import Link from 'next/link';
import Image from 'next/image';
import logoSvg from '@/public/logo.png';

export default function Logo({ isFooter = false }) {

  const logoSrc = process.env.NEXT_PUBLIC_BRAND_LOGO 
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME

  return (
    <Link href="/">
      {isFooter
        ? <Image className="rounded-full" alt={brandName} title={brandName} loading="lazy" width="200" height="50" decoding="async" src={logoSrc} />
        : <Image className="rounded-full" alt={brandName} title={brandName} loading="lazy" width="70" height="20" decoding="async" src={logoSrc} />
      }
    </Link>
  );
}
