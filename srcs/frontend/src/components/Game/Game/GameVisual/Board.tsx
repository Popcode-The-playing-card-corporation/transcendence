
export default function Board() {
  return (
    <mesh rotation={[-0.4, 0, 0]} position={[0, 0.5, 0]}>
      <circleGeometry args={[3, 50]}/>
      <meshStandardMaterial color={"#ad12b4"}/>
    </mesh>
  );
}
