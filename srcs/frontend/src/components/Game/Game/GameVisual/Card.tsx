import { useState } from "react";

export default function Card() {
  const [active, setActive] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  return (
    <mesh onClick={() => setActive(!active)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} scale={active ? 1.5 : 1}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hover ? "blue" : "red"}/>
    </mesh>
  );
}
