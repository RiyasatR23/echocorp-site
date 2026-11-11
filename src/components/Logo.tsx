interface LogoProps {
  variant?: 'wordmark' | 'mark';
  className?: string;
}

const LOGO_FILES = {
  wordmark: { src: '/logo/echo-corp-wordmark.png', width: 681, height: 277 },
  mark: { src: '/logo/echo-corp-mark.png', width: 158, height: 271 },
} as const;

export function Logo({ variant = 'wordmark', className }: LogoProps) {
  const { src, width, height } = LOGO_FILES[variant];
  return <img src={src} width={width} height={height} alt="" className={className} decoding="async" />;
}
