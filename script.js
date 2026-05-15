const STORAGE_KEY = "commanderDiffData";

const initialData = {
  baseDeck: [],
  comparisonsCount: 0,
  addedCounts: {},
  removedCounts: {},
};

const deckInput = document.getElementById("deckInput");
const setBaseButton = document.getElementById("setBaseButton");
const compareButton = document.getElementById("compareButton");
const resetButton = document.getElementById("resetButton");
const baseStatus = document.getElementById("baseStatus");
const comparisonStatus = document.getElementById("comparisonStatus");
const addedList = document.getElementById("addedList");
const removedList = document.getElementById("removedList");

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { ...initialData };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      baseDeck: Array.isArray(parsed.baseDeck) ? parsed.baseDeck : [],
      comparisonsCount: Number.isInteger(parsed.comparisonsCount)
        ? parsed.comparisonsCount
        : 0,
      addedCounts:
        parsed.addedCounts && typeof parsed.addedCounts === "object"
          ? parsed.addedCounts
          : {},
      removedCounts:
        parsed.removedCounts && typeof parsed.removedCounts === "object"
          ? parsed.removedCounts
          : {},
    };
  } catch {
    return { ...initialData };
  }
}

let data = loadData();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function parseDeck(rawText) {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\s+/, "").trim());
}

function updateCountMap(map, cards) {
  cards.forEach((card) => {
    map[card] = (map[card] || 0) + 1;
  });
}

function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function sortStatsEntries([cardA, countA], [cardB, countB]) {
  if (countA !== countB) {
    return countB - countA;
  }

  return cardA.localeCompare(cardB);
}

function renderStatsList(element, countMap, totalComparisons) {
  clearList(element);

  const entries = Object.entries(countMap).sort(sortStatsEntries);

  if (!entries.length) {
    const item = document.createElement("li");
    item.textContent = "No data yet.";
    element.appendChild(item);
    return;
  }

  entries.forEach(([card, count]) => {
    const percentage = totalComparisons > 0 ? ((count / totalComparisons) * 100).toFixed(1) : "0.0";
    const item = document.createElement("li");
    item.textContent = `${card} — ${count}/${totalComparisons} (${percentage}%)`;
    element.appendChild(item);
  });
}

function render() {
  if (data.baseDeck.length) {
    baseStatus.textContent = `Base deck saved with ${data.baseDeck.length} cards.`;
  } else {
    baseStatus.textContent = "No base deck saved yet.";
  }

  comparisonStatus.textContent = `Compared decks: ${data.comparisonsCount}`;
  renderStatsList(addedList, data.addedCounts, data.comparisonsCount);
  renderStatsList(removedList, data.removedCounts, data.comparisonsCount);
}

setBaseButton.addEventListener("click", () => {
  const deck = parseDeck(deckInput.value);
  if (!deck.length) {
    alert("Please paste a deck before saving base deck.");
    return;
  }

  data = {
    ...initialData,
    baseDeck: deck,
  };

  saveData();
  render();
  alert("Base deck saved.");
});

compareButton.addEventListener("click", () => {
  if (!data.baseDeck.length) {
    alert("Save a base deck first.");
    return;
  }

  const deck = parseDeck(deckInput.value);
  if (!deck.length) {
    alert("Please paste a deck to compare.");
    return;
  }

  const baseSet = new Set(data.baseDeck);
  const currentSet = new Set(deck);

  const added = [...currentSet].filter((card) => !baseSet.has(card));
  const removed = [...baseSet].filter((card) => !currentSet.has(card));

  data.comparisonsCount += 1;
  updateCountMap(data.addedCounts, added);
  updateCountMap(data.removedCounts, removed);

  saveData();
  render();
  alert(`Comparison complete. Added: ${added.length}, Removed: ${removed.length}.`);
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  data = { ...initialData };
  deckInput.value = "";
  render();
});

render();
