import { MeshPhongMaterial, Texture, type TextureEventMap } from "three";

type Props = {
  show: boolean;
  front: Texture<HTMLImageElement, TextureEventMap>,
  back: Texture<HTMLImageElement, TextureEventMap>,
  posPlayedCard: number 
}

export default function PlayedCard({show, front, back, posPlayedCard} : Props) {

  const materials = [
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({color: 0xffffff}),
    new MeshPhongMaterial({map: front}),
    new MeshPhongMaterial({map: back})
  ];

  if (!show) {
	return
  }

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
