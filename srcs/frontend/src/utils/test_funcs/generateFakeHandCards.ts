import type { handCardsType } from "../type/handCardsType";

export default function generateFakeHandCards(): handCardsType {
	return ({
		cards: [
			{
				color: "club",
				value: "A",
				id: 8,
			},

			{
				color: "diamond",
				value: "A",
				id: 26,
			},
			{
				color: "heart",
				value: "A",
				id: 35,
			},
			{
				color: "spade",
				value: "A",
				id: 17,
			},

		]
	})
}
