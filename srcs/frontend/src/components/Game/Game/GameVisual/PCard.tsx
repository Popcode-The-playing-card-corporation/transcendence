import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import {
  MeshPhongMaterial,
  Texture,
  type Mesh,
  type TextureEventMap,
} from "three";
import type { cardType } from "../../../../utils/type/handCardsType";

function sendCard(card: cardType) {
  console.log(card.value + " of " + card.color + " played!");
}

type Props = {
  cardIndex: number;
  card: cardType;
  startPos: number;
  front: Texture<HTMLImageElement, TextureEventMap> | undefined;
  back: Texture;
};

export default function PCard({
  cardIndex,
  card,
  startPos,
  front,
  back,
}: Props) {
  const [active, setActive] = useState<boolean>(false);
  const [overed, setOvered] = useState<boolean>(false);
  const [played, setPlayed] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const distance = 1.8;
  const cardRef = useRef<Mesh>(null!);
  const materials = [
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ color: 0xffffff }),
    new MeshPhongMaterial({ map: front, color: overed ? "pink" : "" }),
    new MeshPhongMaterial({ map: back }),
  ];

  function handleDoubleClick() {
    setPlayed(true);
    sendCard(card);
  }

  function handleClick() {
    if (hidden) return;
    if (!active) {
      cardRef.current.translateY(1.3);
      cardRef.current.translateZ(0.1);
      setOvered(false);
      setActive(true);
    } else {
      // replaceCard();
      handleDoubleClick();
      setActive(false);
    }
  }
  function replaceCard() {
    if (hidden) return;
    cardRef.current!.position.set(
      startPos - cardIndex * 0.4,
      -2.5,
      1.5 - 0.001 * cardIndex,
    );
    setActive(false);
  }
  useFrame(() => {
    if (hidden) return;
    if (cardRef.current.rotation.y > 0.01) cardRef.current.rotation.y -= 0.029;
    if (played) {
      if (cardRef.current.position.x < 0) cardRef.current.position.x += 0.1;
      if (cardRef.current.position.x > 0) cardRef.current.position.x -= 0.1;
      if (cardRef.current.position.y < -Math.cos(0) * distance + 0.5)
        cardRef.current.position.y += 0.1;
      if (cardRef.current.position.z > -1.15)
        cardRef.current.position.z -= 0.15;
      if (cardRef.current.rotation.x > -0.4) cardRef.current.rotation.x -= 0.1;
      if (
        cardRef.current.position.z < -1.1 &&
        cardRef.current.position.x < 0.1 &&
        cardRef.current.position.x > -0.1
      ) {
        setHidden(true);
        setPlayed(false);
      }
    }
  });
  return (
    <mesh
      position={[startPos - cardIndex * 0.4, -2.5, 1.5 - 0.001 * cardIndex]}
      material={materials}
      scale={active ? 1.4 : 1}
      rotation={[0, 3.14, 0]}
      ref={cardRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerMissed={(e) => {
        e.stopPropagation();
        replaceCard();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!active) setOvered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setOvered(false);
      }}
    >
      <boxGeometry args={[1, 1.4, 0.03]} />
    </mesh>
  );
}
