import type { boardT } from "../type/boardType";

export default function generateFakeBoard() : boardT[] {
  return[
    {
      playerPos: 0,
      card:{
        id: 0,
        value: "A",
        color: "spade",
      }
    },
    {
      playerPos: 1,
      card:{
        id: 1,
        value: "6",
        color: "heart"
      }
    },
    {
      playerPos: 2,
      card:{
        id: 2,
        value: "8",
        color: "diamond"
      }
    },
    // {
    //   playerPos: 3,
    //   card:{
    //     id: 3,
    //     value: "J",
    //     color: "heart",
    //   }
    // },
    // {
    //   playerPos: 4,
    //   card:{
    //     id: 4,
    //     value: "Q",
    //     color: "spade",
    //   }
    // },
    // {
    //   playerPos: 5,
    //   card:{
    //     id: 5,
    //     value: "8",
    //     color: "spade",
    //   }
    // },
    // {
    //   playerPos: 6,
    //   card:{
    //     id: 6,
    //     value: "9",
    //     color: "club",
    //   }
    // }
  ];
}
