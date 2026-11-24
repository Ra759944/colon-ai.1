"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CircleDollarSign, Plus, RefreshCw } from "lucide-react";

type Transaction = {
  id: string;
  kind: "deposit" | "withdrawal" | "stake" | "return" | "adjustment";
  amount: number;
  description: string | null;
  match_label: string | null;
  occurred_at: string;
};
const labels: Record<Transaction["kind"], string> = {
  deposit: "Dépôt", withdrawal: "Retrait", stake: "Mise", return: "Retour de pari", adjustment: "Ajustement"
};
const signed = (tx: Transaction) => tx.kind === "deposit" || tx.kind === "return" ? tx.amount : tx.kind === "adjustment" ? tx.amount : -tx.amount;
const money = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " FCFA";

export default function BankrollTracker() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [bankrollId, setBankrollId] = useState<string | null>(null);
  const [opening, setOpening] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kind, setKind] = useState<Transaction["kind"]>("deposit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [match, setMatch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const balance = useMemo(() => opening + transactions.reduce((sum, tx) => sum + signed(tx), 0), [opening, transactions]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setUserId(null); setLoading(false); return; }
    setUserId(auth.user.id);
    const { data: banks, error: bankError } = await supabase.from("bankrolls").select("id,opening_balance").eq("user_id", auth.user.id).order("created_at", { ascending: true }).limit(1);
    if (bankError) { setError("Impossible de charger ta bankroll."); setLoading(false); return; }
    let bank = banks?.[0];
    if (!bank) {
      const created = await supabase.from("bankrolls").insert({ user_id: auth.user.id, name: "Capital principal", currency: "XOF", opening_balance: 0 }).select("id,opening_balance").single();
      if (created.error || !created.data) { setError("Impossible de créer ta bankroll."); setLoading(false); return; }
      bank = created.data;
    }
    setBankrollId(bank.id); setOpening(Number(bank.opening_balance));
    const result = await supabase.from("bankroll_transactions").select("id,kind,amount,description,match_label,occurred_at").eq("bankroll_id", bank.id).eq("user_id", auth.user.id).order("occurred_at", { ascending: false }).limit(100);
    if (result.error) setError("Impossible de charger l'historique.");
    else setTransactions((result.data ?? []) as Transaction[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId || !bankrollId) return;
    const value = Number(amount);
    if (!Number.isSafeInteger(value) || value <= 0) { setError("Entre un montant entier positif en FCFA."); return; }
    if ((kind === "withdrawal" || kind === "stake") && value > balance) { setError("Le montant dépasse ton solde disponible."); return; }
    setSaving(true); setError(""); setMessage("");
    const result = await supabase.from("bankroll_transactions").insert({
      bankroll_id: bankrollId, user_id: userId, kind, amount: value, currency: "XOF",
      description: description.trim() || null, match_label: match.trim() || null
    });
    if (result.error) setError("Enregistrement impossible. Vérifie ta connexion puis réessaie.");
    else { setAmount(""); setDescription(""); setMatch(""); setMessage("Opération enregistrée."); await load(); }
    setSaving(false);
  }

  return <section className="bankroll-panel" id="bankroll">
    <div className="bankroll-head"><div><span className="eyebrow">GESTION PERSONNELLE</span><h3><CircleDollarSign size={19}/> Ma bankroll</h3></div><button className="refresh-button" onClick={() => void load()} disabled={loading} aria-label="Actualiser la bankroll"><RefreshCw size={15}/></button></div>
    {!loading && !userId ? <div className="bankroll-empty"><p>Connecte-toi pour enregistrer ton capital et suivre tes opérations.</p><a href="/auth/login">Se connecter</a></div> : loading ? <p className="bankroll-note">Chargement de ta bankroll…</p> : <>
      <div className="bankroll-balance"><span>Solde calculé</span><strong>{money(balance)}</strong><small>Capital initial : {money(opening)}</small></div>
      <form className="bankroll-form" onSubmit={submit}>
        <label>Type d&apos;opération<select value={kind} onChange={e => setKind(e.target.value as Transaction["kind"])}>{Object.entries(labels).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label>Montant (FCFA)<input inputMode="numeric" type="number" min="1" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex. 500" required /></label>
        <label>Match (facultatif)<input value={match} onChange={e => setMatch(e.target.value)} placeholder="Équipe A – Équipe B" /></label>
        <label>Note (facultatif)<input value={description} onChange={e => setDescription(e.target.value)} placeholder="Détail de l'opération" /></label>
        <button className="bankroll-submit" type="submit" disabled={saving || !amount}><Plus size={15}/>{saving ? "Enregistrement…" : "Ajouter l'opération"}</button>
      </form>
      {error && <p className="bankroll-error">{error}</p>}{message && <p className="bankroll-success">{message}</p>}
      <div className="bankroll-history-head"><b>Historique récent</b><span>{transactions.length} opération(s)</span></div>
      {transactions.length ? <div className="bankroll-history">{transactions.slice(0,8).map(tx => <article key={tx.id}><div><b>{labels[tx.kind]}</b><small>{tx.match_label || tx.description || new Date(tx.occurred_at).toLocaleDateString("fr-FR")}</small></div><strong className={signed(tx) >= 0 ? "positive" : "negative"}>{signed(tx) > 0 ? "+" : ""}{money(signed(tx))}</strong></article>)}</div> : <p className="bankroll-note">Aucune opération enregistrée pour le moment.</p>}
      <p className="bankroll-note">Le solde est calculé à partir des dépôts, retraits, mises et retours que tu enregistres. Les résultats ne sont pas importés automatiquement depuis 1XBet.</p>
    </>}
  </section>;
}