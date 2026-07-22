import { createRoot } from "react-dom/client";
import "@joker/design-system/styles.css";
import { HiLoGamePage } from "./HiLoGamePage.jsx";
import { MobileShellScrollFix } from "./MobileShellScrollFix.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <MobileShellScrollFix />
    <HiLoGamePage />
  </>,
);
