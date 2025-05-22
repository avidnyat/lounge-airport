
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: 'gold' | 'platinum' | 'diamond';
  membershipNumber: string;
  expiryDate: string; // ISO Date string
  createdAt: string; // ISO Date string
  visits: number;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: 'gold' | 'platinum' | 'diamond';
  expiryDate: string;
  visits: number;
}
