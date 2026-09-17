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
        <div className="island-dropdown-container">
          <a href="/crime" className="island-nav-link">
            <span className="lang-en">Our Work</span>
            <span className="lang-hi">हमारा काम</span>
            <ChevronDown size={14} />
          </a>
          <div className="island-dropdown-menu">
            <a href="/crime">
              <span className="lang-en">Verified Crime Tracker</span>
              <span className="lang-hi">सत्यापित अपराध ट्रैकर</span>
            </a>
            <a href="/issues">
              <span className="lang-en">Civic Issues & Grievances</span>
              <span className="lang-hi">नागरिक समस्याएं व शिकायतें</span>
            </a>
            <a href="/manifesto">
              <span className="lang-en">Living Manifesto Priorities</span>
              <span className="lang-hi">घोषणापत्र प्राथमिकताएं</span>
            </a>
            <a href="/#coverage">
              <span className="lang-en">Delhi 70 AC Ground Coverage</span>
              <span className="lang-hi">दिल्ली 70 विधानसभा कवरेज</span>
            </a>
          </div>
        </div>

        <div className="island-dropdown-container">
          <a href="/documents" className="island-nav-link">
            <span className="lang-en">Documents</span>
            <span className="lang-hi">दस्तावेज़</span>
            <ChevronDown size={14} />
          </a>
          <div className="island-dropdown-menu">
            <a href="/documents">
              <span className="lang-en">Public Document Library</span>
              <span className="lang-hi">सार्वजनिक दस्तावेज़ लाइब्रेरी</span>
            </a>
            <a href="/legal/constitution">
              <span className="lang-en">Draft Constitution</span>
              <span className="lang-hi">संविधान मसौदा</span>
            </a>
            <a href="/legal/ethics">
              <span className="lang-en">Code of Ethics & Conduct</span>
              <span className="lang-hi">आचार संहिता व आचरण</span>
            </a>
            <a href="/legal/digital-governance">
              <span className="lang-en">Digital Governance & Privacy</span>
              <span className="lang-hi">डिजिटल शासन व गोपनीयता</span>
            </a>
          </div>
        </div>

        <div className="island-dropdown-container">
          <a href="/formation-progress" className="island-nav-link">
            <span className="lang-en">Formation</span>
            <span className="lang-hi">गठन</span>
            <ChevronDown size={14} />
          </a>
          <div className="island-dropdown-menu">
            <a href="/formation-progress">
              <span className="lang-en">9-Stage Roadmap (Stage 3 Active)</span>
              <span className="lang-hi">9-चरणीय रोडमैप (चरण 3 सक्रिय)</span>
            </a>
            <a href="/transparency">
              <span className="lang-en">Financial Transparency Ledger</span>
              <span className="lang-hi">वित्तीय पारदर्शिता लेजर</span>
            </a>
            <a href="/about">
              <span className="lang-en">About Nagrik Party</span>
              <span className="lang-hi">नागरिक पार्टी परिचय</span>
            </a>
            <a href="/president">
              <span className="lang-en">Party Leadership</span>
              <span className="lang-hi">पार्टी नेतृत्व</span>
            </a>
          </div>
        </div>

        <a href="/membership" className="island-nav-link">
          <span className="lang-en">Join Induction</span>
          <span className="lang-hi">सदस्यता लें</span>
        </a>

        <div className="island-action-buttons">
          <a href="/crime" className="button yellow island-action-btn" style={{ fontWeight: 700 }}>
            <span className="lang-en">Crime Tracker</span>
            <span className="lang-hi">अपराध ट्रैकर</span>
          </a>

          {!user && (
            <a href="/membership" className="button red island-action-btn">
              <span className="lang-en">Become Member</span>
              <span className="lang-hi">सदस्य बनें</span>
            </a>
          )}
        </div>
      </nav>

      <div className="nav-actions">
        {!user ? (
          <a href="/login" className="icon-button island-icon-btn" aria-label="Sign In" title="Log In / Member Portal">
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
