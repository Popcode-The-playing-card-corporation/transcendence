import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { MeshPhongMaterial } from "three";
import type { Mesh, Texture, TextureEventMap } from "three";

type Props = {
  setShow: Dispatch<SetStateAction<boolean>>,
  angle: number,
  littleRadius: number,
  front: Texture<HTMLImageElement, TextureEventMap>,
  back: Texture<HTMLImageElement, TextureEventMap>,
  positionCard: number,
  totalPlayer: number,
  posPlayedCard: number,
  animate: boolean,
  resetState: () => void,
}

export default function AdversaryCard({ setShow, angle, littleRadius, front, back, positionCard, totalPlayer, posPlayedCard, animate, resetState }: Props) {
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
  const cardRef = useRef<Mesh>(null!);

  const factor = 0.15 * ((7 - totalPlayer));
  const pf = [0, posPlayedCard, 0 + (positionCard * 0.001)];
  const [scale, setScale] = useState(0.4)


  useFrame(() => {
    if (animate) {
      const delta = [pf[0] - cardRef.current.position.x, pf[1] - cardRef.current.position.y, pf[2] - cardRef.current.position.z];
      if (delta[0] < 0.001 && delta[1] < 0.001 && delta[2] < 0.001) {
        resetState();
        setShow(true);
        return;
      }
      setScale(1);
      const factorDelta = 1 / 10;
      cardRef.current.rotation.x = 0;
      cardRef.current.rotation.z = 0;
      cardRef.current.position.x += delta[0] * factorDelta;
      cardRef.current.position.y += delta[1] * factorDelta;
      cardRef.current.position.z += delta[2] * factorDelta;
    }
  });

  return (
    <>
      <mesh
        rotation={[Math.PI / 2, 0, angle]}
        position={[-Math.sin(angle) * littleRadius, - (littleRadius + factor) + 0.01 * positionCard, Math.cos(angle) * (littleRadius / 3)]}
        scale={scale}
        material={materials}
        ref={cardRef}
      >
        <boxGeometry args={[1, 1.4, 0.001]} />
      </mesh>
    </>
  );
}
