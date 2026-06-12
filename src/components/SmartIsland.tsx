import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

import type { User as SupabaseUser } from "@supabase/supabase-js";

export function SmartIsland() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
      const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null);
      });
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("nagrik-lang");
    const next = saved === "hi" ? "hi" : "en";
    setLang(next);
    document.documentElement.dataset.lang = next;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  function toggleLang() {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    document.documentElement.dataset.lang = next;
    window.localStorage.setItem("nagrik-lang", next);
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  }

  return (
    <>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="/manifesto">
          <span className="lang-en">Manifesto</span>
          <span className="lang-hi">घोषणापत्र</span>
        </a>

        <div className="island-dropdown-container">
          <a href="#" className="island-nav-link">
            <span className="lang-en">Particulars</span>
            <span className="lang-hi">विवरण</span>
            <ChevronDown size={14} />
          </a>
          <div className="island-dropdown-menu">
            <a href="/about">
              <span className="lang-en">The History</span>
              <span className="lang-hi">इतिहास</span>
            </a>
            <a href="/legal/constitution">
              <span className="lang-en">Our Constitution</span>
              <span className="lang-hi">हमारा संविधान</span>
            </a>
            <a href="/events">
              <span className="lang-en">Events</span>
              <span className="lang-hi">कार्यक्रम</span>
            </a>
            <a href="/press">
              <span className="lang-en">Press Releases</span>
              <span className="lang-hi">प्रेस विज्ञप्ति</span>
            </a>
          </div>
        </div>

        <div className="island-action-buttons">
          <a href="/issues" className="button yellow island-action-btn">
            <span className="lang-en">Report Issue</span>
            <span className="lang-hi">मुद्दा दर्ज करें</span>
          </a>

          {!user && (
            <a href="/volunteer" className="button red island-action-btn">
              <span className="lang-en">Become a Volunteer</span>
              <span className="lang-hi">स्वयंसेवक बनें</span>
            </a>
          )}
        </div>
      </nav>

      <div className="nav-actions">
        {!user ? (
          <a href="/auth" className="icon-button island-icon-btn" aria-label="Sign In">
            <User size={18} />
          </a>
        ) : (
          <>
            {import.meta.env.DEV && (
              <select 
                data-testid="role-switcher"
                onChange={async (e) => {
                  const newRole = e.target.value;
                  if (!newRole) return;
                  
                  if (import.meta.env.DEV) {
                    localStorage.setItem("dev_role", newRole);
                  }
                  
                  if (window.location.pathname.startsWith('/dashboard')) {
                    window.location.href = `/dashboard/${newRole}`;
                  }
                }}
                className="island-role-switcher"
              >
                <option value="">Switch Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            )}
            <div data-testid="user-profile-menu" className="island-dropdown-container">
              <button className="icon-button island-user-btn" aria-label="Account Menu" type="button">
                <User size={18} />
              </button>
              <div className="island-dropdown-menu island-user-menu">
                <a href="/dashboard">
                  <span className="lang-en">Dashboard</span>
                  <span className="lang-hi">डैशबोर्ड</span>
                </a>
                <a data-testid="logout-button" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <LogOut size={14} className="island-logout-icon" />
                  <span className="lang-en">Sign Out</span>
                  <span className="lang-hi">साइन आउट</span>
                </a>
              </div>
            </div>
          </>
        )}

        <button className="language-toggle" onClick={toggleLang} type="button" aria-label="Switch language">
          <span className="lang-toggle-text">{lang === "en" ? "अ" : "A"}</span>
          <span>{lang === "en" ? "हिन्दी" : "English"}</span>
        </button>
        
        <button
          className="icon-button mobile-menu"
          onClick={() => setOpen((value) => !value)}
          type="button"
          aria-label="Open navigation"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </>
  );
}
