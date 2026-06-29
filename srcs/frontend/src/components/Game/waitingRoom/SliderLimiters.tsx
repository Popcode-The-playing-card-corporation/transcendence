import type { SettingsT } from "../../../utils/type/boardDataType";
import { useGame } from "../context/GameContext";

export default function SliderLimiters({updateSettings}:{updateSettings:(changes: Partial<SettingsT>) => void}) {

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
		if (val === "0") return 1;
		if (val === "1") return 3;
		if (val === "2") return 6;
		return 10;
	}

	function handle_change(e:number,send_val : (e:number) => void, type:string ) {
		send_val(e);
		if (type === "points") {
			updateSettings({nb_points: e});
		} else {
			updateSettings({nb_games: e})
		}
	}

  if (state.settings.goal === "points") {
    return (
      <>
        <input
          type="range"
          min="0"
          max="2"
          value={nb_points === 333 ? "0" : nb_points === 666 ? "1" : "2"}
          className="range [--range-progress:var(--color-secondary)] glass"
          step="1"
          onChange={(e) => handle_change(get_points(e.target.value), setNBPoints, "points")}
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
          max="3"
          value={nb_games === 1 ? "0" : nb_games === 3 ? "1" : nb_games === 6 ? "2" : "3"}
          className="range [--range-progress:var(--color-primary)] glass"
          step="1"
          onChange={(e) => handle_change(get_games(e.target.value), setNBGames, "games")}
		  disabled={!is_host}
        />
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
		  <span>|</span>
        </div>
        <div className="flex justify-between px-2.5 mt-2 text-xs">
		  <span>Tiny (1)</span>
          <span>Short (3)</span>
          <span>Medium (6)</span>
          <span>Long (10)</span>
        </div>
      </>
    );
  } 
}
