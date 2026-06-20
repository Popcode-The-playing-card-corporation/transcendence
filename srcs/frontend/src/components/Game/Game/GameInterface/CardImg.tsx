import useImage from "../../../../utils/imports/useImage";


export default function CardImg({ name }: { name: string }) {
  const { image } = useImage(name);
  return <img className="w-24 h-full rounded-md" src={image} alt={name} />;

}
