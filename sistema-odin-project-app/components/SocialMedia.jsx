import Image from 'next/image';
import Link from 'next/link';
export default function SocialMedia({ route, alt, icon, className }) {
  return (
    <div className={`${className} transition duration-300 transform hover:scale-105 text-title-active w-30 h-30`}>
      <Link href={route} target="_blank" alt={alt} title={alt} rel="noopener noreferrer">
        {icon}
      </Link>
    </div>
  );
}