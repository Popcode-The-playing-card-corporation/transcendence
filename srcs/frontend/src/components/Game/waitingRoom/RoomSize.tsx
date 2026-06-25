import type { SettingsT } from "../../../utils/type/boardDataType";
import { useNotif } from "../../hooks/useNotif";
import { useGame } from "../context/GameContext";

export default function RoomSize({updateSettings}:{updateSettings:(changes: Partial<SettingsT>) => void}) {

	const { state, setSize } = useGame();
	const notif = useNotif();
	let is_host = false;
	if (state.settings.listPlayer.filter(user => user.is_host)[0]) {
		is_host = state.user === state.settings.listPlayer.filter(user => user.is_host)[0].username;
	}

	function handle_change(e:number) {
		if (e < state.settings.listPlayer.length) {
			notif?.showNotif("Settings Error", "Max players cannot be smaller than amount of players currently in room", 5000);
			return ;
		}
		setSize(e);
		updateSettings({maxSize:e});
	}
	
  return (
    <div className="w-full max-w-xs">
      <input
        type="range"
        min="2"
        max="7"
        value={state.settings.maxSize}
        className="range [--range-progress:var(--color-base-200)] glass"
        step="1"
		onChange={(e) => handle_change(Number(e.target.value))} 
		disabled={!is_host}
		/>

      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
      </div>
    </div>
  );
}
