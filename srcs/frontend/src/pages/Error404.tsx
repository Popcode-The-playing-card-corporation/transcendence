import image from "../../public/assets/404Image.jpg";

export default function Error404() {
	return (
		<div className="page-content mt-17">
			<h1 className="mb-10">Error 404 : page not found</h1>
			<div className="flex justify-center ">
				<img src={image} className="w-xl"></img>
			</div>
		</div>
	);
} 