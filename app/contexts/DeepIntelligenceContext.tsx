'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DeepIntelligenceContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const DeepIntelligenceContext = createContext<DeepIntelligenceContextType | undefined>(undefined);

interface DeepIntelligenceProviderProps {
  children: ReactNode;
}

export function DeepIntelligenceProvider({ children }: DeepIntelligenceProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(prev => !prev);

  const value = {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };

  return (
    <DeepIntelligenceContext.Provider value={value}>
      {children}
    </DeepIntelligenceContext.Provider>
  );
}

export function useDeepIntelligence() {
  const context = useContext(DeepIntelligenceContext);
  if (context === undefined) {
    throw new Error('useDeepIntelligence must be used within a DeepIntelligenceProvider');
  }
  return context;
}
