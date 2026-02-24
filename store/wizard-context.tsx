import type { IssueCategory, UrgencyLevel } from '@/constants/enums';
import { UrgencyLevel as UrgencyLevelEnum } from '@/constants/enums';
import type { IssueAuthorityInput } from '@/types/issues';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const MAX_PHOTOS = 7;

type WizardContextValue = {
  // Step 1
  category: IssueCategory | null;
  setCategory: (category: IssueCategory) => void;
  // Step 2
  photoUrls: string[];
  addPhotoUrl: (url: string) => void;
  removePhotoUrl: (url: string) => void;
  // Step 3
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  urgency: UrgencyLevel;
  setUrgency: (urgency: UrgencyLevel) => void;
  desiredOutcome: string;
  setDesiredOutcome: (desiredOutcome: string) => void;
  communityImpact: string;
  setCommunityImpact: (communityImpact: string) => void;
  address: string;
  setAddress: (address: string) => void;
  latitude: number | null;
  longitude: number | null;
  district: string | null;
  setLocation: (lat: number, lng: number, district: string | null, address: string) => void;
  // Step 4
  authorities: IssueAuthorityInput[];
  setAuthorities: (authorities: IssueAuthorityInput[]) => void;
  // Global
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  // Step 1
  const [category, setCategoryState] = useState<IssueCategory | null>(null);
  // Step 2
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  // Step 3
  const [title, setTitleState] = useState('');
  const [description, setDescriptionState] = useState('');
  const [urgency, setUrgencyState] = useState<UrgencyLevel>(UrgencyLevelEnum.Medium);
  const [desiredOutcome, setDesiredOutcomeState] = useState('');
  const [communityImpact, setCommunityImpactState] = useState('');
  const [address, setAddressState] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  // Step 4
  const [authorities, setAuthoritiesState] = useState<IssueAuthorityInput[]>([]);

  // Step 1 setters
  const setCategory = useCallback((value: IssueCategory) => {
    setCategoryState(value);
  }, []);

  // Step 2 setters
  const addPhotoUrl = useCallback((url: string) => {
    setPhotoUrls((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, url]));
  }, []);

  const removePhotoUrl = useCallback((url: string) => {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  // Step 3 setters
  const setTitle = useCallback((value: string) => setTitleState(value), []);
  const setDescription = useCallback((value: string) => setDescriptionState(value), []);
  const setUrgency = useCallback((value: UrgencyLevel) => setUrgencyState(value), []);
  const setDesiredOutcome = useCallback((value: string) => setDesiredOutcomeState(value), []);
  const setCommunityImpact = useCallback((value: string) => setCommunityImpactState(value), []);
  const setAddress = useCallback((value: string) => setAddressState(value), []);

  const setLocation = useCallback(
    (lat: number, lng: number, dist: string | null, addr: string) => {
      setLatitude(lat);
      setLongitude(lng);
      setDistrict(dist);
      setAddressState(addr);
    },
    [],
  );

  // Step 4 setters
  const setAuthorities = useCallback(
    (value: IssueAuthorityInput[]) => setAuthoritiesState(value),
    [],
  );

  const reset = useCallback(() => {
    setCategoryState(null);
    setPhotoUrls([]);
    setTitleState('');
    setDescriptionState('');
    setUrgencyState(UrgencyLevelEnum.Medium);
    setDesiredOutcomeState('');
    setCommunityImpactState('');
    setAddressState('');
    setLatitude(null);
    setLongitude(null);
    setDistrict(null);
    setAuthoritiesState([]);
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({
      category,
      setCategory,
      photoUrls,
      addPhotoUrl,
      removePhotoUrl,
      title,
      setTitle,
      description,
      setDescription,
      urgency,
      setUrgency,
      desiredOutcome,
      setDesiredOutcome,
      communityImpact,
      setCommunityImpact,
      address,
      setAddress,
      latitude,
      longitude,
      district,
      setLocation,
      authorities,
      setAuthorities,
      reset,
    }),
    [
      category,
      setCategory,
      photoUrls,
      addPhotoUrl,
      removePhotoUrl,
      title,
      setTitle,
      description,
      setDescription,
      urgency,
      setUrgency,
      desiredOutcome,
      setDesiredOutcome,
      communityImpact,
      setCommunityImpact,
      address,
      setAddress,
      latitude,
      longitude,
      district,
      setLocation,
      authorities,
      setAuthorities,
      reset,
    ],
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
