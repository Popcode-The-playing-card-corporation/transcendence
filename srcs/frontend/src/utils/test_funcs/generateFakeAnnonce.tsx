import type { annonceT } from "../type/annonceType";

export default function generateFakeAnnonce() : annonceT[] {
  return [
    {
      annonce: "suite 3 cards",
      cards: "6,7,8",
      colour: "spade"
    },
    {
      annonce: "suite 3 cards",
      cards: "J,Q,K",
      colour: "club"
    },
    {
      annonce: "square",
      cards: "k",
      colour: "heart"
    },
    {
      annonce: "suite 4 cards",
      cards: "9,10,J,Q",
      colour: "club"
    },
    {
      annonce: "suite 7 cards",
      cards: "6,7,8,9,10,J,Q",
      colour: "diamond"
    },
  ];
}