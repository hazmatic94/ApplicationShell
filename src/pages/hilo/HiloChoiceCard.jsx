import { formatHiloChoiceMultiplier } from "./hiloGameLogic.js";

export function HiloChoiceCard({ Card, className = "", disabled, multiplier, onClick, selected = false, support }) {
  return (
    <div className={["joker-hilo-prediction-group", className].filter(Boolean).join(" ")}>
      <div className="joker-hilo-prediction-card-slot">
        <div className="joker-hilo-prediction-card-anchor">
          <div className="joker-hilo-prediction-card-scale">
            <Card
              aria-disabled={disabled}
              aria-pressed={selected}
              className={[
                "joker-hilo-prediction-card",
                disabled ? "is-disabled" : "",
                selected ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              multiplier={formatHiloChoiceMultiplier(multiplier)}
              onClick={disabled ? undefined : onClick}
              onKeyDown={(event) => {
                if (disabled || (event.key !== "Enter" && event.key !== " ")) {
                  return;
                }

                event.preventDefault();
                onClick?.(event);
              }}
              role="button"
              tabIndex={disabled ? -1 : 0}
            />
          </div>
          <span className="joker-hilo-prediction-support">{support}</span>
        </div>
      </div>
    </div>
  );
}
