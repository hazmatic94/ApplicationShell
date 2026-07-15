import { OddsButtonGroup } from "@joker/design-system";

export function MobileOddsGroup({
  options,
  value,
  onValueChange,
  disabled = false,
  className = "",
}) {
  return (
    <OddsButtonGroup
      className={["joker-mobile-odds-group", className].filter(Boolean).join(" ")}
      label={null}
      layout="inline"
      showOdds={false}
      options={options}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      ariaLabel="Coin flip choice"
    />
  );
}
