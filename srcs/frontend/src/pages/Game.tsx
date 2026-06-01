import CreateOrJoin from "../components/Game/CreateOrJoin";

export function Game() {
	const isInWaitingRoom = false;
  return (
	  !isInWaitingRoom ? <CreateOrJoin /> : <></>
  );
}
