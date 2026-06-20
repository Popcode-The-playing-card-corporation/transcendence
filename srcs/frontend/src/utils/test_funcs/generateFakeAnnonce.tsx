import type { annonceT } from "../type/annonceType";

export default function generateFakeAnnonce() : annonceT[] {
  return [
    {
      room_id: 0,
      cards: [
        [
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
        ], 
        [
          {
            color:"spade",
            value: "9",
            id:12
          },
          {
            color:"spade",
            value: "10",
            id:13
          },
          {
            color:"spade",
            value: "J",
            id:14
          },
          {
            color:"spade",
            value: "Q",
            id:15
          },
          {
            color:"spade",
            value: "K",
            id:16
          },
          {
            color:"spade",
            value: "A",
            id:17
          }
        ]
      ]
    },
    {
      room_id: 1,
      cards: [
        [
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
      ]
    },
    {
      room_id: 2,
      cards: [
        [
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
      ]
    }
  ];
}