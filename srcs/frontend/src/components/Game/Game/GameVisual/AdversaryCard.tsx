import { useFrame } from "@react-three/fiber";
import { useRef, type SetStateAction } from "react";
import { MeshPhongMaterial} from "three";
import type { Mesh, Texture, TextureEventMap } from "three";

type Props = {
  setShow: React.Dispatch<SetStateAction<boolean>>,
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

export default function AdversaryCard({setShow, angle, littleRadius, front, back, positionCard, totalPlayer, posPlayedCard, animate, resetState} : Props){
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
	new MeshPhongMaterial({map: front}),
    new MeshPhongMaterial({map: back})
  ];

  const cardRef = useRef<Mesh>(null!);

  const factor = 0.23 * (7 - totalPlayer);
  const pf = [0, posPlayedCard, 0];
  
  
  useFrame(() => {
    if (animate)
    {
      const delta = [pf[0] - cardRef.current.position.x, pf[1] - cardRef.current.position.y, pf[2] - cardRef.current.position.z];
      if (delta[0] <= 0.1 && delta[1] <= 0.1 && delta[2] <= 0.1)
      {
        resetState();
		setShow(true);
      }
    const factor = 1 / 10;
    cardRef.current.rotation.x = 0;
    cardRef.current.rotation.z = 0;
    cardRef.current.position.x += delta[0] * factor;
    cardRef.current.position.y += delta[1] * factor;
    cardRef.current.position.z += delta[2] * factor;
  }
});

  return (
    <mesh
      rotation={[Math.PI / 2, 0, angle]}
      position={[-Math.sin(angle) * littleRadius,- (littleRadius - factor) + 0.01 * positionCard, Math.cos(angle) * (littleRadius - factor)]}
      scale={0.5}
      material={materials}
      ref={cardRef}
    >
      <boxGeometry args={[1, 1.4, 0.001]}/>
    </mesh>
  );
}
//  + 0.02 * positionCard