import { MeshPhongMaterial, TextureLoader } from "three";
import type { Texture, TextureEventMap } from "three";

type Props = {
  angle: number, 
  littleRadius: number, 
  textureBack: Texture<HTMLImageElement, TextureEventMap>,
  second: number
}

export default function AdversaryCard({angle, littleRadius, textureBack, second} : Props){
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xf345ab}),
    new MeshPhongMaterial({map: textureBack})
  ];

  return (
    <mesh
      rotation={[Math.PI / 2, angle, 0]}
      // position={[0, 0, 0]}
      position={[Math.sin(angle) * littleRadius, -Math.cos(angle) * littleRadius, 0]}
      material={materials}
    >
      <boxGeometry args={[1, 1.4, 0.001]}/>
      <axesHelper />
    </mesh>
  );
}