import type { friendT } from "./friendType";

export function generateFakeFriends() : friendT[] {
	return ([
		{
			id: 0,
			username: "Dana la violente",
			status: "accepted",
			date: "23.06.2024",
			online: true,
		},
		{
			id: 1,
			username: "Kilian la nouille",
			status: "pending",
			date: "01.10.2024",
			online: false,
		},
		{
			id: 2,
			username: "Cyril le mousseux",
			status: "accepted",
			date: "23.10.2024",
			online: true,
		},
		{
			id: 3,
			username: "Anouar le bourgeois",
			status: "pending",
			date: "24.10.2024",
			online: true,
		}
	])
}

