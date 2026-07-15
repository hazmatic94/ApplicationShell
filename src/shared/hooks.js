import { useEffect, useRef, useState } from "react";

const gameShellMobilePanelQuery = "(max-width: 1023px)";

export function useGameShellBettingPanelLayout() {
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return "desktop";

    return window.matchMedia(gameShellMobilePanelQuery).matches ? "mobile" : "desktop";
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(gameShellMobilePanelQuery);
    const handleChange = () => setLayout(mediaQuery.matches ? "mobile" : "desktop");

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return layout;
}

export function useDeferredWinCredit(setBalance) {
  const pendingWinCreditRef = useRef(0);

  const deferWinCredit = (amount) => {
    pendingWinCreditRef.current = amount;
  };

  const applyDeferredWinCredit = () => {
    const amount = pendingWinCreditRef.current;
    if (amount <= 0) {
      return;
    }

    pendingWinCreditRef.current = 0;
    setBalance((currentBalance) => currentBalance + amount);
  };

  return { deferWinCredit, applyDeferredWinCredit };
}
