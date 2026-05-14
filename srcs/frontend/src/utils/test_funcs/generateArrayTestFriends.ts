import type { friendT } from "../friendType";

export function generateFakeFriends(): friendT[] {
  return [
    {
      id: 0,
      user: {
        id: 0,
        username: "Dana la violente",
        is_online: true,
      },
      status: "accepted",
      accepted_at: "23.06.2024",
      created_at: "20.06.2024",
    },
    {
      id: 1,
      user: {
        id: 1,
        username: "Kilian la nouille",
        is_online: false,
      },
      status: "pending",
      accepted_at: "",
      created_at: "01.10.2024",
    },
    {
      id: 2,
      user: {
        id: 2,
        username: "Cyril le mousseux",
        is_online: true,
      },
      status: "accepted",
      accepted_at: "23.10.2024",
      created_at: "04.10.2024",
    },
    {
      id: 3,
      user: {
        id: 3,
        username: "Anouar le bourgeois",
        is_online: true,
      },
      status: "pending",
      accepted_at: "",
      created_at: "24.10.2024",
    },
  ];
}
