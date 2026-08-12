"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ProfileRow = { id: string; registrationId: string; fullName: string; gender: string; dateOfBirth: string; caste: string; city: string; district: string; mobile: string; email: string; status: "pending" | "approved" | "rejected"; photoKey: string | null; details: Record<string,string>; createdAt: string };

export default function AdminDashboard({ user, signOutPath }: { user: { name: string; email: string }; signOutPath: string }) {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/profiles?status=${status}&q=${encodeURIComponent(query)}`);
    const data = await response.json() as { profiles?: ProfileRow[]; error?: string };
    setRows(data.profiles || []); setMessage(data.error || ""); setLoading(false);
  }, [status, query]);
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const counts = useMemo(() => ({ all: rows.length, pending: rows.filter(r=>r.status==="pending").length, approved: rows.filter(r=>r.status==="approved").length, rejected: rows.filter(r=>r.status==="rejected").length }), [rows]);
  async function changeStatus(row: ProfileRow, next: ProfileRow["status"]) {
    await fetch("/api/admin/profiles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status: next }) });
    setSelected(current => current ? { ...current, status: next } : null); setMessage(`Profile ${next}.`); await load();
  }

  return <main className="admin-page">
    <aside className="admin-sidebar"><a className="brand admin-brand" href="/"><span className="brand-mark">M</span><span>MilanMitra</span></a><nav><a className="active" href="/admin">◫ Profiles</a><a href="/register">＋ New registration</a><a href="/">⌂ Website</a></nav><div className="admin-user"><span>{user.name.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><a href={signOutPath}>Sign out</a></div></aside>
    <section className="admin-content"><header><div><span className="kicker">ADMIN CONSOLE</span><h1>Profile management</h1><p>Review registrations, protect private details, and approve profiles for sharing.</p></div><a className="button" href="/register">＋ Add profile</a></header>
      <div className="admin-stats"><article><span>Total profiles</span><strong>{counts.all}</strong></article><article><span>Awaiting review</span><strong>{counts.pending}</strong></article><article><span>Approved</span><strong>{counts.approved}</strong></article><article><span>Rejected</span><strong>{counts.rejected}</strong></article></div>
      <div className="admin-toolbar"><label>⌕<input placeholder="Search name, ID, phone or city" value={query} onChange={e=>setQuery(e.target.value)} /></label><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
      {message && <p className="admin-message">{message}</p>}
      <div className="admin-table"><div className="admin-row admin-table-head"><span>Profile</span><span>Contact</span><span>Location</span><span>Status</span><span></span></div>{loading ? <div className="admin-empty">Loading profiles…</div> : rows.length ? rows.map(row => <button className="admin-row" key={row.id} onClick={()=>setSelected(row)}><span><strong>{row.fullName}</strong><small>{row.registrationId} · {row.gender}</small></span><span><strong>{row.mobile}</strong><small>{row.email || "No email"}</small></span><span><strong>{row.city || "—"}</strong><small>{row.district || row.caste || "—"}</small></span><span><i className={`status-dot ${row.status}`} />{row.status}</span><span>View →</span></button>) : <div className="admin-empty"><strong>No profiles found</strong><span>New registrations will appear here automatically.</span></div>}</div>
    </section>
    {selected && <div className="admin-modal-backdrop" onClick={()=>setSelected(null)}><article className="admin-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><span className="kicker">{selected.registrationId}</span><h2>{selected.fullName}</h2><div className="modal-status"><i className={`status-dot ${selected.status}`} />{selected.status}</div><div className="modal-data">{Object.entries(selected.details).filter(([,v])=>v).map(([key,value])=><div key={key}><span>{key.replace(/([A-Z])/g," $1")}</span><strong>{value}</strong></div>)}</div><div className="modal-privacy">🔒 Phone, email and address are visible only in this admin view and remain excluded from the shared PDF.</div><div className="modal-actions"><button className="ghost-button reject" onClick={()=>changeStatus(selected,"rejected")}>Reject</button><button className="ghost-button" onClick={()=>changeStatus(selected,"pending")}>Mark pending</button><button className="button" onClick={()=>changeStatus(selected,"approved")}>✓ Approve profile</button></div></article></div>}
  </main>;
}
