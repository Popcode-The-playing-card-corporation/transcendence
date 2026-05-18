import type { statisticsT } from "./statisticsType";

export function generateFakeStats(): statisticsT {
  return {
    played: 15,
    winned: 7,
    loosed: 8,
    totalPoints: 4267,
    nbTricksChoose: 6,
    PreferedTrick: "heart",
    nbTaken: 42,
    nbLastTake: 4,
    handMeldPoints: 180,
    boardMeldPoints: 420,
    highestHandMeld: 100,
    highestBoardMeld: 50,
    nbHost: 5,
  };
}
