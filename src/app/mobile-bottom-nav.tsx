import Link from "next/link";
import { BarChart3, Home, Plus, UserRound, WalletCards } from "lucide-react";

export type MobileBottomNavProps = Readonly<{
  current: "home" | "accounts" | "analysis" | "profile";
}>;

export function MobileBottomNav({ current }: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
      <Link aria-current={current === "home" ? "page" : undefined} href="/dashboard"><Home aria-hidden="true" /><span>Accueil</span></Link>
      <Link aria-current={current === "accounts" ? "page" : undefined} href="/accounts"><WalletCards aria-hidden="true" /><span>Comptes</span></Link>
      <Link className="mobile-add-action" href="/accounts/new" aria-label="Ajouter un compte"><span><Plus aria-hidden="true" /></span><small>Ajouter</small></Link>
      <Link aria-current={current === "analysis" ? "page" : undefined} href="/dashboard#allocation"><BarChart3 aria-hidden="true" /><span>Analyse</span></Link>
      <Link aria-current={current === "profile" ? "page" : undefined} href="/profile"><UserRound aria-hidden="true" /><span>Profil</span></Link>
    </nav>
  );
}
