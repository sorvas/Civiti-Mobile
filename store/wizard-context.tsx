import type { IssueCategory } from '@/constants/enums';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const MAX_PHOTOS = 7;

type WizardContextValue = {
  category: IssueCategory | null;
  photoUrls: string[];
  setCategory: (category: IssueCategory) => void;
  addPhotoUrl: (url: string) => void;
  removePhotoUrl: (url: string) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [category, setCategoryState] = useState<IssueCategory | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const setCategory = useCallback((value: IssueCategory) => {
    setCategoryState(value);
  }, []);

  const addPhotoUrl = useCallback((url: string) => {
    setPhotoUrls((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, url]));
  }, []);

  const removePhotoUrl = useCallback((url: string) => {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  const reset = useCallback(() => {
    setCategoryState(null);
    setPhotoUrls([]);
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({ category, photoUrls, setCategory, addPhotoUrl, removePhotoUrl, reset }),
    [category, photoUrls, setCategory, addPhotoUrl, removePhotoUrl, reset],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

export { MAX_PHOTOS };
