import { FullGameShell } from "@joker/design-system";
import { HiLoGameCanvas } from "./HiLoGameCanvas.jsx";
import { PackagedHiloBettingPanel } from "./PackagedHiloBettingPanel.jsx";
import { useBettingPanelLayout } from "./useBettingPanelLayout.js";

export function HiLoGamePage() {
  const layout = useBettingPanelLayout();

  return (
    <FullGameShell
      defaultValue="hilo"
      bettingPanel={<PackagedHiloBettingPanel layout={layout} />}
    >
      <HiLoGameCanvas />
    </FullGameShell>
  );
}
