import { useEffect, useRef } from "react";
import {
  RouletteWheel,
  RouletteWheelWin,
  RouletteWrapper,
  ROULETTE_WHEEL_NATIVE_WIDTH,
  useRouletteWheelSpin,
} from "@joker/design-system";
import "@joker/design-system/styles/roulette.css";

export function RouletteGameAreaSlot({
  celebrationActive = false,
  celebrationVariant = "win",
  onSpinComplete,
  onSpinningChange,
  spinRequestId,
  wheelSessionKey = 0,
}) {
  const onSpinCompleteRef = useRef(onSpinComplete);
  const handledSpinRequestRef = useRef(0);
  const deliveredSpinRequestRef = useRef(0);
  const isSpinningRef = useRef(false);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  useEffect(() => {
    handledSpinRequestRef.current = spinRequestId;
    deliveredSpinRequestRef.current = spinRequestId;
  }, [wheelSessionKey]);

  const {
    wheelRotation,
    ballPosition,
    ballBounceScale,
    ballBounceLift,
    showBall,
    isSpinning,
    targetPocket,
    celebratingPocket,
    displayedResult,
    spin,
  } = useRouletteWheelSpin();

  const resolvedCelebratingPocket =
    celebrationVariant === "lose" ? null : celebratingPocket;

  useEffect(() => {
    if (!spinRequestId || isSpinning || displayedResult == null) {
      return;
    }

    if (handledSpinRequestRef.current !== spinRequestId) {
      return;
    }

    if (deliveredSpinRequestRef.current >= spinRequestId) {
      return;
    }

    deliveredSpinRequestRef.current = spinRequestId;
    onSpinCompleteRef.current?.(displayedResult);
  }, [displayedResult, isSpinning, spinRequestId]);

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

    const attemptSpin = () => {
      if (cancelled || handledSpinRequestRef.current === spinRequestId) {
        return;
      }

      if (!isSpinningRef.current) {
        spin();
        handledSpinRequestRef.current = spinRequestId;
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
    <div
      className={[
        "game-area-wheel",
        celebrationActive && celebrationVariant === "lose"
          ? "is-celebrating-loss"
          : celebrationActive && celebrationVariant === "win"
            ? "is-celebrating-win"
            : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ flex: 1, minHeight: 0 }}
    >
      <RouletteWrapper>
        <RouletteWheelWin
          active={celebrationActive}
          variant={celebrationVariant}
          size={ROULETTE_WHEEL_NATIVE_WIDTH}
        >
          <RouletteWheel
            size={ROULETTE_WHEEL_NATIVE_WIDTH}
            wheelRotation={wheelRotation}
            ballPosition={ballPosition}
            ballBounceScale={ballBounceScale}
            ballBounceLift={ballBounceLift}
            showBall={showBall}
            targetPocket={targetPocket}
            celebratingPocket={resolvedCelebratingPocket}
          />
        </RouletteWheelWin>
      </RouletteWrapper>
    </div>
  );
}
