import { z } from 'zod';

export const submitDonationSchema = z.object({
  donor_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  amount: z.number().positive("Amount must be a positive number"),
  purpose: z.string().min(1, "Purpose is required"),
  transaction_ref: z.string().min(5, "Transaction reference must be at least 5 characters"),
});

export const submitReportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  ward: z.string().min(1, "Ward is required"),
  category: z.string().min(1, "Category is required"),
  severity: z.string().min(1, "Severity is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // file is handled separately as it is a Blob/File
});

export const submitMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  guardian_name: z.string().min(2, "Guardian name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  state: z.string().min(1, "State is required"),
  vidhan_sabha: z.string().min(1, "Vidhan Sabha is required"),
  ward: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  is_registered_voter: z.string(),
  is_indian_citizen: z.string(),
  has_criminal_record: z.string(),
  criminal_record_details: z.string().optional().or(z.literal("")),
  is_other_party_member: z.string(),
  other_party_name: z.string().optional().or(z.literal("")),
  epic_number: z.string().optional().or(z.literal("")),
  social_media: z.string().optional().or(z.literal("")),
  referral_source: z.string().optional().or(z.literal("")),
  referral_code: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  declaration_agreed: z.string().refine(val => val === "true", {
    message: "Declaration must be agreed to",
  }),
  skills: z.string().optional(),
});

export const loginMemberSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
});
