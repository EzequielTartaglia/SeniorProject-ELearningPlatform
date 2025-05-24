import { useState } from "react";
import Button from "@/components/Button";
import {
  FiChevronRight,
  FiLogOut,
  FiX,
  FiMenu,
  FiChevronLeft,
} from "react-icons/fi";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import ConfirmModal from "@/components/ConfirmModal";
import Logo from "@/components/Logo";

export default function AsidePlatformMenu({ menuItems, isPlatformRoute }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isSecondAsideVisible, setIsSecondAsideVisible] = useState(false);
  const [currentSubMenuItems, setCurrentSubMenuItems] = useState([]);
  const [parentTitle, setParentTitle] = useState("");
  const [tooltip, setTooltip] = useState("");
  const [isAsideOpen, setIsAsideOpen] = useState(true); // Nuevo estado para manejar la visibilidad del aside
  const { user, userLogout } = useUserInfoContext();

  const handleSubMenuClick = (id, subMenuItems, title) => {
    if (activeSubMenu !== id) {
      setActiveSubMenu(id);
      setCurrentSubMenuItems(subMenuItems);
      setParentTitle(title);
      setIsSecondAsideVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setActiveSubMenu(null);
      setCurrentSubMenuItems([]);
      setParentTitle("");
      setIsSecondAsideVisible(false);
      document.body.style.overflow = "auto";
    }
  };

  const toggleSecondAside = () => {
    setActiveSubMenu(null);
    setCurrentSubMenuItems([]);
    setParentTitle("");
    setIsSecondAsideVisible(false);
    document.body.style.overflow = "auto";
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    userLogout();
    setIsModalOpen(false);
  };

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen); // Alternar la visibilidad del aside
  };

  return (
    <div className="relative flex">
      {!isSecondAsideVisible && (
        <button
          onClick={toggleAside}
          className={`fixed ${
            isAsideOpen
              ? "ml-[60px] sm:ml-[60px] md:ml-[70px] left-4"
              : "left-2"
          } top-2  z-40 text-primary text-2xl p-3 nav-bg-primary-light rounded-full shadow-md`}
        >
          {isAsideOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Primer Aside */}
      <aside
        className={`fixed top-0 left-0 h-full nav-bg-primary-light transition-transform transform w-16 sm:w-20 md:w-20 lg:w-20 xl:w-20 flex flex-col items-center pt-0 z-30 ${
          isAsideOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isPlatformRoute && !user && (
          <div className="w-[55px] mt-2">
            <Logo />
          </div>
        )}
        {menuItems.length > 0 &&
          menuItems.map((item) => (
            <div
              key={item.route}
              className="relative mb-6 flex items-center group"
              onMouseEnter={() => setTooltip(item.text)}
              onMouseLeave={() => setTooltip("")}
            >
              {item?.icon && (
                <div className="text-primary text-xl sm:text-2xl md:text-3xl mb-2">
                  <Button
                    route={item.route}
                    customClasses="p-2 text-primary shadow-none"
                    customFunction={() => {
                      item.subMenu &&
                        handleSubMenuClick(item.id, item.subMenu, item.text);
                    }}
                    icon={item.icon}
                  />
                </div>
              )}
              {item.subMenu && (
                <FiChevronRight size={20} className="text-primary ml-[-10px]" />
              )}
              {/* Tooltip */}
              {tooltip && (
                <div className="relative flex items-center group">
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 w-max bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
                    {tooltip}
                  </div>
                </div>
              )}
            </div>
          ))}
        {user && (
          <div className="mt-auto mb-4 flex flex-col items-center group relative">
            <Button
              customClasses="px-2 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
              customFunction={() =>
                openModal(
                  <ConfirmModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={handleLogout}
                    message={"¿Estás seguro que deseas cerrar sesión?"}
                  />
                )
              }
              icon={<FiLogOut />}
              title={"Cerrar sesión"}
            />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 w-max bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
              Cerrar sesión
            </div>
          </div>
        )}
      </aside>

      {/* Overlay */}
      {isSecondAsideVisible && (
        <div
          className="fixed top-0 left-0 h-full bg-black transition-opacity duration-300 z-10"
          style={{
            opacity: isSecondAsideVisible ? "0.5" : "0",
            pointerEvents: isSecondAsideVisible ? "auto" : "none",
          }}
          onClick={toggleSecondAside}
        ></div>
      )}

      {/* Segundo Aside */}
      <aside
        className={`fixed top-0 ${
          isAsideOpen
            ? "left-16 sm:left-20 md:left-20 lg:left-20 xl:left-20"
            : ""
        }  h-full nav-bg-primary-light z-20 transition-transform duration-300 ${
          isSecondAsideVisible
            ? "translate-x-0 border-r-2 border-r-primary"
            : "-translate-x-full"
        } w-3/5 sm:w-2/5 md:w-3/6 lg:w-1/6`}
      >
        <button
          onClick={toggleSecondAside}
          className="text-primary text-2xl p-4 absolute top-4 right-4"
        >
          <FiX />
        </button>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Display parent title */}
          {parentTitle && (
            <h2 className="text-title-active-static text-xl mb-4 ml-2">
              {parentTitle}
            </h2>
          )}
          {currentSubMenuItems.length > 0 ? (
            <ul className="list-none py-2">
              {currentSubMenuItems.map((subItem) => (
                <li key={subItem.route} className="mb-4">
                  <Button
                    route={subItem.route}
                    text={subItem.text}
                    customClasses="block text-primary shadow-none py-2 px-4 text-title hover:bg-gold hover:text-primary"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </aside>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary p-6 rounded-lg shadow-lg text-center">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}
