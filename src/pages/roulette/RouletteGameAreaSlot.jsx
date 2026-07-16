import { useEffect, useRef } from "react";
import {
  RouletteWheel,
  RouletteWrapper,
  ROULETTE_WHEEL_NATIVE_WIDTH,
  useRouletteWheelSpin,
} from "@joker/design-system";
import "@joker/design-system/styles/roulette.css";

export function RouletteGameAreaSlot({
  onSpinComplete,
  onSpinningChange,
  spinRequestId,
}) {
  const onSpinCompleteRef = useRef(onSpinComplete);
  const wheelRootRef = useRef(null);

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
    targetPocket,
    celebratingPocket,
    spin,
  } = useRouletteWheelSpin({
    soundEnabled: false,
    wheelRootRef,
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
        spin();
        handledSpinRequestRef.current = spinRequestId;
        return;
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
    <div className="game-area-wheel" style={{ flex: 1, minHeight: 0 }}>
      <RouletteWrapper>
        <RouletteWheel
          ref={wheelRootRef}
          size={ROULETTE_WHEEL_NATIVE_WIDTH}
          wheelRotation={wheelRotation}
          ballPosition={ballPosition}
          ballBounceScale={ballBounceScale}
          ballBounceLift={ballBounceLift}
          showBall={showBall}
          targetPocket={targetPocket}
          celebratingPocket={celebratingPocket}
          performanceMode
        />
      </RouletteWrapper>
    </div>
  );
}
