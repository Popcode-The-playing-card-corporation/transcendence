import { useGame } from "../context/GameContext";

export default function SliderLimiters() {

	const { state, setNBGames, setNBPoints} = useGame();
	let is_host = false;
	if (state.settings.listPlayer.filter(user => user.is_host)[0]) {
		is_host = state.user === state.settings.listPlayer.filter(user => user.is_host)[0].username;
	}
	const nb_points = state.settings.nb_points;
	const nb_games = state.settings.nb_games;

	function get_points(val: string) {
		if (val === "0") return 333;
		if (val === "1") return 666;
		return 1000;
	}

	function get_games(val: string) {
		if (val === "0") return 3;
		if (val === "1") return 6;
		return 10;
	}

  if (state.settings.goal === "points") {
    return (
      <>
        <input
          type="range"
          min="0"
          max="2"
          value={nb_points === 333 ? "0" : nb_points === 666 ? "1" : "2"}
          className="range [--range-thumb:var(--font-color)] [--range-progress:var(--nav-color)] glass"
          step="1"
          onChange={(e) => setNBPoints(get_points(e.target.value))}
		  disabled={!is_host}
        />
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>Short (333)</span>
          <span>Medium (666)</span>
          <span>Long (1000)</span>
        </div>
      </>
    );
  } else  {
    return (
      <>
        <input
          type="range"
          min="0"
          max="2"
          value={nb_games === 3 ? "0" : nb_games === 6 ? "1" : "2"}
          className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
          step="1"
          onChange={(e) => setNBGames(get_games(e.target.value))}
		  disabled={!is_host}
        />
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>Short (3)</span>
          <span>Medium (6)</span>
          <span>Long (10)</span>
        </div>
      </>
    );
  } 
}
