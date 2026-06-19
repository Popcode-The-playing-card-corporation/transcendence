import type { cardType } from "./handCardsType"

export type boardT = {
  playerPos: number,
  card: cardType
}


export const defaultBoard:boardT  = {
  playerPos: 0,
  card: {
    color: "club",
    value: "9",
    id: 3
  }
}