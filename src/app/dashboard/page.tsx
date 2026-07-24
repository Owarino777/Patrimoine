import { CashCopyAdjustment } from "../cash-copy-adjustment";
import { FinancialDashboard } from "../financial-dashboard";
import { MobileBottomNav } from "../mobile-bottom-nav";

export default function DashboardPage() {
  return (
    <>
      <CashCopyAdjustment />
      <FinancialDashboard />
      <MobileBottomNav current="home" />
    </>
  );
}
