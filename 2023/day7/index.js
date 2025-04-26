import fs from "fs";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();

const hands = input
  .split("\n")
  .filter((x) => x)
  .map((line) => line.split(" "))
  .map((line) => ({
    hand: line[0],
    bid: Number(line[1]),
  }));

const handRank = {
  five: 6,
  four: 5,
  fullHouse: 4,
  three: 3,
  twoPair: 2,
  pair: 1,
  high: 0,
};

// rank by hand type
// tiebreaker -> card rank
const sortHands = (cardRank) => (a, b) => {
  const aRank = handRank[a.type];
  const bRank = handRank[b.type];

  if (aRank !== bRank) return aRank - bRank;

  // kinda gross, but it'll get us there!
  return (
    cardRank[a.hand[0]] - cardRank[b.hand[0]] ||
    cardRank[a.hand[1]] - cardRank[b.hand[1]] ||
    cardRank[a.hand[2]] - cardRank[b.hand[2]] ||
    cardRank[a.hand[3]] - cardRank[b.hand[3]] ||
    cardRank[a.hand[4]] - cardRank[b.hand[4]]
  );
};

const part1 = () => {
  const cardRank = {
    A: 12,
    K: 11,
    Q: 10,
    J: 9,
    T: 8,
    9: 7,
    8: 6,
    7: 5,
    6: 4,
    5: 3,
    4: 2,
    3: 1,
    2: 0,
  };

  const getHandType = (hand) => {
    // count how many of each card type there is
    const cardCounts = new Map();
    hand.split("").forEach((card) => {
      cardCounts.set(card, (cardCounts.get(card) ?? 0) + 1);
    });

    const maxCount = Math.max(...cardCounts.values());
    switch (cardCounts.size) {
      case 1:
        return "five";
      case 2:
        return maxCount === 4 ? "four" : "fullHouse";
      case 3:
        return maxCount === 3 ? "three" : "twoPair";
      case 4:
        return "pair";
      default:
        return "high";
    }
  };

  // final total -> bid * rank
  return hands
    .map((hand) => ({
      ...hand,
      type: getHandType(hand.hand),
    }))
    .sort(sortHands(cardRank))
    .reduce((total, hand, index) => {
      return total + hand.bid * (index + 1);
    }, 0);
};

const part2 = () => {
  const cardRank = {
    A: 12,
    K: 11,
    Q: 10,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
    J: 0,
  };

  const getHandType = (hand) => {
    const cardCounts = new Map();
    hand.split("").forEach((card) => {
      cardCounts.set(card, (cardCounts.get(card) ?? 0) + 1);
    });

    // short-circuit in case we have all Js
    if (cardCounts.size === 1) return "five";

    // whatever the max count card is,
    // turn any Js into that card to maximize the hand value
    // because 4 > fullHouse, 3 > twoPair
    let highestCount = 0;
    let highestCard;
    for (let [card, count] of cardCounts) {
      if (count > highestCount && card !== "J") {
        highestCard = card;
        highestCount = count;
      }
    }

    if (cardCounts.has("J")) {
      cardCounts.set(
        highestCard,
        cardCounts.get(highestCard) + cardCounts.get("J"),
      );
      cardCounts.delete("J");
    }

    let maxCount = cardCounts.get(highestCard);

    switch (cardCounts.size) {
      case 1:
        return "five";
      case 2:
        return maxCount === 4 ? "four" : "fullHouse";
      case 3:
        return maxCount === 3 ? "three" : "twoPair";
      case 4:
        return "pair";
      default:
        return "high";
    }
  };

  return hands
    .map((hand) => ({
      ...hand,
      type: getHandType(hand.hand),
    }))
    .sort(sortHands(cardRank))
    .reduce((total, hand, index) => {
      return total + hand.bid * (index + 1);
    }, 0);
};

console.log("Part 1:", part1());
console.log("Part 2:", part2());
