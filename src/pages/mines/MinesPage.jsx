import { useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@joker/design-system";
import minesBombSound from "../../../assets/mines-bomb.mp3?url";
import minesCashoutSound from "../../../assets/mines-cashout.mp3?url";
import minesPlaceBetSound from "../../../assets/mines-placebet.mp3?url";
import {
  GAME_ROUND_END_RESET_MS,
  GAME_ROUND_END_STYLES,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance } from "../../shared/formatting.js";
import { useDeferredWinCredit, useGameShellBettingPanelLayout, useOpenGameMenu } from "../../shared/hooks.js";
import { playSound } from "../../shared/sounds.js";
import { MinesGrid } from "./MinesGrid.jsx";
import { PackagedMinesBettingPanel } from "./PackagedMinesBettingPanel.jsx";
import {
  desktopMinesGrid,
  minTileAmount,
  minesNavigationPreset,
  mobileMinesGrid,
} from "./minesConfig.js";
import {
  blockTileWithShield,
  calculateMultiplier,
  clampTileAmount,
  countSafeReveals,
  createMineTiles,
  createMinesAmountOptions,
  createRoundBoard,
  getTileContent,
} from "./minesGameLogic.jsx";
import { getMinesPageStyles } from "./minesPageStyles.js";

export function MinesPage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const minesGrid = bettingPanelLayout === "mobile" ? mobileMinesGrid : desktopMinesGrid;
  const minesTileCount = minesGrid.columns * minesGrid.rows;
  const maxTileAmount = minesTileCount - 1;
  const mineTiles = useMemo(() => createMineTiles(minesTileCount), [minesTileCount]);
  const minesAmountOptions = useMemo(
    () => createMinesAmountOptions(maxTileAmount),
    [maxTileAmount]
  );
  const [bettingMode, setBettingMode] = useState("manual");
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState("");
  const [mines, setMines] = useState(String(minTileAmount));
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [freshRevealedTiles, setFreshRevealedTiles] = useState([]);
  const [roundStatus, setRoundStatus] = useState("idle");
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldUsed, setShieldUsed] = useState(false);
  const [cashoutResult, setCashoutResult] = useState(null);
  const [lossResult, setLossResult] = useState(false);
  const resultResetTimeout = useRef(null);

  const activeMineCount = clampTileAmount(mines, maxTileAmount);
  const safeRevealedCount = countSafeReveals(board, revealedTiles);
  const gameInPlay = roundStatus === "active";
  const multiplier = calculateMultiplier(minesTileCount, activeMineCount, safeRevealedCount);
  const nextMultiplier = calculateMultiplier(minesTileCount, activeMineCount, safeRevealedCount + 1);
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const currentProfit =
    roundStatus === "active" && safeRevealedCount > 0
      ? numericBetAmount * multiplier
      : 0;
  const nextProfit = numericBetAmount * nextMultiplier;

  useOpenGameMenu(minesNavigationPreset.openMenuLabel);

  useEffect(() => {
    return () => {
      if (resultResetTimeout.current) {
        window.clearTimeout(resultResetTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setMines((currentMines) => String(clampTileAmount(currentMines, maxTileAmount)));
    setBoard([]);
    setRevealedTiles([]);
    setFreshRevealedTiles([]);
    setRoundStatus("idle");
    setShieldActive(false);
    setShieldUsed(false);
    setCashoutResult(null);
    setLossResult(false);
    setMessage("");
  }, [maxTileAmount]);

  function clearResultTimer() {
    if (resultResetTimeout.current) {
      window.clearTimeout(resultResetTimeout.current);
      resultResetTimeout.current = null;
    }
  }

  function dismissCashoutResult() {
    setRoundStatus("idle");
    setBoard([]);
    setRevealedTiles([]);
    setFreshRevealedTiles([]);
    setCashoutResult(null);
    setLossResult(false);
    setShieldActive(false);
    setShieldUsed(false);
    setMessage("");
    resultResetTimeout.current = null;
  }

  function handleResultClose() {
    const shouldResetCashout = Boolean(cashoutResult);

    clearResultTimer();
    setLossResult(false);

    if (shouldResetCashout) {
      dismissCashoutResult();
      return;
    }

    setCashoutResult(null);
  }

  function handleTileClick(tile) {
    if (roundStatus !== "active" || revealedTiles.includes(tile)) {
      return;
    }

    const tileContent = getTileContent(board[tile - 1]);

    setRevealedTiles((currentTiles) =>
      currentTiles.includes(tile) ? currentTiles : [...currentTiles, tile]
    );
    setFreshRevealedTiles((currentTiles) =>
      currentTiles.includes(tile) ? currentTiles : [...currentTiles, tile]
    );

    if (tileContent === "joker") {
      setShieldActive(true);
      setMessage("Joker Shield Activated");
    }

    if (tileContent === "dynamite" && shieldActive) {
      setBoard((currentBoard) => blockTileWithShield(currentBoard, tile));
      setShieldActive(false);
      setShieldUsed(true);
      setMessage("Shield Saved You");
    }

    if (tileContent === "dynamite" && !shieldActive) {
      setRoundStatus("lost");
      setShieldActive(false);
      setLossResult(true);
      setMessage("");

      clearResultTimer();
      resultResetTimeout.current = window.setTimeout(
        dismissCashoutResult,
        GAME_ROUND_END_RESET_MS
      );
    }

    window.setTimeout(() => {
      setFreshRevealedTiles((currentTiles) =>
        currentTiles.filter((currentTile) => currentTile !== tile)
      );
    }, 1500);
  }

  function handleBetAction() {
    if (roundStatus === "cashedOut") {
      return;
    }

    if (gameInPlay) {
      playSound(minesCashoutSound);
      deferWinCredit(currentProfit);
      setCashoutResult({
        multiplier,
        profit: currentProfit,
      });
      setRoundStatus("cashedOut");
      setFreshRevealedTiles([]);
      setShieldActive(false);
      setShieldUsed(false);
      setLossResult(false);
      setMessage("");

      clearResultTimer();
      resultResetTimeout.current = window.setTimeout(dismissCashoutResult, 3000);
      return;
    }

    if (numericBetAmount <= 0 || numericBetAmount > balance) {
      setMessage("Enter a valid bet amount");
      return;
    }

    const nextBoard = createRoundBoard(activeMineCount, mineTiles);
    playSound(minesPlaceBetSound);

    clearResultTimer();

    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setBoard(nextBoard);
    setRoundStatus("active");
    setRevealedTiles([]);
    setFreshRevealedTiles([]);
    setShieldActive(false);
    setShieldUsed(false);
    setCashoutResult(null);
    setLossResult(false);
    setMessage("");
  }

  return (
    <>
      <style>{getMinesPageStyles(GAME_ROUND_END_STYLES)}</style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--mines"
        defaultValue={minesNavigationPreset.defaultValue}
        game={minesNavigationPreset.game}
        onValueChange={onGameChange}
        value={minesNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedMinesBettingPanel
            betAmount={betAmount}
            bettingMode={bettingMode}
            currentProfit={currentProfit}
            gameInPlay={gameInPlay}
            layout={bettingPanelLayout}
            mines={mines}
            maxTileAmount={maxTileAmount}
            minesAmountOptions={minesAmountOptions}
            multiplier={multiplier}
            nextMultiplier={nextMultiplier}
            nextProfit={nextProfit}
            onBetAmountChange={setBetAmount}
            onMinesChange={setMines}
            onModeChange={setBettingMode}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <MinesGrid
          board={board}
          cashoutResult={cashoutResult}
          freshRevealedTiles={freshRevealedTiles}
          lossResult={lossResult}
          multiplier={multiplier}
          columns={minesGrid.columns}
          onResultClose={handleResultClose}
          onWinCoinsLand={applyDeferredWinCredit}
          onTileClick={handleTileClick}
          revealedTiles={revealedTiles}
          roundStatus={roundStatus}
          rows={minesGrid.rows}
          tiles={mineTiles}
        />
      </GameShell>
    </>
  );
}
