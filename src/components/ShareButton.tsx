import React, { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  label?: string;
}

/** WhatsApp-first share with native Web Share fallback. */
export function ShareButton({ title, text, url, label = "Share Karein" }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(url || window.location.href);
  }, [url]);

  function handleShare() {
    const fullText = text ? `${text}\n${shareUrl}` : shareUrl;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${fullText}`)}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, text, url: shareUrl }).catch(() => {
        window.open(waUrl, "_blank", "noopener");
      });
    } else {
      window.open(waUrl, "_blank", "noopener");
    }
  }

  return (
    <button type="button" className="share-btn" onClick={handleShare} aria-label="WhatsApp par share karein">
      <Share2 size={16} />
      <span>{label}</span>
    </button>
  );
}
