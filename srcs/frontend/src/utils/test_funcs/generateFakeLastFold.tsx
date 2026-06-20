import type { cardType } from "../type/handCardsType";

export default function generateFakeLastFold(): cardType[] {
	return (
		[
			{
				id: 1,
				color: "club",
				value: "7",
			},
			{
				id: 7,
				color: "club",
				value: "K",
			},
			{
				id: 11,
				color: "spade",
				value: "8",
			},
			{
				id: 17,
				color: "spade",
				value: "A",
			},
			{
				id: 21,
				color: "diamond",
				value: "J",
			},
			{
				id: 25,
				color: "diamond",
				value: "K",
			},
			{
				id: 31,
				color: "heart",
				value: "10"
			}
		]
	)
}
