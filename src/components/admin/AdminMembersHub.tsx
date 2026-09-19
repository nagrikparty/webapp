import React, { useState, useEffect } from "react";
import {
  Users,
  FileCheck2,
  Inbox,
  CreditCard,
} from "lucide-react";
import { AdminApplicationsView } from "@/components/AdminApplicationsView";
import { VerifierDashboard } from "@/components/VerifierDashboard";
import { AdminMembersView } from "@/components/AdminMembersView";
import { AdminCardsView } from "@/components/AdminCardsView";

export function AdminMembersHub() {
  const [activeTab, setActiveTab] = useState<"members" | "applications" | "verifications" | "cards">("members");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "applications" || tabParam === "verifications" || tabParam === "cards" || tabParam === "members") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "members" | "applications" | "verifications" | "cards") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Sub-tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--line-strong)",
          paddingBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => switchTab("members")}
          className="button"
          style={{
            background: activeTab === "members" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "members" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "members" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Users size={16} />
          Founding Member Register
        </button>

        <button
          type="button"
          onClick={() => switchTab("verifications")}
          className="button"
          style={{
            background: activeTab === "verifications" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "verifications" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "verifications" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <FileCheck2 size={16} />
          Document Scrutiny Desk
        </button>

        <button
          type="button"
          onClick={() => switchTab("applications")}
          className="button"
          style={{
            background: activeTab === "applications" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "applications" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "applications" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Inbox size={16} />
          Application Intake Queue
        </button>

        <button
          type="button"
          onClick={() => switchTab("cards")}
          className="button"
          style={{
            background: activeTab === "cards" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "cards" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "cards" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <CreditCard size={16} />
          Membership Card Console
        </button>
      </div>

      {/* --- Active View --- */}
      {activeTab === "members" && <AdminMembersView />}
      {activeTab === "verifications" && <VerifierDashboard />}
      {activeTab === "applications" && <AdminApplicationsView />}
      {activeTab === "cards" && <AdminCardsView />}
    </div>
  );
}
