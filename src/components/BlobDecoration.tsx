type BlobDecorationProps = {
  className?: string;
};

/**
 * Par de formas organicas (azul-marinho + laranja) usado como decoracao de
 * fundo em telas de destaque (Home, Perfil). Posicione o wrapper com
 * className (absolute/inset) — as formas usam currentColor via classes
 * text-* nos próprios elementos internos.
 */
export function BlobDecoration({ className }: BlobDecorationProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMaxYMin slice"
    >
      <path
        d="M400 0H230c-40 20-60 55-40 90s70 35 100 20 70-10 110 15V0Z"
        className="fill-primary/10"
      />
      <path
        d="M400 10c-50-15-85 5-95 35s10 55 45 60 70-10 50-40-10-45 0-55Z"
        className="fill-gold/25"
      />
    </svg>
  );
}
