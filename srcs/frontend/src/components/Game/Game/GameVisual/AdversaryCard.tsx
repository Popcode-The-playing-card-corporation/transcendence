import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MeshPhongMaterial} from "three";
import type { Mesh, Texture, TextureEventMap, Vector3 } from "three";

type Props = {
  angle: number,
  littleRadius: number, 
  back: Texture<HTMLImageElement, TextureEventMap>,
  positionCard: number,
  totalPlayer: number,
  angleAdversary: number
}

export default function AdversaryCard({angle, littleRadius, back, positionCard, totalPlayer, angleAdversary} : Props){
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xf345ab}),
    new MeshPhongMaterial({map: back})
  ];

  const cardRef = useRef<Mesh>(null!);
  const [isPlayed, setIsPlayed] = useState<boolean>(false);

  const factor = 0.15 * (7 - totalPlayer);
  const p0 = [-Math.sin(angle) * littleRadius,- (littleRadius - factor) + 0.01 * positionCard, Math.cos(angle) * (littleRadius - factor)];
  const pf = [Math.sin(angleAdversary) * 1.8, -Math.cos(angleAdversary) * 1.8, 0];
  const delta = [pf[0] - p0[0], pf[1] - p0[1], pf[2] - p0[2]];
  
  function handleClick() {
    setIsPlayed(true);
  }

  useFrame(() => {
    if (isPlayed && cardRef.current.position.x !== pf[0]) {
      const factor = 1 / 10;
      cardRef.current.position.x += delta[0] * factor;
      cardRef.current.position.y += delta[1] * factor;
      cardRef.current.position.z += delta[2] * factor;
    }
  });

  console.log("p0 : " + p0[0] + ", " + p0[1] + ", " + p0[2]);
  console.log("pf : " + pf[0] + ", " + pf[1] + ", " + pf[2]);
  // console.log("cardRef : " + cardRef.current.position.x  + ", " + cardRef.current.position.y  + ", " + cardRef.current.position.z);

  return (
    <mesh
      rotation={[Math.PI / 2, 0, angle]}
      position={[-Math.sin(angle) * littleRadius,- (littleRadius - factor) + 0.01 * positionCard, Math.cos(angle) * (littleRadius - factor)]}
      material={materials}
      ref={cardRef}
      onClick={() => (positionCard === 4 ? handleClick() : "")}
    >
      <boxGeometry args={[1, 1.4, 0.001]}/>
    </mesh>
  );
}
//  + 0.02 * positionCard