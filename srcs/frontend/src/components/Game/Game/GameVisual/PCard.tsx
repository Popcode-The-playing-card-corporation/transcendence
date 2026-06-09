import { useFrame, } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MeshPhongMaterial, Texture, type Mesh, type TextureEventMap } from "three";
import type { cardType } from "../../../../utils/type/handCardsType";

function sendCard(card: cardType) {
  console.log(card.value + " of " + card.color + " played!");
}

type Props = {

            cardIndex: number;
            card: cardType;
            startPos:number;
			front: Texture<HTMLImageElement, TextureEventMap> | undefined;
			back: Texture;
}

export default function PCard({cardIndex, card, startPos, front, back}: Props) {
  const [active, setActive] = useState<boolean>(false);
  const [overed, setOvered] = useState<boolean>(false);
  const cardRef = useRef<Mesh>(null!);
  const materials = [
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ map: front , color: overed ? "pink" : ""}),
    new MeshPhongMaterial({ map: back }),
  ];

  function handleDoubleClick() {
    sendCard(card);
  }

  function handleClick() {
    if (!active) {
      cardRef.current?.translateY(1.3);
      cardRef.current.translateZ(0.1);
	  setOvered(false);
	  setActive(true);
    } else {
      replaceCard();
      handleDoubleClick();
      setActive(false);
    }
  }
  function replaceCard() {
    cardRef.current!.position.set(
      startPos -
        cardIndex * 0.4,
      -2.5,
      2 - 0.001 * cardIndex,
    );
    setActive(false);
  }
  useFrame(() => {});
  return (
    <mesh
     position={[startPos - cardIndex * 0.4, -2.5, 2 - 0.001 * cardIndex]}
	 material={materials}
	 scale={active ? 1.4 : 1}
	 rotation={[0, 0, 0]}
	 ref={cardRef}

      onPointerDown={(e) => {
        e.stopPropagation();
        handleClick();
      }}

      onPointerMissed={() => replaceCard()}

      onPointerUp={(e) => {
        e.stopPropagation();
      }}

	onPointerOver={(e) => {
		e.stopPropagation()
		if (!active)
			setOvered(true);
	}}

	onPointerLeave={(e) => {
		e.stopPropagation();
		setOvered(false);
	}}
    >
      <boxGeometry args={[1, 1.4, 0.01]} />
    </mesh>
  );
}
