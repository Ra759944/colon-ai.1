"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setMessage("Compte créé. Vérifie ta boîte e-mail pour confirmer ton adresse, puis connecte-toi.");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        router.replace(next);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="auth-brand" href="/">COLON <b>AI</b></Link>
        <span className="auth-eyebrow">FOOTBALL INTELLIGENCE</span>
        <h1>{mode === "login" ? "Content de te revoir" : "Créer ton compte"}</h1>
        <p>{mode === "login" ? "Connecte-toi pour retrouver ton espace d’analyse." : "Crée ton espace personnel COLON AI."}</p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>Nom affiché<input autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ton nom" maxLength={60} /></label>
          )}
          <label>Adresse e-mail<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nom@exemple.com" /></label>
          <label>Mot de passe<input type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum" /></label>
          {error && <div className="auth-alert error" role="alert">{error}</div>}
          {message && <div className="auth-alert success" role="status">{message}</div>}
          <button type="submit" disabled={busy}>{busy ? "Patiente..." : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
        </form>
        <div className="auth-switch">
          {mode === "login" ? <>Pas encore de compte ? <Link href="/auth/signup">Créer un compte</Link></> : <>Déjà inscrit ? <Link href="/auth/login">Se connecter</Link></>}
        </div>
        <Link className="auth-home" href="/">Retour à l’accueil</Link>
      </section>
    </main>
  );
}
