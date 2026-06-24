import { loadTexture } from "../../../../utils/imports/textures";

export default function CardImg({ name }: { name: string }) {
  return <img className="w-24 h-full rounded-md" src={loadTexture(name)} alt={name} />;
}
