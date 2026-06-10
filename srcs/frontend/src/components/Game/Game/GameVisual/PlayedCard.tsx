import { MeshPhongMaterial, TextureLoader } from "three";
import { loadTexture } from "../../../../utils/imports/textures";
import { useLoader } from "@react-three/fiber";

export default function PlayedCard({card, id, total} : {card:string, id: number, total:number}) {

  const angle = (360* id /total) * (Math.PI / 180);
  const distance = 1.8;
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
  <>
    <mesh
      rotation={[0, 0, angle]}
      position={[Math.sin(angle) * distance, -Math.cos(angle) * distance, 0]}
      material={materials}
    >
	{ id === 0 ? <></> : <boxGeometry args={[1, 1.4, 0.01]}/>}
    </mesh>
  </>
  );
}
