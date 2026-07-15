import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  CocoHutBettingPanel as JokerCocoHutBettingPanel,
  Coin,
  CoinFlipBettingPanel as JokerCoinFlipBettingPanel,
  CoinProgression,
  CrashBettingPanel as JokerCrashBettingPanel,
  FourDMinesBettingPanel,
  FourDMinesTile,
  FourDMinesWinTile,
  GameCardFace,
  GameCardMini,
  GameCardMiniFace,
  GameCardStack,
  GameShell,
  HigherCard,
  HiLoBettingPanel as JokerHiLoBettingPanel,
  HiLoEllipseButton,
  HiloMainCardGlow,
  LossTile,
  LowerCard,
  MinesBettingPanel,
  MinesTile,
  MobileHiLoOddsGroup,
  OddsButtonGroup,
  RouletteBettingPanel as JokerRouletteBettingPanel,
  RouletteGameHeaderRail,
  RouletteWheel,
  RouletteWheelWin,
  SafeTile,
  SkipButton,
  WinModalCard,
  WinStreakRow,
  WinTile,
  getCoinReceiverLossTotalMs,
  getPocketColor,
  useRouletteWheelSpin,
  getFourDNumberPermutations,
  isFourDNumberPermutationMatch,
  isValidFourDNumber,
  normalizeFourDNumber,
} from "@joker/design-system";
import dynamiteIcon from "../assets/mines-bomb.png?url";
import shieldIcon from "../assets/mines-shield.png?url";
import minesBombSound from "../assets/mines-bomb.mp3?url";
import minesCashoutSound from "../assets/mines-cashout.mp3?url";
import minesPlaceBetSound from "../assets/mines-placebet.mp3?url";
import hiloCardDrawSound from "../assets/hilo-card-draw.mp3?url";
import hiloNextSound from "../assets/hilo-next.mp3?url";
import coinFlipSound from "../assets/coin-flip.mp3?url";
import cocoHutBackground from "../assets/cocohut-bg.png?url";
import jokerCoinIcon from "../assets/jokerCoin.svg?url";
const minTileAmount = 2;
const minFourDMinesAmount = 1;
const fourDMinesTileCount = 24;
const maxFourDMinesAmount = fourDMinesTileCount - 1;
const desktopFourDMinesGrid = { columns: 6, rows: 4 };
const mobileFourDMinesGrid = { columns: 4, rows: 6 };
const desktopMinesGrid = { columns: 5, rows: 5 };
const mobileMinesGrid = { columns: 4, rows: 5 };
const MINES_PAGE_LOAD_ANIMATION_MS = 460;
const MINES_PAGE_LOAD_ROW_STAGGER_MS = 24;
const MINES_PAGE_LOAD_ROW_BASE_DELAY_MS = 32;
const MINES_PAGE_LOAD_ROW_DURATION_MS = 320;
const minesRtp = 0.96; // 96% RTP applied to fair multipliers
const coinFlipRtp = 0.96;
const coinFlipMaxWins = 4;
const coinFlipFairProbability = 0.5;
const rouletteRtp = 0.96;

function createMinesAmountOptions(maxTileAmount) {
  return Array.from({ length: maxTileAmount - minTileAmount + 1 }, (_, index) => {
    const count = minTileAmount + index;

    return {
      value: String(count),
      label: (
        <span className="joker-mines-dynamite-option">
          <img src={dynamiteIcon} alt="" />
          <span>{count} Dynamite</span>
        </span>
      ),
    };
  });
}

function createFourDMinesAmountOptions() {
  return Array.from({ length: maxFourDMinesAmount }, (_, index) => {
    const count = index + 1;

    return {
      value: String(count),
      label: `${count} ${count === 1 ? "Mine" : "Mines"}`,
    };
  });
}

function createMineTiles(tileCount) {
  return Array.from({ length: tileCount }, (_, index) => index + 1);
}
const hiloRanks = [
  { rank: "A", value: 1 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 11 },
  { rank: "Q", value: 12 },
  { rank: "K", value: 13 },
];
const hiloSuits = [
  { suit: "hearts", tone: "red" },
  { suit: "diamonds", tone: "red" },
  { suit: "clubs", tone: "black" },
  { suit: "spades", tone: "black" },
];
function pickRandomHiloCard() {
  const deck = createHiloDeck();
  return deck[Math.floor(Math.random() * deck.length)];
}

function createHiloPreviewState() {
  const startCard = pickRandomHiloCard();

  return {
    currentCard: startCard,
    history: [createHiloHistoryEntry(startCard, "Start", "start")],
  };
}

const getInitialHiloPreview = (() => {
  let cachedPreview = null;

  return () => {
    if (!cachedPreview) {
      cachedPreview = createHiloPreviewState();
    }

    return cachedPreview;
  };
})();
const minesNavigationPreset = {
  defaultValue: "mines",
  game: { label: "Mines", icon: "mines" },
  openMenuLabel: "Originals",
  selectedValue: "mines",
};
const hiloNavigationPreset = {
  defaultValue: "hilo",
  game: { label: "Hilo", icon: "hi-lo" },
  openMenuLabel: "Originals",
  selectedValue: "hilo",
};
const crashNavigationPreset = {
  defaultValue: "crash",
  game: { label: "Crash", icon: "crash" },
  openMenuLabel: "Originals",
  selectedValue: "crash",
};
const coinFlipNavigationPreset = {
  defaultValue: "coin-flip",
  game: { label: "Coin Flip", icon: "coin-flip" },
  openMenuLabel: "Originals",
  selectedValue: "coin-flip",
};
const cocoHutNavigationPreset = {
  defaultValue: "coco-hut",
  game: { label: "CocoHut", icon: "coco-hut" },
  openMenuLabel: "Originals",
  selectedValue: "coco-hut",
};
const fourDMinesNavigationPreset = {
  defaultValue: "4d-mines",
  game: { label: "4D Mines", icon: "4d-mines" },
  openMenuLabel: "Originals",
  selectedValue: "4d-mines",
};
const rouletteNavigationPreset = {
  defaultValue: "roulette",
  game: { label: "Roulette", icon: "roulette" },
  openMenuLabel: "Originals",
  selectedValue: "roulette",
};
const gameRouteMap = {
  "4d-mines": "/4d-mines",
  "coco-hut": "/coco-hut",
  "coin-flip": "/coin-flip",
  crash: "/crash",
  hilo: "/hilo",
  mines: "/",
  roulette: "/roulette",
};

function getRouletteFairBaseMultiplier(betType) {
  return betType === "green" ? 36 : 2;
}

function getRouletteWinBaseMultiplier(betType) {
  return getRouletteFairBaseMultiplier(betType) * rouletteRtp;
}

function formatRouletteStreakWinMultiplier(betType, winIndex) {
  const multiplier = getRouletteWinBaseMultiplier(betType) * 2 ** winIndex;
  return `${multiplier.toFixed(2)}x`;
}

function calculateRouletteStreakProfit(stake, streakWins) {
  const numericStake = Number(stake) || 0;

  if (numericStake <= 0 || streakWins.length === 0) {
    return 0;
  }

  return streakWins.reduce((total, win, index) => {
    const base = getRouletteWinBaseMultiplier(win.betColor);
    return total + Math.round(numericStake * base * 2 ** index);
  }, 0);
}

function getRouletteOddsOptions(betAmount, streakWinCount = 0) {
  const stake = Number(betAmount) || 0;
  const nextWinIndex = streakWinCount;

  return [
    {
      value: "red",
      label: "Bet Red",
      sideIcon: "red",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("red") * 2 ** nextWinIndex)
          : "1:1",
    },
    {
      value: "black",
      label: "Bet Black",
      sideIcon: "black",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("black") * 2 ** nextWinIndex)
          : "1:1",
    },
    {
      value: "green",
      label: "Bet Green",
      sideIcon: "green",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("green") * 2 ** nextWinIndex)
          : "35:1",
    },
  ];
}

function didRouletteBetWin(betType, resultNumber) {
  if (betType === "green") {
    return resultNumber === 0;
  }

  return getPocketColor(resultNumber) === betType;
}

function formatRouletteResultLabel(resultNumber, resultColor) {
  if (resultNumber === 0) {
    return "0";
  }

  return `${resultNumber} ${resultColor}`;
}

function calculateCoinFlipMultiplier(winCount) {
  if (winCount <= 0) {
    return 1;
  }

  return coinFlipRtp * 2 ** winCount;
}

function calculateCoinFlipProfit(betAmount, winCount) {
  const stake = Number(betAmount) || 0;

  if (stake <= 0 || winCount <= 0) {
    return 0;
  }

  return Math.round(stake * calculateCoinFlipMultiplier(winCount));
}

function roundJkcAmount(value) {
  return Math.round(Number(value) || 0);
}

function formatJkcAmount(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundJkcAmount(value));
}

function JkcAmount({ value, className = "", tone = "default" }) {
  return (
    <span className={["joker-jkc-amount", tone === "inherit" && "is-inherit-tone", className]
      .filter(Boolean)
      .join(" ")}>
      {tone === "inherit" ? (
        <span
          className="joker-jkc-amount__icon joker-jkc-amount__icon--mask"
          style={{
            WebkitMaskImage: `url(${jokerCoinIcon})`,
            maskImage: `url(${jokerCoinIcon})`,
          }}
          aria-hidden="true"
        />
      ) : (
        <img className="joker-jkc-amount__icon" src={jokerCoinIcon} alt="" aria-hidden="true" />
      )}
      <span className="joker-jkc-amount__value">{formatJkcAmount(value)}</span>
    </span>
  );
}

function formatCoinFlipMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
}

function formatProbabilityPercent(probability) {
  return `${(probability * 100).toFixed(2)}%`;
}

function getCoinFlipOddsOptions(betAmount, roundsToWin = String(coinFlipMaxWins)) {
  const maxRounds = Number(roundsToWin) || coinFlipMaxWins;
  const targetMultiplier = calculateCoinFlipMultiplier(maxRounds);
  const targetProfit = calculateCoinFlipProfit(betAmount, maxRounds);
  const oddsLabel =
    Number(betAmount) > 0 ? formatJkcAmount(targetProfit) : formatCoinFlipMultiplier(targetMultiplier);

  return [
    { value: "heads", label: "Bet Heads", sideIcon: "heads", odds: oddsLabel },
    { value: "tails", label: "Bet Tails", sideIcon: "tails", odds: oddsLabel },
  ];
}

function MobileOddsGroup({
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

const appBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const gameShellMobilePanelQuery = "(max-width: 1023px)";

function normalizePathname(pathname) {
  if (!appBase) return pathname;
  return pathname.startsWith(appBase) ? pathname.slice(appBase.length) || "/" : pathname;
}

function withBase(path) {
  return `${appBase}${path}`;
}

function useGameShellBettingPanelLayout() {
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return "desktop";

    return window.matchMedia(gameShellMobilePanelQuery).matches ? "mobile" : "desktop";
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(gameShellMobilePanelQuery);
    const handleChange = () => setLayout(mediaQuery.matches ? "mobile" : "desktop");

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return layout;
}

function useDeferredWinCredit(setBalance) {
  const pendingWinCreditRef = useRef(0);

  const deferWinCredit = (amount) => {
    pendingWinCreditRef.current = amount;
  };

  const applyDeferredWinCredit = () => {
    const amount = pendingWinCreditRef.current;
    if (amount <= 0) {
      return;
    }

    pendingWinCreditRef.current = 0;
    setBalance((currentBalance) => currentBalance + amount);
  };

  return { deferWinCredit, applyDeferredWinCredit };
}

function clampTileAmount(value, maxTileAmount) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minTileAmount;
  }

  return Math.min(Math.max(numericValue, minTileAmount), maxTileAmount);
}

function calculateMultiplier(totalTiles, mines, revealedCount) {
  if (revealedCount <= 0) {
    return 1;
  }

  const safeTiles = totalTiles - mines;
  const effectiveReveals = Math.min(revealedCount, safeTiles);

  let fairMultiplier = 1;

  for (let index = 0; index < effectiveReveals; index += 1) {
    fairMultiplier *= (totalTiles - index) / (totalTiles - mines - index);
  }

  return fairMultiplier * minesRtp;
}

function createRoundBoard(minesCount, mineTiles) {
  const tileIndexes = mineTiles.map((tile) => tile - 1);
  const shuffledIndexes = [...tileIndexes];

  for (let index = shuffledIndexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledIndexes[index], shuffledIndexes[swapIndex]] = [
      shuffledIndexes[swapIndex],
      shuffledIndexes[index],
    ];
  }

  const dynamiteIndexes = new Set(shuffledIndexes.slice(0, minesCount));
  const earlyShieldIndexes = tileIndexes.slice(0, 4);
  const availableEarlyShieldIndexes = earlyShieldIndexes.filter(
    (index) => !dynamiteIndexes.has(index)
  );
  const jokerIndexPool =
    availableEarlyShieldIndexes.length > 0
      ? availableEarlyShieldIndexes
      : shuffledIndexes.filter((index) => !dynamiteIndexes.has(index));
  const jokerIndex =
    jokerIndexPool[Math.floor(Math.random() * jokerIndexPool.length)];

  return tileIndexes.map((index) => {
    let content = "gold";

    if (dynamiteIndexes.has(index)) content = "dynamite";
    if (index === jokerIndex) content = "joker";

    return {
      blockedByShield: false,
      content,
      id: index + 1,
    };
  });
}

function getTileContent(tile) {
  return tile?.content || "gold";
}

function clampFourDMinesAmount(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minFourDMinesAmount;
  }

  return Math.min(Math.max(numericValue, minFourDMinesAmount), maxFourDMinesAmount);
}

function hasUniqueFourDDigits(value) {
  const digits = normalizeFourDNumber(value).split("");

  return digits.length === 4 && new Set(digits).size === 4;
}

function createFourDMineTiles(tileCount = fourDMinesTileCount) {
  return Array.from({ length: tileCount }, (_, index) => index + 1);
}

function createFourDRoundBoard(mineCount, playerFourDNumber, tileCount = fourDMinesTileCount) {
  const tileIndexes = Array.from({ length: tileCount }, (_, index) => index);
  const shuffledIndexes = [...tileIndexes];

  for (let index = shuffledIndexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledIndexes[index], shuffledIndexes[swapIndex]] = [
      shuffledIndexes[swapIndex],
      shuffledIndexes[index],
    ];
  }

  const dynamiteIndexes = new Set(shuffledIndexes.slice(0, mineCount));
  const earlyShieldIndexes = tileIndexes.slice(0, 4);
  const availableEarlyShieldIndexes = earlyShieldIndexes.filter(
    (index) => !dynamiteIndexes.has(index)
  );
  const jokerIndexPool =
    availableEarlyShieldIndexes.length > 0
      ? availableEarlyShieldIndexes
      : shuffledIndexes.filter((index) => !dynamiteIndexes.has(index));
  const jokerIndex =
    jokerIndexPool[Math.floor(Math.random() * jokerIndexPool.length)];

  const winIndexes = tileIndexes.filter(
    (index) => !dynamiteIndexes.has(index) && index !== jokerIndex
  );
  const shuffledPermutations = [...getFourDNumberPermutations(playerFourDNumber)];

  for (let index = shuffledPermutations.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledPermutations[index], shuffledPermutations[swapIndex]] = [
      shuffledPermutations[swapIndex],
      shuffledPermutations[index],
    ];
  }

  const permutationByIndex = new Map();
  winIndexes.forEach((index, permutationIndex) => {
    permutationByIndex.set(
      index,
      shuffledPermutations[permutationIndex % shuffledPermutations.length]
    );
  });

  return tileIndexes.map((index) => {
    if (dynamiteIndexes.has(index)) {
      return {
        blockedByShield: false,
        content: "dynamite",
        fourDNumber: null,
        id: index + 1,
      };
    }

    if (index === jokerIndex) {
      return {
        blockedByShield: false,
        content: "joker",
        fourDNumber: null,
        id: index + 1,
      };
    }

    return {
      blockedByShield: false,
      content: "win",
      fourDNumber: permutationByIndex.get(index),
      id: index + 1,
    };
  });
}

function getFourDTileContent(tile) {
  return tile?.content || "safe";
}

function countFourDSafeReveals(board, revealedTiles) {
  return revealedTiles.filter((tile) => getFourDTileContent(board[tile - 1]) !== "dynamite")
    .length;
}

function countSafeReveals(board, revealedTiles) {
  return revealedTiles.filter((tile) => getTileContent(board[tile - 1]) !== "dynamite")
    .length;
}

function blockTileWithShield(board, tileId) {
  return board.map((tile) =>
    tile.id === tileId ? { ...tile, blockedByShield: true } : tile
  );
}

function playSound(src, volume = 0.8) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}

const GAME_ROUND_END_TRANSITION_MS = 300;
const GAME_ROUND_END_RESET_MS = 2000;

const GAME_ROUND_END_STYLES = `
  .joker-game-round-end-canvas.is-round-ending {
    animation: joker-game-round-end-canvas ${GAME_ROUND_END_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.15, 1) forwards;
    transform-origin: center center;
  }

  .joker-game-round-end-dim {
    position: absolute;
    inset: 0;
    z-index: 35;
    pointer-events: none;
    background: rgb(0 0 0 / 0.12);
    opacity: 0;
    animation: joker-game-round-end-dim ${GAME_ROUND_END_TRANSITION_MS}ms ease-in-out forwards;
  }

  @keyframes joker-game-round-end-dim {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes joker-game-round-end-canvas {
    0% {
      transform: scale(1) translateY(0);
    }

    22% {
      transform: scale(0.99) translateY(-2px);
    }

    44% {
      transform: scale(0.99) translateY(2px);
    }

    66% {
      transform: scale(0.995) translateY(-1px);
    }

    100% {
      transform: scale(1) translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .joker-game-round-end-canvas.is-round-ending {
      animation: none;
    }

    .joker-game-round-end-dim {
      animation: none;
      opacity: 0;
    }
  }
`;

function GameRoundEndTransition({ active, animationKey = "round-end" }) {
  if (!active) {
    return null;
  }

  return (
    <div
      key={animationKey}
      className="joker-game-round-end-dim"
      aria-hidden="true"
    />
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatBalance(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function createHiloDeck() {
  return hiloSuits.flatMap((suit) =>
    hiloRanks.map((rank) => ({
      ...rank,
      ...suit,
      id: `${suit.suit}-${rank.rank}`,
    }))
  );
}

function shuffleCards(cards) {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCards[index], shuffledCards[swapIndex]] = [
      shuffledCards[swapIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
}

function formatHiloPercent(value) {
  return `${value.toFixed(2)}%`;
}

function calculateHiloOdds(currentCard, deck) {
  if (!currentCard || deck.length === 0) {
    return {
      higherPercent: 0,
      higherProbability: 0,
      lowerPercent: 0,
      lowerProbability: 0,
    };
  }

  const lowerCount = deck.filter((card) => card.value <= currentCard.value).length;
  const higherCount = deck.filter((card) => card.value >= currentCard.value).length;
  const lowerProbability = lowerCount / deck.length;
  const higherProbability = higherCount / deck.length;

  return {
    higherPercent: higherProbability * 100,
    higherProbability,
    lowerPercent: lowerProbability * 100,
    lowerProbability,
  };
}

function getHiloDisplayOdds(currentCard, deck) {
  if (deck.length > 0) {
    return calculateHiloOdds(currentCard, deck);
  }

  const previewDeck = createHiloDeck().filter(
    (card) => card.suit !== currentCard.suit || card.rank !== currentCard.rank
  );

  return calculateHiloOdds(currentCard, previewDeck);
}

function calculateHiloPayout(probability) {
  if (probability <= 0) return 1;

  return Math.max(1.01, (1 / probability) * 0.96);
}

function calculateProjectedHiloMultiplier(currentMultiplier, probability) {
  return currentMultiplier * calculateHiloPayout(probability);
}

function createHiloHistoryEntry(card, chip, chipTone = "win") {
  return {
    ...card,
    chip,
    chipTone,
    next: null,
  };
}

function getHiloHistoryChipVariant(chipTone) {
  if (chipTone === "start") return "start";
  if (chipTone === "skip") return "skip";
  if (chipTone === "end") return "loss";
  return "win";
}

function getHiloHistoryConnectorVariant(next) {
  if (next === "up") return "higher";
  if (next === "down") return "lower";
  return "skip";
}

function createHiloRound(startCard) {
  const deck = shuffleCards(
    createHiloDeck().filter(
      (card) => card.suit !== startCard.suit || card.rank !== startCard.rank
    )
  );

  return {
    currentCard: startCard,
    deck,
    history: [createHiloHistoryEntry(startCard, "Start", "start")],
  };
}

function resolveHiloPrediction(choice, currentCard, nextCard) {
  if (choice === "higher") {
    return nextCard.value >= currentCard.value;
  }

  return nextCard.value <= currentCard.value;
}

function updateHiloHistory(history, direction, nextEntry) {
  return [
    ...history.slice(0, -1),
    { ...history[history.length - 1], next: direction },
    nextEntry,
  ];
}

function runHiloPrediction(choice, { currentCard, deck, history, multiplier, odds, stake }) {
  if (deck.length === 0) {
    return null;
  }

  const [nextCard, ...remainingDeck] = deck;
  const direction = choice === "higher" ? "up" : "down";
  const correct = resolveHiloPrediction(choice, currentCard, nextCard);

  if (!correct) {
    return {
      currentCard: nextCard,
      deck: remainingDeck,
      history: updateHiloHistory(
        history,
        direction,
        createHiloHistoryEntry(nextCard, "0.00x", "end")
      ),
      multiplier: 0,
      roundStatus: "loss",
    };
  }

  const probability = choice === "higher" ? odds.higherProbability : odds.lowerProbability;
  const nextMultiplier = calculateProjectedHiloMultiplier(multiplier, probability);
  const updatedHistory = updateHiloHistory(
    history,
    direction,
    createHiloHistoryEntry(nextCard, `${nextMultiplier.toFixed(2)}x`)
  );

  if (remainingDeck.length === 0) {
    return {
      currentCard: nextCard,
      deck: remainingDeck,
      history: updatedHistory,
      multiplier: nextMultiplier,
      roundStatus: "win",
      winProfit: stake * nextMultiplier,
    };
  }

  return {
    currentCard: nextCard,
    deck: remainingDeck,
    history: updatedHistory,
    multiplier: nextMultiplier,
    roundStatus: "active",
  };
}

function MobileShellScrollFix() {
  return (
    <style>
      {`
        .joker-game-shell .joker-game-shell-empty-stage > * {
          min-height: 100%;
        }

        @media (min-width: 1024px) {
          .joker-game-shell .joker-page-wrapper {
            align-items: stretch;
            padding: var(--game-shell-page-padding);
          }

          .joker-game-shell .joker-page-wrapper > * {
            max-height: 100%;
          }
        }

        .joker-game-shell .joker-navigation-mobile-content .joker-page-wrapper::after {
          content: "";
          display: block;
          flex: 0 0 var(--game-shell-page-padding);
          width: 100%;
        }

        @media (max-width: 1023px) {
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel {
            display: grid;
            grid-template-rows: auto auto auto;
            align-content: start;
            gap: var(--spacing-16);
            padding: var(--spacing-24);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-betting-submit-group {
            order: 1;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-hilo-betting-submit-spacer {
            display: none;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-betting-divider {
            order: 2;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-hilo-betting-main {
            order: 3;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-hilo-betting-main {
            gap: var(--spacing-16);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-button--hi-lo-skip,
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-button--secondary {
            display: none;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields {
            gap: var(--spacing-16);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-hilo-betting-actions,
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-betting-divider:last-of-type {
            display: none;
          }

        }
      `}
    </style>
  );
}

export function App() {
  const [pathname, setPathname] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePathname(window.location.pathname)
  );

  useEffect(() => {
    const handleLocationChange = () =>
      setPathname(normalizePathname(window.location.pathname));

    window.addEventListener("popstate", handleLocationChange);

    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  function navigateToGame(nextValue) {
    const normalizedNextPath = gameRouteMap[nextValue] ?? null;
    const nextPath = normalizedNextPath ? withBase(normalizedNextPath) : null;

    if (!nextPath || normalizePathname(window.location.pathname) === normalizedNextPath) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPathname(normalizedNextPath);
  }

  if (pathname === "/hilo") {
    return (
      <>
        <MobileShellScrollFix />
        <HiloPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/crash") {
    return (
      <>
        <MobileShellScrollFix />
        <CrashPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/roulette") {
    return (
      <>
        <MobileShellScrollFix />
        <RoulettePage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/coin-flip") {
    return (
      <>
        <MobileShellScrollFix />
        <CoinFlipPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/coco-hut") {
    return (
      <>
        <MobileShellScrollFix />
        <CocoHutPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/4d-mines") {
    return (
      <>
        <MobileShellScrollFix />
        <FourDMinesPage onGameChange={navigateToGame} />
      </>
    );
  }

  return (
    <>
      <MobileShellScrollFix />
      <MinesPage onGameChange={navigateToGame} />
    </>
  );
}

function MinesPage({ onGameChange }) {
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

  useEffect(() => {
    const openMinesMenu = () => {
      const minesMenu = [...document.querySelectorAll(".joker-product-rail-game-menu")].find(
        (menu) =>
          menu
            .querySelector(".joker-product-rail-menu-label")
            ?.textContent?.trim() === minesNavigationPreset.openMenuLabel
      );
      const trigger = minesMenu?.querySelector(".joker-product-rail-menu-trigger");

      if (minesMenu && trigger && !minesMenu.classList.contains("is-open")) {
        trigger.click();
      }
    };

    openMinesMenu();
    const frameId = window.requestAnimationFrame(openMinesMenu);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

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
      <style>
        {`
          .joker-mines-stage {
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 0;
            overflow: hidden;
            background: var(--joker-black-800);
          }

          .joker-game-shell .joker-navigation-body {
            max-width: none;
            justify-self: center;
          }

          .joker-game-shell .joker-navigation--compact .joker-navigation-body {
            max-width: none;
          }

          .joker-game-shell .joker-game-inner-frame {
            width: 100%;
            justify-self: stretch;
          }

          @media (min-width: 1024px) {
            .joker-game-shell--mines .joker-game-shell-betting {
              overflow-y: hidden;
            }
          }

          .joker-mines-dynamite-option {
            display: inline-flex;
            min-width: 0;
            align-items: center;
            gap: var(--spacing-8);
            line-height: var(--text-body-line-height);
          }

          .joker-mines-dynamite-option > span {
            display: inline-flex;
            min-width: 0;
            align-items: center;
          }

          .joker-mines-dynamite-option img {
            display: block;
            align-self: center;
            flex: 0 0 var(--icon-size-md);
            width: var(--icon-size-md);
            height: var(--icon-size-md);
            object-fit: contain;
          }

          .joker-mines-board-area {
            --mines-board-padding: 32px;
            --mines-grid-gap: var(--spacing-8);
            position: relative;
            display: grid;
            height: 100%;
            min-height: 0;
            align-items: stretch;
            justify-items: stretch;
            padding: var(--mines-board-padding);
            overflow: hidden;
            container-type: size;
            container-name: mines-board;
          }

          .joker-mines-grid {
            display: grid;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            grid-template-columns: repeat(var(--mines-grid-columns, 5), minmax(0, 1fr));
            grid-template-rows: repeat(var(--mines-grid-rows, 5), minmax(0, 1fr));
            gap: var(--mines-grid-gap);
            overflow: visible;
          }

          .joker-game-shell .joker-navigation-mobile-content .joker-mines-stage {
            height: 100%;
            min-height: 100%;
            overflow: visible;
          }

          .joker-game-shell .joker-navigation-mobile-content .joker-mines-board-area {
            height: 100%;
            min-height: 0;
            overflow: visible;
          }

          @media (min-width: 1024px) {
            .joker-mines-board-area {
              --mines-board-padding: 40px;
              place-items: center;
            }

            .joker-mines-grid {
              --mines-grid-fit: min(100cqw, 100cqh);
              width: var(--mines-grid-fit);
              height: var(--mines-grid-fit);
              max-width: 100%;
              max-height: 100%;
            }
          }

          @media (min-width: 1280px) {
            .joker-mines-board-area {
              --mines-board-padding: 48px;
            }
          }

          @media (max-width: 1023px) {
            .joker-mines-board-area {
              --mines-board-padding: 8px;
            }
          }

          .joker-mines-frame-footer {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: auto minmax(0, 1fr) auto;
            align-items: center;
            min-height: calc(var(--spacing-64) - var(--spacing-8));
            border-top: var(--border-width-default) solid var(--joker-black-300);
            background: var(--joker-black-600);
            padding: 0 var(--spacing-24);
          }

          .joker-mines-footer-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-8);
            min-width: 0;
          }

          .joker-mines-footer-button {
            display: inline-grid;
            width: var(--spacing-32);
            height: var(--spacing-32);
            place-items: center;
            border: 0;
            border-radius: var(--radius-sm);
            background: transparent;
            color: color-mix(in srgb, var(--joker-white-50) 68%, var(--joker-black-50));
            cursor: pointer;
            padding: 0;
            transition:
              color var(--motion-fast) var(--ease-standard),
              transform var(--motion-fast) var(--ease-standard);
          }

          .joker-mines-footer-button:hover {
            color: var(--joker-white-50);
            transform: translateY(calc(var(--border-width-default) * -1));
          }

          .joker-mines-footer-icon {
            display: block;
            width: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
            height: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
            object-fit: contain;
            pointer-events: none;
          }

          .joker-mines-footer-logo {
            display: block;
            grid-column: 3;
            justify-self: end;
            width: clamp(calc(var(--spacing-64) + var(--spacing-8)), 7vw, calc(var(--spacing-64) + var(--spacing-40)));
            max-height: var(--spacing-24);
            opacity: 0.38;
            filter: grayscale(1);
            pointer-events: none;
            user-select: none;
          }

          .joker-mines-footer-spacer {
            grid-column: 2;
            grid-row: 1;
            min-width: 0;
          }

          .joker-mines-grid-cell {
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            overflow: visible;
            place-items: stretch;
          }

          .joker-mines-grid-tile {
            --game-tile-size: 100%;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }

          .joker-mines-grid.is-round-lost .joker-mines-grid-cell:not(.is-revealed) .joker-mines-grid-tile {
            opacity: 0.34;
            filter: saturate(0.48);
            pointer-events: none;
          }

          .joker-mines-grid-cell.is-shield-blocked .joker-loss-tile-icon {
            opacity: 0.2;
          }

          .joker-mines-shield-badge {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 6;
            display: grid;
            width: clamp(calc(var(--spacing-64) + var(--spacing-16)), 68%, calc(var(--spacing-64) + var(--spacing-64)));
            aspect-ratio: 1;
            place-items: center;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }

          .joker-mines-shield-badge img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter:
              drop-shadow(0 var(--spacing-8) var(--spacing-16) rgb(0 0 0 / 0.36))
              drop-shadow(0 0 var(--spacing-16) color-mix(in srgb, var(--joker-gold-400) 22%, transparent));
          }

          .joker-mines-grid-cell.is-shield-blocked.is-fresh-reveal .joker-mines-shield-badge {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.72);
            animation: joker-mines-shield-block 980ms var(--ease-standard) both;
          }

          .joker-mines-result-card {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: auto;
            transform: scale(0.96);
            animation: joker-mines-cashout-pop 420ms var(--ease-standard) both;
          }

          .joker-mines-result-card > * {
            max-width: min(500px, calc(100cqw - var(--spacing-48)));
            box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
          }

          

          @keyframes joker-mines-cashout-pop {
            0% {
              opacity: 0;
              transform: translateY(var(--spacing-24)) scale(0.86);
            }

            48% {
              opacity: 1;
              transform: translateY(calc(var(--spacing-4) * -1)) scale(1.06);
            }

            72% {
              opacity: 1;
              transform: translateY(var(--spacing-2, 2px)) scale(0.98);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes joker-mines-shield-block {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.72);
              filter: drop-shadow(0 0 0 transparent);
            }

            34% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.1);
              filter: drop-shadow(0 0 var(--spacing-24) color-mix(in srgb, var(--joker-gold-400) 54%, transparent));
            }

            72% {
              opacity: 0.92;
              transform: translate(-50%, -50%) scale(0.96);
              filter: drop-shadow(0 0 var(--spacing-16) color-mix(in srgb, var(--joker-gold-400) 34%, transparent));
            }

            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
              filter: drop-shadow(0 var(--spacing-4) var(--spacing-12) rgb(0 0 0 / 0.42));
            }
          }

          .joker-mines-board-area.is-page-load-enter {
            animation: joker-mines-load-board-fade 200ms var(--ease-out) both;
          }

          .joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
            animation: joker-mines-load-tile-reveal 320ms var(--ease-out) var(--mines-load-row-delay, 32ms) both;
          }

          .joker-mines-grid.is-page-load-enter .joker-mines-grid-tile:hover {
            transform: none;
          }

          @keyframes joker-mines-load-board-fade {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes joker-mines-load-tile-reveal {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .joker-mines-board-area.is-page-load-enter,
            .joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }

          ${GAME_ROUND_END_STYLES}
        `}
      </style>
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

function FourDMinesPage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const fourDMinesGrid = bettingPanelLayout === "mobile" ? mobileFourDMinesGrid : desktopFourDMinesGrid;
  const fourDMinesAmountOptions = useMemo(() => createFourDMinesAmountOptions(), []);
  const mineTiles = useMemo(() => createFourDMineTiles(fourDMinesTileCount), []);
  const [betAmount, setBetAmount] = useState("");
  const [fourDNumber, setFourDNumber] = useState("");
  const [bettingPanelKey, setBettingPanelKey] = useState(0);
  const [activeFourDNumber, setActiveFourDNumber] = useState("");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState("");
  const [mines, setMines] = useState(String(minFourDMinesAmount));
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [freshRevealedTiles, setFreshRevealedTiles] = useState([]);
  const [roundStatus, setRoundStatus] = useState("idle");
  const [cashoutResult, setCashoutResult] = useState(null);
  const [lossResult, setLossResult] = useState(false);
  const resultResetTimeout = useRef(null);

  const activeMineCount = clampFourDMinesAmount(mines);
  const safeRevealedCount = countFourDSafeReveals(board, revealedTiles);
  const gameInPlay = roundStatus === "active";
  const multiplier = calculateMultiplier(fourDMinesTileCount, activeMineCount, safeRevealedCount);
  const nextMultiplier = calculateMultiplier(
    fourDMinesTileCount,
    activeMineCount,
    safeRevealedCount + 1
  );
  const numericBetAmount = Number(betAmount) || 0;
  const currentProfit =
    roundStatus === "active" && safeRevealedCount > 0
      ? numericBetAmount * multiplier
      : 0;
  const nextProfit = numericBetAmount * nextMultiplier;

  useEffect(() => {
    const openFourDMinesMenu = () => {
      const gameMenu = [...document.querySelectorAll(".joker-product-rail-game-menu")].find(
        (menu) =>
          menu
            .querySelector(".joker-product-rail-menu-label")
            ?.textContent?.trim() === fourDMinesNavigationPreset.openMenuLabel
      );
      const trigger = gameMenu?.querySelector(".joker-product-rail-menu-trigger");

      if (gameMenu && trigger && !gameMenu.classList.contains("is-open")) {
        trigger.click();
      }
    };

    openFourDMinesMenu();
    const frameId = window.requestAnimationFrame(openFourDMinesMenu);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    return () => {
      if (resultResetTimeout.current) {
        window.clearTimeout(resultResetTimeout.current);
      }
    };
  }, []);

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
    setMessage("");
    setFourDNumber("");
    setBettingPanelKey((currentKey) => currentKey + 1);
    setActiveFourDNumber("");
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

    const tileContent = getFourDTileContent(board[tile - 1]);

    setRevealedTiles((currentTiles) =>
      currentTiles.includes(tile) ? currentTiles : [...currentTiles, tile]
    );
    setFreshRevealedTiles((currentTiles) =>
      currentTiles.includes(tile) ? currentTiles : [...currentTiles, tile]
    );

    if (tileContent === "dynamite") {
      setRoundStatus("lost");
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

    if (!isValidFourDNumber(fourDNumber) || !hasUniqueFourDDigits(fourDNumber)) {
      setMessage("Enter a valid 4D number");
      return;
    }

    const normalizedFourDNumber = normalizeFourDNumber(fourDNumber);
    const nextBoard = createFourDRoundBoard(activeMineCount, normalizedFourDNumber);
    playSound(minesPlaceBetSound);

    clearResultTimer();

    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setActiveFourDNumber(normalizedFourDNumber);
    setBoard(nextBoard);
    setRoundStatus("active");
    setRevealedTiles([]);
    setFreshRevealedTiles([]);
    setCashoutResult(null);
    setLossResult(false);
    setMessage("");
  }

  return (
    <>
      <style>
        {`
          .joker-mines-stage {
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 0;
            overflow: hidden;
            background: var(--joker-black-800);
          }

          @media (min-width: 1024px) {
            .joker-game-shell--4d-mines .joker-game-shell-betting {
              overflow-y: hidden;
            }
          }

          .joker-mines-board-area {
            --mines-board-padding: 32px;
            --mines-grid-gap: var(--spacing-8);
            position: relative;
            display: grid;
            height: 100%;
            min-height: 0;
            align-items: stretch;
            justify-items: stretch;
            padding: var(--mines-board-padding);
            overflow: hidden;
            container-type: size;
            container-name: mines-board;
          }

          .joker-mines-grid {
            display: grid;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            grid-template-columns: repeat(var(--mines-grid-columns, 5), minmax(0, 1fr));
            grid-template-rows: repeat(var(--mines-grid-rows, 5), minmax(0, 1fr));
            gap: var(--mines-grid-gap);
            overflow: visible;
          }

          .joker-game-shell .joker-navigation-mobile-content .joker-mines-stage {
            height: 100%;
            min-height: 100%;
            overflow: visible;
          }

          .joker-game-shell .joker-navigation-mobile-content .joker-mines-board-area {
            height: 100%;
            min-height: 0;
            overflow: visible;
          }

          @media (min-width: 1024px) {
            .joker-mines-board-area {
              --mines-board-padding: 40px;
              place-items: center;
            }

            .joker-mines-grid {
              --mines-grid-fit: min(100cqw, 100cqh);
              width: var(--mines-grid-fit);
              height: var(--mines-grid-fit);
              max-width: 100%;
              max-height: 100%;
            }
          }

          @media (min-width: 1280px) {
            .joker-mines-board-area {
              --mines-board-padding: 48px;
            }
          }

          @media (max-width: 1023px) {
            .joker-mines-board-area {
              --mines-board-padding: 8px;
            }
          }

          .joker-mines-grid-cell {
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            overflow: visible;
            place-items: stretch;
          }

          .joker-mines-grid-tile {
            --game-tile-size: 100%;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }

          .joker-mines-grid-cell .joker-mines-grid-tile {
            align-self: stretch;
            justify-self: stretch;
          }

          .joker-mines-grid.is-round-lost .joker-mines-grid-cell:not(.is-revealed) .joker-mines-grid-tile {
            opacity: 0.34;
            filter: saturate(0.48);
            pointer-events: none;
          }

          .joker-mines-result-card {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: auto;
            transform: scale(0.96);
            animation: joker-mines-cashout-pop 420ms var(--ease-standard) both;
          }

          .joker-mines-result-card > * {
            max-width: min(500px, calc(100cqw - var(--spacing-48)));
            box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
          }

          @keyframes joker-mines-cashout-pop {
            0% {
              opacity: 0;
              transform: translateY(var(--spacing-24)) scale(0.86);
            }

            48% {
              opacity: 1;
              transform: translateY(calc(var(--spacing-4) * -1)) scale(1.06);
            }

            72% {
              opacity: 1;
              transform: translateY(var(--spacing-2, 2px)) scale(0.98);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .joker-mines-board-area.is-page-load-enter {
            animation: joker-mines-load-board-fade 200ms var(--ease-out) both;
          }

          .joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
            animation: joker-mines-load-tile-reveal 320ms var(--ease-out) var(--mines-load-row-delay, 32ms) both;
          }

          .joker-mines-grid.is-page-load-enter .joker-mines-grid-tile:hover {
            transform: none;
          }

          @keyframes joker-mines-load-board-fade {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes joker-mines-load-tile-reveal {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .joker-mines-board-area.is-page-load-enter,
            .joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }

          ${GAME_ROUND_END_STYLES}
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--4d-mines"
        defaultValue={fourDMinesNavigationPreset.defaultValue}
        game={fourDMinesNavigationPreset.game}
        onValueChange={onGameChange}
        value={fourDMinesNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedFourDMinesBettingPanel
            key={bettingPanelKey}
            betAmount={betAmount}
            currentProfit={currentProfit}
            gameInPlay={gameInPlay}
            layout={bettingPanelLayout}
            mines={mines}
            minesAmountOptions={fourDMinesAmountOptions}
            multiplier={multiplier}
            nextMultiplier={nextMultiplier}
            nextProfit={nextProfit}
            onBetAmountChange={setBetAmount}
            onFourDNumberChange={setFourDNumber}
            onMinesChange={setMines}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <FourDMinesGrid
          board={board}
          cashoutResult={cashoutResult}
          columns={fourDMinesGrid.columns}
          freshRevealedTiles={freshRevealedTiles}
          lossResult={lossResult}
          multiplier={multiplier}
          onResultClose={handleResultClose}
          onWinCoinsLand={applyDeferredWinCredit}
          onTileClick={handleTileClick}
          playerFourDNumber={activeFourDNumber}
          revealedTiles={revealedTiles}
          roundStatus={roundStatus}
          rows={fourDMinesGrid.rows}
          tiles={mineTiles}
        />
      </GameShell>
    </>
  );
}

function HiloPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [currentCard, setCurrentCard] = useState(() => getInitialHiloPreview().currentCard);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState(() => getInitialHiloPreview().history);
  const [multiplier, setMultiplier] = useState(1);
  const [roundStatus, setRoundStatus] = useState("pre-game");
  const [pendingPrediction, setPendingPrediction] = useState("");
  const [skipAvailable, setSkipAvailable] = useState(true);
  const [hiloWinModal, setHiloWinModal] = useState(null);
  const hiloWinModalTimeoutRef = useRef(null);
  const hiloWinModalResetRef = useRef(false);
  const hiloRoundResetTimeoutRef = useRef(null);
  const hiloHistoryLengthRef = useRef(history.length);

  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const gameInPlay = roundStatus === "active";
  const gameOdds = calculateHiloOdds(currentCard, deck);
  const displayOdds = getHiloDisplayOdds(currentCard, deck);
  const lowerMultiplier = calculateProjectedHiloMultiplier(
    multiplier,
    gameOdds.lowerProbability
  );
  const higherMultiplier = calculateProjectedHiloMultiplier(
    multiplier,
    gameOdds.higherProbability
  );
  const currentProfit = multiplier > 1 ? numericBetAmount * multiplier : 0;

  useEffect(() => {
    const openHiloMenu = () => {
      const hiloMenu = [...document.querySelectorAll(".joker-product-rail-game-menu")].find(
        (menu) =>
          menu
            .querySelector(".joker-product-rail-menu-label")
            ?.textContent?.trim() === hiloNavigationPreset.openMenuLabel
      );
      const trigger = hiloMenu?.querySelector(".joker-product-rail-menu-trigger");

      if (hiloMenu && trigger && !hiloMenu.classList.contains("is-open")) {
        trigger.click();
      }
    };

    openHiloMenu();
    const frameId = window.requestAnimationFrame(openHiloMenu);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    return () => {
      if (hiloWinModalTimeoutRef.current) {
        window.clearTimeout(hiloWinModalTimeoutRef.current);
      }

      if (hiloRoundResetTimeoutRef.current) {
        window.clearTimeout(hiloRoundResetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameInPlay) {
      hiloHistoryLengthRef.current = history.length;
      return;
    }

    if (history.length > hiloHistoryLengthRef.current) {
      setPendingPrediction("");
    }

    hiloHistoryLengthRef.current = history.length;
  }, [gameInPlay, history.length]);

  function clearHiloRoundResetTimer() {
    if (hiloRoundResetTimeoutRef.current) {
      window.clearTimeout(hiloRoundResetTimeoutRef.current);
      hiloRoundResetTimeoutRef.current = null;
    }
  }

  function clearHiloWinModalTimer() {
    if (hiloWinModalTimeoutRef.current) {
      window.clearTimeout(hiloWinModalTimeoutRef.current);
      hiloWinModalTimeoutRef.current = null;
    }
  }

  function resetHiloRound() {
    clearHiloRoundResetTimer();
    const preview = createHiloPreviewState();
    setCurrentCard(preview.currentCard);
    setDeck([]);
    setHistory(preview.history);
    setMultiplier(1);
    setRoundStatus("pre-game");
    setPendingPrediction("");
    setSkipAvailable(true);
    setHiloWinModal(null);
    hiloWinModalResetRef.current = false;
  }

  function scheduleHiloRoundReset() {
    clearHiloRoundResetTimer();
    hiloRoundResetTimeoutRef.current = window.setTimeout(() => {
      hiloRoundResetTimeoutRef.current = null;
      clearHiloWinModalTimer();
      resetHiloRound();
    }, GAME_ROUND_END_RESET_MS);
  }

  function closeHiloWinModal() {
    clearHiloRoundResetTimer();
    clearHiloWinModalTimer();
    setHiloWinModal(null);
    hiloWinModalResetRef.current = false;
    resetHiloRound();
  }

  function showHiloWinModal({ title, profit }) {
    setHiloWinModal({ title, profit });
    clearHiloWinModalTimer();
    scheduleHiloRoundReset();
  }

  function handleHiloWinModalClose() {
    closeHiloWinModal();
  }

  function handleBetAmountChange(nextValue) {
    setBetAmount(nextValue);

    if (!Number(nextValue)) {
      setPendingPrediction("");
    }
  }

  function handleHiloChoiceSelection(choice) {
    if (gameInPlay) {
      setPendingPrediction(choice);
      handlePrediction(choice);
      return;
    }

    if (roundStatus === "pre-game" && hasBetAmount) {
      setPendingPrediction(choice);
    }
  }

  function handlePlaceBet() {
    if (gameInPlay) return;

    if (!hasBetAmount || numericBetAmount > balance || !pendingPrediction) {
      return;
    }

    clearHiloWinModalTimer();
    clearHiloRoundResetTimer();
    setHiloWinModal(null);
    hiloWinModalResetRef.current = false;

    playSound(minesPlaceBetSound);

    const nextRound = createHiloRound(currentCard);

    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setSkipAvailable(true);

    if (pendingPrediction) {
      const choice = pendingPrediction;
      const roundOdds = calculateHiloOdds(nextRound.currentCard, nextRound.deck);
      const result = runHiloPrediction(choice, {
        currentCard: nextRound.currentCard,
        deck: nextRound.deck,
        history: nextRound.history,
        multiplier: 1,
        odds: roundOdds,
        stake: numericBetAmount,
      });

      setPendingPrediction("");

      if (result) {
        setCurrentCard(result.currentCard);
        setDeck(result.deck);
        setHistory(result.history);
        setMultiplier(result.multiplier);
        setRoundStatus(result.roundStatus);

        if (result.roundStatus === "win") {
          deferWinCredit(result.winProfit);
          playSound(minesCashoutSound);
          showHiloWinModal({
            title: "You Won",
            profit: result.winProfit,
          });
          return;
        }

        if (result.roundStatus === "loss") {
          playSound(minesBombSound);
          scheduleHiloRoundReset();
          return;
        }

        return;
      }
    }

    setCurrentCard(nextRound.currentCard);
    setDeck(nextRound.deck);
    setHistory(nextRound.history);
    setMultiplier(1);
    setRoundStatus("active");
  }

  function handleCashout() {
    if (!gameInPlay || currentProfit <= 0) {
      return;
    }

    deferWinCredit(currentProfit);
    setRoundStatus("cash-out");
    playSound(minesCashoutSound);
    showHiloWinModal({
      title: "Cashout Successful",
      profit: currentProfit,
    });
  }

  function handlePrediction(choice) {
    if (!gameInPlay || deck.length === 0) {
      return;
    }

    playSound(hiloCardDrawSound);

    const result = runHiloPrediction(choice, {
      currentCard,
      deck,
      history,
      multiplier,
      odds: gameOdds,
      stake: numericBetAmount,
    });

    if (!result) {
      return;
    }

    setCurrentCard(result.currentCard);
    setDeck(result.deck);
    setHistory(result.history);
    setMultiplier(result.multiplier);
    setRoundStatus(result.roundStatus);

    if (result.roundStatus === "win") {
      deferWinCredit(result.winProfit);
      playSound(minesCashoutSound);
      showHiloWinModal({
        title: "You Won",
        profit: result.winProfit,
      });
      return;
    }

    if (result.roundStatus === "loss") {
      playSound(minesBombSound);
      scheduleHiloRoundReset();
    }
  }

  function handleSkipCard() {
    if (roundStatus === "pre-game") {
      playSound(hiloNextSound);
      const preview = createHiloPreviewState();
      setCurrentCard(preview.currentCard);
      setHistory(preview.history);
      return;
    }

    if (!gameInPlay || !skipAvailable || deck.length === 0) {
      return;
    }

    playSound(hiloNextSound);

    const [nextCard, ...remainingDeck] = deck;

    setCurrentCard(nextCard);
    setDeck(remainingDeck);
    setHistory((currentHistory) =>
      updateHiloHistory(
        currentHistory,
        "skip",
        createHiloHistoryEntry(nextCard, "Skip", "skip")
      )
    );
    setSkipAvailable(false);

    if (remainingDeck.length === 0 && currentProfit > 0) {
      deferWinCredit(currentProfit);
      setRoundStatus("win");
      playSound(minesCashoutSound);
      showHiloWinModal({
        title: "You Won",
        profit: currentProfit,
      });
    }
  }

  return (
    <>
      <style>
        {`
          .joker-game-shell .joker-navigation-body {
            max-width: none;
            justify-self: center;
          }

          .joker-game-shell .joker-navigation--compact .joker-navigation-body {
            max-width: none;
          }

          .joker-game-shell .joker-game-inner-frame {
            width: 100%;
            justify-self: stretch;
          }

          .joker-hilo-betting-panel.is-hilo-pre-game .joker-hilo-betting-actions {
            cursor: not-allowed;
          }

          .joker-hilo-betting-panel .joker-hilo-betting-actions button {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .joker-hilo-betting-panel .joker-hilo-betting-actions button > span:first-child {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-8);
            min-width: 0;
            max-width: 100%;
          }

          .joker-hilo-betting-panel .joker-hilo-betting-actions .joker-hi-lo-odds {
            gap: var(--spacing-8);
          }

          @media (min-width: 1024px) {
            .joker-hilo-betting-panel.is-hilo-pre-game:not(.is-hilo-pre-game-ready) .joker-button--hi-lo {
              pointer-events: none;
              cursor: not-allowed;
              opacity: 0.56;
            }

            .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice .joker-betting-submit-group .joker-button {
              pointer-events: none;
              cursor: not-allowed;
              opacity: 0.45;
            }
          }

          @media (max-width: 1023px) {
            .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice .joker-betting-submit-group .joker-button {
              pointer-events: none;
              cursor: not-allowed;
              opacity: 0.45;
            }
          }

          .joker-game-shell--hilo .joker-game-inner-canvas {
            min-height: 0;
            height: 100%;
          }

          .joker-game-shell--hilo .joker-game-shell-empty-stage {
            min-height: 0;
            overflow: visible;
          }

          .joker-game-shell--hilo .joker-game-shell-empty-stage > .joker-hilo-stage {
            min-height: 0;
          }

          .joker-hilo-stage {
            container-type: size;
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 0;
            box-sizing: border-box;
            --hilo-betting-divider-offset: calc(
              var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
                var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
            );
            --hilo-sync-history-rail-height: var(--hilo-betting-divider-offset);
            --hilo-sync-divider-band: calc(
              var(--hilo-betting-divider-offset) + var(--border-width-default)
            );
            --hilo-board-padding: var(--spacing-24);
            --hilo-main-native-width: 296px;
            --hilo-main-native-height: 398.5px;
            --hilo-side-native-width: 164px;
            --hilo-side-to-main-ratio: 0.6;
            --hilo-play-gap: 24px;
            --hilo-play-scale-max: 1;
            --hilo-play-scale-bias: 1;
            --hilo-felt-card-scale: 0.88;
            --hilo-support-native-height: 42px;
            --hilo-skip-protrusion-native: 52px;
            --hilo-play-row-native-width: 699px;
            --hilo-play-row-native-height: 463px;
            --hilo-play-fit-native-height: 463px;
            --hilo-felt-native-width: 936px;
            --hilo-felt-native-height: 481px;
            --hilo-felt-aspect-ratio: 1.946;
            --hilo-felt-inline-padding: var(--spacing-24);
            --hilo-felt-padding-block-start: var(--spacing-24);
            --hilo-felt-padding-block-end: var(--spacing-24);
            --hilo-play-to-felt-width-ratio: 0.896;
            --hilo-play-to-felt-height-ratio: 0.84;
            --hilo-mini-scale-factor: 0.58;
            --hilo-mini-native-width: 110px;
            --hilo-mini-native-height: 76px;
            --hilo-row-content-native-width: calc(
              var(--hilo-main-native-width) * (1 + (2 * var(--hilo-side-to-main-ratio)))
            );
            --hilo-history-band-height: calc(
              (var(--spacing-8) + 18px) * var(--hilo-play-scale-bias) + 76px * 0.58 * var(--hilo-play-scale-bias) +
                var(--spacing-16)
            );
            --hilo-play-scale: min(
              (100cqw - (2 * var(--hilo-play-gap))) / var(--hilo-row-content-native-width),
              (100cqh - var(--hilo-history-band-height)) /
                calc(var(--hilo-main-native-height) + (var(--hilo-main-native-height) * 0.18)),
              var(--hilo-play-scale-max)
            );
            --hilo-play-scale: max(0.4, calc(var(--hilo-play-scale) * var(--hilo-play-scale-bias)));
            --hilo-side-scale: calc(
              var(--hilo-play-scale) * var(--hilo-side-to-main-ratio) * var(--hilo-main-native-width) /
                var(--hilo-side-native-width)
            );
            --hilo-main-slot-width: calc(var(--hilo-main-native-width) * var(--hilo-play-scale));
            --hilo-main-slot-height: calc(var(--hilo-main-native-height) * var(--hilo-play-scale));
            --hilo-side-slot-width: calc(
              var(--hilo-main-native-width) * var(--hilo-side-to-main-ratio) * var(--hilo-play-scale)
            );
            --hilo-side-slot-height: calc(
              var(--hilo-main-native-height) * var(--hilo-side-to-main-ratio) * var(--hilo-play-scale)
            );
            --hilo-mini-scale: calc(
              var(--hilo-play-scale) * var(--hilo-mini-native-width) / var(--hilo-main-native-width) *
                var(--hilo-mini-scale-factor)
            );
            --hilo-mini-card-width: calc(var(--hilo-mini-native-width) * var(--hilo-mini-scale));
            --hilo-mini-card-height: calc(var(--hilo-mini-native-height) * var(--hilo-mini-scale));
            padding: 0;
            grid-template-rows: minmax(0, 1fr);
            overflow: visible;
            background: var(--joker-black-800);
          }

          .joker-hilo-history-rail {
            --hilo-history-chip-room: 18px;
            --hilo-history-chip-height: 30px;
            --hilo-history-chip-overhang: calc(var(--hilo-history-chip-height) / 2);
            position: relative;
            z-index: 2;
            display: flex;
            width: 100%;
            min-width: 0;
            flex: 0 0 auto;
            align-items: center;
            padding-block: var(--spacing-12);
            padding-inline: 0;
            overflow-x: auto;
            overflow-y: visible;
            scroll-behavior: smooth;
            scroll-padding-inline-end: var(--spacing-24);
            scroll-padding-inline-start: var(--spacing-24);
            scrollbar-width: none;
          }

          .joker-hilo-history-rail::-webkit-scrollbar {
            display: none;
          }

          .joker-hilo-history-track {
            display: flex;
            width: max-content;
            min-width: 100%;
            align-items: center;
            justify-content: flex-start;
            gap: var(--spacing-8);
            padding-inline-start: var(--spacing-24);
            overflow: visible;
            box-sizing: border-box;
          }

          .joker-hilo-history-track::after {
            content: "";
            display: block;
            flex: 0 0 var(--spacing-24);
            width: var(--spacing-24);
            height: 1px;
          }

          .joker-hilo-history-entry {
            position: relative;
            display: flex;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            box-sizing: border-box;
            padding-top: var(--hilo-history-chip-overhang);
          }

          .joker-hilo-history-entry.is-latest {
            animation: joker-hilo-history-enter var(--motion-slow) var(--ease-out) both;
          }

          .joker-hilo-history-entry .joker-hilo-history-chip {
            position: absolute;
            top: var(--hilo-history-chip-overhang);
            left: 50%;
            z-index: 2;
            transform: translate(-50%, -50%);
          }

          .joker-hilo-history-card-wrap {
            position: relative;
            display: flex;
            width: var(--hilo-mini-card-width, 110px);
            height: var(--hilo-mini-card-height, 76px);
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            overflow: visible;
          }

          .joker-hilo-history-entry .joker-game-card-mini {
            flex: 0 0 auto;
            transform: scale(var(--hilo-mini-scale, 1));
            transform-origin: center center;
          }

          .joker-hilo-history-connector {
            position: absolute;
            top: 50%;
            left: calc(100% + (var(--spacing-8) / 2));
            z-index: 3;
            margin: 0;
            transform: translate(-50%, -50%);
            opacity: 1;
            pointer-events: none;
          }

          .joker-hilo-history-connector:disabled {
            opacity: 1;
            cursor: default;
          }

          .joker-hilo-main-area {
            container-type: size;
            display: flex;
            width: 100%;
            max-width: 100%;
            height: 100%;
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
            align-items: stretch;
            justify-content: flex-start;
            overflow: visible;
            padding: 0;
          }

          .joker-hilo-game-frame {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            max-height: 100cqh;
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 0;
            overflow: visible;
            padding: 0;
            margin-inline: auto;
          }

          .joker-hilo-game-frame__top {
            display: flex;
            width: 100%;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: stretch;
            border-bottom: 0;
            box-sizing: border-box;
            padding: var(--spacing-16) var(--spacing-24);
            overflow: visible;
            background: var(--joker-black-800);
          }

          .joker-hilo-game-frame__top > .joker-betting-divider {
            width: calc(100% + (2 * var(--spacing-24)));
            margin-inline: calc(-1 * var(--spacing-24));
            flex: 0 0 auto;
          }

          @media (min-width: 1024px) {
            .joker-hilo-game-frame__top {
              position: relative;
              flex: 0 0 auto;
              height: var(--hilo-sync-divider-band);
              min-height: var(--hilo-sync-divider-band);
              max-height: var(--hilo-sync-divider-band);
              padding: 0;
            }

            .joker-hilo-history-rail {
              display: flex;
              height: var(--hilo-sync-history-rail-height);
              max-height: var(--hilo-sync-history-rail-height);
              flex: 0 0 auto;
              align-items: center;
              justify-content: flex-start;
              min-height: 0;
              padding-block: 0;
              box-sizing: border-box;
            }

            .joker-hilo-history-track {
              display: flex;
              width: max-content;
              min-width: 100%;
              height: 100%;
              min-height: 0;
              align-items: center;
              justify-content: flex-start;
              gap: var(--spacing-8);
              padding-inline-start: var(--spacing-24);
              box-sizing: border-box;
            }

            .joker-hilo-game-frame__top > .joker-betting-divider {
              position: absolute;
              top: var(--hilo-betting-divider-offset);
              right: 0;
              left: 0;
              width: auto;
              margin: 0;
            }
          }

          .joker-hilo-game-frame__bottom {
            display: flex;
            width: 100%;
            flex: 1 1 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            min-height: 0;
            padding-block: var(--spacing-24);
            padding-inline: var(--spacing-24);
            box-sizing: border-box;
          }

          .joker-hilo-game-frame__play-stack {
            display: flex;
            width: 100%;
            max-width: var(--hilo-felt-native-width);
            flex: 1 1 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 0;
            margin-inline: auto;
            container-type: size;
            container-name: hilo-felt;
          }

          .joker-hilo-game-frame__play {
            position: relative;
            z-index: 2;
            display: flex;
            flex: 0 0 auto;
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
            align-items: center;
            justify-content: center;
            overflow: visible;
            padding-block: calc(var(--hilo-support-native-height) * var(--hilo-side-scale) / 2 + var(--spacing-8));
            padding-inline: var(--spacing-12);
          }

          .joker-hilo-game-frame__play-inner {
            display: flex;
            width: var(--hilo-play-row-native-width);
            height: var(--hilo-play-fit-native-height);
            box-sizing: border-box;
            flex: 0 0 auto;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            gap: var(--hilo-play-gap);
            transform: scale(
              calc(
                min(calc(100cqw / 699px), calc(100cqh / 463px)) * var(--hilo-felt-card-scale, 0.88)
              )
            );
            transform-origin: center center;
            --hilo-play-scale: 1;
            --hilo-side-scale: 1.082;
            --hilo-main-slot-width: var(--hilo-main-native-width);
            --hilo-main-slot-height: var(--hilo-main-native-height);
            --hilo-side-slot-width: calc(var(--hilo-main-native-width) * var(--hilo-side-to-main-ratio));
            --hilo-side-slot-height: calc(var(--hilo-main-native-height) * var(--hilo-side-to-main-ratio));
            --hilo-card-bottom-inset: var(--spacing-12);
            --game-card-stack-hover-shadow: 0 4px 12px rgb(0 0 0 / 0.12), 0 1px 3px rgb(0 0 0 / 0.08);
            --game-card-stack-hover-shift-factor: 0;
            --game-card-stack-hover-active: 0;
            --game-card-stack-hover-card-shadow: none;
            --game-card-stack-hover-overlay-opacity: 0.92;
          }

          .joker-hilo-game-frame__play-inner:has(
              .joker-hilo-prediction-group--lower .joker-hilo-prediction-card:hover
            ) {
            --game-card-stack-hover-shift-factor: -1;
            --game-card-stack-hover-active: 1;
            --game-card-stack-hover-card-shadow: var(--game-card-stack-hover-shadow);
            --game-card-stack-hover-overlay-opacity: 0.96;
          }

          .joker-hilo-game-frame__play-inner:has(
              .joker-hilo-prediction-group--higher .joker-hilo-prediction-card:hover
            ) {
            --game-card-stack-hover-shift-factor: 1;
            --game-card-stack-hover-active: 1;
            --game-card-stack-hover-card-shadow: var(--game-card-stack-hover-shadow);
            --game-card-stack-hover-overlay-opacity: 0.96;
          }

          .joker-hilo-game-frame__play-inner > .joker-hilo-prediction-group,
          .joker-hilo-game-frame__play-inner > .joker-hilo-main-card-column {
            flex: 0 0 auto;
            min-width: 0;
          }

          .joker-hilo-game-frame__play-inner .joker-game-card-stack,
          .joker-hilo-game-frame__play-inner .joker-higher-card,
          .joker-hilo-game-frame__play-inner .joker-lower-card {
            flex: 0 0 auto;
            max-width: none;
          }

          .joker-hilo-main-card-column {
            position: relative;
            display: flex;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: center;
            margin-bottom: calc(24px + 20px + var(--border-width-default));
          }

          .joker-hilo-main-card-anchor {
            position: relative;
            display: inline-flex;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: center;
          }

          .joker-hilo-main-card-anchor .joker-hilo-game-frame__status {
            position: absolute;
            top: 100%;
            left: 50%;
            z-index: 4;
            margin: 0;
            flex: 0 0 auto;
            padding: 12px 16px;
            box-sizing: border-box;
            border: var(--border-width-default) solid var(--joker-black-100);
            border-top: 0;
            border-radius: 0 0 20px 20px;
            background: var(--joker-black-600);
            color: var(--joker-white-50);
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 500;
            letter-spacing: 0.06em;
            line-height: 1;
            text-align: center;
            text-transform: uppercase;
            transform: translateX(-50%);
            white-space: nowrap;
          }

          .joker-hilo-game-frame__status strong {
            color: var(--joker-gold-400);
            font-weight: 600;
          }

          .joker-hilo-main-card-wrap {
            position: relative;
            display: flex;
            width: fit-content;
            max-width: 100%;
            height: auto;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: visible;
            padding-bottom: 0;
          }

          .joker-hilo-main-card-wrap .joker-hilo-main-card-stack-slot {
            position: relative;
            z-index: 2;
            display: flex;
            width: var(--hilo-main-slot-width);
            height: var(--hilo-main-slot-height);
            justify-content: center;
            align-items: center;
            overflow: visible;
          }

          .joker-hilo-main-card-scale {
            position: relative;
            z-index: 1;
            transform: scale(var(--hilo-play-scale));
            transform-origin: center center;
          }

          .joker-hilo-main-card-wrap .joker-hilo-main-card-stack {
            flex: 0 0 auto;
          }

          .joker-hilo-main-card-skip-slot {
            position: absolute;
            top: calc(var(--spacing-16) * -1);
            right: calc(var(--spacing-24) * -1);
            z-index: 6;
            display: flex;
            width: calc(58px * var(--hilo-play-scale));
            height: calc(32px * var(--hilo-play-scale));
            align-items: center;
            justify-content: center;
            overflow: visible;
            pointer-events: none;
          }

          .joker-hilo-main-card-skip-scale {
            transform: scale(var(--hilo-play-scale));
            transform-origin: center center;
            pointer-events: auto;
          }

          .joker-hilo-main-card-wrap .joker-hilo-main-card-skip {
            flex: 0 0 auto;
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          .joker-hilo-prediction-group {
            position: relative;
            display: flex;
            width: var(--hilo-side-slot-width);
            height: var(--hilo-side-slot-height);
            box-sizing: border-box;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .joker-hilo-prediction-card-slot {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            overflow: visible;
          }

          .joker-hilo-prediction-card-anchor {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 4px;
          }

          .joker-hilo-prediction-card-scale {
            flex: 0 0 auto;
            transform: scale(var(--hilo-side-scale));
            transform-origin: center bottom;
          }

          .joker-hilo-prediction-card-slot .joker-hilo-prediction-card {
            flex: 0 0 auto;
          }

          .joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-disabled {
            opacity: 0.62;
            cursor: default;
            pointer-events: none;
            transform: none;
          }

          .joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected {
            transform: translateY(var(--hi-lo-card-hover-lift, -2px));
          }

          .joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected.joker-lower-card,
          .joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected.joker-higher-card {
            background: linear-gradient(180deg, var(--joker-black-500) 0%, var(--joker-black-200) 100%);
          }

          .joker-hilo-prediction-support {
            position: relative;
            top: auto;
            left: auto;
            width: var(--hilo-side-slot-width);
            margin-top: 0;
            flex: 0 0 auto;
            transform: none;
            color: var(--joker-white-50);
            font-family: var(--font-body);
            font-size: 12px;
            font-weight: var(--text-body-weight);
            line-height: var(--text-body-line-height);
            text-align: center;
          }

          .joker-hilo-result-card {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: auto;
            transform: scale(0.96);
            animation: joker-hilo-result-pop 420ms var(--ease-standard) both;
          }

          .joker-hilo-result-card > * {
            max-width: min(500px, calc(100% - var(--spacing-48)));
            box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
          }

          @keyframes joker-hilo-result-pop {
            0% {
              opacity: 0;
              transform: scale(0.92);
            }

            100% {
              opacity: 1;
              transform: scale(0.96);
            }
          }

          @keyframes joker-hilo-history-enter {
            0% {
              opacity: 0;
              transform: translateY(var(--spacing-24)) scale(1.08);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-scale {
            animation: joker-hilo-load-deal-main 400ms var(--ease-out) both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-glow {
            animation: joker-hilo-load-deal-glow 360ms var(--ease-out) 30ms both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--lower .joker-hilo-prediction-card-scale {
            animation: joker-hilo-load-deal-side 380ms var(--ease-out) 70ms both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--higher .joker-hilo-prediction-card-scale {
            animation: joker-hilo-load-deal-side 380ms var(--ease-out) 120ms both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip {
            animation: joker-hilo-load-deal-chip 280ms var(--ease-out) var(--hilo-load-chip-delay, 200ms) both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-card-wrap {
            animation: joker-hilo-load-deal-history-card 300ms var(--ease-out) var(--hilo-load-chip-delay, 200ms) both;
          }

          .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-entry.is-latest,
          .joker-hilo-game-frame.is-page-load-enter .joker-higher-card__chevron,
          .joker-hilo-game-frame.is-page-load-enter .joker-lower-card__chevron {
            animation: none;
          }

          @keyframes joker-hilo-load-deal-main {
            from {
              opacity: 0;
              transform: scale(var(--hilo-play-scale)) translateY(22px);
            }

            to {
              opacity: 1;
              transform: scale(var(--hilo-play-scale)) translateY(0);
            }
          }

          @keyframes joker-hilo-load-deal-glow {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes joker-hilo-load-deal-side {
            from {
              opacity: 0;
              transform: scale(var(--hilo-side-scale)) translateY(22px);
            }

            to {
              opacity: 1;
              transform: scale(var(--hilo-side-scale)) translateY(0);
            }
          }

          @keyframes joker-hilo-load-deal-chip {
            from {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 10px));
            }

            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }

          @keyframes joker-hilo-load-deal-history-card {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-scale,
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-glow,
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--lower .joker-hilo-prediction-card-scale,
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--higher .joker-hilo-prediction-card-scale,
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip,
            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-card-wrap {
              animation: none;
              opacity: 1;
              transform: none;
            }

            .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip {
              transform: translate(-50%, -50%);
            }
          }

          .joker-mines-frame-footer {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: auto minmax(0, 1fr) auto;
            align-items: center;
            min-height: calc(var(--spacing-64) - var(--spacing-8));
            border-top: var(--border-width-default) solid var(--joker-black-300);
            background: var(--joker-black-500);
            padding: 0 var(--spacing-24);
          }

          .joker-mines-footer-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-8);
            min-width: 0;
          }

          .joker-mines-footer-button {
            display: inline-grid;
            width: var(--spacing-32);
            height: var(--spacing-32);
            place-items: center;
            border: 0;
            border-radius: var(--radius-sm);
            background: transparent;
            color: color-mix(in srgb, var(--joker-white-50) 68%, var(--joker-black-50));
            cursor: pointer;
            padding: 0;
          }

          .joker-mines-footer-icon {
            display: block;
            width: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
            height: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
            object-fit: contain;
            pointer-events: none;
          }

          .joker-mines-footer-logo {
            display: block;
            grid-column: 3;
            justify-self: end;
            width: clamp(calc(var(--spacing-64) + var(--spacing-8)), 7vw, calc(var(--spacing-64) + var(--spacing-40)));
            max-height: var(--spacing-24);
            opacity: 0.38;
            filter: grayscale(1);
            pointer-events: none;
            user-select: none;
          }

          .joker-mines-footer-spacer {
            grid-column: 2;
            grid-row: 1;
            min-width: 0;
          }

          @media (max-width: 1023px) {
            .joker-hilo-stage {
              --hilo-history-mini-mobile-scale: 0.7;
              --hilo-mobile-odds-reserve: 52px;
              --hilo-mobile-main-status-room: 48px;
              --hilo-mobile-main-fit-height: 446.5px;
              --hilo-mobile-felt-card-scale: 0.96;
            }

            .joker-game-shell--hilo .joker-game-shell-empty-stage {
              overflow: visible;
            }

            .joker-hilo-stage {
              --hilo-board-padding: var(--spacing-24);
              padding: 0;
              overflow: visible;
            }

            .joker-hilo-history-connector {
              transform: translate(-50%, -50%) scale(calc(0.72 * var(--hilo-history-mini-mobile-scale)));
            }

            .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-stage {
              height: 100%;
              min-height: 100%;
              overflow: visible;
            }

            .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-main-area {
              display: flex;
              align-items: stretch;
              justify-content: flex-start;
              width: 100%;
              height: 100%;
              min-height: 0;
              padding: 0;
            }

            .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-main-area > .joker-hilo-game-frame {
              flex: 1 1 auto;
              width: 100%;
              min-width: 0;
            }

            .joker-hilo-game-frame {
              position: relative;
              display: flex;
              flex-direction: column;
              width: 100%;
              min-width: 0;
              height: 100%;
              max-height: 100cqh;
              gap: 0;
              padding-bottom: 0;
              box-sizing: border-box;
            }

            .joker-hilo-game-frame__top {
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: var(--spacing-12) 0;
              gap: var(--spacing-12);
            }

            .joker-hilo-game-frame__top > .joker-betting-divider {
              width: 100%;
              margin-inline: 0;
              margin-top: 0;
            }

            .joker-hilo-history-rail {
              --hilo-history-chip-height: 22px;
              align-items: center;
              justify-content: flex-start;
              flex: 0 0 auto;
              padding-block: 0;
              padding-inline: 0;
            }

            .joker-hilo-history-card-wrap {
              width: calc(var(--hilo-mini-native-width) * var(--hilo-history-mini-mobile-scale));
              height: calc(var(--hilo-mini-native-height) * var(--hilo-history-mini-mobile-scale));
            }

            .joker-hilo-history-entry {
              justify-content: flex-end;
              padding-top: var(--hilo-history-chip-overhang);
            }

            .joker-hilo-history-entry .joker-game-card-mini {
              transform: scale(var(--hilo-history-mini-mobile-scale));
              transform-origin: center center;
            }

            .joker-hilo-history-track {
              display: flex;
              width: max-content;
              min-width: 100%;
              height: calc(
                var(--hilo-history-chip-overhang) +
                  (var(--hilo-mini-native-height) * var(--hilo-history-mini-mobile-scale))
              );
              min-height: 0;
              align-items: center;
              justify-content: flex-start;
              margin-inline: 0;
              gap: var(--spacing-4);
              padding-inline-start: var(--spacing-24);
              box-sizing: border-box;
            }

            .joker-hilo-history-entry .joker-hilo-history-chip {
              height: var(--hilo-history-chip-height);
              padding-inline: var(--spacing-4);
              font-size: var(--text-body-12);
              transform: translate(-50%, -50%);
            }

            .joker-hilo-game-frame__bottom {
              position: relative;
              display: flex;
              flex: 1 1 auto;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              min-width: 0;
              min-height: 0;
              padding: 0;
              overflow: hidden;
            }

            .joker-hilo-game-frame__play-stack {
              position: relative;
              display: flex;
              width: 100%;
              height: 100%;
              flex: 1 1 auto;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 0;
              padding: 0;
              box-sizing: border-box;
              container-type: size;
              container-name: hilo-mobile-felt;
            }

            .joker-hilo-game-frame__play {
              flex: 1 1 auto;
              width: 100%;
              height: 100%;
              min-height: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              padding-block: 0;
              padding-inline: 0;
            }

            .joker-hilo-game-frame__play-inner {
              display: flex;
              width: var(--hilo-main-native-width);
              height: var(--hilo-mobile-main-fit-height);
              transform: scale(
                calc(
                  min(
                    calc(100cqw / var(--hilo-main-native-width)),
                    calc(100cqh / var(--hilo-mobile-main-fit-height)),
                    1
                  ) * var(--hilo-mobile-felt-card-scale, 0.96)
                )
              );
              transform-origin: center center;
              gap: 0;
              align-items: center;
              justify-content: center;
              flex: 0 0 auto;
              margin-inline: auto;
              --hilo-play-scale: 1;
            }

            .joker-hilo-game-frame__play-inner > .joker-hilo-prediction-group {
              display: none;
            }

            .joker-hilo-main-card-column {
              display: flex;
              flex: 0 0 auto;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 0;
              padding-bottom: 0;
              box-sizing: border-box;
              transform: none;
            }

            .joker-hilo-main-card-anchor .joker-hilo-game-frame__status {
              display: none;
            }

            .joker-hilo-main-card-wrap .joker-hilo-main-card-glow {
              --hilo-main-card-glow-size: min(360px, 92vw, 72cqh);
            }

            .joker-hilo-main-card-wrap {
              position: relative;
              display: block;
              width: var(--hilo-main-native-width);
              height: var(--hilo-main-native-height);
              max-width: none;
              margin: 0 auto;
              padding-bottom: 0;
            }

            .joker-hilo-main-card-wrap .joker-hilo-main-card-stack-slot {
              width: var(--hilo-main-native-width);
              height: var(--hilo-main-native-height);
            }

            .joker-hilo-main-card-scale {
              transform: none;
              transform-origin: center center;
            }

            .joker-hilo-main-card-skip-slot {
              top: calc(var(--spacing-16) * -1);
              right: calc(var(--spacing-16) * -1);
              width: calc(58px * 1.2);
              height: calc(32px * 1.2);
            }

            .joker-hilo-main-card-skip-scale {
              transform: none;
              transform-origin: center center;
            }

            .joker-hilo-main-card-wrap .joker-hilo-main-card-skip {
              --skip-button-width: calc(58px * 1.2);
              --skip-button-height: calc(32px * 1.2);
              --skip-button-chevron-size: calc(8px * 1.2);
            }

            .joker-hilo-mobile-odds {
              position: relative;
              flex: 0 0 auto;
              left: auto;
              right: auto;
              bottom: auto;
              width: 100%;
              max-width: none;
              margin-top: 0;
              padding: var(--spacing-4) var(--spacing-24) var(--spacing-16);
              box-sizing: border-box;
              z-index: 4;
              pointer-events: auto;
            }

            .joker-hilo-mobile-odds .joker-odds-button-group.is-inline {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: var(--spacing-8);
            }

            .joker-hilo-mobile-odds button {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .joker-hilo-mobile-odds button > span:first-child {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: var(--spacing-8);
              min-width: 0;
              max-width: 100%;
            }

            .joker-hilo-mobile-odds .joker-hi-lo-odds {
              gap: var(--spacing-8);
            }
          }

          ${GAME_ROUND_END_STYLES}
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--hilo"
        defaultValue={hiloNavigationPreset.defaultValue}
        game={hiloNavigationPreset.game}
        onValueChange={onGameChange}
        value={hiloNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedHiloBettingPanel
            awaitingHiloChoice={!gameInPlay && hasBetAmount && !pendingPrediction}
            betAmount={betAmount}
            gameInPlay={gameInPlay}
            hasBetAmount={hasBetAmount}
            higherOdds={formatHiloPercent(displayOdds.higherPercent)}
            layout={bettingPanelLayout}
            lowerOdds={formatHiloPercent(displayOdds.lowerPercent)}
            onBetAmountChange={handleBetAmountChange}
            onCashout={handleCashout}
            onPlaceBet={handlePlaceBet}
            onHigherSame={() => handleHiloChoiceSelection("higher")}
            onLowerSame={() => handleHiloChoiceSelection("lower")}
            onSkipCard={handleSkipCard}
            selectedOddsValue={pendingPrediction}
            skipAvailable={skipAvailable}
          />
        }
      >
        <HiloStage
          bettingPanelLayout={bettingPanelLayout}
          cardsRemaining={deck.length}
          currentCard={currentCard}
          hasBetAmount={hasBetAmount}
          higherMultiplier={higherMultiplier}
          higherOdds={formatHiloPercent(displayOdds.higherPercent)}
          history={history}
          lowerMultiplier={lowerMultiplier}
          lowerOdds={formatHiloPercent(displayOdds.lowerPercent)}
          onHigherSame={() => handleHiloChoiceSelection("higher")}
          onLowerSame={() => handleHiloChoiceSelection("lower")}
          onSkipCard={handleSkipCard}
          onWinModalClose={handleHiloWinModalClose}
          onWinCoinsLand={applyDeferredWinCredit}
          pendingPrediction={pendingPrediction}
          roundStatus={roundStatus}
          skipAvailable={skipAvailable}
          winModal={hiloWinModal}
        />
      </GameShell>
    </>
  );
}

const crashGraphWidth = 1000;
const crashGraphHeight = 640;
const crashGraphDurationSeconds = 8;
const crashGrowthRate = 0.3;
const crashGraphBottom = 620;
const crashGraphTop = 52;
const crashResetDurationMs = 5000;
const crashRtp = 0.96;
const crashMaxMultiplier = 100;
const crashSocialEvents = [
  { name: "James", multiplier: 1.62 },
  { name: "Mia", multiplier: 2.24 },
  { name: "Noah", multiplier: 3.08 },
  { name: "Michael", multiplier: 4.42 },
  { name: "Sofia", multiplier: 6.15 },
  { name: "Alex", multiplier: 8.74 },
  { name: "Kai", multiplier: 12.36 },
  { name: "Lena", multiplier: 18.52 },
];
const crashParticles = Array.from({ length: 16 }, (_, index) => ({
  delay: `${index * 190}ms`,
  duration: `${3800 + (index % 5) * 620}ms`,
  size: `${2 + (index % 3)}px`,
  x: `${8 + ((index * 17) % 84)}%`,
  y: `${12 + ((index * 23) % 74)}%`,
}));

function createCrashRound() {
  const random = Math.random();
  const rawCrash = crashRtp / (1 - random);
  const crashPoint = Number(Math.min(crashMaxMultiplier, Math.max(1, rawCrash)).toFixed(2));
  const calculatedCrashTimeMs = (Math.log(Math.max(crashPoint, 1.0001)) / crashGrowthRate) * 1000;
  const crashTimeMs = Math.min(
    crashGraphDurationSeconds * 1000,
    Math.max(crashPoint <= 1.01 ? 720 : 0, calculatedCrashTimeMs),
  );

  return {
    status: "active",
    elapsedMs: 0,
    multiplier: 1,
    crashPoint,
    crashTimeMs,
  };
}

function getCrashMultiplierAt(elapsedMs) {
  return Math.max(1, Math.exp(crashGrowthRate * (elapsedMs / 1000)));
}

function formatCrashMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
}

function formatCrashAxisMultiplier(multiplier) {
  return `${multiplier >= 10 ? multiplier.toFixed(0) : multiplier.toFixed(1)}x`;
}

function getCrashIntensity(multiplier) {
  if (multiplier < 2) return Math.max(0, (multiplier - 1) / 1) * 0.24;
  if (multiplier < 5) return 0.24 + ((multiplier - 2) / 3) * 0.3;
  if (multiplier < 10) return 0.54 + ((multiplier - 5) / 5) * 0.32;
  return Math.min(1, 0.86 + ((multiplier - 10) / 3) * 0.14);
}

function getCrashGraphPoint(elapsedMs, crashPoint) {
  const seconds = elapsedMs / 1000;
  const multiplier = getCrashMultiplierAt(elapsedMs);
  const maxMultiplier = Math.max(1.82, crashPoint * 1.12);
  const x = Math.min(crashGraphWidth, (seconds / crashGraphDurationSeconds) * crashGraphWidth);
  const normalizedMultiplier = Math.min(1, (multiplier - 1) / (maxMultiplier - 1));
  const y = crashGraphBottom - normalizedMultiplier * (crashGraphBottom - crashGraphTop);

  return { x, y };
}

function getCrashRocketAngle(elapsedMs, crashPoint) {
  const current = getCrashGraphPoint(elapsedMs, crashPoint);
  const previous = getCrashGraphPoint(Math.max(0, elapsedMs - 48), crashPoint);
  const dx = current.x - previous.x || 1;
  const dy = current.y - previous.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function buildCrashGraphPaths(elapsedMs, crashPoint) {
  const clampedElapsed = Math.max(0, elapsedMs);
  const samples = Math.max(2, Math.ceil(clampedElapsed / 40));
  const points = Array.from({ length: samples }, (_, index) => {
    const sampleElapsed = (clampedElapsed / (samples - 1)) * index;
    return getCrashGraphPoint(sampleElapsed, crashPoint);
  });
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }

    const previousPoint = points[index - 1];
    const controlX = ((previousPoint.x + point.x) / 2).toFixed(2);
    return `${path} Q${controlX} ${previousPoint.y.toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, "");
  const endPoint = points[points.length - 1];
  const fillPath = `${linePath} L${endPoint.x.toFixed(2)} ${crashGraphHeight} L0 ${crashGraphHeight} Z`;

  return { linePath, fillPath, endPoint };
}

function CrashPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [bettingMode, setBettingMode] = useState("manual");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [roundStatus, setRoundStatus] = useState("idle");
  const [numberOfBets, setNumberOfBets] = useState("");
  const [crashResult, setCrashResult] = useState(null);
  const [crashResetting, setCrashResetting] = useState(false);
  const [crashRound, setCrashRound] = useState(() => ({
    status: "idle",
    elapsedMs: 0,
    multiplier: 1,
    crashPoint: 1.8,
    crashTimeMs: crashGraphDurationSeconds * 1000,
  }));
  const crashStartRef = useRef(0);
  const crashFrameRef = useRef(null);
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const crashGraph = buildCrashGraphPaths(crashRound.elapsedMs, crashRound.crashPoint);
  const crashAxisMax = Math.max(1.82, crashRound.crashPoint * 1.12);
  const crashYAxisLabels = [
    crashAxisMax,
    1 + (crashAxisMax - 1) * 0.75,
    1 + (crashAxisMax - 1) * 0.5,
    1 + (crashAxisMax - 1) * 0.25,
    1,
  ];
  const crashSpeedIntensity = getCrashIntensity(crashRound.multiplier);
  const crashLivePlayers = Math.max(3, Math.round(97 - crashSpeedIntensity * 94));
  const visibleCrashCashouts = crashSocialEvents
    .filter((event) => crashRound.multiplier >= event.multiplier)
    .slice(-3);
  const crashCameraStyle = {
    "--crash-atmosphere": crashSpeedIntensity.toFixed(3),
    "--crash-camera-scale": (1 + crashSpeedIntensity * 0.05).toFixed(3),
    "--crash-camera-x": `${(-10 * crashSpeedIntensity).toFixed(2)}px`,
    "--crash-camera-y": `${(6 * crashSpeedIntensity).toFixed(2)}px`,
    "--crash-fill-peak-opacity": (0.14 + crashSpeedIntensity * 0.16).toFixed(3),
    "--crash-line-trail-opacity": (0.06 + crashSpeedIntensity * 0.18).toFixed(3),
    "--crash-line-width": `${(4 + crashSpeedIntensity * 1.4).toFixed(2)}px`,
  };
  const crashMultiplierTick = Math.floor(crashRound.multiplier * 100);
  const crashRocketAngle = getCrashRocketAngle(crashRound.elapsedMs, crashRound.crashPoint);
  const crashRocketStyle = {
    left: `${(crashGraph.endPoint.x / crashGraphWidth) * 100}%`,
    top: `${(crashGraph.endPoint.y / crashGraphHeight) * 100}%`,
    "--crash-rocket-angle": `${crashRocketAngle}deg`,
    "--crash-rocket-scale": (1 + crashSpeedIntensity * 0.22).toFixed(2),
    "--crash-rocket-pulse-duration": `${Math.round(520 - crashSpeedIntensity * 260)}ms`,
    "--crash-flame-scale": (0.72 + crashSpeedIntensity * 0.56).toFixed(2),
    "--crash-rocket-glow-opacity": (0.18 + crashSpeedIntensity * 0.42).toFixed(2),
  };
  const crashMultiplierStyle = {
    "--crash-multiplier-pulse-duration": `${Math.round(280 - crashSpeedIntensity * 120)}ms`,
    "--crash-multiplier-drift": `${(-4 * crashSpeedIntensity).toFixed(2)}px`,
  };

  useEffect(() => {
    if (crashRound.status !== "active") return undefined;

    function tick(now) {
      const elapsedMs = Math.min(now - crashStartRef.current, crashRound.crashTimeMs);
      const nextMultiplier = Math.min(getCrashMultiplierAt(elapsedMs), crashRound.crashPoint);

      if (elapsedMs >= crashRound.crashTimeMs || nextMultiplier >= crashRound.crashPoint) {
        setCrashRound((currentRound) => ({
          ...currentRound,
          status: "crashed",
          elapsedMs: currentRound.crashTimeMs,
          multiplier: currentRound.crashPoint,
        }));
        setCrashResetting(true);
        setCrashResult({
          type: "loss",
          multiplier: crashRound.crashPoint,
        });
        setRoundStatus("crashed");
        return;
      }

      setCrashRound((currentRound) => ({
        ...currentRound,
        elapsedMs,
        multiplier: nextMultiplier,
      }));
      crashFrameRef.current = requestAnimationFrame(tick);
    }

    crashFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (crashFrameRef.current) {
        cancelAnimationFrame(crashFrameRef.current);
      }
    };
  }, [crashRound.status, crashRound.crashTimeMs, crashRound.crashPoint]);

  useEffect(() => {
    if (!crashResult) return undefined;

    const timer = window.setTimeout(() => {
      setCrashResult(null);
      setCrashResetting(false);
      setRoundStatus("idle");
      setCrashRound((currentRound) => ({
        ...currentRound,
        status: "idle",
        elapsedMs: 0,
        multiplier: 1,
      }));
    }, crashResetDurationMs);

    return () => window.clearTimeout(timer);
  }, [crashResult]);

  function handleCrashResultClose() {
    setCrashResult(null);
    setCrashResetting(false);
    setRoundStatus("idle");
    setCrashRound((currentRound) => ({
      ...currentRound,
      status: "idle",
      elapsedMs: 0,
      multiplier: 1,
    }));
  }

  function handleBetAction() {
    if (!hasBetAmount) return;

    if (roundStatus === "active") {
      const payout = numericBetAmount * crashRound.multiplier;
      setRoundStatus("cashedOut");
      setCrashResetting(true);
      setCrashRound((currentRound) => ({
        ...currentRound,
        status: "cashedOut",
      }));
      setCrashResult({
        type: "win",
        amount: payout,
        multiplier: crashRound.multiplier,
      });
      deferWinCredit(payout);
      return;
    }

    const nextRound = createCrashRound();
    crashStartRef.current = performance.now();
    setCrashResult(null);
    setBalance((currentBalance) => Math.max(0, currentBalance - numericBetAmount));
    setCrashRound(nextRound);
    setRoundStatus("active");
  }

  return (
    <>
      <style>
        {`
          .joker-crash-stage {
            width: 100%;
            height: 100%;
            min-height: 0;
            display: grid;
            padding: 0;
            background: var(--joker-black-800);
            overflow: hidden;
          }

          .joker-game-shell--crash .joker-crash-betting-panel {
            height: 100%;
            min-height: 0;
            grid-template-rows: auto minmax(0, 1fr) auto auto;
          }

          .joker-game-shell--crash .joker-crash-betting-panel .joker-betting-submit-spacer {
            min-height: 0;
          }

          .joker-crash-chart {
            position: relative;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            --crash-atmosphere: 0;
            background:
              radial-gradient(
                circle at calc(58% + (var(--crash-atmosphere) * 12%)) calc(48% - (var(--crash-atmosphere) * 8%)),
                color-mix(in srgb, #E6D0A4 calc(8% + (var(--crash-atmosphere) * 14%)), transparent) 0%,
                transparent 48%
              ),
              var(--joker-black-800);
            overflow: hidden;
            isolation: isolate;
            transition: background 240ms var(--ease-standard);
          }

          .joker-crash-chart-grid {
            position: absolute;
            inset: 0;
            display: block;
            z-index: 1;
          }

          .joker-crash-chart::after {
            position: absolute;
            inset: 0;
            z-index: 0;
            background:
              linear-gradient(115deg, transparent 0%, rgb(255 255 255 / 0.018) 44%, transparent 52%),
              radial-gradient(circle at 70% 35%, rgb(230 208 164 / 0.045), transparent 34%);
            content: "";
            opacity: calc(0.18 + var(--crash-atmosphere) * 0.32);
            transform: translate3d(calc(var(--crash-atmosphere) * -14px), calc(var(--crash-atmosphere) * 8px), 0);
            transition:
              opacity 240ms var(--ease-standard),
              transform 240ms var(--ease-standard);
            pointer-events: none;
          }

          .joker-crash-y-axis,
          .joker-crash-x-axis {
            color: var(--joker-black-50);
            font-family: var(--font);
            font-size: var(--text-body-14);
            font-weight: var(--text-body-weight);
            line-height: var(--text-body-line-height);
          }

          .joker-crash-y-axis {
            position: absolute;
            top: 0;
            bottom: 56px;
            left: 0;
            width: 56px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 48px 0;
            border-right: var(--border-width-default) solid var(--joker-black-300);
          }

          .joker-crash-y-axis span {
            display: grid;
            width: 100%;
            min-height: 56px;
            place-items: center;
          }

          .joker-crash-x-axis {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 48px 0 calc(56px + 48px);
            border-top: var(--border-width-default) solid var(--joker-black-300);
          }

          .joker-crash-x-axis span {
            display: grid;
            min-width: 56px;
            height: 100%;
            place-items: center;
          }

          .joker-crash-axis-corner {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 56px;
            height: 56px;
            border-top: var(--border-width-default) solid var(--joker-black-300);
            border-right: var(--border-width-default) solid var(--joker-black-300);
          }

          .joker-crash-plot {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 56px;
            left: 56px;
            overflow: hidden;
          }

          .joker-crash-camera {
            position: absolute;
            inset: 0;
            transform:
              translate3d(var(--crash-camera-x, 0), var(--crash-camera-y, 0), 0)
              scale(var(--crash-camera-scale, 1));
            transform-origin: 64% 60%;
            transition: transform 120ms linear;
            will-change: transform;
          }

          .joker-crash-graph {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }

          .joker-crash-graph-fill {
            fill: url("#joker-crash-fill");
            transition: fill 180ms var(--ease-standard);
          }

          .joker-crash-graph-trail {
            fill: none;
            stroke: #E6D0A4;
            stroke-width: 14;
            stroke-linecap: round;
            stroke-linejoin: round;
            opacity: var(--crash-line-trail-opacity, 0.06);
            filter: blur(10px);
            transition:
              opacity 160ms var(--ease-standard),
              stroke 180ms var(--ease-standard);
          }

          .joker-crash-graph-line {
            fill: none;
            stroke: #E6D0A4;
            stroke-width: var(--crash-line-width, 4px);
            stroke-linecap: round;
            stroke-linejoin: round;
            filter: drop-shadow(0 0 calc(var(--spacing-8) * var(--crash-atmosphere, 0)) rgb(230 208 164 / 0.2));
            transition:
              stroke 180ms var(--ease-standard),
              stroke-width 160ms var(--ease-standard),
              filter 160ms var(--ease-standard);
          }

          .joker-crash-multiplier {
            position: absolute;
            top: 54%;
            left: 48%;
            transform: translate(-50%, -50%);
            color: var(--joker-white-50);
            font-family: var(--font-display);
            font-size: var(--text-display-d1, var(--display-d1));
            font-weight: var(--text-display-weight);
            line-height: var(--text-display-line-height-compact);
            letter-spacing: 0;
            pointer-events: none;
            text-shadow: 0 var(--spacing-8) var(--spacing-32) rgb(0 0 0 / 0.34);
          }

          .joker-crash-multiplier-value {
            display: inline-block;
            transform-origin: center;
            animation: joker-crash-multiplier-pulse var(--crash-multiplier-pulse-duration, 220ms) cubic-bezier(0.17, 0.89, 0.32, 1.28) both;
          }

          .joker-crash-multiplier.is-crashed {
            color: var(--joker-red-500, #e24a4a);
          }

          .joker-crash-rocket {
            position: absolute;
            width: 56px;
            height: 56px;
            transform:
              translate(-50%, -50%)
              rotate(var(--crash-rocket-angle, -32deg))
              scale(var(--crash-rocket-scale, 1));
            transform-origin: center;
            pointer-events: none;
            z-index: 2;
          }

          .joker-crash-rocket-body {
            position: relative;
            display: grid;
            place-items: center;
            width: 100%;
            height: 100%;
            animation: joker-crash-rocket-pulse var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
          }

          .joker-crash-rocket-body svg {
            display: block;
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 0 10px rgb(230 208 164 / 0.42));
          }

          .joker-crash-rocket-glow {
            position: absolute;
            inset: -18px;
            border-radius: 9999px;
            background: radial-gradient(circle, rgb(230 208 164 / 0.34) 0%, transparent 72%);
            opacity: var(--crash-rocket-glow-opacity, 0.24);
            animation: joker-crash-rocket-glow var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
            pointer-events: none;
          }

          .joker-crash-rocket-flame {
            position: absolute;
            top: 58%;
            left: 8%;
            width: 18px;
            height: 10px;
            border-radius: 9999px 0 9999px 9999px;
            background: linear-gradient(90deg, #ff8a3d, #ffd56a 58%, transparent);
            opacity: calc(0.55 + var(--crash-atmosphere, 0) * 0.45);
            transform:
              translateY(-50%)
              rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg))
              scaleX(var(--crash-flame-scale, 1));
            transform-origin: right center;
            filter: blur(0.4px);
            animation: joker-crash-rocket-flame var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
          }

          .joker-crash-chart.is-crashed .joker-crash-rocket-body svg {
            filter: drop-shadow(0 0 12px rgb(226 74 74 / 0.5));
          }

          .joker-crash-chart.is-crashed .joker-crash-rocket-body svg .joker-crash-rocket-fill {
            fill: var(--joker-red-500, #e24a4a);
          }

          .joker-crash-chart.is-crashed .joker-crash-rocket-body svg .joker-crash-rocket-window {
            fill: color-mix(in srgb, var(--joker-red-500, #e24a4a) 72%, #fff);
          }

          .joker-crash-chart.is-crashed .joker-crash-rocket-flame {
            background: linear-gradient(90deg, #ff4d4d, #ff9b7a 58%, transparent);
            animation: joker-crash-rocket-burst 420ms var(--ease-standard) both;
          }

          .joker-crash-chart.is-crashed .joker-crash-rocket-glow {
            background: radial-gradient(circle, rgb(226 74 74 / 0.42) 0%, transparent 72%);
            animation: joker-crash-rocket-burst 420ms var(--ease-standard) both;
          }

          .joker-crash-particles {
            position: absolute;
            inset: 0;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
          }

          .joker-crash-particle {
            position: absolute;
            left: var(--particle-x);
            top: var(--particle-y);
            width: var(--particle-size);
            height: var(--particle-size);
            border-radius: var(--radius-pill);
            background: #E6D0A4;
            opacity: calc(var(--crash-atmosphere, 0) * 0.24);
            filter: blur(0.4px);
            animation: joker-crash-particle-drift var(--particle-duration) linear infinite;
            animation-delay: var(--particle-delay);
            transform: translate3d(0, 0, 0);
          }

          .joker-crash-social {
            position: absolute;
            top: var(--spacing-24);
            right: var(--spacing-24);
            z-index: 2;
            display: grid;
            gap: var(--spacing-8);
            min-width: 190px;
            color: var(--joker-black-50);
            font-family: var(--font);
            font-size: var(--text-body-12);
            line-height: var(--text-body-line-height);
            pointer-events: none;
          }

          .joker-crash-live-count {
            justify-self: end;
            border: var(--border-width-default) solid color-mix(in srgb, var(--joker-black-300) 76%, transparent);
            border-radius: var(--radius-sm);
            background: color-mix(in srgb, var(--joker-black-700) 72%, transparent);
            color: color-mix(in srgb, var(--joker-white-50) 74%, transparent);
            padding: var(--spacing-4) var(--spacing-8);
          }

          .joker-crash-cashout-feed {
            display: grid;
            gap: var(--spacing-4);
            justify-items: end;
            min-height: 64px;
          }

          .joker-crash-cashout-feed span {
            color: color-mix(in srgb, var(--joker-white-50) 54%, transparent);
            opacity: 0.84;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            animation: joker-crash-social-enter 360ms var(--ease-standard) both;
          }

          .joker-crash-chart.is-crashed .joker-crash-graph-line {
            stroke: var(--joker-red-500, #e24a4a);
            filter: none;
          }

          .joker-crash-chart.is-crashed .joker-crash-graph-trail {
            stroke: var(--joker-red-500, #e24a4a);
            opacity: 0.12;
          }

          .joker-crash-chart.is-crashed .joker-crash-graph-fill {
            fill: url("#joker-crash-fill-red");
          }

          .joker-crash-chart.is-crashed .joker-crash-camera {
            transition: none;
          }

          .joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit {
            position: relative;
          }

          .joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit > span {
            color: transparent;
          }

          .joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit > span::after {
            content: "Cashout";
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            color: var(--button-primary-text);
            font: inherit;
            text-transform: inherit;
          }

          .joker-crash-result-overlay {
            position: absolute;
            inset: 0;
            z-index: 8;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: none;
          }

          .joker-crash-result-card {
            pointer-events: auto;
            animation: joker-crash-result-pop 420ms var(--ease-standard) both;
          }

          .joker-crash-reset-timer {
            position: absolute;
            right: var(--spacing-32);
            bottom: calc(56px + var(--spacing-24));
            left: calc(56px + var(--spacing-32));
            z-index: 7;
            display: grid;
            gap: var(--spacing-8);
            pointer-events: none;
          }

          .joker-crash-reset-copy {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: color-mix(in srgb, var(--joker-white-50) 62%, transparent);
            font-family: var(--font);
            font-size: var(--text-body-12);
            line-height: var(--text-body-line-height);
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .joker-crash-reset-track {
            height: var(--spacing-4);
            overflow: hidden;
            border-radius: var(--radius-pill);
            background: color-mix(in srgb, var(--joker-black-300) 46%, transparent);
          }

          .joker-crash-reset-fill {
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, color-mix(in srgb, #E6D0A4 64%, transparent), #E6D0A4);
            transform-origin: left;
            animation: joker-crash-reset-fill ${crashResetDurationMs}ms linear both;
          }

          @keyframes joker-crash-result-pop {
            0% {
              opacity: 0;
              transform: scale(0.92) translateY(var(--spacing-12));
            }

            68% {
              opacity: 1;
              transform: scale(1.03) translateY(0);
            }

            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes joker-crash-multiplier-pulse {
            0% {
              transform: translateY(var(--crash-multiplier-drift, 0)) scale(0.985);
            }

            52% {
              transform: translateY(var(--crash-multiplier-drift, 0)) scale(1.035);
            }

            100% {
              transform: translateY(var(--crash-multiplier-drift, 0)) scale(1);
            }
          }

          @keyframes joker-crash-rocket-pulse {
            0%, 100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.12);
            }
          }

          @keyframes joker-crash-rocket-glow {
            0%, 100% {
              opacity: calc(var(--crash-rocket-glow-opacity, 0.24) * 0.72);
              transform: scale(0.92);
            }

            50% {
              opacity: var(--crash-rocket-glow-opacity, 0.24);
              transform: scale(1.08);
            }
          }

          @keyframes joker-crash-rocket-flame {
            0%, 100% {
              opacity: calc(0.5 + var(--crash-atmosphere, 0) * 0.35);
              transform: translateY(-50%) rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg)) scaleX(calc(var(--crash-flame-scale, 1) * 0.88));
            }

            50% {
              opacity: calc(0.72 + var(--crash-atmosphere, 0) * 0.28);
              transform: translateY(-50%) rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg)) scaleX(calc(var(--crash-flame-scale, 1) * 1.18));
            }
          }

          @keyframes joker-crash-rocket-burst {
            0% {
              opacity: 1;
              transform: scale(1);
            }

            100% {
              opacity: 0;
              transform: scale(2.4);
            }
          }

          @keyframes joker-crash-particle-drift {
            0% {
              transform: translate3d(0, var(--spacing-16), 0);
              opacity: 0;
            }

            18% {
              opacity: calc(var(--crash-atmosphere, 0) * 0.24);
            }

            100% {
              transform: translate3d(calc(var(--crash-atmosphere, 0) * -26px), calc(var(--spacing-40) * -1), 0);
              opacity: 0;
            }
          }

          @keyframes joker-crash-social-enter {
            0% {
              opacity: 0;
              transform: translateY(var(--spacing-4));
            }

            100% {
              opacity: 0.84;
              transform: translateY(0);
            }
          }

          @keyframes joker-crash-reset-fill {
            0% {
              transform: scaleX(0);
            }

            100% {
              transform: scaleX(1);
            }
          }
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--crash"
        defaultValue={crashNavigationPreset.defaultValue}
        game={crashNavigationPreset.game}
        onValueChange={onGameChange}
        value={crashNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCrashBettingPanel
            betAmount={betAmount}
            bettingMode={bettingMode}
            gameInPlay={roundStatus === "active"}
            layout={bettingPanelLayout}
            numberOfBets={numberOfBets}
            onBetAmountChange={setBetAmount}
            onModeChange={setBettingMode}
            onNumberOfBetsChange={setNumberOfBets}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <section className="joker-crash-stage" aria-label="Crash game area">
          <div
            className={`joker-crash-chart ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
            style={crashCameraStyle}
          >
            <div className="joker-crash-chart-grid">
              <div className="joker-crash-y-axis" aria-hidden="true">
                {crashYAxisLabels.map((label) => (
                  <span key={label}>{formatCrashAxisMultiplier(label)}</span>
                ))}
              </div>
              <div className="joker-crash-plot">
                <div className="joker-crash-camera">
                  <div className="joker-crash-particles" aria-hidden="true">
                    {crashParticles.map((particle, index) => (
                      <span
                        className="joker-crash-particle"
                        key={`${particle.x}-${particle.y}-${index}`}
                        style={{
                          "--particle-delay": particle.delay,
                          "--particle-duration": particle.duration,
                          "--particle-size": particle.size,
                          "--particle-x": particle.x,
                          "--particle-y": particle.y,
                        }}
                      />
                    ))}
                  </div>
                  <svg
                    className="joker-crash-graph"
                    viewBox={`0 0 ${crashGraphWidth} ${crashGraphHeight}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="joker-crash-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#E6D0A4" stopOpacity="var(--crash-fill-peak-opacity)" />
                        <stop offset="100%" stopColor="#E6D0A4" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="joker-crash-fill-red" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(226, 74, 74, 0.22)" />
                        <stop offset="100%" stopColor="rgba(226, 74, 74, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      className="joker-crash-graph-fill"
                      d={crashGraph.fillPath}
                    />
                    <path
                      className="joker-crash-graph-trail"
                      d={crashGraph.linePath}
                    />
                    <path
                      className="joker-crash-graph-line"
                      d={crashGraph.linePath}
                    />
                  </svg>
                  <span
                    className={`joker-crash-rocket ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
                    style={crashRocketStyle}
                    aria-hidden="true"
                  >
                    <span className="joker-crash-rocket-glow" />
                    <span className="joker-crash-rocket-body">
                      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <path
                          className="joker-crash-rocket-fill"
                          d="M16 3.5 21.5 14.5 16 12 10.5 14.5Z"
                          fill="#E6D0A4"
                        />
                        <path
                          className="joker-crash-rocket-fill"
                          d="M10.5 14.5 8 22 16 17.5 24 22 21.5 14.5Z"
                          fill="#E6D0A4"
                        />
                        <circle className="joker-crash-rocket-window" cx="16" cy="11.5" r="2.2" fill="#1a1a1a" />
                        <path
                          className="joker-crash-rocket-fill"
                          d="M13.5 22 16 28.5 18.5 22Z"
                          fill="#c9b48a"
                        />
                      </svg>
                    </span>
                    <span className="joker-crash-rocket-flame" />
                  </span>
                  <div
                    className={`joker-crash-multiplier ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
                    style={crashMultiplierStyle}
                    aria-live="polite"
                  >
                    <span className="joker-crash-multiplier-value" key={crashMultiplierTick}>
                      {formatCrashMultiplier(crashRound.multiplier)}
                    </span>
                  </div>
                </div>
              </div>
              <aside className="joker-crash-social" aria-live="polite">
                <span className="joker-crash-live-count">{crashLivePlayers} players live</span>
                <div className="joker-crash-cashout-feed">
                  {visibleCrashCashouts.map((event) => (
                    <span key={`${event.name}-${event.multiplier}`}>
                      {event.name} cashed out @ {formatCrashMultiplier(event.multiplier)}
                    </span>
                  ))}
                </div>
              </aside>
              <div className="joker-crash-axis-corner" aria-hidden="true" />
              <div className="joker-crash-x-axis" aria-hidden="true">
                <span>0s</span>
                <span>2s</span>
                <span>4s</span>
                <span>6s</span>
                <span>8s</span>
              </div>
              {crashResetting && (
                <div className="joker-crash-reset-timer" aria-live="polite">
                  <div className="joker-crash-reset-copy">
                    <span>Next round</span>
                    <span>Bets opening</span>
                  </div>
                  <div className="joker-crash-reset-track" aria-hidden="true">
                    <div className="joker-crash-reset-fill" />
                  </div>
                </div>
              )}
              {crashResult?.type === "win" && (
                <div className="joker-crash-result-overlay" role="status" aria-live="polite">
                  <WinModalCard
                    className="joker-crash-result-card"
                    title="Cashout Successful"
                    amountWon={formatCurrency(crashResult.amount)}
                    currency={null}
                    message={`Cashed out at ${formatCrashMultiplier(crashResult.multiplier)}. Added to your balance.`}
                    closeLabel="Close"
                    onCoinsLand={applyDeferredWinCredit}
                    onClose={handleCrashResultClose}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </GameShell>
    </>
  );
}

const ROULETTE_WHEEL_NATIVE_SIZE = {
  desktop: 760,
  mobile: 440,
};
const ROULETTE_WIN_CHIP_SIZE = 72;


function RouletteWheelStage({
  className = "",
  onSpinComplete,
  onSpinningChange,
  spinRequestId,
  wheelSize,
  celebrationActive = false,
  celebrationVariant = "win",
}) {
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
    onSpinComplete: (result) => onSpinComplete?.(result.targetPocket.value),
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
        showBall={showBall}
        isSpinning={isSpinning}
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

function RoulettePage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [lockedBetAmount, setLockedBetAmount] = useState("");
  const [selectedOdds, setSelectedOdds] = useState("red");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [inGame, setInGame] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPending, setSpinPending] = useState(false);
  const [spinRequestId, setSpinRequestId] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [winCelebrationActive, setWinCelebrationActive] = useState(false);
  const [loseCelebrationActive, setLoseCelebrationActive] = useState(false);
  const [streakWins, setStreakWins] = useState([]);
  const [rouletteWinModal, setRouletteWinModal] = useState(null);
  const winStreakRailRef = useRef(null);
  const handleWheelSpinningChange = useCallback((wheelIsSpinning) => {
    setIsSpinning(wheelIsSpinning);
    if (wheelIsSpinning) {
      setSpinPending(false);
    }
  }, []);
  const activeSpinRequestRef = useRef(0);
  const activeStakeRef = useRef(0);
  const activeOddsRef = useRef("red");
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const displayBetAmount = inGame ? lockedBetAmount : betAmount;
  const hasDisplayBetAmount = Number(displayBetAmount) > 0;
  const canCashOut = inGame && streakWins.length > 0 && !isSpinning && !spinPending && !rouletteWinModal;
  const spinLocked = isSpinning || spinPending;
  const rouletteWheelNativeSize =
    bettingPanelLayout === "mobile"
      ? ROULETTE_WHEEL_NATIVE_SIZE.mobile
      : ROULETTE_WHEEL_NATIVE_SIZE.desktop;
  const rouletteOddsOptions = useMemo(
    () =>
      hasDisplayBetAmount
        ? getRouletteOddsOptions(displayBetAmount, streakWins.length)
        : undefined,
    [displayBetAmount, hasDisplayBetAmount, streakWins.length]
  );

  const streakWinSlots = useMemo(
    () =>
      streakWins.map((win) => ({
        betColor: win.betColor,
        multiplier: win.multiplier,
      })),
    [streakWins],
  );
  const streakCompletedThrough = streakWins.length > 0 ? streakWins.length - 2 : -1;
  const rouletteCelebrationActive = winCelebrationActive || loseCelebrationActive;
  const rouletteCelebrationVariant = loseCelebrationActive ? "lose" : "win";

  useLayoutEffect(() => {
    const rail = winStreakRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [streakWins]);

  useEffect(() => {
    if (roundResult?.type !== "loss") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      resetRouletteRound();
    }, GAME_ROUND_END_RESET_MS);

    return () => window.clearTimeout(timer);
  }, [roundResult]);

  useEffect(() => {
    if (!spinPending) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSpinPending(false);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [spinPending, spinRequestId]);

  function resetRouletteRound() {
    setRoundResult(null);
    setInGame(false);
    setWinCelebrationActive(false);
    setLoseCelebrationActive(false);
    setStreakWins([]);
    setRouletteWinModal(null);
    setLockedBetAmount("");
    activeStakeRef.current = 0;
  }

  function requestSpin() {
    setRoundResult(null);
    setWinCelebrationActive(false);
    setLoseCelebrationActive(false);
    setSpinPending(true);
    setSpinRequestId((currentRequestId) => {
      const nextRequestId = currentRequestId + 1;
      activeSpinRequestRef.current = nextRequestId;
      return nextRequestId;
    });
  }

  function triggerRouletteCelebration(variant) {
    setWinCelebrationActive(false);
    setLoseCelebrationActive(false);
    window.requestAnimationFrame(() => {
      setWinCelebrationActive(variant === "win");
      setLoseCelebrationActive(variant === "lose");
    });
  }

  function handleSpinComplete(resultNumber) {
    const betType = activeOddsRef.current;
    const resultColor = getPocketColor(resultNumber);
    const didWin = didRouletteBetWin(betType, resultNumber);
    const completedSpinId = activeSpinRequestRef.current;

    if (didWin) {
      setSpinPending(false);
      setStreakWins((currentStreak) => {
        const winIndex = currentStreak.length;

        return [
          ...currentStreak,
          {
            id: completedSpinId,
            betColor: betType,
            multiplier: formatRouletteStreakWinMultiplier(betType, winIndex),
          },
        ];
      });
      triggerRouletteCelebration("win");
      return;
    }

    setSpinPending(false);
    setStreakWins([]);
    setInGame(false);
    triggerRouletteCelebration("lose");
    setRoundResult({
      type: "loss",
      number: resultNumber,
      color: resultColor,
    });
  }

  function handlePlaceBet() {
    if (!hasBetAmount || !selectedOdds || inGame || spinLocked) {
      return;
    }

    if (numericBetAmount > balance) {
      return;
    }

    activeStakeRef.current = numericBetAmount;
    activeOddsRef.current = selectedOdds;
    setLockedBetAmount(betAmount);
    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setInGame(true);
    requestSpin();
  }

  function handleContinueSpin() {
    if (
      !inGame ||
      spinLocked ||
      !selectedOdds ||
      rouletteWinModal ||
      loseCelebrationActive
    ) {
      return;
    }

    activeOddsRef.current = selectedOdds;
    requestSpin();
  }

  function handleRouletteCashout() {
    if (!canCashOut) {
      return;
    }

    const cashoutProfit = calculateRouletteStreakProfit(lockedBetAmount, streakWins);

    playSound(minesCashoutSound);
    deferWinCredit(cashoutProfit);
    setRouletteWinModal({ profit: cashoutProfit });
  }

  function handleRouletteCashoutClose() {
    setRouletteWinModal(null);
    resetRouletteRound();
  }

  function handleOddsChange(value) {
    if (spinLocked) {
      return;
    }

    setSelectedOdds(value);
  }

  return (
    <>
      <style>
        {`
          .joker-game-shell--roulette .joker-game-shell-empty-stage {
            position: relative;
            min-height: 0;
            overflow: hidden;
          }

          .joker-game-shell--roulette .joker-game-inner-canvas {
            overflow: hidden;
          }

          .joker-game-shell--roulette .joker-game-shell-empty-stage > .joker-roulette-stage {
            min-height: 0;
            height: 100%;
          }

          .joker-roulette-stage {
            container-type: size;
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 0;
            box-sizing: border-box;
            --roulette-betting-divider-offset: calc(
              var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
                var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
            );
            --roulette-streak-inset: var(--spacing-24);
            --roulette-sync-streak-rail-height: var(--roulette-betting-divider-offset);
            --roulette-sync-top-band-height: calc(
              var(--roulette-sync-streak-rail-height) + var(--roulette-streak-inset)
            );
            --roulette-wheel-native-size: ${ROULETTE_WHEEL_NATIVE_SIZE.desktop}px;
            --roulette-wheel-visible-scale: 1;
            --roulette-wheel-scale-boost: 1.4;
            --roulette-wheel-scale-max: 1.34;
            --roulette-wheel-lift: 35%;
            --roulette-wheel-lift-offset: 0px;
            --roulette-wheel-vignette-size: 200px;
            padding: 0;
            overflow: hidden;
            background: var(--joker-black-800);
          }

          .joker-roulette-main-area {
            container-type: size;
            display: flex;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            align-items: stretch;
            justify-content: flex-start;
            overflow: hidden;
          }

          .joker-roulette-game-frame {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            max-height: 100cqh;
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 0;
            overflow: hidden;
            padding: 0;
            margin-inline: auto;
          }

          .joker-roulette-game-frame__top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 5;
            display: flex;
            width: 100%;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: flex-start;
            box-sizing: border-box;
            padding: var(--roulette-streak-inset) 0 0 var(--roulette-streak-inset);
            overflow: visible;
            background: transparent;
            pointer-events: none;
          }

          .joker-roulette-game-frame__top .joker-roulette-streak-rail {
            pointer-events: auto;
          }

          @media (min-width: 1024px) {
            .joker-roulette-game-frame__top {
              height: var(--roulette-sync-top-band-height);
              min-height: var(--roulette-sync-top-band-height);
              max-height: var(--roulette-sync-top-band-height);
              padding: var(--roulette-streak-inset) 0 0 var(--roulette-streak-inset);
              justify-content: flex-start;
            }
          }

          .joker-roulette-streak-rail {
            position: relative;
            z-index: 5;
            width: 100%;
            min-width: 0;
            min-height: var(--roulette-sync-streak-rail-height);
            flex: 0 0 auto;
            --win-streak-row-gap: var(--spacing-12);
            --win-streak-row-chip-size: ${ROULETTE_WIN_CHIP_SIZE}px;
            overflow-x: auto;
            overflow-y: visible;
            scroll-behavior: smooth;
            scroll-padding-inline-end: var(--spacing-24);
            scroll-padding-inline-start: var(--spacing-24);
            scrollbar-width: none;
          }

          .joker-roulette-streak-rail .joker-win-streak-row__track {
            width: max-content;
            min-width: 100%;
          }

          .joker-roulette-streak-rail::-webkit-scrollbar {
            display: none;
          }

          .joker-roulette-game-frame__bottom {
            display: flex;
            width: 100%;
            flex: 1 1 auto;
            flex-direction: column;
            align-items: stretch;
            justify-content: stretch;
            gap: 0;
            min-height: 0;
            height: 100%;
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
            background: var(--joker-black-800);
          }

          .joker-roulette-wheel-viewport {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            min-height: 0;
            flex: 1 1 auto;
            align-items: flex-end;
            justify-content: center;
            overflow: hidden;
            background: var(--joker-black-800);
            container-type: size;
            container-name: roulette-wheel;
            --roulette-wheel-visible-scale: min(
              calc((100cqw * 1.22) / var(--roulette-wheel-native-size)),
              calc((100cqh * 2.35) / var(--roulette-wheel-native-size)),
              var(--roulette-wheel-scale-max)
            );
          }

          .joker-roulette-wheel-vignette {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            background:
              linear-gradient(
                90deg,
                #151515 0%,
                rgb(21 21 21 / 80%) 49%,
                rgb(21 21 21 / 0%) 100%
              )
              left center / var(--roulette-wheel-vignette-size) 100% no-repeat,
              linear-gradient(
                270deg,
                #151515 0%,
                rgb(21 21 21 / 80%) 49%,
                rgb(21 21 21 / 0%) 100%
              )
              right center / var(--roulette-wheel-vignette-size) 100% no-repeat,
              linear-gradient(
                0deg,
                #151515 0%,
                rgb(21 21 21 / 80%) 49%,
                rgb(21 21 21 / 0%) 100%
              )
              center bottom / 100% var(--roulette-wheel-vignette-size) no-repeat;
          }

          .joker-roulette-wheel-mount {
            position: relative;
            z-index: 1;
            display: flex;
            flex: 0 0 auto;
            width: var(--roulette-wheel-native-size);
            height: var(--roulette-wheel-native-size);
            align-items: center;
            justify-content: center;
            overflow: visible;
            transform: translateY(
                calc(var(--roulette-wheel-lift, 35%) + var(--roulette-wheel-lift-offset, 0px))
              )
              scale(calc(var(--roulette-wheel-visible-scale, 1) * var(--roulette-wheel-scale-boost, 1.4)));
            transform-origin: center center;
          }

          .joker-roulette-wheel-stage {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            overflow: visible;
          }

          .joker-roulette-wheel-stage .joker-roulette-wheel-composition {
            overflow: visible;
          }

          .joker-roulette-wheel-viewport,
          .joker-roulette-wheel-stage .joker-roulette-wheel {
            overflow: hidden;
          }

          .joker-roulette-result-overlay {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: none;
          }

          .joker-roulette-result-overlay .joker-win-modal-card {
            pointer-events: auto;
          }

          @media (min-width: 1024px) {
            .joker-roulette-stage {
              --roulette-wheel-lift: 50%;
              --roulette-wheel-lift-offset: 60px;
            }

            .joker-roulette-wheel-viewport {
              --roulette-wheel-visible-scale: min(
                calc((100cqw * 1.18) / var(--roulette-wheel-native-size)),
                calc((100cqh * 2.42) / var(--roulette-wheel-native-size)),
                var(--roulette-wheel-scale-max)
              );
            }

            .joker-roulette-wheel-mount {
              --roulette-wheel-visible-scale: max(0.86, var(--roulette-wheel-visible-scale, 1));
            }
          }

          @media (max-width: 1023px) {
            .joker-roulette-stage {
              --roulette-wheel-native-size: ${ROULETTE_WHEEL_NATIVE_SIZE.mobile}px;
              --roulette-wheel-scale-max: 1.28;
              --roulette-wheel-lift: 33%;
            }

            .joker-roulette-game-frame {
              position: relative;
              min-height: 0;
            }

            .joker-roulette-game-frame__bottom {
              flex: 1 1 auto;
              min-height: 0;
            }

            .joker-roulette-wheel-viewport {
              --roulette-wheel-visible-scale: min(
                calc((100cqw * 1.26) / var(--roulette-wheel-native-size)),
                calc((100cqh * 2.45) / var(--roulette-wheel-native-size)),
                var(--roulette-wheel-scale-max)
              );
            }

            .joker-roulette-wheel-mount {
              --roulette-wheel-visible-scale: max(0.9, var(--roulette-wheel-visible-scale, 1));
            }
          }

          ${GAME_ROUND_END_STYLES}
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--roulette"
        defaultValue={rouletteNavigationPreset.defaultValue}
        game={rouletteNavigationPreset.game}
        gameHeaderRail={<RouletteGameHeaderRail />}
        onValueChange={onGameChange}
        value={rouletteNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedRouletteBettingPanel
            betAmount={displayBetAmount}
            inGame={inGame}
            isSpinning={spinLocked}
            layout={bettingPanelLayout}
            oddsOptions={rouletteOddsOptions}
            onBetAmountChange={setBetAmount}
            onCashout={handleRouletteCashout}
            onOddsChange={handleOddsChange}
            onPlaceBet={inGame ? handleContinueSpin : handlePlaceBet}
            selectedOdds={selectedOdds}
          />
        }
      >
        <section className="joker-roulette-stage" aria-label="Roulette game board">
          <div className="joker-roulette-main-area">
            <div
              className="joker-roulette-game-frame joker-game-round-end-canvas"
              aria-label="Roulette game area"
            >
              {streakWins.length > 0 ? (
                <div className="joker-roulette-game-frame__top" ref={winStreakRailRef}>
                  <WinStreakRow
                    className="joker-roulette-streak-rail"
                    wins={streakWinSlots}
                    animateOnMount={false}
                    completedThrough={streakCompletedThrough}
                    chipSize={ROULETTE_WIN_CHIP_SIZE}
                    gap={12}
                  />
                </div>
              ) : null}
              <div className="joker-roulette-game-frame__bottom">
                <div className="joker-roulette-wheel-viewport" aria-label="Roulette wheel">
                  <div className="joker-roulette-wheel-vignette" aria-hidden="true" />
                  <div className="joker-roulette-wheel-mount">
                    <RouletteWheelStage
                      onSpinComplete={handleSpinComplete}
                      onSpinningChange={handleWheelSpinningChange}
                      spinRequestId={spinRequestId}
                      wheelSize={rouletteWheelNativeSize}
                      celebrationActive={rouletteCelebrationActive}
                      celebrationVariant={rouletteCelebrationVariant}
                    />
                  </div>
                </div>
              </div>
              {rouletteWinModal ? (
                <div className="joker-roulette-result-overlay" role="status" aria-live="polite">
                  <WinModalCard
                    className="joker-roulette-result-card"
                    title="Cashout Successful"
                    amountWon={formatCurrency(rouletteWinModal.profit)}
                    currency={null}
                    message="Your winnings from this round have been added to your balance."
                    closeLabel="Close"
                    onCoinsLand={applyDeferredWinCredit}
                    onClose={handleRouletteCashoutClose}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </GameShell>
    </>
  );
}

const COIN_FLIP_PROGRESSION_RECEIVER_SIZE = 72;
const COIN_FLIP_PROGRESSION_COIN_SIZE = Math.round(COIN_FLIP_PROGRESSION_RECEIVER_SIZE * 0.76);
const COIN_FLIP_PAGE_LOAD_ANIMATION_MS = 480;
const COIN_FLIP_LOSS_RESET_MS = getCoinReceiverLossTotalMs() + 240;
const COIN_FLIP_LOSS_SEALED_HOLD_MS = 400;

function CoinFlipPage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [balance] = useState(150000);
  const [selectedSide, setSelectedSide] = useState("heads");
  const [roundsToWin, setRoundsToWin] = useState("4");
  const [coinSide, setCoinSide] = useState("heads");
  const [tossPhase, setTossPhase] = useState("idle");
  const [tossOutcome, setTossOutcome] = useState("heads");
  const [tapHintVisible, setTapHintVisible] = useState(true);
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinRoundStatus, setCoinRoundStatus] = useState("idle");
  const [coinResult, setCoinResult] = useState(null);
  const [coinHistory, setCoinHistory] = useState([]);
  const [displayedCoinProfit, setDisplayedCoinProfit] = useState(0);
  const [coinWinModal, setCoinWinModal] = useState(null);
  const [progressionActiveIndex, setProgressionActiveIndex] = useState(0);
  const [progressionCompletedThrough, setProgressionCompletedThrough] = useState(-1);
  const [progressionLockingIndex, setProgressionLockingIndex] = useState(null);
  const [progressionLosingIndex, setProgressionLosingIndex] = useState(null);
  const [progressionLossIndex, setProgressionLossIndex] = useState(null);
  const [coinProgressionKey, setCoinProgressionKey] = useState(0);
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);
  const coinProfitAnimationRef = useRef(null);
  const coinWinModalTimeoutRef = useRef(null);
  const coinLossResetTimeoutRef = useRef(null);
  const coinWinModalResetRef = useRef(false);
  const pendingTossRef = useRef(null);
  const selectedSideRef = useRef(selectedSide);
  const hasCoinBetAmount = Number(betAmount) > 0;
  const hasActiveCoinRound = coinRoundStatus === "active";
  const maxRoundsToWin = Number(roundsToWin) || coinFlipMaxWins;
  const settledCoinCount = coinHistory.filter((coin) => coin.didWin).length;
  const canCashOut =
    hasActiveCoinRound && settledCoinCount > 0 && !isCoinFlipping && !coinWinModal;
  const isRoundLocked = hasActiveCoinRound;
  const canStartCoinFlip =
    hasCoinBetAmount &&
    coinHistory.length < maxRoundsToWin &&
    !isCoinFlipping &&
    !coinWinModal &&
    progressionLosingIndex == null;
  const canFlipCoin = canStartCoinFlip;
  const coinProgressionSteps = useMemo(
    () =>
      Array.from({ length: maxRoundsToWin }, (_, index) => ({
        multiplier: formatCoinFlipMultiplier(calculateCoinFlipMultiplier(index + 1)),
      })),
    [maxRoundsToWin],
  );
  const currentCoinMultiplier = calculateCoinFlipMultiplier(settledCoinCount);
  const nextCoinMultiplier = calculateCoinFlipMultiplier(Math.min(maxRoundsToWin, settledCoinCount + 1));
  const currentCoinProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);
  const nextCoinProfit = calculateCoinFlipProfit(betAmount, Math.min(maxRoundsToWin, settledCoinCount + 1));
  const coinFlipStageRef = useRef(null);
  const coinHistoryRailRef = useRef(null);

  useLayoutEffect(() => {
    const rail = coinHistoryRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [coinHistory, maxRoundsToWin]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, COIN_FLIP_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (coinProfitAnimationRef.current) {
        window.cancelAnimationFrame(coinProfitAnimationRef.current);
      }
      if (coinWinModalTimeoutRef.current) {
        window.clearTimeout(coinWinModalTimeoutRef.current);
      }
      clearCoinLossResetTimer();
    };
  }, []);

  useEffect(() => {
    selectedSideRef.current = selectedSide;
  }, [selectedSide]);

  useEffect(() => {
    const fromProfit = displayedCoinProfit;
    const toProfit = currentCoinProfit;

    if (coinProfitAnimationRef.current) {
      window.cancelAnimationFrame(coinProfitAnimationRef.current);
    }

    if (fromProfit === toProfit) return;

    const startTime = performance.now();
    const duration = 560;

    function easeOutQuart(value) {
      return 1 - Math.pow(1 - value, 4);
    }

    function animateProfit(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const easedProgress = easeOutQuart(progress);

      setDisplayedCoinProfit(fromProfit + (toProfit - fromProfit) * easedProgress);

      if (progress < 1) {
        coinProfitAnimationRef.current = window.requestAnimationFrame(animateProfit);
        return;
      }

      coinProfitAnimationRef.current = null;
    }

    coinProfitAnimationRef.current = window.requestAnimationFrame(animateProfit);
  }, [currentCoinProfit]);

  function clearCoinWinModalTimer() {
    if (coinWinModalTimeoutRef.current) {
      window.clearTimeout(coinWinModalTimeoutRef.current);
      coinWinModalTimeoutRef.current = null;
    }
  }

  function clearCoinLossResetTimer() {
    if (coinLossResetTimeoutRef.current) {
      window.clearTimeout(coinLossResetTimeoutRef.current);
      coinLossResetTimeoutRef.current = null;
    }
  }

  function resetCoinRound() {
    clearCoinLossResetTimer();
    setCoinRoundStatus("idle");
    setCoinResult(null);
    setCoinHistory([]);
    setDisplayedCoinProfit(0);
    setCoinWinModal(null);
    setCoinSide(selectedSideRef.current);
    setTossPhase("idle");
    setTapHintVisible(true);
    pendingTossRef.current = null;
    setProgressionActiveIndex(0);
    setProgressionCompletedThrough(-1);
    setProgressionLockingIndex(null);
    setProgressionLosingIndex(null);
    setProgressionLossIndex(null);
    setCoinProgressionKey((currentKey) => currentKey + 1);
  }

  function scheduleCoinLossReset(delayMs = COIN_FLIP_LOSS_RESET_MS) {
    clearCoinLossResetTimer();
    coinLossResetTimeoutRef.current = window.setTimeout(() => {
      resetCoinRound();
    }, delayMs);
  }

  const handleProgressionLockComplete = useCallback((index) => {
    setProgressionCompletedThrough(index);
    setProgressionActiveIndex(index + 1);
    setProgressionLockingIndex(null);
  }, []);

  const handleProgressionLossComplete = useCallback((index) => {
    setProgressionLossIndex(index);
    setProgressionLosingIndex(null);
    scheduleCoinLossReset(COIN_FLIP_LOSS_SEALED_HOLD_MS);
  }, []);

  function closeCoinWinModal() {
    const shouldResetRound = coinWinModalResetRef.current;

    clearCoinWinModalTimer();
    setCoinWinModal(null);
    coinWinModalResetRef.current = false;

    if (shouldResetRound) {
      resetCoinRound();
    }
  }

  function showCoinWinModal({ title, profit, multiplier, resetOnClose }) {
    coinWinModalResetRef.current = resetOnClose;
    setCoinWinModal({
      title,
      profit,
      multiplier,
      resetOnClose,
    });
    clearCoinWinModalTimer();
    coinWinModalTimeoutRef.current = window.setTimeout(closeCoinWinModal, 3000);
  }

  function handleCoinWinModalClose() {
    closeCoinWinModal();
  }

  function handleBetAction() {
    if (!canStartCoinFlip) return;

    clearCoinWinModalTimer();
    setCoinWinModal(null);
    coinWinModalResetRef.current = false;
    setCoinResult(null);
    if (!hasActiveCoinRound) {
      setCoinHistory([]);
      setCoinSide(selectedSideRef.current);
      setProgressionActiveIndex(0);
      setProgressionCompletedThrough(-1);
      setProgressionLockingIndex(null);
      setProgressionLosingIndex(null);
      setProgressionLossIndex(null);
    }
    setCoinRoundStatus("active");
    window.setTimeout(() => runCoinFlipAnimation(true), 60);
  }

  function handleCoinCashout() {
    if (isCoinFlipping || !hasActiveCoinRound || settledCoinCount <= 0) return;

    const cashoutProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);

    playSound(minesCashoutSound);
    showCoinWinModal({
      title: "Cashout Successful",
      profit: cashoutProfit,
      multiplier: currentCoinMultiplier,
      resetOnClose: true,
    });
  }

  function handleCoinSideChange(side) {
    if (isCoinFlipping) return;

    selectedSideRef.current = side;
    setSelectedSide(side);
    setCoinResult(null);
    setCoinSide(side);
  }

  function handleTossEnd() {
    const pending = pendingTossRef.current;
    if (!pending) {
      setTossPhase("idle");
      setIsCoinFlipping(false);
      setTapHintVisible(true);
      return;
    }

    const { didWin, result } = pending;
    pendingTossRef.current = null;
    const lockIndex = coinHistory.length;

    setCoinSide(result);
    setTossPhase("idle");
    setIsCoinFlipping(false);
    setTapHintVisible(true);
    setCoinResult(didWin ? "win" : "loss");
    setCoinHistory((currentHistory) => [
      ...currentHistory,
      {
        id: `${result}-${Date.now()}`,
        didWin,
        result,
      },
    ]);

    if (didWin) {
      setProgressionLockingIndex(lockIndex);
      const nextWinCount = lockIndex + 1;

      if (nextWinCount >= maxRoundsToWin) {
        const winMultiplier = calculateCoinFlipMultiplier(nextWinCount);
        const winProfit = calculateCoinFlipProfit(betAmount, nextWinCount);

        playSound(minesCashoutSound);
        showCoinWinModal({
          title: "Cashout Successful",
          profit: winProfit,
          multiplier: winMultiplier,
          resetOnClose: true,
        });
      }
    }

    if (!didWin) {
      setProgressionLosingIndex(lockIndex);
      scheduleCoinLossReset();
    }
  }

  function runCoinFlipAnimation(forceStart = false) {
    const isAllowedToFlip =
      hasCoinBetAmount &&
      coinHistory.length < maxRoundsToWin &&
      !isCoinFlipping &&
      tossPhase !== "tossing" &&
      (hasActiveCoinRound || forceStart);

    if (!isAllowedToFlip) return;

    playSound(coinFlipSound);

    const activeSelectedSide = selectedSideRef.current;
    const didWin = Math.random() < coinFlipFairProbability;
    const result = didWin ? activeSelectedSide : activeSelectedSide === "heads" ? "tails" : "heads";

    pendingTossRef.current = { didWin, result };
    setIsCoinFlipping(true);
    setCoinResult(null);
    setTapHintVisible(false);
    setTossOutcome(result);
    setTossPhase("tossing");
  }

  const flipCoin = useCallback(() => {
    if (tossPhase === "tossing" || !canFlipCoin) return;

    if (!hasActiveCoinRound) {
      clearCoinWinModalTimer();
      setCoinWinModal(null);
      coinWinModalResetRef.current = false;
      setCoinResult(null);
      setCoinHistory([]);
      setCoinRoundStatus("active");
      setProgressionActiveIndex(0);
      setProgressionCompletedThrough(-1);
      setProgressionLockingIndex(null);
      setProgressionLosingIndex(null);
      setProgressionLossIndex(null);
      runCoinFlipAnimation(true);
      return;
    }

    runCoinFlipAnimation();
  }, [canFlipCoin, hasActiveCoinRound, tossPhase]);

  return (
    <>
      <style>
        {`
          .joker-game-shell--coin-flip .joker-game-shell-empty-stage {
            position: relative;
            min-height: 0;
          }

          .joker-game-shell--coin-flip .joker-game-shell-empty-stage > .joker-coin-flip-stage {
            min-height: 0;
            height: 100%;
          }

          .joker-coin-flip-stage {
            container-type: size;
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 0;
            box-sizing: border-box;
            --coin-flip-betting-divider-offset: calc(
              var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
                var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
            );
            --coin-flip-history-inset: var(--spacing-24);
            --coin-flip-sync-history-rail-height: var(--coin-flip-betting-divider-offset);
            --coin-flip-sync-top-band-height: calc(
              var(--coin-flip-sync-history-rail-height) + var(--coin-flip-history-inset)
            );
            --coin-flip-play-native-width: 548px;
            --coin-flip-play-native-height: 500px;
            --coin-flip-play-scale-bias: 1.08;
            --coin-flip-play-scale-max: 1.32;
            --coin-flip-play-gap: var(--spacing-24);
            --coin-flip-coin-native-size: 256px;
            --coin-flip-stage-native-size: 400px;
            --coin-pull-scale-x: 1;
            --coin-pull-scale-y: 1;
            --coin-shadow-scale: 1;
            --coin-shadow-opacity: 0.28;
            padding: 0;
            overflow: visible;
            background: var(--joker-black-800);
          }

          .joker-coin-flip-main-area {
            container-type: size;
            display: flex;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            align-items: stretch;
            justify-content: flex-start;
            overflow: visible;
          }

          .joker-coin-flip-game-frame {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            max-height: 100cqh;
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 0;
            overflow: visible;
            padding: 0;
            margin-inline: auto;
          }

          .joker-coin-flip-game-frame__top {
            display: flex;
            width: 100%;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: flex-start;
            box-sizing: border-box;
            padding: var(--coin-flip-history-inset) 0 0 var(--coin-flip-history-inset);
            overflow: visible;
            background: var(--joker-black-800);
          }

          @media (min-width: 1024px) {
            .joker-coin-flip-game-frame__top {
              position: relative;
              flex: 0 0 auto;
              height: var(--coin-flip-sync-top-band-height);
              min-height: var(--coin-flip-sync-top-band-height);
              max-height: var(--coin-flip-sync-top-band-height);
              padding: var(--coin-flip-history-inset) 0 0 var(--coin-flip-history-inset);
              justify-content: flex-start;
            }

            .joker-coin-flip-history-rail {
              display: flex;
              height: auto;
              max-height: none;
              flex: 0 0 auto;
              align-items: flex-start;
              justify-content: flex-start;
              min-height: 0;
              padding: 0;
              box-sizing: border-box;
            }
          }

          .joker-coin-flip-history-rail {
            position: relative;
            z-index: 2;
            display: flex;
            width: 100%;
            min-width: 0;
            flex: 0 0 auto;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 0;
            overflow-x: auto;
            overflow-y: visible;
            scroll-behavior: smooth;
            scroll-padding-inline-end: var(--spacing-24);
            scroll-padding-inline-start: var(--spacing-24);
            scrollbar-width: none;
          }

          .joker-coin-flip-history-rail .joker-coin-progression {
            width: auto;
          }

          .joker-coin-flip-history-rail .joker-coin-progression__track {
            align-items: flex-start;
            justify-content: flex-start;
            margin: 0;
            padding: 0;
          }

          .joker-coin-flip-history-rail::-webkit-scrollbar {
            display: none;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield {
            animation: joker-coin-flip-load-coin-land 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner {
            animation: joker-coin-flip-load-ring-expand 360ms var(--ease-out) 100ms both;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__particles {
            opacity: 0;
            animation: joker-coin-flip-load-fade-in 260ms var(--ease-out) 300ms forwards;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__coin-shadow {
            animation: none;
            opacity: 0.3;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-receiver__active-fx {
            opacity: 0;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step {
            opacity: 0;
            transform: translateY(8px);
            animation: joker-coin-flip-load-progression-step 300ms var(--ease-out) var(--coin-flip-load-step-delay, 220ms) both;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(1) {
            --coin-flip-load-step-delay: 220ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(2) {
            --coin-flip-load-step-delay: 260ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(3) {
            --coin-flip-load-step-delay: 300ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(4) {
            --coin-flip-load-step-delay: 340ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(5) {
            --coin-flip-load-step-delay: 380ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(6) {
            --coin-flip-load-step-delay: 420ms;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-demo__hint {
            opacity: 0;
            animation: none;
          }

          .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__tap-target {
            pointer-events: none;
          }

          @keyframes joker-coin-flip-load-coin-land {
            0% {
              transform: translateX(-50%) translateY(-30px);
            }

            74% {
              transform: translateX(-50%) translateY(3px);
            }

            88% {
              transform: translateX(-50%) translateY(-2px);
            }

            100% {
              transform: translateX(-50%) translateY(0);
            }
          }

          @keyframes joker-coin-flip-load-ring-expand {
            from {
              opacity: 0.55;
              transform: translate(-50%, -50%) scale(0.8);
            }

            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes joker-coin-flip-load-fade-in {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes joker-coin-flip-load-progression-step {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__particles,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-demo__hint {
              animation: none;
              opacity: 1;
              transform: none;
            }

            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield {
              transform: translateX(-50%);
            }

            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
            .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner {
              transform: translate(-50%, -50%) scale(1);
            }
          }

          .joker-coin-flip-game-frame__bottom {
            display: flex;
            width: 100%;
            flex: 1 1 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            min-height: 0;
            padding-block: var(--spacing-24);
            padding-inline: var(--spacing-24);
            box-sizing: border-box;
          }

          .joker-coin-flip-play-stack {
            display: flex;
            width: 100%;
            flex: 1 1 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 0;
            margin-inline: auto;
            container-type: size;
            container-name: coin-flip-play;
          }

          .joker-coin-flip-play {
            position: relative;
            z-index: 2;
            display: flex;
            flex: 0 0 auto;
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
            align-items: center;
            justify-content: center;
            overflow: visible;
            padding-inline: var(--spacing-12);
          }

          .joker-coin-flip-play-inner {
            display: flex;
            width: var(--coin-flip-play-native-width);
            height: var(--coin-flip-play-native-height);
            box-sizing: border-box;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            transform-origin: center center;
            --coin-size: var(--coin-flip-coin-native-size);
            --coin-toss-stage-size: var(--coin-flip-stage-native-size);
          }

          @media (min-width: 1024px) {
            .joker-coin-flip-play-stack {
              width: 100%;
              max-width: 900px;
            }

            .joker-coin-flip-play-inner {
              --coin-flip-play-scale: min(
                calc((100cqw - (2 * var(--coin-flip-play-gap))) / var(--coin-flip-play-native-width)),
                calc((100cqh - var(--coin-flip-play-gap)) / var(--coin-flip-play-native-height)),
                var(--coin-flip-play-scale-max)
              );
              --coin-flip-play-scale: max(
                0.55,
                calc(var(--coin-flip-play-scale) * var(--coin-flip-play-scale-bias))
              );
              transform: scale(var(--coin-flip-play-scale));
            }
          }

          .joker-coin-flip-coin-stage {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            overflow: visible;
          }

          .joker-coin-flip-coin-zone {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
          }

          .joker-coin-flip-result-card {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: grid;
            place-items: center;
            padding: var(--spacing-24);
            pointer-events: auto;
            transform: scale(0.96);
            animation: joker-coin-flip-result-pop 420ms var(--ease-standard) both;
          }

          .joker-coin-flip-result-card > * {
            max-width: min(500px, calc(100% - var(--spacing-48)));
            box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
          }

          @keyframes joker-coin-flip-result-pop {
            0% {
              opacity: 0;
              transform: translateY(var(--spacing-24)) scale(0.86);
            }

            48% {
              opacity: 1;
              transform: translateY(calc(var(--spacing-4) * -1)) scale(1.06);
            }

            72% {
              opacity: 1;
              transform: translateY(var(--spacing-2, 2px)) scale(0.98);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .joker-coin-flip-betting-panel.is-coin-flipping {
            pointer-events: none;
            opacity: 0.72;
            transition: opacity 220ms ease;
          }

          .joker-coin-flip-betting-panel.is-round-locked .joker-rounds-to-win-field,
          .joker-coin-flip-betting-panel.is-round-locked .joker-bet-field {
            opacity: 0.45;
            pointer-events: none;
            transition: opacity 220ms ease;
          }

          .joker-coin-flip-betting-panel.is-round-locked .joker-rounds-to-win-option,
          .joker-coin-flip-betting-panel.is-round-locked .joker-bet-amount-stepper-button {
            cursor: not-allowed;
          }

          .joker-jkc-amount {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            vertical-align: middle;
          }

          .joker-jkc-amount__icon {
            display: block;
            width: 14px;
            height: 14px;
            flex: 0 0 auto;
          }

          .joker-jkc-amount__icon--mask {
            background-color: currentColor;
            -webkit-mask-size: contain;
            mask-size: contain;
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
          }

          .joker-jkc-amount__value {
            color: inherit;
            font-size: inherit;
            font-weight: inherit;
            line-height: inherit;
          }

          @media (max-width: 1023px) {
            .joker-coin-flip-stage {
              --coin-flip-mobile-odds-reserve: 80px;
              --coin-flip-mobile-play-scale-bias: 0.9;
              --coin-flip-play-native-width: 360px;
              --coin-flip-play-native-height: 400px;
              --coin-flip-coin-native-size: 208px;
              --coin-flip-stage-native-size: 320px;
            }

            .joker-game-shell--coin-flip .joker-coin-flip-betting-panel.is-mobile .joker-odds-button-group-field {
              display: none;
            }

            .joker-coin-flip-game-frame {
              position: relative;
              min-height: 0;
            }

            .joker-coin-flip-game-frame__bottom {
              flex: 1 1 auto;
              justify-content: flex-start;
              min-height: 0;
              padding-block: var(--spacing-12) calc(var(--spacing-24) + var(--coin-flip-mobile-odds-reserve));
            }

            .joker-coin-flip-play-stack {
              flex: 1 1 auto;
              justify-content: center;
              min-height: 0;
              padding-bottom: var(--spacing-8);
            }

            .joker-coin-flip-play {
              flex: 1 1 auto;
              min-height: 0;
              align-items: center;
              justify-content: center;
            }

            .joker-coin-flip-play-inner {
              width: var(--coin-flip-play-native-width);
              height: var(--coin-flip-play-native-height);
              --coin-flip-play-scale: min(
                calc(100cqw / var(--coin-flip-play-native-width)),
                calc((100cqh - var(--coin-flip-mobile-odds-reserve)) / var(--coin-flip-play-native-height)),
                1
              );
              --coin-flip-play-scale: max(
                0.48,
                calc(var(--coin-flip-play-scale) * var(--coin-flip-mobile-play-scale-bias))
              );
              transform: scale(var(--coin-flip-play-scale));
            }

            .joker-coin-flip-mobile-odds {
              position: absolute;
              left: var(--spacing-24);
              right: var(--spacing-24);
              bottom: var(--spacing-24);
              z-index: 4;
              pointer-events: auto;
            }

            .joker-coin-flip-mobile-odds .joker-odds-button-group.is-inline {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: var(--spacing-8);
            }
          }

          @media (max-width: 760px) {
            .joker-coin-flip-stage {
              --coin-flip-mobile-odds-reserve: 84px;
              --coin-flip-mobile-play-scale-bias: 0.84;
              --coin-flip-play-native-width: 320px;
              --coin-flip-play-native-height: 360px;
              --coin-flip-coin-native-size: 184px;
              --coin-flip-stage-native-size: 288px;
            }

            .joker-coin-flip-play-inner {
              width: var(--coin-flip-play-native-width);
              height: var(--coin-flip-play-native-height);
            }
          }

          ${GAME_ROUND_END_STYLES}
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--coin-flip"
        defaultValue={coinFlipNavigationPreset.defaultValue}
        game={coinFlipNavigationPreset.game}
        onValueChange={onGameChange}
        value={coinFlipNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCoinFlipBettingPanel
            betAmount={betAmount}
            inGame={hasActiveCoinRound}
            isFlipping={isCoinFlipping}
            layout={bettingPanelLayout}
            onBetAmountChange={setBetAmount}
            onCashout={handleCoinCashout}
            onFlipCoin={flipCoin}
            onPlaceBet={handleBetAction}
            onSideChange={handleCoinSideChange}
            onRoundsToWinChange={setRoundsToWin}
            oddsOptions={getCoinFlipOddsOptions(betAmount, roundsToWin)}
            roundLocked={isRoundLocked}
            roundsToWinValue={roundsToWin}
            defaultRoundsToWinValue="4"
            selectedSide={selectedSide}
          />
        }
      >
        <section className="joker-coin-flip-stage" aria-label="Coin Flip game board">
          <div className="joker-coin-flip-main-area">
            <div
              ref={coinFlipStageRef}
              className={[
                "joker-coin-flip-game-frame",
                "joker-game-round-end-canvas",
                isPageLoadEnter ? "is-page-load-enter" : "",
                coinResult === "loss" ? "is-round-ending" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label="Coin Flip game area"
            >
              <div className="joker-coin-flip-game-frame__top">
                <div
                  className="joker-coin-flip-history-rail"
                  aria-label="Coin Flip preview history"
                  ref={coinHistoryRailRef}
                >
                  <CoinProgression
                    key={coinProgressionKey}
                    steps={coinProgressionSteps}
                    activeIndex={progressionActiveIndex}
                    completedThrough={progressionCompletedThrough}
                    lockingIndex={progressionLockingIndex}
                    losingIndex={progressionLosingIndex}
                    lossIndex={progressionLossIndex}
                    receiverSize={COIN_FLIP_PROGRESSION_RECEIVER_SIZE}
                    onLockComplete={handleProgressionLockComplete}
                    onLossComplete={handleProgressionLossComplete}
                    renderCoin={(index) => {
                      const historyItem = coinHistory[index];
                      const isLossSlot =
                        progressionLosingIndex === index || progressionLossIndex === index;
                      if (!historyItem && !isLossSlot) return null;
                      return (
                        <Coin
                          side={historyItem?.result ?? coinSide}
                          style={{ "--coin-size": `${COIN_FLIP_PROGRESSION_COIN_SIZE}px` }}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <div className="joker-coin-flip-game-frame__bottom">
                <div className="joker-coin-flip-play-stack">
                  <div className="joker-coin-flip-play">
                    <div className="joker-coin-flip-play-inner">
                      <div className="joker-coin-flip-coin-stage">
                        <div className="joker-coin-flip-coin-zone">
                          <button
                            type="button"
                            className="joker-coin-toss__tap-target"
                            onClick={flipCoin}
                            disabled={!canFlipCoin || tossPhase === "tossing"}
                            aria-label="Flip coin"
                          >
                            <Coin
                              side={coinSide}
                              tossPhase={tossPhase}
                              tossOutcome={tossOutcome}
                              onTossEnd={handleTossEnd}
                              tapHint="tap to flip"
                              tapHintVisible={tapHintVisible && canFlipCoin && !isPageLoadEnter}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {bettingPanelLayout === "mobile" && (
                <div className="joker-coin-flip-mobile-odds">
                  <MobileOddsGroup
                    options={getCoinFlipOddsOptions(betAmount, roundsToWin)}
                    value={hasCoinBetAmount ? selectedSide : ""}
                    onValueChange={(value) => handleCoinSideChange(value)}
                    disabled={!hasCoinBetAmount || isCoinFlipping}
                  />
                </div>
              )}
              <GameRoundEndTransition
                active={coinResult === "loss"}
                animationKey={`coin-loss-${coinHistory.length}`}
              />
              {coinWinModal && (
                <div className="joker-coin-flip-result-card" role="status" aria-live="polite">
                  <WinModalCard
                    title={coinWinModal.title}
                    amountWon={`+${formatJkcAmount(coinWinModal.profit)}`}
                    currency={null}
                    message="Your winnings from this round have been added to your balance."
                    closeLabel="Close"
                    onClose={handleCoinWinModalClose}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </GameShell>
    </>
  );
}

function CocoHutPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [balance] = useState(150000);
  const [difficulty, setDifficulty] = useState("tourist");
  const bettingPanelLayout = useGameShellBettingPanelLayout();

  function handleBetAction() {
    // Coco Hut gameplay will be wired here without touching the other games.
  }

  return (
    <>
      <style>
        {`
          .joker-coco-hut-stage {
            min-height: 100%;
            background:
              linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.16)),
              url("${cocoHutBackground}") center / cover no-repeat;
          }
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--coco-hut"
        defaultValue={cocoHutNavigationPreset.defaultValue}
        game={cocoHutNavigationPreset.game}
        onValueChange={onGameChange}
        value={cocoHutNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCocoHutBettingPanel
            betAmount={betAmount}
            difficulty={difficulty}
            layout={bettingPanelLayout}
            onBetAmountChange={setBetAmount}
            onDifficultyChange={setDifficulty}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <section className="joker-coco-hut-stage" aria-label="Coco Hut game area" />
      </GameShell>
    </>
  );
}

const HILO_PAGE_LOAD_ANIMATION_MS = 480;
const HILO_PAGE_LOAD_CHIP_STAGGER_MS = 50;

function HiloStage({
  bettingPanelLayout = "desktop",
  cardsRemaining = 0,
  currentCard,
  hasBetAmount = false,
  higherMultiplier,
  higherOdds,
  history,
  lowerMultiplier,
  lowerOdds,
  onHigherSame,
  onLowerSame,
  onSkipCard,
  onWinModalClose,
  onWinCoinsLand,
  pendingPrediction,
  roundStatus,
  skipAvailable,
  winModal,
}) {
  const cardTotal =
    roundStatus === "pre-game" ? hiloRanks.length * hiloSuits.length : history.length + cardsRemaining;
  const choiceInteractive =
    roundStatus === "active" || (roundStatus === "pre-game" && hasBetAmount);
  const historyRailRef = useRef(null);
  const historyLengthRef = useRef(history.length);
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);
  const [enteringHistoryIndex, setEnteringHistoryIndex] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, HILO_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPageLoadEnter) {
      historyLengthRef.current = history.length;
      return;
    }

    if (history.length <= historyLengthRef.current) {
      historyLengthRef.current = history.length;
      return;
    }

    const nextIndex = history.length - 1;
    historyLengthRef.current = history.length;
    setEnteringHistoryIndex(nextIndex);

    const timer = window.setTimeout(() => {
      setEnteringHistoryIndex((currentIndex) => (currentIndex === nextIndex ? null : currentIndex));
    }, 600);

    return () => window.clearTimeout(timer);
  }, [history.length, isPageLoadEnter]);

  useLayoutEffect(() => {
    const rail = historyRailRef.current;
    if (!rail) {
      return;
    }

    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.scrollLeft = maxScrollLeft;
  }, [history]);

  return (
    <section className="joker-hilo-stage" aria-label="Hilo game board">
      <div className="joker-hilo-main-area">
        <div
          className={[
            "joker-hilo-game-frame",
            "joker-game-round-end-canvas",
            isPageLoadEnter ? "is-page-load-enter" : "",
            roundStatus === "loss" ? "is-round-ending" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Hilo game area"
        >
          <div className="joker-hilo-game-frame__top">
            <div
              className="joker-hilo-history-rail"
              aria-label="Previous cards"
              ref={historyRailRef}
            >
              <div className="joker-hilo-history-track">
                {history.map((card, index) => (
                  <HiloHistoryEntry
                    card={card}
                    chipIndex={index}
                    className={enteringHistoryIndex === index ? "is-latest" : ""}
                    isPageLoadEnter={isPageLoadEnter}
                    key={`${card.id}-${index}`}
                  />
                ))}
              </div>
            </div>
            <span className="joker-betting-divider" aria-hidden="true" />
          </div>
          <div className="joker-hilo-game-frame__bottom">
            <div className="joker-hilo-game-frame__play-stack">
              <div className="joker-hilo-game-frame__play">
                <div className="joker-hilo-game-frame__play-inner">
                <HiloChoiceCard
                  Card={LowerCard}
                  className="joker-hilo-prediction-group--lower"
                  disabled={!choiceInteractive}
                  multiplier={lowerMultiplier}
                  onClick={onLowerSame}
                  selected={pendingPrediction === "lower"}
                  support="Ace = lowest"
                />
                <div className="joker-hilo-main-card-column">
                  <HiloMainCard
                    card={currentCard}
                    key={currentCard.id}
                    onSkipCard={onSkipCard}
                    showSkipButton={
                      bettingPanelLayout === "mobile" || (roundStatus === "active" && skipAvailable)
                    }
                    skipDisabled={
                      roundStatus === "pre-game" ? false : roundStatus !== "active" || !skipAvailable
                    }
                  >
                    <p className="joker-hilo-game-frame__status">
                      CARD <strong>{history.length}</strong> OF <strong>{cardTotal}</strong>
                    </p>
                  </HiloMainCard>
                </div>
                <HiloChoiceCard
                  Card={HigherCard}
                  className="joker-hilo-prediction-group--higher"
                  disabled={!choiceInteractive}
                  multiplier={higherMultiplier}
                  onClick={onHigherSame}
                  selected={pendingPrediction === "higher"}
                  support="King = highest"
                />
                </div>
              </div>
            </div>
          </div>
          {bettingPanelLayout === "mobile" && (
            <div className="joker-hilo-mobile-odds">
              <MobileHiLoOddsGroup
                key={`hilo-mobile-odds-${history.length}`}
                disabled={!choiceInteractive}
                lowerOdds={lowerOdds}
                higherOdds={higherOdds}
                onLowerSame={onLowerSame}
                onHigherSame={onHigherSame}
                value={pendingPrediction}
              />
            </div>
          )}
          <GameRoundEndTransition
            active={roundStatus === "loss"}
            animationKey={`hilo-loss-${history.length}`}
          />
        </div>
      </div>
      {winModal && (
        <div className="joker-hilo-result-card" role="status" aria-live="polite">
          <WinModalCard
            title={winModal.title}
            amountWon={formatCurrency(winModal.profit)}
            currency={null}
            message="Your winnings from this round have been added to your balance."
            closeLabel="Close"
            onCoinsLand={onWinCoinsLand}
            onClose={onWinModalClose}
          />
        </div>
      )}
    </section>
  );
}

function HiloMainCard({ card, children, onSkipCard, showSkipButton, skipDisabled }) {
  return (
    <div className="joker-hilo-main-card-wrap">
      {showSkipButton && (
        <div className="joker-hilo-main-card-skip-slot">
          <div className="joker-hilo-main-card-skip-scale">
            <SkipButton
              aria-label="Skip Card"
              className="joker-hilo-main-card-skip"
              disabled={skipDisabled}
              onClick={onSkipCard}
            />
          </div>
        </div>
      )}
      <div className="joker-hilo-main-card-stack-slot">
        <HiloMainCardGlow className="joker-hilo-main-card-glow" />
        <div className="joker-hilo-main-card-scale">
          <div className="joker-hilo-main-card-anchor">
            <GameCardStack
              aria-label={`${card.rank} of ${card.suit}`}
              className="joker-hilo-main-card-stack"
            >
              <GameCardFace color={card.tone} rank={card.rank} suit={card.suit} />
            </GameCardStack>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatHiloChoiceMultiplier(value) {
  return `X${value.toFixed(2)}`;
}

function HiloChoiceCard({ Card, className = "", disabled, multiplier, onClick, selected = false, support }) {
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

function HiloHistoryEntry({ card, chipIndex = 0, className = "", isPageLoadEnter = false }) {
  const chipVariant = getHiloHistoryChipVariant(card.chipTone);
  const chipLabel = chipVariant === "start" || chipVariant === "skip" ? undefined : card.chip;
  const loadStyle = isPageLoadEnter
    ? {
        "--hilo-load-chip-delay": `${200 + chipIndex * HILO_PAGE_LOAD_CHIP_STAGGER_MS}ms`,
      }
    : undefined;

  return (
    <div
      className={["joker-hilo-history-entry", className].filter(Boolean).join(" ")}
      style={loadStyle}
    >
      <Chip className="joker-hilo-history-chip" variant={chipVariant}>
        {chipLabel}
      </Chip>
      <div className="joker-hilo-history-card-wrap">
        <GameCardMini
          aria-label={`${card.rank} of ${card.suit}`}
          className="joker-hilo-mini-card"
        >
          <GameCardMiniFace color={card.tone} rank={card.rank} suit={card.suit} />
        </GameCardMini>
        {card.next ? (
          <HiLoEllipseButton
            aria-hidden="true"
            className="joker-hilo-history-connector"
            disabled
            tabIndex={-1}
            type="button"
            variant={getHiloHistoryConnectorVariant(card.next)}
          />
        ) : null}
      </div>
    </div>
  );
}

function MinesBoardTile({
  blockedByShield,
  cellStyle,
  freshReveal,
  gameActive,
  multiplier,
  onClick,
  revealed,
  stackIndex,
  tile,
  tileContent,
}) {
  const [showRevealed, setShowRevealed] = useState(revealed && !freshReveal);

  useEffect(() => {
    if (!revealed) {
      setShowRevealed(false);
      return;
    }

    if (freshReveal) {
      setShowRevealed(false);
      const frameId = window.requestAnimationFrame(() => {
        setShowRevealed(true);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setShowRevealed(true);
  }, [freshReveal, revealed]);

  const cellClassName = [
    "joker-mines-grid-cell",
    revealed ? "is-revealed" : "",
    freshReveal ? "is-fresh-reveal" : "",
    blockedByShield ? "is-shield-blocked" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const tileClassName = "joker-mines-grid-tile";

  if (!revealed) {
    return (
      <div className={cellClassName} style={cellStyle}>
        <MinesTile
          aria-hidden={false}
          aria-label={`Reveal tile ${tile}`}
          className={tileClassName}
          onClick={gameActive ? onClick : undefined}
          playClickSound={tileContent === "gold"}
          role="button"
          selected={gameActive}
          stackIndex={stackIndex}
          tabIndex={gameActive ? 0 : -1}
        />
      </div>
    );
  }

  const revealProps = {
    "aria-hidden": false,
    "aria-label": `Tile ${tile}: ${tileContent}`,
    className: tileClassName,
    defaultRevealed: false,
    revealed: showRevealed,
    stackIndex,
  };

  let tileNode;
  if (tileContent === "gold") {
    tileNode = (
      <WinTile
        {...revealProps}
        multiplier={freshReveal ? `${multiplier.toFixed(2)}x` : undefined}
      />
    );
  } else if (tileContent === "dynamite") {
    tileNode = <LossTile {...revealProps} soundOnReveal={!blockedByShield} />;
  } else {
    tileNode = <SafeTile {...revealProps} />;
  }

  return (
    <div className={cellClassName} style={cellStyle}>
      {tileNode}
      {blockedByShield ? (
        <span className="joker-mines-shield-badge" aria-hidden="true">
          <img src={shieldIcon} alt="" />
        </span>
      ) : null}
    </div>
  );
}

function MinesGrid({
  board,
  cashoutResult,
  columns,
  freshRevealedTiles,
  lossResult,
  multiplier,
  onResultClose,
  onWinCoinsLand,
  onTileClick,
  revealedTiles,
  roundStatus,
  rows,
  tiles,
}) {
  const gameActive = roundStatus === "active";
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, MINES_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="joker-mines-stage" aria-label="Mines game board">
      <div
        className={[
          "joker-mines-board-area",
          "joker-game-round-end-canvas",
          isPageLoadEnter ? "is-page-load-enter" : "",
          roundStatus === "lost" ? "is-round-ending" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--mines-grid-columns": columns,
          "--mines-grid-rows": rows,
        }}
      >
        <div
          className={[
            "joker-mines-grid",
            gameActive ? "is-round-active" : "",
            roundStatus === "lost" ? "is-round-lost" : "",
            isPageLoadEnter ? "is-page-load-enter" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tiles.map((tile, index) => {
            const revealed = revealedTiles.includes(tile);
            const freshReveal = freshRevealedTiles.includes(tile);
            const tileData = board[index];
            const tileContent = getTileContent(tileData);
            const blockedByShield = Boolean(tileData?.blockedByShield);
            const rowIndex = Math.floor(index / columns);
            const cellStyle = isPageLoadEnter
              ? {
                  "--mines-load-row-delay": `${MINES_PAGE_LOAD_ROW_BASE_DELAY_MS + rowIndex * MINES_PAGE_LOAD_ROW_STAGGER_MS}ms`,
                }
              : undefined;

            return (
              <MinesBoardTile
                key={tile}
                blockedByShield={blockedByShield}
                cellStyle={cellStyle}
                freshReveal={freshReveal}
                gameActive={gameActive}
                multiplier={multiplier}
                onClick={() => onTileClick(tile)}
                revealed={revealed}
                stackIndex={tiles.length - index}
                tile={tile}
                tileContent={tileContent}
              />
            );
          })}
        </div>
        <GameRoundEndTransition
          active={roundStatus === "lost"}
          animationKey={`mines-loss-${revealedTiles.join("-")}`}
        />
        {cashoutResult && (
          <div className="joker-mines-result-card" role="status" aria-live="polite">
            <WinModalCard
              title="Cashout Successful"
              amountWon={formatCurrency(cashoutResult.profit)}
              currency={null}
              message="Your winnings from this round have been added to your balance."
              closeLabel="Close"
              onCoinsLand={onWinCoinsLand}
              onClose={onResultClose}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function FourDMinesBoardTile({
  cellStyle,
  freshReveal,
  gameActive,
  multiplier,
  onClick,
  playerFourDNumber,
  revealed,
  stackIndex,
  tile,
  tileData,
}) {
  const [showRevealed, setShowRevealed] = useState(revealed && !freshReveal);
  const tileContent = getFourDTileContent(tileData);
  const tileClassName = "joker-mines-grid-tile";

  useEffect(() => {
    if (!revealed) {
      setShowRevealed(false);
      return;
    }

    if (freshReveal) {
      setShowRevealed(false);
      const frameId = window.requestAnimationFrame(() => {
        setShowRevealed(true);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setShowRevealed(true);
  }, [freshReveal, revealed]);

  const cellClassName = [
    "joker-mines-grid-cell",
    revealed ? "is-revealed" : "",
    freshReveal ? "is-fresh-reveal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!revealed) {
    return (
      <div className={cellClassName} style={cellStyle}>
        <FourDMinesTile
          aria-hidden={false}
          aria-label={`Reveal tile ${tile}`}
          className={tileClassName}
          onClick={gameActive ? onClick : undefined}
          role="button"
          selected={gameActive}
          stackIndex={stackIndex}
          tabIndex={gameActive ? 0 : -1}
        />
      </div>
    );
  }

  const revealProps = {
    "aria-hidden": false,
    "aria-label": `Tile ${tile}: ${tileContent}`,
    className: tileClassName,
    defaultRevealed: false,
    revealed: showRevealed,
    stackIndex,
  };

  let tileNode;
  if (tileContent === "dynamite") {
    tileNode = <LossTile {...revealProps} soundOnReveal />;
  } else if (tileContent === "win") {
    const tileNumber = tileData?.fourDNumber ?? "0000";
    const isPermutationMatch = isFourDNumberPermutationMatch(tileNumber, playerFourDNumber);

    tileNode = (
      <FourDMinesWinTile
        {...revealProps}
        number={playerFourDNumber || tileNumber}
        displayNumber={tileNumber}
        multiplier={
          freshReveal && isPermutationMatch ? `${multiplier.toFixed(2)}x` : undefined
        }
      />
    );
  } else {
    tileNode = <SafeTile {...revealProps} />;
  }

  return (
    <div className={cellClassName} style={cellStyle}>
      {tileNode}
    </div>
  );
}

function FourDMinesGrid({
  board,
  cashoutResult,
  columns,
  freshRevealedTiles,
  lossResult,
  multiplier,
  onResultClose,
  onWinCoinsLand,
  onTileClick,
  playerFourDNumber,
  revealedTiles,
  roundStatus,
  rows,
  tiles,
}) {
  const gameActive = roundStatus === "active";
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, MINES_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="joker-mines-stage" aria-label="4D Mines game board">
      <div
        className={[
          "joker-mines-board-area",
          "joker-game-round-end-canvas",
          isPageLoadEnter ? "is-page-load-enter" : "",
          roundStatus === "lost" ? "is-round-ending" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--mines-grid-columns": columns,
          "--mines-grid-rows": rows,
        }}
      >
        <div
          className={[
            "joker-mines-grid",
            gameActive ? "is-round-active" : "",
            roundStatus === "lost" ? "is-round-lost" : "",
            isPageLoadEnter ? "is-page-load-enter" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tiles.map((tile, index) => {
            const revealed = revealedTiles.includes(tile);
            const freshReveal = freshRevealedTiles.includes(tile);
            const tileData = board[index];
            const rowIndex = Math.floor(index / columns);
            const cellStyle = isPageLoadEnter
              ? {
                  "--mines-load-row-delay": `${MINES_PAGE_LOAD_ROW_BASE_DELAY_MS + rowIndex * MINES_PAGE_LOAD_ROW_STAGGER_MS}ms`,
                }
              : undefined;

            return (
              <FourDMinesBoardTile
                key={tile}
                cellStyle={cellStyle}
                freshReveal={freshReveal}
                gameActive={gameActive}
                multiplier={multiplier}
                onClick={() => onTileClick(tile)}
                playerFourDNumber={playerFourDNumber}
                revealed={revealed}
                stackIndex={tiles.length - index}
                tile={tile}
                tileData={tileData}
              />
            );
          })}
        </div>
        <GameRoundEndTransition
          active={roundStatus === "lost"}
          animationKey={`4d-mines-loss-${revealedTiles.join("-")}`}
        />
        {cashoutResult && (
          <div className="joker-mines-result-card" role="status" aria-live="polite">
            <WinModalCard
              title="Cashout Successful"
              amountWon={formatCurrency(cashoutResult.profit)}
              currency={null}
              message="Your winnings from this round have been added to your balance."
              closeLabel="Close"
              onCoinsLand={onWinCoinsLand}
              onClose={onResultClose}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function PackagedMinesBettingPanel({
  betAmount,
  bettingMode,
  currentProfit,
  gameInPlay,
  layout = "desktop",
  maxTileAmount,
  mines,
  minesAmountOptions,
  multiplier,
  nextMultiplier,
  nextProfit,
  onBetAmountChange,
  onMinesChange,
  onModeChange,
  onPlaceBet,
}) {
  const [numberOfBets, setNumberOfBets] = useState("");

  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  function handleMinesAmountChange(nextValue) {
    onMinesChange(String(clampTileAmount(nextValue, maxTileAmount)));
  }

  function handleNumberOfBetsChange(event) {
    setNumberOfBets(event.currentTarget.value.replace(/\D/g, ""));
  }

  return (
    <MinesBettingPanel
      layout={layout}
      mode={bettingMode}
      onModeChange={onModeChange}
      onPlaceBet={onPlaceBet}
      onCashout={onPlaceBet}
      inGame={gameInPlay}
      cashoutLabel="Cashout"
      inGameCardProps={{
        currentProfit: formatCurrency(currentProfit),
        nextValue: formatCurrency(nextProfit),
        currentMultiplier: `${multiplier.toFixed(2)}x`,
        nextMultiplier: `${nextMultiplier.toFixed(2)}x`,
      }}
      betAmount={betAmount}
      onBetAmountChange={handleBetAmountChange}
      disablePlaceBetUntilBetAmount
      minesAmountOptions={minesAmountOptions}
      defaultMinesAmount={String(minTileAmount)}
      minesAmount={mines}
      onMinesAmountChange={handleMinesAmountChange}
      numberOfBets={numberOfBets}
      onNumberOfBetsChange={handleNumberOfBetsChange}
    />
  );
}

function PackagedFourDMinesBettingPanel({
  betAmount,
  currentProfit,
  gameInPlay,
  layout = "desktop",
  mines,
  minesAmountOptions,
  multiplier,
  nextMultiplier,
  nextProfit,
  onBetAmountChange,
  onFourDNumberChange,
  onMinesChange,
  onPlaceBet,
}) {
  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  function handleMinesAmountChange(nextValue) {
    onMinesChange(String(clampFourDMinesAmount(nextValue)));
  }

  function handleFourDNumberChange(nextValue) {
    onFourDNumberChange(normalizeFourDNumber(nextValue));
  }

  return (
    <FourDMinesBettingPanel
      layout={layout}
      onPlaceBet={onPlaceBet}
      onCashout={onPlaceBet}
      inGame={gameInPlay}
      cashoutLabel="Cashout"
      inGameCardProps={{
        currentProfit: formatCurrency(currentProfit),
        nextValue: formatCurrency(nextProfit),
        currentMultiplier: `${multiplier.toFixed(2)}x`,
        nextMultiplier: `${nextMultiplier.toFixed(2)}x`,
      }}
      betAmount={betAmount}
      onBetAmountChange={handleBetAmountChange}
      disablePlaceBetUntilBetAmount
      minesAmountOptions={minesAmountOptions}
      defaultMinesAmount={String(minFourDMinesAmount)}
      minesAmount={mines}
      onMinesAmountChange={handleMinesAmountChange}
      onFourDNumberChange={handleFourDNumberChange}
    />
  );
}

function PackagedHiloBettingPanel({
  awaitingHiloChoice = false,
  betAmount,
  gameInPlay,
  hasBetAmount = false,
  higherOdds,
  layout = "desktop",
  lowerOdds,
  onBetAmountChange,
  onCashout,
  onHigherSame,
  onLowerSame,
  onPlaceBet,
  onSkipCard,
  selectedOddsValue,
  skipAvailable,
}) {
  const isMobileLayout = layout === "mobile";

  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  const panelClassName = [
    gameInPlay ? "" : "is-hilo-pre-game",
    !gameInPlay && hasBetAmount ? "is-hilo-pre-game-ready" : "",
    awaitingHiloChoice ? "is-awaiting-hilo-choice" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <JokerHiLoBettingPanel
      layout={layout}
      betAmount={betAmount}
      className={panelClassName}
      onBetAmountChange={handleBetAmountChange}
      onPlaceBet={onPlaceBet}
      onCashout={onCashout}
      onLowerSame={onLowerSame}
      onHigherSame={onHigherSame}
      onSkipCard={!isMobileLayout && gameInPlay && skipAvailable ? onSkipCard : undefined}
      inGame={gameInPlay}
      cashoutLabel="Cashout"
      lowerLabel="Lower / Same"
      higherLabel="Higher / Same"
      lowerOdds={lowerOdds}
      higherOdds={higherOdds}
      selectedOddsValue={selectedOddsValue}
      skipLabel={skipAvailable ? "Skip Card" : "Skip Used"}
      disablePlaceBetUntilBetAmount
    />
  );
}

function PackagedCrashBettingPanel({
  betAmount,
  bettingMode,
  gameInPlay,
  layout = "desktop",
  numberOfBets,
  onBetAmountChange,
  onModeChange,
  onNumberOfBetsChange,
  onPlaceBet,
}) {
  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  function handleNumberOfBetsChange(event) {
    onNumberOfBetsChange(event.currentTarget.value.replace(/\D/g, ""));
  }

  return (
    <JokerCrashBettingPanel
      layout={layout}
      className={gameInPlay ? "is-crash-active" : ""}
      mode={bettingMode}
      onModeChange={onModeChange}
      onPlaceBet={onPlaceBet}
      betAmount={betAmount}
      onBetAmountChange={handleBetAmountChange}
      numberOfBets={numberOfBets}
      onNumberOfBetsChange={handleNumberOfBetsChange}
      disablePlaceBetUntilBetAmount
    />
  );
}

function PackagedCoinFlipBettingPanel({
  betAmount,
  inGame = false,
  isFlipping,
  layout = "desktop",
  oddsOptions,
  onBetAmountChange,
  onCashout,
  onFlipCoin,
  onPlaceBet,
  onRoundsToWinChange,
  onSideChange,
  roundLocked = false,
  roundsToWinValue,
  defaultRoundsToWinValue = "4",
  selectedSide,
}) {
  function handleBetAmountChange(event) {
    if (roundLocked) return;

    onBetAmountChange(event.currentTarget.value.replace(/\D/g, ""));
  }

  function handleOddsValueChange(value, option) {
    if (isFlipping) return;

    onSideChange(value, option);
  }

  function handleRoundsToWinChange(value, option) {
    if (roundLocked) return;

    onRoundsToWinChange?.(value, option);
  }

  function handlePlaceBet(event) {
    if (isFlipping) return;

    onPlaceBet(event);
  }

  function handleFlipCoin(event) {
    if (isFlipping) return;

    onFlipCoin(event);
  }

  function handleCashout(event) {
    if (isFlipping) return;

    onCashout(event);
  }

  return (
    <JokerCoinFlipBettingPanel
      layout={layout}
      className={[isFlipping ? "is-coin-flipping" : "", roundLocked ? "is-round-locked" : ""]
        .filter(Boolean)
        .join(" ")}
      betAmount={betAmount}
      inGame={inGame}
      selectedOddsValue={selectedSide}
      defaultSelectedOddsValue="heads"
      onBetAmountChange={handleBetAmountChange}
      onOddsValueChange={handleOddsValueChange}
      onPlaceBet={inGame ? handleFlipCoin : handlePlaceBet}
      onCashout={handleCashout}
      onRoundsToWinChange={handleRoundsToWinChange}
      oddsOptions={oddsOptions}
      roundsToWinValue={roundsToWinValue}
      defaultRoundsToWinValue={defaultRoundsToWinValue}
      submitLabel="Flip Coin"
      flipCoinLabel="Flip Coin"
      cashoutLabel="Cashout"
      disablePlaceBetUntilBetAmount
    />
  );
}

function PackagedCocoHutBettingPanel({
  betAmount,
  difficulty,
  layout = "desktop",
  onBetAmountChange,
  onDifficultyChange,
  onPlaceBet,
}) {
  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  return (
    <JokerCocoHutBettingPanel
      layout={layout}
      betAmount={betAmount}
      difficulty={difficulty}
      onBetAmountChange={handleBetAmountChange}
      onDifficultyChange={onDifficultyChange}
      onPlaceBet={onPlaceBet}
      disablePlaceBetUntilBetAmount
    />
  );
}

function PackagedRouletteBettingPanel({
  betAmount,
  inGame = false,
  isSpinning = false,
  layout = "desktop",
  oddsOptions,
  onBetAmountChange,
  onCashout,
  onOddsChange,
  onPlaceBet,
  selectedOdds,
}) {
  function handleBetAmountChange(event) {
    if (inGame || isSpinning) return;

    onBetAmountChange(event.currentTarget.value.replace(/\D/g, ""));
  }

  function handleOddsChange(value, option) {
    if (isSpinning) return;

    onOddsChange?.(value, option);
  }

  function handlePlaceBet(event) {
    if (isSpinning) return;

    onPlaceBet?.(event);
  }

  function handleCashout(event) {
    if (isSpinning) return;

    onCashout?.(event);
  }

  return (
    <JokerRouletteBettingPanel
      layout={layout}
      betAmount={betAmount}
      selectedOddsValue={selectedOdds}
      defaultSelectedOddsValue="red"
      onBetAmountChange={handleBetAmountChange}
      onOddsValueChange={handleOddsChange}
      onPlaceBet={handlePlaceBet}
      onCashout={handleCashout}
      oddsOptions={oddsOptions}
      oddsLayout="stacked"
      showOdds
      inGame={inGame}
      disablePlaceBetUntilBetAmount
    />
  );
}
