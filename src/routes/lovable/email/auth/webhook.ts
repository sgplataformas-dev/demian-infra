import * as React from 'react'
import { render } from '@react-email/components'
import { WebhookVerifyError, verifyStandardWebhook } from '@/lib/webhook-verify.server'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { SignupEmail } from '@/lib/email-templates/signup'
import { InviteEmail } from '@/lib/email-templates/invite'
import { MagicLinkEmail } from '@/lib/email-templates/magic-link'
import { RecoveryEmail } from '@/lib/email-templates/recovery'
import { EmailChangeEmail } from '@/lib/email-templates/email-change'
import { ReauthenticationEmail } from '@/lib/email-templates/reauthentication'

const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirm your email',
  invite: "You've been invited",
  magiclink: 'Your login link',
  recovery: 'Reset your password',
  email_change: 'Confirm your new email',
  reauthentication: 'Your verification code',
}

// Template mapping
const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

// Configuration
// PLACEHOLDER: substituir pelos valores reais do cliente antes de ir para produção.
const SITE_NAME = "REPLACE_ME_SITE_NAME"
const SENDER_DOMAIN = "REPLACE_ME_SENDER_DOMAIN"
const ROOT_DOMAIN = "REPLACE_ME_ROOT_DOMAIN"
const FROM_DOMAIN = "REPLACE_ME_SENDER_DOMAIN"

function redactEmail(email: string | null | undefined): string {
  if (!email) return '***'
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return '***'
  return `${localPart[0]}***@${domain}`
}

// Payload shape that Supabase's native "Send Email" Auth Hook POSTs.
// https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
type SupabaseAuthEmailHookPayload = {
  user: {
    email: string
    new_email?: string
  }
  email_data: {
    token: string
    token_hash: string
    token_new?: string
    token_hash_new?: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

export const Route = createFileRoute("/lovable/email/auth/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // PLACEHOLDER: configure este endpoint como "Send Email Hook" no painel
        // do Supabase (Auth > Hooks) e cole o secret gerado la (formato whsec_...).
        const hookSecret = process.env.SUPABASE_AUTH_HOOK_SECRET

        if (!hookSecret) {
          console.error('SUPABASE_AUTH_HOOK_SECRET not configured')
          return Response.json(
            { error: 'Server configuration error' },
            { status: 500 }
          )
        }

        let payload: SupabaseAuthEmailHookPayload
        try {
          payload = (await verifyStandardWebhook(request, hookSecret)) as SupabaseAuthEmailHookPayload
        } catch (error) {
          if (error instanceof WebhookVerifyError) {
            const status = error.code === 'invalid_json' ? 400 : 401
            console.error('Webhook verification failed', { code: error.code, error: error.message })
            return Response.json({ error: error.message }, { status })
          }
          console.error('Webhook verification failed', { error })
          return Response.json({ error: 'Invalid webhook payload' }, { status: 400 })
        }

        const emailType = payload.email_data?.email_action_type
        const recipient = payload.user?.email
        console.log('Received auth event', {
          emailType,
          email_redacted: redactEmail(recipient),
        })

        const EmailTemplate = EMAIL_TEMPLATES[emailType]
        if (!EmailTemplate) {
          console.error('Unknown email type', { emailType })
          return Response.json(
            { error: `Unknown email type: ${emailType}` },
            { status: 400 }
          )
        }

        // Link padrao do Supabase para confirmar o token via /auth/v1/verify
        // (ver docs do Send Email Hook). O Supabase valida o token e redireciona
        // o navegador para redirect_to.
        const supabaseUrlForLink = import.meta.env.VITE_SUPABASE_URL
        const confirmationUrl = `${supabaseUrlForLink}/auth/v1/verify?token=${payload.email_data.token_hash}&type=${payload.email_data.email_action_type}&redirect_to=${payload.email_data.redirect_to}`

        const templateProps = {
          siteName: SITE_NAME,
          siteUrl: `https://${ROOT_DOMAIN}`,
          recipient,
          confirmationUrl,
          token: payload.email_data.token,
          email: recipient,
          oldEmail: recipient,
          newEmail: payload.user?.new_email,
        }

        // Render React Email to HTML and plain text
        const element = React.createElement(EmailTemplate, templateProps)
        const html = await render(element)
        const text = await render(element, { plainText: true })

        // Enqueue email for async processing by the dispatcher (process-email-queue).
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('Missing Supabase environment variables')
          return Response.json(
            { error: 'Server configuration error' },
            { status: 500 }
          )
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const messageId = crypto.randomUUID()

        // Log pending BEFORE enqueue so we have a record even if enqueue crashes
        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: emailType,
          recipient_email: recipient,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'auth_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: EMAIL_SUBJECTS[emailType] || 'Notification',
            html,
            text,
            purpose: 'transactional',
            label: emailType,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Failed to enqueue auth email', { error: enqueueError, emailType })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: emailType,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json(
            { error: 'Failed to enqueue email' },
            { status: 500 }
          )
        }

        console.log('Auth email enqueued', {
          emailType,
          email_redacted: redactEmail(recipient),
        })

        return Response.json({ success: true, queued: true })
      },
    },
  },
})
