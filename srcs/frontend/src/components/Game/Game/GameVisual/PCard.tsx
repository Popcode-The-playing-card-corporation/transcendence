import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  // log,
  MeshPhongMaterial,
  Texture,
  type Mesh,
  type TextureEventMap,
} from "three";
import type { cardT } from "../../../../utils/type/handCardsType";
import { useGame } from "../../context/GameContext";
// import { RoundedBoxGeometry } from "@react-three/drei";

// function sendCard(card: cardT) {
//   console.log(card.value + " of " + card.color + " played!");
// }

type Props = {
  cardIndex: number;
  card: cardT;
  startPos: number;
  front: Texture<HTMLImageElement, TextureEventMap> | undefined;
  back: Texture<HTMLImageElement, TextureEventMap> | undefined;
  oldStartPos: number;
//   setHand: Dispatch<SetStateAction<cardT[]>>;
//   hand: cardT[];
  lastCardPlayed: number;
  setHand: Dispatch<any>;
  setLastCardPlayed: Dispatch<SetStateAction<number>>;
};

export default function PCard({
  cardIndex,
  card,
  startPos,
  front,
  back,
  oldStartPos,
//   setHand,
//   hand,
  lastCardPlayed,
  setHand,
  setLastCardPlayed,
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
  const game = useGame();

  useEffect(() => {
	async function handle_play() {
		const inHand = game.state.game.self_cards.hand.some((thisCard) => {return card.id === thisCard.id})
		if (!inHand && !played && !hidden) {
			setPlayed(true);
		}
	}
	handle_play();
  }, [game.state.game.self_cards.hand, card.id, hidden, played])

  

	useEffect(() => {

		function resetCard() {

			cardRef.current!.position.set(
			startPos - cardIndex * 0.4,
			-2.5,
			1.5 - 0.001 * cardIndex,
			);
			setActive(false);
		} 

		if (game.state.event === "card_valid" && game.state.message === "invalid") {
			
			resetCard();
		}
	
	}, [game.state.event, game.state.message, game.state.eventID]);


  function handleDoubleClick() {
    game.playCard(card.id);
  }
  

  function handleClick() {
    if (hidden || played) return;
    if (!active) {
      // cardRef.current.translateY(1.3);
      // cardRef.current.translateZ(0.1);
      setOvered(false);
      setActive(true);
    } else {
      // replaceCard();
      handleDoubleClick();
      setActive(false);
    }
  }
  function replaceCard() {
    if (hidden || played) return;
    cardRef.current!.position.set(
      startPos - cardIndex * 0.4,
      -2.5,
      1.5 - 0.001 * cardIndex,
    );
    setActive(false);
  }
  useFrame(() => {
    if (hidden) return;

    // begin animation
    if (cardRef.current.rotation.y > 0.01)
      cardRef.current.rotation.y -= 0.029 * cardRef.current.rotation.y;

    // Selection animation
    if (active) {
      const deltaY = cardRef.current.position.y - -1.2;
      const deltaZ = cardRef.current.position.z - 1.5 - 0.001 * cardIndex + 0.1;

      if (cardRef.current.position.y < -1.2)
        cardRef.current.position.y += 0.05 * deltaY * -1 * 5;
      if (cardRef.current.position.z < 1.5 - 0.001 * cardIndex + 0.1)
        cardRef.current.position.z += 0.01 * deltaZ * 5;
    }

    // Playing card
    if (played) {
      const deltaY = cardRef.current.position.y - (1 * distance + 0.5);
      const deltaX = cardRef.current.position.x;
      const deltaZ = cardRef.current.position.z - -1.15;
      const deltaRotX = cardRef.current.rotation.x - -0.4;

      if (cardRef.current.position.x < 0)
        cardRef.current.position.x += 0.1 * deltaX * -1;
      if (cardRef.current.position.x > 0)
        cardRef.current.position.x -= 0.1 * deltaX;
      if (cardRef.current.position.y < -Math.cos(0) * distance + 0.5)
        cardRef.current.position.y += 0.01 * (deltaY * 10);
      if (cardRef.current.position.z > -1.15)
        cardRef.current.position.z -= 0.15 * (deltaZ * 0.5);
      if (cardRef.current.rotation.x > -0.4)
        cardRef.current.rotation.x -= 0.1 * deltaRotX;

      // when is finished remove card from hand
      if (
        cardRef.current.position.z < -1.1 &&
        cardRef.current.position.x < 0.1 &&
        cardRef.current.position.x > -0.1
      ) {
        setHidden(true);
        // setHand(
        //   hand.filter((currCard) => {
        //     return currCard.id !== card.id;
        //   }),
        // );
        setLastCardPlayed(cardIndex);
		setHand(game.state.game.self_cards.hand);
        return;
      }
    }

    // Hand's card replacment
    if (!played) {
      const deltaX = cardRef.current.position.x - (startPos - cardIndex * 0.4);
      if (cardRef.current.position.x > startPos - cardIndex * 0.4)
        cardRef.current.position.x -= 0.01 * deltaX * 10;
      if (cardRef.current.position.x < startPos - cardIndex * 0.4)
        cardRef.current.position.x += 0.01 * deltaX * -1 * 10;
    }
  });
  return (
    <mesh
      position={
        cardIndex >= lastCardPlayed
          ? [oldStartPos - (cardIndex + 1) * 0.4, -2.5, 1.5 - 0.001 * cardIndex]
          : [oldStartPos - cardIndex * 0.4, -2.5, 1.5 - 0.001 * cardIndex]
      }
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
      {/* <RoundedBoxGeometry */}
      {/*   args={[1, 1.4, 0.03]} */}
      {/*   radius={0.05} */}
      {/*   steps={1} */}
      {/*   smoothness={4} */}
      {/*   bevelSegments={4} */}
      {/*   creaseAngle={0.4} */}
      {/*   material={materials} */}
      {/* /> */}
    </mesh>
  );
}
