// Whitelist de e-mails com acesso administrativo — fonte unica, usada tanto
// pela checagem de permissao do painel /admin (admin.functions.ts) quanto
// pelo login (email-only-login.functions.ts, que normalmente exige compra
// aprovada: admins entram sem precisar de uma "compra" sintetica).
export const ADMIN_EMAILS = new Set([
  "axagentes@gmail.com",
  "demianborgesdiaz348@gmail.com",
]);
