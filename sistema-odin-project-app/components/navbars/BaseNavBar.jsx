import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAside } from "@/contexts/AsideContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import LoginForm from "../forms/login/LoginForm";
import LoginControlCenterForm from "../forms/login/LoginControlCenterForm";
import Button from "../Button";
import Logo from "../Logo";
import SubMenu from "./Submenu";
import { FiChevronDown } from "react-icons/fi";
import AsidePlatformMenu from "./platform/AsidePlatformMenu";
import Carousel from "../Carousel";
import Link from "next/link";
import Image from "next/image";
import AsideControlCenterMenu from "./control_center/AsideControlCenterMenu";
import { FaLaptopHouse, FaRegChartBar } from "react-icons/fa";

export default function BaseNavBar({ mainMenu, toggleMenuItems, loginInfo }) {
  const { user, userLogout } = useUserInfoContext();
  const { userControlCenter, userLogoutControlCenter } =
    useUserControlCenterContext();

  const { isAsideOpen, toggleAside, closeAside } = useAside();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState({});

  const pathname = usePathname();
  const isHomeRoute = pathname && pathname === "/";
  const isPlatformRoute = pathname && pathname.includes("/platform");
  const isControlCenterRoute = pathname && pathname.includes("/control_center");

  const closeAsideButtonRef = useRef(null);

  // Effect to handle body overflow
  useEffect(() => {
    document.body.style.overflow = isAsideOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAsideOpen]);

  // Effect to simulate click on button to close aside if route is "/platform"
  useEffect(() => {
    if (
      (isPlatformRoute || isControlCenterRoute) &&
      closeAsideButtonRef.current
    ) {
      closeAsideButtonRef.current.click();
    }
  }, [isControlCenterRoute, isPlatformRoute]);

  const toggleSubMenu = (id) => {
    setActiveSubMenu((prevSubMenu) => ({
      ...prevSubMenu,
      [id]: !prevSubMenu[id],
    }));
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    if (isPlatformRoute) {
      userLogout();
    } else if (isControlCenterRoute) {
      userLogoutControlCenter();
    }

    setIsModalOpen(false);
  };

  const getGreeting = (genderId) => {
    if (genderId === 1) {
      return "¡Bienvenido";
    } else if (genderId === 2) {
      return "¡Bienvenida";
    } else {
      return "Hola";
    }
  };

  const carouselItems = [
    {
      text: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_1_TEXT,
      image: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_1_IMAGE,
      alt: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_1_ALT,
    },
    {
      text: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_2_TEXT,
      image: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_2_IMAGE,
      alt: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_2_ALT,
    },
    {
      text: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_3_TEXT,
      image: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_3_IMAGE,
      alt: process.env.NEXT_PUBLIC_CAROUSEL_ITEM_3_ALT,
    },
  ];

  return (
    <div className="header font-semibold">
      
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2 flex items-center justify-between shadow-lg z-20">
      <div className="p-2 ml-3 flex items-center">
      {!isPlatformRoute && !isControlCenterRoute && <Logo />}
        </div>

        <div className="flex-grow flex justify-center items-center hidden lg:flex">
          {mainMenu.map((item) => (
            <Button
            isAnimated={false}
              key={item.id}
              route={item.route}
              text={item.text}
              customClasses="text-title transition-colors duration-300 cursor-pointer shadow-none"
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {!isPlatformRoute && !isControlCenterRoute && (
            <>
              <Button
                route="/control_center"
                icon={<FaRegChartBar size={24} />}
                customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                title={"Sistema de control"}

              />
              <Button
                route="/platform"
                icon={<FaLaptopHouse size={24}/>}
                customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                title={"Campus Virtual"}
              />
              
              <button
                id="hamburger-btn"
                className="text-title focus:outline-none  px-3 py-2"
                onClick={toggleAside}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </>
          )}

          {isPlatformRoute && user && (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:flex text-white">
                {getGreeting(user.platform_user_gender_id)}, <br />
                <span className="text-title-active-static">
                  {user.first_name} {user.last_name}
                </span>
                !
              </span>
              <span className="flex sm:hidden text-primary">
                <span className="text-title-active-static">
                  {user.first_name} {user.last_name}
                </span>
              </span>
              <Link href="/platform/user/profile" passHref>
                <button>
                  <Image
                    src="/account.png"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                </button>
              </Link>
            </div>
          )}

          {isControlCenterRoute && userControlCenter && (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:flex text-white">
                {getGreeting(userControlCenter.cc_user_gender_id)}, <br />
                <span className="text-title-active-static">
                  {userControlCenter.first_name} {userControlCenter.last_name}
                </span>
                !
              </span>
              <span className="flex sm:hidden text-primary">
                <span className="text-title-active-static">
                  {userControlCenter.first_name} {userControlCenter.last_name}
                </span>
              </span>
              <Link href="/control_center/user/profile" passHref>
                <button>
                  <Image
                    src="/account.png"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                </button>
              </Link>
            </div>
          )}

          {loginInfo && isPlatformRoute && !user && (
            <div className="p-0 mt-2">
              <div className="flex justify-center items-center mb-2">
                <button
                  className="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  onClick={() =>
                    openModal(<LoginForm onCloseModal={closeModal} />)
                  }
                >
                  {loginInfo.text}
                </button>
              </div>
            </div>
          )}
          
          {loginInfo && isControlCenterRoute && !userControlCenter && (
            <div className="p-0 mt-2">
              <div className="flex justify-center items-center mb-2">
                <button
                  className="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  onClick={() =>
                    openModal(
                      <LoginControlCenterForm onCloseModal={closeModal} />
                    )
                  }
                >
                  {loginInfo.text}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {isAsideOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeAside}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full nav-bg-primary bg-opacity-90 z-20 transition-transform transform ${
          isAsideOpen ? "translate-x-0" : "-translate-x-full"
        } w-4/5 sm:w-4/5 md:w-2/6 lg:w-1/4`}
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <div className="bg-dark-mode relative h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-center items-center p-4 pb-0">
              {!isPlatformRoute && !isControlCenterRoute && (
                <div className="flex flex-col items-center">
                  <Logo />
                </div>
              )}
              {(isPlatformRoute || isControlCenterRoute) && (
                <button
                  className="hidden"
                  onClick={closeAside}
                  ref={closeAsideButtonRef}
                ></button>
              )}
              <button
                className="text-primary focus:outline-none text-title px-3 py-2 absolute right-0 top-0"
                onClick={closeAside}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {!isPlatformRoute &&
                !isControlCenterRoute &&
                toggleMenuItems.map((item) => (
                  <div key={item.id} className="relative">
                    <Button
                      route={item.route}
                      text={item.text}
                      icon={item.subMenu && <FiChevronDown size={24} />}
                      customClasses="block text-primary py-2 px-4 shadow-none text-title border-none hover:bg-gold hover:text-primary"
                      customFunction={() => toggleSubMenu(item.id)}
                    />
                    {item.subMenu && (
                      <SubMenu
                        subMenuItems={item.subMenu}
                        isVisible={activeSubMenu[item.id]}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
          {loginInfo && !user && isPlatformRoute && (
            <div className="p-4">
              <div className="flex justify-center items-center mb-4">
                <button
                  className="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  onClick={() =>
                    openModal(<LoginForm onCloseModal={closeModal} />)
                  }
                >
                  {loginInfo.text}
                </button>
              </div>
            </div>
          )}

          {loginInfo && !userControlCenter && isControlCenterRoute && (
            <div className="p-4">
              <div className="flex justify-center items-center mb-4">
                <button
                  className="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  onClick={() =>
                    openModal(
                      <LoginControlCenterForm onCloseModal={closeModal} />
                    )
                  }
                >
                  {loginInfo.text}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      {isPlatformRoute && (
        <AsidePlatformMenu
          isPlatformRoute={isPlatformRoute}
          menuItems={toggleMenuItems}
        />
      )}
      {isControlCenterRoute && (
        <AsideControlCenterMenu
          isControlCenterRoute={isControlCenterRoute}
          menuItems={toggleMenuItems}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary p-6 rounded-lg shadow-lg text-center">
            {modalContent}
          </div>
        </div>
      )}

      {/* Carousel Section */}
      {isHomeRoute && <Carousel items={carouselItems} />}
    </div>
  );
}
