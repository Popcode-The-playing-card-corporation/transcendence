import { MeshPhongMaterial, Texture, type TextureEventMap } from "three";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  front: Texture<HTMLImageElement, TextureEventMap>,
  back: Texture<HTMLImageElement, TextureEventMap>,
  posPlayedCard: number, 
  idPlayer: number ,
  position: number 
}

export default function PlayedCard({show, front, back, posPlayedCard, idPlayer, position} : Props) {

  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: front}),
    new MeshPhongMaterial({map: back})
  ];

  const { state } = useGame();
  const [wait, setWait] = useState(true);

    useEffect(() => {
	async function handle_wait() {
		if (idPlayer === 0) {
			setWait(false);
			setTimeout(() => setWait(true), 100);
		}
	}
	handle_wait();
	}, [idPlayer])

  if (!show || (idPlayer === 0 && state.wait) || !wait) {
	return
  }

  
  return (
  <>
    <mesh
      position={[0, posPlayedCard, 0.01 * position]}
      material={materials}
    >
	{ <boxGeometry args={[1, 1.4, 0.01]}/>}
    </mesh>
  </>
  );
}
