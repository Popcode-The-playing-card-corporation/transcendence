import Chrono from "./Chrono"

export default function InfoAndActionPart() {
	return (
          <div className=" space-y-6 mt-10 col-span-3">
            <div className="flex justify-center">
              <button className="btn">Start Game</button>
            </div>
            <div className="flex flex-row gap-3">
              <p className="w-full flex justify-center">Room Code</p>
              <p className="w-full flex justify-center rounded-md bg-(--hover-color) text-lg">jdasjdbadasda</p>
            </div>
            <Chrono />
          </div>

	)
}
