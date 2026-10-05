// ============================================
// Change Password Types
// ============================================

export interface ChangePasswordDTO {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ============================================
// User Account Types
// ============================================

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ============================================
// User Details Types
// ============================================

export interface CountryData {
  id: number;
  name: string;
  phoneCode?: string;
  capital?: string;
}

export interface GenderAPIData {
  id: number;
  name: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface TimezoneData {
  id: number;
  name: string;
  offset: string;
  company?: number;
  country?: number | null;
}

export interface ProfileFormValues {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  profilePicture?: string;
  gender?: string;
  birthDate?: string | null;
  address?: string;
  country?: string;
  designation?: string;
  timezone?: string;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  profilePicture?: File | null;
  gender?: string;
  dateOfBirth?: string | null;
  address?: string;
  country?: string;
  designation?: string;
  timezone?: string;
}
