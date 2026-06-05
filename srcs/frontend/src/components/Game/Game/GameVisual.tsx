import { Canvas } from "@react-three/fiber";
import Hand from "./GameVisual/Hand";
import Board from "./GameVisual/Board";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function GameVisual() {
  return (
    <Canvas className="bg-(--green-color) w-3/4">
      <ambientLight />
      <Hand />
      <Board />
      <axesHelper/>
    </Canvas>
  );
}
