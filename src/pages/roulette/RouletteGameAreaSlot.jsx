import { useCallback, useEffect, useRef } from "react";
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
  const wheelRootRef = useRef(null);
  const inFlightSpinRequestIdRef = useRef(0);
  const deliveredSpinRequestRef = useRef(0);
  const wheelSessionKeyRef = useRef(wheelSessionKey);
  const isSpinningRef = useRef(false);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  useEffect(() => {
    if (wheelSessionKeyRef.current === wheelSessionKey) {
      return;
    }

    wheelSessionKeyRef.current = wheelSessionKey;
    inFlightSpinRequestIdRef.current = 0;
    deliveredSpinRequestRef.current = Math.max(deliveredSpinRequestRef.current, spinRequestId);
  }, [wheelSessionKey, spinRequestId]);

  const deliverSpinResult = useCallback((resultNumber, completedRequestId) => {
    if (!Number.isInteger(resultNumber) || completedRequestId < 1) {
      return;
    }

    if (deliveredSpinRequestRef.current >= completedRequestId) {
      return;
    }

    deliveredSpinRequestRef.current = completedRequestId;
    inFlightSpinRequestIdRef.current = 0;
    onSpinCompleteRef.current?.(resultNumber, completedRequestId);
  }, []);

  const handleWheelSpinComplete = useCallback(
    (result) => {
      const completedRequestId = inFlightSpinRequestIdRef.current;
      if (!completedRequestId) {
        return;
      }

      deliverSpinResult(result.targetPocket.value, completedRequestId);
    },
    [deliverSpinResult],
  );

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
    soundEnabled: true,
    wheelRootRef,
    onSpinComplete: handleWheelSpinComplete,
  });

  const resolvedCelebratingPocket =
    celebrationVariant === "lose" ? null : celebratingPocket;

  useEffect(() => {
    isSpinningRef.current = isSpinning;
    onSpinningChange?.(isSpinning);
  }, [isSpinning, onSpinningChange]);

  useEffect(() => {
    if (!spinRequestId) {
      inFlightSpinRequestIdRef.current = 0;
      return undefined;
    }

    if (deliveredSpinRequestRef.current >= spinRequestId) {
      return undefined;
    }

    let cancelled = false;
    let rafId = 0;

    const attemptSpin = () => {
      if (cancelled || deliveredSpinRequestRef.current >= spinRequestId) {
        return;
      }

      if (!isSpinningRef.current) {
        inFlightSpinRequestIdRef.current = spinRequestId;
        spin();
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
      <RouletteWrapper data-roulette-wrapper>
        <RouletteWheelWin
          active={celebrationActive}
          variant={celebrationVariant}
          soundEnabled
          size={ROULETTE_WHEEL_NATIVE_WIDTH}
        >
          <RouletteWheel
            ref={wheelRootRef}
            size={ROULETTE_WHEEL_NATIVE_WIDTH}
            performanceMode
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
