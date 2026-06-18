import { MeshPhongMaterial, TextureLoader } from "three";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader } from "@react-three/fiber";

type Props = {
  card: string, 
  id: number,
  posPlayedCard: number 
}

export default function PlayedCard({card, id, posPlayedCard} : Props) {

  const textureFront = useLoader(TextureLoader, loadTexture(card)!);
  const back = useLoader(TextureLoader, loadTexture("back")!);
  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: textureFront}),
    new MeshPhongMaterial({map: back})
  ];

  return (
  <>
    <mesh
      position={[0, posPlayedCard, 0]}
      material={materials}
    >
	{/* { id === 0 ? <></> : <boxGeometry args={[1, 1.4, 0.01]}/>} */}
    </mesh>
  </>
  );
}
