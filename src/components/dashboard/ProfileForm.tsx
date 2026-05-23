"use client";

import { useState } from "react";
import { updateProfile } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

interface ProfileFormProps {
  member: any;
  translations: {
    editProfile: string;
    saveChanges: string;
    cancel: string;
    name: string;
    phone: string;
    email: string;
    successMessage: string;
  };
}

export default function ProfileForm({ member, translations }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: member.name || "",
    phone: member.phone || "",
    email: member.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("phone", formData.phone);
    fd.append("email", formData.email);

    const result = await updateProfile(fd);

    if (result.success) {
      toast.success(translations.successMessage);
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update profile");
    }

    setLoading(false);
  };

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="mt-4 px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        {translations.editProfile}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-black/40">{translations.name}</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange}
          className="px-3 py-2 bg-black/5 border border-black/10 rounded-md font-body text-sm focus:outline-none focus:border-red"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-black/40">{translations.phone}</label>
        <input 
          type="text" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange}
          className="px-3 py-2 bg-black/5 border border-black/10 rounded-md font-body text-sm focus:outline-none focus:border-red"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-black/40">{translations.email}</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          className="px-3 py-2 bg-black/5 border border-black/10 rounded-md font-body text-sm focus:outline-none focus:border-red"
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-red text-white rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-red/90 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : translations.saveChanges}
        </button>
        <button 
          type="button" 
          onClick={() => setIsEditing(false)}
          disabled={loading}
          className="px-4 py-2 bg-black/5 border border-black/10 rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-black/10 transition-colors disabled:opacity-50"
        >
          {translations.cancel}
        </button>
      </div>
    </form>
  );
}
