import { type ThreeElements } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import type { cardType } from "../../../../utils/type/handCardsType";

function sendCard(card: cardType) {
  console.log(card.value + " of " + card.color + " played!");
}

export default function PCard(props: ThreeElements["mesh"]) {
  const [active, setActive] = useState<boolean>(false);
  const cardRef = useRef<Mesh>(null!);

  function handleClick() {
    setActive(!active);
    sendCard(cardRef.current.userData.card);
  }

  function handleHover() {
    cardRef.current?.translateY(1.3);
	setActive(true)
  }
  function handleLeave() {
    cardRef.current!.position.set(
      cardRef.current.userData.cardIndex * 1.1 - 1.5,
      -2.5,
      2,
    );
	setActive(false)
  }
  return (
    <mesh
      {...props}
      onClick={() => handleClick()}
      scale={active ? 1.5 : 1}
      rotation={[0, 0, 0]}
      onPointerEnter={() => {
        handleHover();
      }}
      onPointerLeave={() => {
        handleLeave();
      }}
      ref={cardRef}
    >
      <boxGeometry args={[1, 1.4, 0.03]} />
    </mesh>
  );
}
