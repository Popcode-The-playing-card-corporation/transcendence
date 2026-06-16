import type { boardT } from "../type/boardType";

export default function generateFakeBoard() : boardT[] {
  return[
    {
      position: 0,
      card:{
        id: 0,
        value: "A",
        color: "spade",
      }
    },
    {
      position: 1,
      card:{
        id: 1,
        value: "6",
        color: "heart"
      }
    },
    {
      position: 2,
      card:{
        id: 2,
        value: "8",
        color: "diamond"
      }
    },
    // {
    //   position: 3,
    //   card:{
    //     id: 3,
    //     value: "J",
    //     color: "heart",
    //   }
    // },
    // {
    //   position: 4,
    //   card:{
    //     id: 4,
    //     value: "Q",
    //     color: "spade",
    //   }
    // },
    // {
    //   position: 5,
    //   card:{
    //     id: 5,
    //     value: "8",
    //     color: "spade",
    //   }
    // },
    // {
    //   position: 6,
    //   card:{
    //     id: 6,
    //     value: "9",
    //     color: "club",
    //   }
    // }
  ];
}
