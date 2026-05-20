import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function Logo({ href = '/', width = 45, height = 45, className = '' }: LogoProps) {
  const img = (
    <Image
      src="/logo.svg"
      alt="COMMA Logo"
      width={width}
      height={height}
      priority
      className={className}
      style={{ display: 'block' }}
    />
  );

  if (href) {
    return <Link href={href}>{img}</Link>;
  }

  return img;
}
