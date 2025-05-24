'use client'

import { createContext, useContext, useState } from "react";

const AsideContext = createContext();

export function AsideNavBarProvider({ children }) {
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const toggleAside = () => setIsAsideOpen(!isAsideOpen);
  const openAside = () => setIsAsideOpen(true);
  const closeAside = () => setIsAsideOpen(false);

  return (
    <AsideContext.Provider value={{ isAsideOpen, toggleAside, openAside, closeAside }}>
      {children}
    </AsideContext.Provider>
  );
}

export function useAside() {
  return useContext(AsideContext);
}
