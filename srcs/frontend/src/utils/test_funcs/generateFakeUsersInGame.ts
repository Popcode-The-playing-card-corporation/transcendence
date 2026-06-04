import type { userInGameT } from "../type/userInGameType";

export function generateFakeUsersInGame(): userInGameT[] {
  return [
    {
      id: 0,
      username: "danouille",
      score: 666,
    },
    {
      id: 1,
      username: "kiliouille",
      score: 67,
    },
    {
      id: 2,
      username: "cyrouille",
      score: 96,
    },
    {
      id: 3,
      username: "Anouille",
      score: 3945,
    },
    {
      id: 4,
      username: "Alexouille",
      score: 69,
    },
  ];
}
