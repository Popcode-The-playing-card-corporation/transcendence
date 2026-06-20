import type { annonceT } from "../type/annonceType";

export default function generateFakeAnnonce() : annonceT[] {
  return [
    {
      room_id: 0,
      cards: [
        {
          color: "club",
          value: "6",
          id:0
        },
        {
          color:"club",
          value: "7",
          id:1
        },
        {
          color:"club",
          value: "8",
          id:2
        }
      ]
    },
  ];
}