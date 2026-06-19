import { useFrame } from "@react-three/fiber";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { MeshPhongMaterial} from "three";
import type { Mesh, Texture, TextureEventMap, Vector3 } from "three";

type Props = {
  angle: number,
  littleRadius: number, 
  back: Texture<HTMLImageElement, TextureEventMap>,
  positionCard: number,
  totalPlayer: number,
  posPlayedCard: number,
}

export default function AdversaryCard({angle, littleRadius, back, positionCard, totalPlayer, posPlayedCard} : Props){
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
  const pf = [0, posPlayedCard, 0];
  
  function handleClick() {
    setIsPlayed(true);
  }
  
  useFrame(() => {
    if (isPlayed)
    {
      const delta = [pf[0] - cardRef.current.position.x, pf[1] - cardRef.current.position.y, pf[2] - cardRef.current.position.z];
      if (delta[0] <= 0.1 && delta[1] <= 0.1 && delta[2] <= 0.1)
      {
        console.log("bruh : " + isPlayed);
        setIsPlayed(false);
        console.log("bruh : " + isPlayed);
      }
    const factor = 1 / 10;
    cardRef.current.rotation.x = 0;
    cardRef.current.rotation.z = 0;
    cardRef.current.position.x += delta[0] * factor;
    cardRef.current.position.y += delta[1] * factor;
    cardRef.current.position.z += delta[2] * factor;
    console.log(isPlayed);
  }
});

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