import Chrono from "./waitingRoom/Chrono";
import ParameterRoom from "./waitingRoom/parameterRoom";
import PlayerList from "./waitingRoom/playerList";

export default function WaitingRoom() {

    return (
      <>  
        <h1>Waiting Room</h1>
        <div className="grid grid-cols-4 gap-6">
          <div className=" space-y-6 mt-10">
            <p>Room Code : jdasjdbadasda</p>
            <Chrono />
            <div className="flex justify-center">
              <button className="btn">Start Game</button>
            </div>
          </div>
          <div className=" space-y-6">
            <PlayerList />
            <button className="btn">Invite your friends</button>
          </div>
          <div className="col-span-2">
            <ParameterRoom />
          </div>
        </div>
      </>
    );
}