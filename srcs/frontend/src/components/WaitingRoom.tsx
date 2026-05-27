import ParameterRoom from "./waitingRoom/parameterRoom";
import PlayerList from "./waitingRoom/playerList";

export default function WaitingRoom() {

    return (
      <>  
        <h1>Waiting Room</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className=" space-y-6 ">
            <PlayerList />
            <button className="btn">Start Game</button>
          </div>
          <div className="col-span-2">
            <ParameterRoom />
          </div>
        </div>
      </>
    );
}