import { hiloRanks, hiloSuits } from "./hiloConfig.js";

export function createHiloDeck() {
  return hiloSuits.flatMap((suit) =>
    hiloRanks.map((rank) => ({
      ...rank,
      ...suit,
      id: `${suit.suit}-${rank.rank}`,
    }))
  );
}

export function shuffleCards(cards) {
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

export function formatHiloPercent(value) {
  return `${value.toFixed(2)}%`;
}

export function calculateHiloOdds(currentCard, deck) {
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

export function getHiloDisplayOdds(currentCard, deck) {
  if (deck.length > 0) {
    return calculateHiloOdds(currentCard, deck);
  }

  const previewDeck = createHiloDeck().filter(
    (card) => card.suit !== currentCard.suit || card.rank !== currentCard.rank
  );

  return calculateHiloOdds(currentCard, previewDeck);
}

export function calculateHiloPayout(probability) {
  if (probability <= 0) return 1;

  return Math.max(1.01, (1 / probability) * 0.96);
}

export function calculateProjectedHiloMultiplier(currentMultiplier, probability) {
  return currentMultiplier * calculateHiloPayout(probability);
}

export function createHiloHistoryEntry(card, chip, chipTone = "win") {
  return {
    ...card,
    chip,
    chipTone,
    next: null,
  };
}

export function getHiloHistoryChipVariant(chipTone) {
  if (chipTone === "start") return "start";
  if (chipTone === "skip") return "skip";
  if (chipTone === "end") return "loss";
  return "win";
}

export function getHiloHistoryConnectorVariant(next) {
  if (next === "up") return "higher";
  if (next === "down") return "lower";
  return "skip";
}

export function createHiloRound(startCard) {
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

export function resolveHiloPrediction(choice, currentCard, nextCard) {
  if (choice === "higher") {
    return nextCard.value >= currentCard.value;
  }

  return nextCard.value <= currentCard.value;
}

export function updateHiloHistory(history, direction, nextEntry) {
  return [
    ...history.slice(0, -1),
    { ...history[history.length - 1], next: direction },
    nextEntry,
  ];
}

export function runHiloPrediction(choice, { currentCard, deck, history, multiplier, odds, stake }) {
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

export function formatHiloChoiceMultiplier(value) {
  return `X${value.toFixed(2)}`;
}

function pickRandomHiloCard() {
  const deck = createHiloDeck();
  return deck[Math.floor(Math.random() * deck.length)];
}

export function createHiloPreviewState() {
  const startCard = pickRandomHiloCard();

  return {
    currentCard: startCard,
    history: [createHiloHistoryEntry(startCard, "Start", "start")],
  };
}

export const getInitialHiloPreview = (() => {
  let cachedPreview = null;

  return () => {
    if (!cachedPreview) {
      cachedPreview = createHiloPreviewState();
    }

    return cachedPreview;
  };
})();
