import { useEffect, useRef } from "react";
import {
  RouletteWheel,
  RouletteWheelWin,
  useRouletteWheelSpin,
} from "@joker/design-system";

export function RouletteWheelStage({
  className = "",
  onSpinComplete,
  onSpinningChange,
  spinRequestId,
  wheelSize,
  celebrationActive = false,
  celebrationVariant = "win",
}) {
  const onSpinCompleteRef = useRef(onSpinComplete);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  const {
    wheelRotation,
    ballPosition,
    ballBounceScale,
    ballBounceLift,
    showBall,
    isSpinning,
    pointerRotation,
    targetPocket,
    celebratingPocket,
    spin,
  } = useRouletteWheelSpin({
    onSpinComplete: (result) => {
      onSpinCompleteRef.current?.(result.targetPocket.value);
    },
  });
  const handledSpinRequestRef = useRef(0);
  const isSpinningRef = useRef(isSpinning);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
    onSpinningChange?.(isSpinning);
  }, [isSpinning, onSpinningChange]);

  useEffect(() => {
    if (!spinRequestId || spinRequestId === handledSpinRequestRef.current) {
      return undefined;
    }

    let cancelled = false;
    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 180;

    const attemptSpin = () => {
      if (cancelled || handledSpinRequestRef.current === spinRequestId) {
        return;
      }

      if (!isSpinningRef.current) {
        if (spin()) {
          handledSpinRequestRef.current = spinRequestId;
          return;
        }
      }

      if (isSpinningRef.current) {
        handledSpinRequestRef.current = spinRequestId;
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        return;
      }

      rafId = window.requestAnimationFrame(attemptSpin);
    };

    attemptSpin();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [spinRequestId, spin]);

  return (
    <RouletteWheelWin
      active={celebrationActive}
      variant={celebrationVariant}
      className={["joker-roulette-wheel-stage", className].filter(Boolean).join(" ")}
      size={wheelSize}
    >
      <RouletteWheel
        size={wheelSize}
        wheelRotation={wheelRotation}
        ballPosition={ballPosition}
        ballBounceScale={ballBounceScale}
        ballBounceLift={ballBounceLift}
        pointerRotation={pointerRotation}
        showBall={showBall}
        showDebugVisual={
          import.meta.env.DEV &&
          new URLSearchParams(window.location.search).has("rouletteDebug")
        }
        targetPocket={targetPocket}
        celebratingPocket={celebratingPocket}
      />
    </RouletteWheelWin>
  );
}
