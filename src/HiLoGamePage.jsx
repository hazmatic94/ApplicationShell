import { FullGameShell } from "@joker/design-system";
import { HiLoGameCanvas } from "./HiLoGameCanvas.jsx";

export function HiLoGamePage() {
  return (
    <FullGameShell defaultValue="hilo">
      <HiLoGameCanvas />
    </FullGameShell>
  );
}
