import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Card from "./GameVisual/Card";

export default function GameVisual() {
  return (
    <Canvas className="bg-(--green-color) w-3/4">
      <ambientLight />
      <Card />
    </Canvas>
  );
}
