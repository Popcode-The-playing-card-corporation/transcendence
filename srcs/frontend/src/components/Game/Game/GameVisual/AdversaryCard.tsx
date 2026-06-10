import { MeshPhongMaterial, TextureLoader } from "three";
import type { Texture, TextureEventMap } from "three";

type Props = {
  angle: number, 
  distance: number, 
  textureBack: Texture<HTMLImageElement, TextureEventMap> 
}

export default function AdversaryCard({angle,distance, textureBack} : Props){
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: textureBack}),
    new MeshPhongMaterial({map: textureBack})
  ];

  return (
    <mesh
      rotation={[Math.PI / 2, angle, 0]}
      position={[Math.sin(angle) * distance, -Math.cos(angle) * distance, 0]}
      material={materials}
    >
      <boxGeometry args={[1, 1.4, 0.01]}/>
      <axesHelper />
    </mesh>
  );
}