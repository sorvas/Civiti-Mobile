export type AuthorityListResponse = {
  id: string;
  name: string | null;
  email: string | null;
  city: string | null;
  district: string | null;
}

export type AuthorityResponse = {
  id: string;
  name: string | null;
  email: string | null;
  county: string | null;
  city: string | null;
  district: string | null;
  isActive: boolean;
  createdAt: string;
}

export type GetAuthoritiesParams = {
  city?: string;
  district?: string;
  search?: string;
}

export type CategoryResponse = {
  value: string | null;
  label: string | null;
}
