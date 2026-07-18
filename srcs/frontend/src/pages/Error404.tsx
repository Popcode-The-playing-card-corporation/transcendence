import image from "../../static/404-stitch.png";

export default function Error404() {
	return (
		<div className="page-content mt-17">
			<h1 className="mb-10">Error 404 : page not found</h1>
			<div className="flex justify-center ">
				<img src={image} className="w-xl rounded-2xl"></img>
			</div>
		</div>
	);
}
