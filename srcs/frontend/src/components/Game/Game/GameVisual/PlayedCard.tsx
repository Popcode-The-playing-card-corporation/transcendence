import { MeshPhongMaterial, Texture, type TextureEventMap } from "three";
import { useGame } from "../../context/GameContext";
import { useEffect, useMemo, useState } from "react";

type Props = {
  show: boolean,
  front: Texture<HTMLImageElement, TextureEventMap>,
  back: Texture<HTMLImageElement, TextureEventMap>,
  posPlayedCard: number,
  position: number
}

export default function PlayedCard({ show, front, back, posPlayedCard, position }: Props) {

	const materials = useMemo(
	() => [
		new MeshPhongMaterial({ color: 0xffffff }),
		new MeshPhongMaterial({ color: 0xffffff }),
		new MeshPhongMaterial({ color: 0xffffff }),
		new MeshPhongMaterial({ color: 0xffffff }),
		new MeshPhongMaterial({ map: front }),
		new MeshPhongMaterial({ map: back }),
	],
	[front, back]
	);

  const { state } = useGame();
  const [wait, setWait] = useState(true);


  useEffect(() => {
    async function handle_wait() {
      if (position === 0) {
        setWait(false);
        setTimeout(() => setWait(true), 100);
      }
    }
    handle_wait();
  }, [position])

  if (!show || (position === 0 && state.wait) || !wait) {
    return
  }

  return (
    <>
      <mesh
        position={[0, posPlayedCard, 0.05 + 0.001 * position]}
        material={materials}
      >
        {<boxGeometry args={[1, 1.4, 0.001]} />}
      </mesh>
    </>
  );
}
