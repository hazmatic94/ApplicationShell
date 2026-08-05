import { WinModalCard } from "@joker/design-system";
import { formatBalance, formatCurrency } from "./formatting.js";

export function GameWinModalCard({
  profit,
  balance,
  amountWon,
  className,
  message = "Your winnings have been credited to your account",
  messageHighlight = "credited",
  onClose,
  onCoinsLand,
  ...props
}) {
  const resolvedAmountWon = amountWon ?? formatCurrency(profit);
  const resolvedBalance =
    balance != null && profit != null
      ? formatBalance(Number(balance) + Number(profit))
      : balance != null
        ? formatBalance(balance)
        : undefined;

  return (
    <WinModalCard
      amountWon={resolvedAmountWon}
      currency={null}
      balance={resolvedBalance}
      message={message}
      messageHighlight={messageHighlight}
      closeLabel="Close"
      className={className}
      onClose={onClose}
      onCoinsLand={onCoinsLand}
      {...props}
    />
  );
}
