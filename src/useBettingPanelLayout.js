import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 999px)";

export function useBettingPanelLayout() {
  const [layout, setLayout] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
      ? "mobile"
      : "desktop",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const updateLayout = () => {
      setLayout(mediaQuery.matches ? "mobile" : "desktop");
    };

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  return layout;
}
