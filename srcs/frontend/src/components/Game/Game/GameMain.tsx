import type { Dispatch, SetStateAction } from "react"
import GameVisual from "./GameVisual"
import Interface from "./Interface"


export default function  GameMain({setInGame} : {setInGame: Dispatch<SetStateAction<boolean>>}) {
	
	setInGame(true)
	return (
		<div className="w-sceen h-screen flex">
		<GameVisual />
		<Interface />
		</div>
		
	)
}
