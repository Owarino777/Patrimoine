"use client";

import { useEffect } from "react";

export function CashCopyAdjustment() {
  useEffect(() => {
    const title = document.getElementById("cash-action-title");
    if (title) title.textContent = "Mes billets et pièces";
  }, []);

  return null;
}
