import { Languages, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("nagrik-lang");
    const next = saved === "hi" ? "hi" : "en";
    setLang(next);
    document.documentElement.dataset.lang = next;
  }, []);

  function toggle() {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    document.documentElement.dataset.lang = next;
    window.localStorage.setItem("nagrik-lang", next);
  }

  return (
    <button className="language-toggle" onClick={toggle} type="button" aria-label="Switch language">
      <span style={{ fontWeight: 800, fontSize: 14 }}>{lang === "en" ? "अ" : "A"}</span>
      <span>{lang === "en" ? "हिन्दी" : "English"}</span>
    </button>
  );
}

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <button
      className="icon-button mobile-menu"
      onClick={() => setOpen((value) => !value)}
      type="button"
      aria-label="Open navigation"
    >
      {open ? <X size={19} /> : <Menu size={19} />}
    </button>
  );
}
