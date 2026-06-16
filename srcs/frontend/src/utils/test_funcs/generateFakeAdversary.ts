import type { adversaryT } from "../type/adversaryType";

export default function generateFakeAdversary() : adversaryT[]{
  return [
    {
      position: 0,
      nbCards: 5
    },
    {
      position: 1,
      nbCards: 5
    },
    {
      position: 2,
      nbCards: 5
    },
    {
      position: 3,
      nbCards: 5
    },
    {
      position: 4,
      nbCards: 5
    },
    {
      position: 5,
      nbCards: 5
    }
  ];
}