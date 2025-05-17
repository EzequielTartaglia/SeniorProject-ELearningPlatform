import { useRouter } from 'next/navigation';
import { FiChevronLeft } from "react-icons/fi";

export default function GoBackButton({ route, text, customFunction, customClasses = "", target, children }) {
    const router = useRouter();

    const handleOnClick = () => {
        if (route) {
            if (target === "_blank") {
                window.open(route, '_blank');
            } else {
                router.push(route);
            }
        }

        if (customFunction && typeof customFunction === 'function') {
            customFunction();
        }
    };

    return (
        <div className="flex items-center justify-between w-full mb-2">
            <button className={`flex items-center py-2 px-4 text-white hover:text-gray-200 shadow-none transition duration-300 hover:-translate-y-1 mb-4 md:mb-0 md:mr-4 ${customClasses}`} type='button' onClick={handleOnClick}>
                <FiChevronLeft className="mr-1" size={24} />{text}
            </button>
            {children}
        </div>
    );
}