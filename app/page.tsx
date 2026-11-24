import MatchCenter from "./components/match-center";
import BankrollTracker from "./components/bankroll-tracker";
import CouponBuilder from "./components/coupon-builder";
import { Activity, ArrowUpRight, BarChart3, BrainCircuit, CalendarDays, CircleDollarSign, ShieldCheck, Target, Trophy } from "lucide-react";

const features = [
  { icon: BrainCircuit, title: "Analyses IA", desc: "Évalue les matchs à partir des statistiques disponibles.", tag: "Bientôt" },
  { icon: Target, title: "Générateur de coupons", desc: "Construis un combiné, calcule sa cote et enregistre un brouillon.", tag: "Disponible" },
  { icon: BarChart3, title: "Comparateur de cotes", desc: "Compare les marchés et repère les écarts de prix.", tag: "Bientôt" },
  { icon: CircleDollarSign, title: "Gestion de bankroll", desc: "Enregistre tes dépôts, retraits, mises et retours en FCFA.", tag: "Disponible" },
];

export default function Home() {
  return <main className="shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark">C</span><span>COLON <b>AI</b><small>FOOTBALL INTELLIGENCE</small></span></a>
      <div className="nav-label">ESPACE DE TRAVAIL</div>
      <a className="nav-item active" href="#"><Activity size={18}/> Tableau de bord</a>
      <a className="nav-item" href="#matchs"><CalendarDays size={18}/> Matchs & résultats</a>
      <a className="nav-item" href="#coupon-builder"><Target size={18}/> Outils & coupons</a>
      <a className="nav-item" href="#bankroll"><CircleDollarSign size={18}/> Bankroll</a>
      <div className="sidebar-bottom"><ShieldCheck size={17}/><span>Les pronostics comportent des risques. Aucun gain n’est garanti.</span></div>
    </aside>
    <section className="main-area">
      <header className="topbar"><div><span className="eyebrow">CENTRE DE CONTRÔLE</span><h1>Tableau de bord</h1></div><a className="auth-top-link" href="/auth/login">Connexion / Inscription <ArrowUpRight size={15}/></a><div className="status"><span className="pulse"/> Plateforme en préparation</div></header>
      <section className="welcome"><div><span className="eyebrow light">BIENVENUE SUR COLON AI</span><h2>Décide avec les données.<br/><em>Pas avec l’intuition.</em></h2><p>Une plateforme d’analyse football conçue pour transformer les statistiques en informations utiles.</p><a href="#outils" className="primary-link">Découvrir les outils <ArrowUpRight size={17}/></a></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-icon"><Trophy size={62}/></div><div className="hero-caption">FOOTBALL DATA<br/><b>INTELLIGENCE</b></div></div></section>
      <MatchCenter />
      <BankrollTracker />
      <CouponBuilder />
      <div className="section-heading"><div><span className="eyebrow">VUE D’ENSEMBLE</span><h3>Votre activité</h3></div><span className="muted"><CalendarDays size={15}/> Données à connecter</span></div>
      <div className="metrics"><article className="metric"><span>Matchs analysés</span><BrainCircuit/><strong>—</strong><small>En attente de connexion API</small></article><article className="metric"><span>Pronostics suivis</span><Target/><strong>—</strong><small>Aucune donnée enregistrée</small></article><article className="metric"><span>Bankroll suivie</span><CircleDollarSign/><strong>—</strong><small>Configure ton suivi personnel</small></article><article className="metric"><span>Taux de réussite</span><BarChart3/><strong>—</strong><small>Calculé sur tes résultats réels</small></article></div>
      <div className="section-heading" id="outils"><div><span className="eyebrow">BOÎTE À OUTILS</span><h3>Les outils COLON AI</h3></div><span className="muted">Développement en cours</span></div>
      <div className="feature-grid">{features.map(({icon:Icon,title,desc,tag})=><article className="feature" key={title}><div className="feature-icon"><Icon size={21}/></div><span className="tag">{tag}</span><h4>{title}</h4><p>{desc}</p></article>)}</div>
      <footer><span>© 2026 COLON AI</span><span>Statistiques réelles • Transparence • Gestion du risque</span></footer>
    </section>
  </main>;
}
