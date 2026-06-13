export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "volunteer" | "member" | "admin";
  ward: string | null;
  referred_by: string | null;
  epic: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  ward: string | null;
  assigned_to: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  author_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_id: string;
  payment_status?: string;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  category: string;
  ward: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  status: string;
  created_at: string;
}

export interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  date_of_birth?: string;
  ward?: string;
  vidhan_sabha?: string;
  voter_id?: string;
  identity_doc_url?: string;
  vision_extracted_text?: string;
  vision_validation_status?: string;
  status: string;
  created_at: string;
}

export interface Proposer {
  id: string;
  full_name: string;
  epic_number: string;
  ward: string | null;
  vidhan_sabha: string | null;
  contact_number: string | null;
  address: string | null;
  created_at: string;
}

export interface CrimeStat {
  crime_type: string;
  count: number;
}
