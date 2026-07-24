"use client";

import Link from "next/link";
import { Cloud, Download, HardDrive, LockKeyhole, UserRound } from "lucide-react";
import { MobileBottomNav } from "../mobile-bottom-nav";
import { DEMO_ACCOUNTS_STORAGE_KEY } from "../demo-account-storage";

const SETTINGS_KEY = "patrimoine.dashboard.settings.v1";
const CASH_KEY = "patrimoine.cash.v1";

export default function ProfilePage() {
  function exportLocalData(): void {
    const payload = {
      exportedAt: new Date().toISOString(),
      accounts: JSON.parse(window.localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY) ?? "[]") as unknown,
      settings: JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}") as unknown,
      cash: JSON.parse(window.localStorage.getItem(CASH_KEY) ?? "{}") as unknown,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `patrimoine-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <main className="form-page profile-page" id="main-content" tabIndex={-1}>
        <header className="profile-header">
          <span className="profile-avatar" aria-hidden="true"><UserRound /></span>
          <div><p className="eyebrow">Profil</p><h1>Mode local</h1><p>Aucun compte cloud connecté.</p></div>
        </header>

        <section className="section-card profile-status-card">
          <div className="profile-status-icon"><HardDrive aria-hidden="true" /></div>
          <div><p className="eyebrow">Stockage actuel</p><h2>Sur cet appareil</h2><p>Tes données restent dans ce navigateur. Elles seront toujours disponibles ici tant que les données du site ne sont pas effacées.</p></div>
        </section>

        <section className="profile-grid">
          <article className="section-card profile-feature-card">
            <Download aria-hidden="true" />
            <h2>Sauvegarder une copie</h2>
            <p>Exporte tes comptes, objectifs et espèces dans un fichier JSON.</p>
            <button className="secondary-link icon-button" type="button" onClick={exportLocalData}><Download aria-hidden="true" size={18} />Exporter mes données</button>
          </article>

          <article className="section-card profile-feature-card cloud-card">
            <Cloud aria-hidden="true" />
            <h2>Compte utilisateur</h2>
            <p>La prochaine étape ajoutera connexion, synchronisation multi-appareils et sauvegarde PostgreSQL sécurisée.</p>
            <span className="coming-soon-badge"><LockKeyhole aria-hidden="true" size={16} />Supabase à connecter</span>
          </article>
        </section>

        <section className="section-card profile-actions-list">
          <Link href="/dashboard">Tableau de bord <span aria-hidden="true">›</span></Link>
          <Link href="/accounts">Gérer mes comptes <span aria-hidden="true">›</span></Link>
          <Link href="/accounts/new">Ajouter un compte <span aria-hidden="true">›</span></Link>
        </section>
      </main>
      <MobileBottomNav current="profile" />
    </>
  );
}
