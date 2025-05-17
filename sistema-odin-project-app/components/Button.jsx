'use client'

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Button({ route, text, customFunction, customClasses = "", target, title, icon, isAnimated = true, disabled, iconPosition = 'right' }) {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === route;

    const handleClick = (e) => {
        if (customFunction && typeof customFunction === 'function') {
            customFunction();
        }
    };

    const buttonClasses = `py-2 ${text ? 'px-4' : 'px-3 rounded-full'} shadow-md transition duration-300 ${isAnimated && 'hover:-translate-y-1'} flex items-center ${customClasses} ${isActive && 'text-title-active'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    const renderContent = () => (
        <>
            {iconPosition === 'left' && icon && <span className={`${text ? 'mr-2' : ''}`}>{icon}</span>}
            {text}
            {iconPosition === 'right' && icon && <span className={`${text ? 'ml-2' : ''}`}>{icon}</span>}
        </>
    );

    return route ? (
        <Link href={route} passHref target={target}>
            <button
                className={buttonClasses}
                onClick={handleClick}
                title={title}
                disabled={disabled}
            >
                {renderContent()}
            </button>
        </Link>
    ) : (
        <button
            className={buttonClasses}
            type='button'
            onClick={handleClick}
            title={title}
            disabled={disabled}
        >
            {renderContent()}
        </button>
    );
}
