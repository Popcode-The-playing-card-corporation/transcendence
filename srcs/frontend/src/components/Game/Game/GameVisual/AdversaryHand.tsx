import { useLoader, useThree } from "@react-three/fiber";
import { MeshPhongMaterial, Texture, TextureLoader, type TextureEventMap } from "three";
import { loadTexture } from "../../../../utils/imports/textures";

type Props = {
  card: string,
  id: number, 
  total: number,
}

export default function AdversaryHand({card, id, total} : Props) {
  const textureFront = useLoader(TextureLoader, loadTexture(card)!);
  const textureBack = useLoader(TextureLoader, loadTexture("back")!);
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: textureFront}),
    new MeshPhongMaterial({map: textureBack})
  ];
  return (
    <mesh
      rotation={[Math.PI / 2, angle, 0]}
      position={[Math.sin(angle) * distance, -Math.cos(angle) * distance, 1]}
      material={materials}
    >
      <boxGeometry rotateX={Math.PI} args={[1, 1.4, 0.03]}/>
      <axesHelper />
    </mesh>
  );
}