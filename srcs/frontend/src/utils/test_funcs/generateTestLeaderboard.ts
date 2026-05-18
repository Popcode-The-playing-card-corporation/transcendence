import type { leaderboardT } from "./leaderboardType";

export function generateFakeLeaderboard(): leaderboardT {
  return {
    leaderboard: [
      {
        username: "Dana la violente",
        score: 666,
      },
      {
        username: "Cyril le mousseux",
        score: 420,
      },
      {
        username: "Kilian le JSON",
        score: 670,
      },
      {
        username: "Anour le bourgeois",
        score: 312,
      },
      {
        username: "Che guevara",
        score: 213,
      },
      {
        username: "Poppy la mascotte",
        score: 3,
      },
      {
        username: "Jean-michel",
        score: 462,
      },
      {
        username: "Jean-François",
        score: 945,
      },
      {
        username: "Jean-Pierre",
        score: 1200,
      },
      {
        username: "Jean-Eude",
        score: 628,
      },
      {
        username: "Jean-Jean",
        score: 124,
      },
      {
        username: "Jean-Paul",
        score: 242,
      },
      {
        username: "Jean-Fabrice",
        score: 345,
      },
      {
        username: "Jean-Christophe",
        score: 89,
      },
      {
        username: "Jean-Cule",
        score: 430,
      },
    ],
    current: {
      username: "Alex le mec chelou",
      score: 690,
	  rank: 12,
    },
  };
}
