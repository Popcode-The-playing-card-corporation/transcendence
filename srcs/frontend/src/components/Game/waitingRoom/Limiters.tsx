import SliderLimiters from "./SliderLimiters";
import { useGame } from "../context/GameContext";

export default function Limiters() {

	const { state, setGoal } = useGame(); 
	let is_host = false;
	if (state.settings.listPlayer.filter(user => user.is_host)[0]) {
		is_host = state.user === state.settings.listPlayer.filter(user => user.is_host)[0].username;
	}

  function handle_click() {
		if (state.settings.goal === "games") {
			setGoal("points");
		} else {
			setGoal("games");
		}
  }

  return (
    <div className="w-full max-w-xs ">
      <div className="flex mb-10 gap-4 justify-center items-center">
        <p>Rounds</p>
        <input
          type="checkbox"
          checked={state.settings.goal !== "games"}
          className="toggle border-primary bg-primary text-base-content checked:border-secondary checked:bg-secondary checked:text-base-content"
          onClick={handle_click}
		  disabled={!is_host}
        />
        <p>Points</p>
      </div>
      <SliderLimiters  />
    </div>
  );
}
