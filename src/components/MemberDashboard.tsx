import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Megaphone, Users, User, MapPin } from "lucide-react";
import { ManifestoVoting } from "./ManifestoVoting";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unitMembers, setUnitMembers] = useState<any[]>([]);
  const [tab, setTab] = useState<"announcements" | "manifesto" | "directory">("announcements");

  // R1 Tasks
  const [tasks, setTasks] = useState<any[]>([]);

  // R2 ID Card Download
  const [downloading, setDownloading] = useState(false);
  const [cardError, setCardError] = useState("");

  // R3 Payments
  const [amount, setAmount] = useState<string>("100");
  const [donating, setDonating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  // R4 Referrals
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      // If a volunteer manages to get here without member role, redirect them.
      // Admins and members are allowed.
      if (profileData.role === "volunteer") {
        window.location.href = "/dashboard/volunteer";
        return;
      }
      setProfile(profileData);

      // Load Unit Members (same ward)
      if (profileData.ward) {
        const { data: membersData } = await supabase
          .from("profiles")
          .select("*")
          .eq("ward", profileData.ward)
          .in("role", ["member", "admin"])
          .neq("id", user.id);
        if (membersData) setUnitMembers(membersData);
      }
    }

    // Load Announcements
    const { data: announcementsData } = await supabase
      .from("announcements")
      .select("*")
      .in("target_audience", ["all", "members"])
      .order("created_at", { ascending: false });
    if (announcementsData) setAnnouncements(announcementsData);

    // Load Tasks (R1: open status or assigned to user ID)
    const { data: tasksData } = await supabase
      .from("volunteer_tasks")
      .select("*")
      .or(`status.eq.open,assigned_to.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (tasksData) setTasks(tasksData || []);

    // Load Transaction History (R3)
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (transactionsData) setTransactions(transactionsData);

    // Load Referral Count (R4)
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", user.id);
    if (count !== null && count !== undefined) {
      setReferralCount(count);
    } else {
      const { data: refData } = await supabase
        .from("profiles")
        .select("id")
        .eq("referred_by", user.id);
      if (refData) setReferralCount(refData.length);
    }

    setLoading(false);
  }

  async function loadTransactions() {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (transactionsData) setTransactions(transactionsData);
  }

  async function downloadIdCard() {
    if (downloading) return;
    setDownloading(true);
    setCardError("");

    try {
      const cardElement = document.getElementById("id-card-element");
      if (!cardElement) {
        throw new Error("ID Card element not found");
      }

      let canvas;
      if ((window as any).html2canvas) {
        canvas = await (window as any).html2canvas(cardElement);
      } else {
        canvas = await html2canvas(cardElement);
      }
      
      const link = document.createElement("a");
      link.download = `${profile?.full_name || "member"}_id_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err: any) {
      setCardError("Failed to download ID Card.");
    } finally {
      setDownloading(false);
    }
  }

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/signup?ref=${profile?.id || ""}`
    : "";

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      (window as any).__clipboardText = referralLink;
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  const numericAmount = parseFloat(amount);
  const isDonateDisabled = !amount || isNaN(numericAmount) || numericAmount <= 0 || donating;

  async function handleDonate() {
    if (isDonateDisabled) return;
    setDonating(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK is not loaded.");
      }

      const options = {
        key: "rzp_test_mock",
        amount: numericAmount * 100,
        currency: "INR",
        name: "Nagrik Party",
        description: "Donation / Fee payment",
        handler: async function (response: any) {
          try {
            const sessionRes = await supabase.auth.getSession();
            const token = sessionRes.data.session?.access_token;
            if (!token) {
              throw new Error("Missing auth session token.");
            }

            const res = await fetch("/api/donations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                amount: numericAmount,
                transactionId: response.razorpay_payment_id
              })
            });

            if (!res.ok) {
              const resData = await res.json();
              throw new Error(resData.error || "Failed to log donation transaction.");
            }

            setSuccessMsg("Success! Donation recorded.");
            loadTransactions();
          } catch (err: any) {
            setErrorMsg(err.message || "Failed to log transaction.");
          } finally {
            setDonating(false);
          }
        },
        modal: {
          ondismiss: function () {
            setErrorMsg("Payment process cancelled.");
            setDonating(false);
          }
        },
        prefill: {
          name: profile?.full_name || "",
          email: profile?.email || ""
        },
        theme: {
          color: "#0F766E"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Payment modal failed to open.");
      setDonating(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/member/${profile?.id || ""}`
    : "";

  return (
    <div data-testid="member-dashboard-content" className="dashboard-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
        
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card feature dashboard-welcome-card member">
            <h2 className="dashboard-welcome-title">Welcome, {profile?.full_name || "Member"}</h2>
            <p className="dashboard-welcome-subtitle">
              <MapPin size={14} className="dashboard-welcome-icon" />
              {profile?.ward ? `Official Member for ${profile.ward}` : "Verified Member"}
            </p>
          </div>

          <div className="dashboard-tabs">
            <button className={`button ${tab === "announcements" ? "primary" : ""}`} onClick={() => setTab("announcements")} type="button">Party Announcements</button>
            <button className={`button ${tab === "manifesto" ? "primary" : ""}`} onClick={() => setTab("manifesto")} type="button">Vote Manifesto</button>
            <button className={`button ${tab === "directory" ? "primary" : ""}`} onClick={() => setTab("directory")} type="button">Unit Directory</button>
          </div>

          {tab === "announcements" && (
            <div className="dashboard-list">
              <h3>Circulars & Announcements</h3>
              {announcements.length === 0 ? (
                <p className="text-muted">No new announcements from the party.</p>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="card dashboard-card">
                    <div className="announcement-header">
                      <div className="announcement-icon-wrap">
                        <Megaphone size={20} color="var(--blue)" />
                      </div>
                      <div>
                        <h3 className="m-0">{ann.title}</h3>
                        <span className="announcement-date">{new Date(ann.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="announcement-content">{ann.content}</p>
                  </div>
                ))
              )}

              <h3 style={{ marginTop: "32px" }}>Volunteering Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-muted">No volunteering tasks assigned or open.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="card dashboard-card" data-testid="volunteer-task-card">
                    <div className="announcement-header">
                      <div className="announcement-icon-wrap" style={{ backgroundColor: "rgba(249, 115, 22, 0.1)" }}>
                        <Users size={20} color="var(--orange)" />
                      </div>
                      <div>
                        <h3 className="m-0">{task.title}</h3>
                        <span className="announcement-date">Status: {task.status}</span>
                      </div>
                    </div>
                    <p className="announcement-content">{task.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "manifesto" && (
            <div>
              <p style={{ color: "var(--muted)", marginBottom: "24px" }}>Shape the party's priorities by upvoting the most important issues in your area.</p>
              <ManifestoVoting />
            </div>
          )}

          {tab === "directory" && (
            <div className="dashboard-list">
              <p className="text-muted">Connect with other verified members in {profile?.ward}.</p>
              {unitMembers.length === 0 ? (
                <p className="text-muted">No other members found in your ward yet.</p>
              ) : (
                <div className="directory-grid">
                  {unitMembers.map(m => (
                    <div key={m.id} className="card directory-card">
                      <div className="directory-avatar">
                        <User size={24} color="var(--green)" />
                      </div>
                      <div>
                        <h4 className="m-0 mb-1">{m.full_name || "Anonymous Member"}</h4>
                        <span className="directory-role">Member</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* R2 Digital ID Card */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Digital ID Card</h3>
            <div 
              data-testid="id-card" 
              id="id-card-element" 
              style={{
                background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
                color: "#ffffff",
                padding: "24px",
                borderRadius: "16px",
                textAlign: "center",
                marginBottom: "16px"
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "8px" }}>NAGRIK PARTY</div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8, marginBottom: "16px" }}>Digital Member Card</div>
              
              <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "8px", display: "inline-block", marginBottom: "16px" }}>
                <QRCode value={verifyUrl} size={128} data-testid="qr-code" />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>MEMBER NAME</div>
                <div data-testid="id-card-name" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{profile?.full_name || "Anonymous Member"}</div>
              </div>

              <div>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>EPIC / VOTER ID</div>
                <div data-testid="id-card-epic" style={{ fontFamily: "monospace", fontSize: "1rem" }}>{profile?.epic || "Pending Verification"}</div>
              </div>
            </div>

            <button 
              data-testid="download-id-card-button" 
              onClick={downloadIdCard} 
              disabled={downloading}
              className="button primary"
              style={{ width: "100%" }}
            >
              {downloading ? "Downloading..." : "Download ID Card"}
            </button>
            {cardError && <div data-testid="error-message" className="auth-message error" style={{ marginTop: "12px" }}>{cardError}</div>}
          </div>

          {/* R4 Referral System */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Referral Link</h3>
            <p className="text-muted" style={{ marginBottom: "16px", fontSize: "0.9rem" }}>Help build our network by referring new members.</p>
            
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                data-testid="referral-link"
                style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.9rem" }}
              />
              <button 
                data-testid="copy-referral-button" 
                onClick={copyReferralLink}
                className="button outline"
              >
                Copy
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(15, 118, 110, 0.1)" }}>
              <span style={{ fontWeight: "500" }}>Total referred members:</span>
              <span data-testid="referral-count" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--teal)" }}>{referralCount}</span>
            </div>
          </div>

          {/* R3 Donation Portal */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Donations & Fees</h3>
            
            {successMsg && (
              <div data-testid="success-message" className="auth-message success" style={{ marginBottom: "16px" }}>
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div data-testid="error-message" className="auth-message error" style={{ marginBottom: "16px" }}>
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="payment-amount-input-id" style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "0.9rem" }}>Payment Amount (INR)</label>
              <input 
                id="payment-amount-input-id"
                type="number" 
                data-testid="payment-amount-input"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount"
                disabled={donating}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button type="button" data-testid="preset-100" onClick={() => setAmount("100")} className="button outline" style={{ flex: 1, padding: "6px" }}>₹100</button>
              <button type="button" data-testid="preset-500" onClick={() => setAmount("500")} className="button outline" style={{ flex: 1, padding: "6px" }}>₹500</button>
              <button type="button" data-testid="preset-1000" onClick={() => setAmount("1000")} className="button outline" style={{ flex: 1, padding: "6px" }}>₹1000</button>
            </div>

            <button 
              data-testid="donate-button" 
              onClick={handleDonate}
              disabled={isDonateDisabled}
              className="button primary"
              style={{ width: "100%" }}
            >
              {donating ? "Processing..." : "Donate"}
            </button>

            <h4 style={{ marginTop: "24px", marginBottom: "12px" }}>Donation History</h4>
            <div data-testid="donation-history" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px" }}>
              {transactions.length === 0 ? (
                <p className="text-muted" style={{ margin: 0, textAlign: "center", fontSize: "0.9rem" }}>No transactions recorded yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {transactions.map((tx) => (
                    <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid var(--border-light)", fontSize: "0.85rem" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>₹{tx.amount}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>ID: {tx.transaction_id || tx.transactionId}</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
