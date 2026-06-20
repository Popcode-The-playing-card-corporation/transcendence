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
        },
        {
          color:"club",
          value: "9",
          id:3
        },
        {
          color:"club",
          value: "10",
          id:4
        },
        {
          color:"club",
          value: "J",
          id:5
        },
        {
          color:"club",
          value: "Q",
          id:6
        },
        {
          color:"club",
          value: "K",
          id:7
        },
        {
          color:"club",
          value: "A",
          id:8
        }
      ]
    },
  ];
}