'use client'

import React, { createContext, ReactNode, useContext } from 'react'
import { StoreInfo } from '../app/types';

type StoreContextType = {
  storeInfo: StoreInfo;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

type StoreProviderProps = {
  children: ReactNode;
  storeInfo: StoreInfo;
};

export const StoreProvider = ({ children, storeInfo }: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={{ storeInfo }}>
      {children}
    </StoreContext.Provider>
  );
};


