import { MeshPhongMaterial, Texture, type TextureEventMap } from "three";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader } from "@react-three/fiber";

type Props = {
  front: Texture<HTMLImageElement, TextureEventMap>,
  back: Texture<HTMLImageElement, TextureEventMap>,
  id: number,
  posPlayedCard: number 
}

export default function PlayedCard({front, back, id, posPlayedCard} : Props) {

  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: front}),
    new MeshPhongMaterial({map: back})
  ];

  return (
  <>
    <mesh
      position={[0, posPlayedCard, 0]}
      material={materials}
    >
	{ <boxGeometry args={[1, 1.4, 0.01]}/>}
    </mesh>
  </>
  );
}
