"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calculator, Plus, Trash2, Save } from "lucide-react";

type Leg = { id: number; competition: string; selection: string; odds: string };
const competitions = ["Premier League (Angleterre)","EFL Championship (Angleterre)","LaLiga (Espagne)","Ligue 1 (France)","Bundesliga (Allemagne)","Serie A (Italie)","Eredivisie (Pays-Bas)","Primeira Liga (Portugal)","Autre compétition"];
const fmt = (n:number) => new Intl.NumberFormat("fr-FR",{maximumFractionDigits:2}).format(n);
export default function CouponBuilder() {
 const supabase=useMemo(()=>createClient(),[]);
 const [title,setTitle]=useState("Mon combiné");
 const [stake,setStake]=useState("");
 const [legs,setLegs]=useState<Leg[]>([{id:1,competition:competitions[0],selection:"",odds:""}]);
 const [saving,setSaving]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const valid=legs.filter(x=>x.selection.trim()&&Number(x.odds)>1);
 const combined=valid.reduce((acc,x)=>acc*Number(x.odds),1);
 const potential=Number(stake)>0?Number(stake)*combined:0;
 function update(id:number,key:keyof Omit<Leg,"id">,value:string){setLegs(old=>old.map(x=>x.id===id?{...x,[key]:value}:x));}
 function add(){setLegs(old=>[...old,{id:Math.max(0,...old.map(x=>x.id))+1,competition:competitions[0],selection:"",odds:""}]);}
 async function save(){
  setError("");setNotice("");
  if(!title.trim()||valid.length!==legs.length||legs.length===0){setError("Complète le titre, chaque sélection et une cote supérieure à 1.");return;}
  if(stake && (!Number.isSafeInteger(Number(stake))||Number(stake)<=0)){setError("La mise doit être un montant entier positif en FCFA.");return;}
  setSaving(true);
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setError("Connecte-toi pour enregistrer ce coupon.");setSaving(false);return;}
  const created=await supabase.from("coupons").insert({user_id:user.id,title:title.trim(),target_odds:combined,actual_odds:combined,stake:stake?Number(stake):null,status:"draft"}).select("id").single();
  if(created.error||!created.data){setError("Enregistrement du coupon impossible.");setSaving(false);return;}
  const inserted=await supabase.from("coupon_legs").insert(legs.map(x=>({coupon_id:created.data.id,competition_name:x.competition,selection:x.selection.trim(),odds:Number(x.odds)})));
  if(inserted.error){await supabase.from("coupons").delete().eq("id",created.data.id);setError("Les sélections n'ont pas pu être enregistrées. Le brouillon a été annulé.");}
  else setNotice("Coupon enregistré en brouillon dans ton compte.");
  setSaving(false);
 }
 return <section className="coupon-panel" id="coupon-builder"><div className="coupon-head"><div><span className="eyebrow">OUTIL DE CALCUL</span><h3><Calculator size={19}/> Constructeur de combiné</h3></div><span className="coupon-tag">Sans pari automatique</span></div>
 <label className="coupon-title-field">Nom du coupon<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
 <div className="coupon-legs">{legs.map((leg,index)=><article className="coupon-leg" key={leg.id}><div className="coupon-leg-head"><b>Sélection {index+1}</b>{legs.length>1&&<button type="button" onClick={()=>setLegs(old=>old.filter(x=>x.id!==leg.id))} aria-label="Supprimer"><Trash2 size={14}/></button>}</div>
 <label>Compétition<select value={leg.competition} onChange={e=>update(leg.id,"competition",e.target.value)}>{competitions.map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Marché / sélection<input value={leg.selection} onChange={e=>update(leg.id,"selection",e.target.value)} placeholder="Ex. Plus de 1,5 but" /></label>
 <label>Cote décimale<input type="number" min="1.01" step="0.01" value={leg.odds} onChange={e=>update(leg.id,"odds",e.target.value)} placeholder="1.50" /></label>
 </article>)}</div>
 <button className="coupon-add" type="button" onClick={add}><Plus size={15}/> Ajouter une sélection</button>
 <div className="coupon-summary"><div><span>Cote combinée</span><strong>{valid.length===legs.length&&valid.length>0?fmt(combined):"—"}</strong></div><div><span>Probabilité implicite</span><strong>{valid.length===legs.length&&combined>0?fmt(100/combined)+" %":"—"}</strong></div></div>
 <label className="coupon-stake">Mise envisagée (FCFA, facultatif)<input type="number" min="1" step="1" value={stake} onChange={e=>setStake(e.target.value)} placeholder="Ex. 500" /></label>
 {potential>0&&<p className="coupon-potential">Retour théorique avant éventuelles règles du bookmaker : <b>{fmt(potential)} FCFA</b>. Ce montant n&apos;est pas un gain garanti.</p>}
 <button className="coupon-save" type="button" onClick={()=>void save()} disabled={saving}><Save size={15}/>{saving?"Enregistrement…":"Enregistrer le brouillon"}</button>
 {error&&<p className="bankroll-error">{error}</p>}{notice&&<p className="bankroll-success">{notice}</p>}
 <p className="bankroll-note">La probabilité affichée est seulement l&apos;inverse de la cote combinée. Elle ne tient pas compte de la marge du bookmaker ni de la probabilité réelle des événements. Vérifie chaque sélection et le nom complet de la compétition.</p>
 </section>;
}