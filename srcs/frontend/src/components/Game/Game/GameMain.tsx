import type React from "react"
import GameVisual from "./GameVisual"
import Interface from "./Interface"
import type { SetStateAction } from "react"

export default function  GameMain({setIsGamePage} : {setIsGamePage: React.Dispatch<SetStateAction<boolean>>}) {
	setIsGamePage(true);
	return (
		<div className="w-sceen h-screen flex">
		<GameVisual />
		<Interface />
		</div>
		
	)
}
