import PlayerList from "./waitingRoom/playerList";

export default function WaitingRoom() {

    return (
      <div>  
        <h1>Waiting Room</h1>
        <div className="grid grid-cols-2 w-xl gap-6">
          <PlayerList />
          <button className="btn ">Start Game</button>
        </div>
      </div>
    );
}