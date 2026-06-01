import Chrono from "./waitingRoom/Chrono";
import InviteYourFriends from "./waitingRoom/InviteYourFriends";
import ParameterRoom from "./waitingRoom/parameterRoom";
import PlayerList from "./waitingRoom/playerList";

export default function WaitingRoom() {

    return (
      <>  
        <h1>Waiting Room</h1>
        <div className="grid grid-cols-4 gap-6">
          <div className=" space-y-6 mt-10">
            <div className="flex justify-center">
              <button className="btn">Start Game</button>
            </div>
            <div className="flex flex-row gap-3">
              <p className="w-full flex justify-center">Room Code</p>
              <p className="w-full flex justify-center rounded-md bg-(--hover-color) text-lg">jdasjdbadasda</p>
            </div>
            <Chrono />
          </div>
          <div className=" space-y-6">
            <PlayerList />
            <InviteYourFriends />
          </div>
          <div className="col-span-2">
            <ParameterRoom />
          </div>
        </div>
      </>
    );
}