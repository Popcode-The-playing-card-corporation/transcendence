import { Canvas } from "@react-three/fiber";
import Hand from "./GameVisual/Hand";
import Board from "./GameVisual/Board";
import { OrbitControls } from '@react-three/drei'

export default function GameVisual() {
  return (
    <Canvas className="bg-(--green-color) w-3/4">
      <ambientLight />
      <Board />
      <Hand />
      <OrbitControls />
      <axesHelper />

    </Canvas>
  );
}
