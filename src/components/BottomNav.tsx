import React, { useEffect, useState } from "react";
import { Home, Compass, ShieldAlert, Receipt, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Tab {
  href: string;
  en: string;
  hi: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  match: (path: string) => boolean;
}

const tabs: Tab[] = [
  { href: "/", en: "Home", hi: "होम", icon: Home, match: (p) => p === "/" },
  { href: "/explore", en: "Explore", hi: "देखें", icon: Compass, match: (p) => p.startsWith("/explore") || p.startsWith("/topics") },
  { href: "/crime", en: "Crime", hi: "अपराध", icon: ShieldAlert, match: (p) => p.startsWith("/crime") },
  { href: "/transparency", en: "Hisaab", hi: "हिसाब", icon: Receipt, match: (p) => p.startsWith("/transparency") },
  { href: "/member", en: "Profile", hi: "प्रोफाइल", icon: User, match: (p) => p.startsWith("/member") || p.startsWith("/login") || p.startsWith("/account") },
];

export function BottomNav() {
  const [path, setPath] = useState("/");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session?.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(Boolean(session?.user));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => {
        const active = tab.match(path);
        const href = tab.href === "/member" && !loggedIn ? "/login" : tab.href;
        const Icon = tab.icon;
        return (
          <a
            key={tab.href}
            href={href}
            className={`bottom-nav-tab${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span className="bottom-nav-label lang-en">{tab.en}</span>
            <span className="bottom-nav-label lang-hi">{tab.hi}</span>
          </a>
        );
      })}
    </nav>
  );
}
