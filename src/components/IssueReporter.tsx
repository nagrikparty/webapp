import { Camera, LocateFixed, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { lokSabhaToVidhanSabha, delhiConstituenciesAndWards } from "@/lib/delhi_data";

type Status = "idle" | "ready" | "saved";

export function IssueReporter() {
  const [status, setStatus] = useState<Status>("idle");
  const [location, setLocation] = useState("Not captured");
  const [detected, setDetected] = useState("Delhi boundary engine ready");
  const [lokSabha, setLokSabha] = useState("");
  const [vidhanSabha, setVidhanSabha] = useState("");
  const assemblies = lokSabha ? lokSabhaToVidhanSabha[lokSabha] : [];
  const wards = vidhanSabha ? delhiConstituenciesAndWards[vidhanSabha] : [];

  function locate() {
    if (!navigator.geolocation) {
      setLocation("Geolocation unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setLocation(`${lat}, ${lng}`);
        setDetected("Auto assignment queued: Vidhan Sabha + ward");
        setStatus("ready");
      },
      () => setLocation("Permission needed"),
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saved");

    const form = new FormData(event.currentTarget);
    const data = {
      title: form.get("title"),
      category: form.get("category"),
      description: form.get("description"),
      lok_sabha: form.get("lok_sabha"),
      vidhan_sabha: form.get("vidhan_sabha"),
      ward: form.get("ward"),
    };

    await fetch("/api/v1/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status: "submitted" })
    });
  }

  return (
    <form className="form-surface" onSubmit={submit}>
      <div className="form-grid">
        <div className="field full">
          <label>
            <span className="lang-en">Issue title</span>
            <span className="lang-hi">मुद्दे का शीर्षक</span>
          </label>
          <input name="title" required placeholder="Broken drain cover, dark lane, waterlogging..." />
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Issue type</span>
            <span className="lang-hi">मुद्दे का प्रकार</span>
          </label>
          <select name="category" required>
            <option>Roads & infrastructure</option>
            <option>Drainage / sewage</option>
            <option>Women safety</option>
            <option>Water supply</option>
            <option>Sanitation</option>
            <option>Healthcare access</option>
            <option>Legal / documentation help</option>
            <option>Environment</option>
          </select>
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Lok Sabha (Parliament)</span>
            <span className="lang-hi">लोकसभा</span>
          </label>
          <select name="lok_sabha" required value={lokSabha} onChange={(e) => { setLokSabha(e.target.value); setVidhanSabha(""); }}>
            <option value="">Select Lok Sabha</option>
            {Object.keys(lokSabhaToVidhanSabha).sort().map((ls) => (
              <option key={ls} value={ls}>{ls}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Vidhan Sabha (Assembly)</span>
            <span className="lang-hi">विधानसभा</span>
          </label>
          <select name="vidhan_sabha" required disabled={!lokSabha} value={vidhanSabha} onChange={(e) => setVidhanSabha(e.target.value)}>
            <option value="">Select Assembly</option>
            {assemblies.map((ac) => (
              <option key={ac} value={ac}>{ac}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Ward</span>
            <span className="lang-hi">वार्ड</span>
          </label>
          <select name="ward" required disabled={!vidhanSabha}>
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label>
            <span className="lang-en">Description</span>
            <span className="lang-hi">विवरण</span>
          </label>
          <textarea name="description" required placeholder="Describe what citizens are facing and since when." />
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Photo evidence</span>
            <span className="lang-hi">फोटो प्रमाण</span>
          </label>
          <input name="photo" accept="image/*" capture="environment" type="file" />
        </div>
        <div className="field">
          <label>
            <span className="lang-en">Optional email</span>
            <span className="lang-hi">वैकल्पिक ईमेल</span>
          </label>
          <input name="email" type="email" placeholder="For private follow-up only" />
        </div>
      </div>

      <div className="form-submit-group">
        <button className="button" type="button" onClick={locate}>
          <LocateFixed size={17} />
          <span className="lang-en">Use current location</span>
          <span className="lang-hi">वर्तमान लोकेशन लें</span>
        </button>
        <div className="notice">
          <strong>
            <span className="lang-en">Public privacy:</span>
            <span className="lang-hi">सार्वजनिक गोपनीयता:</span>
          </strong>{" "}
          <span className="lang-en">
            issue pages will show the work, not your name, email or personal identity.
          </span>
          <span className="lang-hi">
            मुद्दा पेज काम दिखाएंगे, आपका नाम, ईमेल या निजी पहचान नहीं।
          </span>
          <br />
          <span>{location}</span> · <span>{detected}</span>
        </div>
        <button className="button primary" type="submit">
          {status === "saved" ? <Camera size={17} /> : <UploadCloud size={17} />}
          <span className="lang-en">{status === "saved" ? "Issue saved locally" : "Submit issue"}</span>
          <span className="lang-hi">{status === "saved" ? "मुद्दा सेव हुआ" : "मुद्दा जमा करें"}</span>
        </button>
      </div>
    </form>
  );
}
