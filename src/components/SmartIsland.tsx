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
            <a href="/formation-progress">
              <span className="lang-en">Formation Roadmap</span>
              <span className="lang-hi">गठन कार्ययोजना</span>
            </a>
            <a href="/transparency">
              <span className="lang-en">Financial Transparency</span>
              <span className="lang-hi">वित्तीय पारदर्शिता</span>
            </a>
            <a href="/documents">
              <span className="lang-en">Public Documents</span>
              <span className="lang-hi">सार्वजनिक दस्तावेज़</span>
            </a>
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
          </div>
        </div>

        <a href="/formation-progress" className="island-nav-link">
          <span className="lang-en">Roadmap</span>
          <span className="lang-hi">कार्ययोजना</span>
        </a>

        <a href="/membership" className="island-nav-link">
          <span className="lang-en">Join</span>
          <span className="lang-hi">जुड़ें</span>
        </a>

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
            <div data-testid="user-profile-menu" className="island-dropdown-container">
              <button className="icon-button island-user-btn" aria-label="Account Menu" type="button">
                <User size={18} />
              </button>
              <div className="island-dropdown-menu island-user-menu">
                <a href="/member">
                  <span className="lang-en">Member Portal</span>
                  <span className="lang-hi">सदस्य पोर्टल</span>
                </a>
                <a href="/member/induction">
                  <span className="lang-en">Digital Induction</span>
                  <span className="lang-hi">डिजिटल प्रेरण</span>
                </a>
                <a href="/member/membership-card">
                  <span className="lang-en">Membership Card</span>
                  <span className="lang-hi">सदस्यता कार्ड</span>
                </a>
                <a href="/admin">
                  <span className="lang-en">Admin Console</span>
                  <span className="lang-hi">प्रशासन कंसोल</span>
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
