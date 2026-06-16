import { MeshPhongMaterial} from "three";
import type { Texture, TextureEventMap } from "three";

type Props = {
  angle: number,
  littleRadius: number, 
  back: Texture<HTMLImageElement, TextureEventMap>,
  positionCard: number,
  totalPlayer: number
}

export default function AdversaryCard({angle, littleRadius, back, positionCard, totalPlayer} : Props){
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xf345ab}),
    new MeshPhongMaterial({map: back})
  ];

  const factor = 0.15 * (7 - totalPlayer);

  return (
    <mesh
      rotation={[Math.PI / 2, 0, angle]}
      position={[-Math.sin(angle) * littleRadius,- (littleRadius - factor) + 0.01 * positionCard, Math.cos(angle) * (littleRadius - factor)]}
      material={materials}
    >
      <boxGeometry args={[1, 1.4, 0.001]}/>
    </mesh>
  );
}
//  + 0.02 * positionCard