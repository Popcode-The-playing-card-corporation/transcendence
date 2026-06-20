import { useRef } from "react";
import generateFakeLastFold from "../../../../utils/test_funcs/generateFakeLastFold"
import useImage from "../../../../utils/imports/useImage";

export default function FoldModal() {
	const lastFold = generateFakeLastFold();
	const lastFoldRef = useRef<HTMLDialogElement>(null)
	const { image, loading } = useImage(lastFold[0].value + lastFold[0].color)
	console.log(image);

	return (
    <div>
      <button
        className={"btn btn-circle"}
        onClick={() => lastFoldRef.current?.showModal()}
        >
        Annonces
      </button>
      <dialog id="endingGame" className="modal text-center" ref={lastFoldRef}>
        <div className="modal-box bg-(--bg-color)">
          <h2>Last fold</h2>
		  <div>
		  {loading ? (<p>loading..</p>) :
		  (<img src={image?.currentSrc}/>)

		  }
		  </div>
          <div className="modal-action">
            <form method="dialog" className="flex justify-between w-full">
              <button className="btn" onClick={() => lastFoldRef.current?.close()}>
                Continue
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
	)
}
