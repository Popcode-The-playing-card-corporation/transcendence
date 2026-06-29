import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import generateDeck from "../createDeck";

const C6 = "/assets/cards/6club.png";
const C7 = "/assets/cards/7club.png";
const C8 = "/assets/cards/8club.png";
const C9 = "/assets/cards/9club.png";
const C10 = "/assets/cards/10club.png";
const CJ = "/assets/cards/Jclub.png";
const CQ = "/assets/cards/Qclub.png";
const CK = "/assets/cards/Kclub.png";
const CA = "/assets/cards/Aclub.png";
const D6 = "/assets/cards/6diamond.png";
const D7 = "/assets/cards/7diamond.png";
const D8 = "/assets/cards/8diamond.png";
const D9 = "/assets/cards/9diamond.png";
const D10 = "/assets/cards/10diamond.png";
const DJ = "/assets/cards/Jdiamond.png";
const DQ = "/assets/cards/Qdiamond.png";
const DK = "/assets/cards/Kdiamond.png";
const DA = "/assets/cards/Adiamond.png";
const H6 = "/assets/cards/6heart.png";
const H7 = "/assets/cards/7heart.png";
const H8 = "/assets/cards/8heart.png";
const H9 = "/assets/cards/9heart.png";
const H10 = "/assets/cards/10heart.png";
const HJ = "/assets/cards/Jheart.png";
const HQ = "/assets/cards/Qheart.png";
const HK = "/assets/cards/Kheart.png";
const HA = "/assets/cards/Aheart.png";
const S6 = "/assets/cards/6spade.png";
const S7 = "/assets/cards/7spade.png";
const S8 = "/assets/cards/8spade.png";
const S9 = "/assets/cards/9spade.png";
const S10 = "/assets/cards/10spade.png";
const SJ = "/assets/cards/Jspade.png";
const SQ = "/assets/cards/Qspade.png";
const SK = "/assets/cards/Kspade.png";
const SA = "/assets/cards/Aspade.png";
const Back = "/assets/cards/back.png";

export function preloadCards() {
	const deck = generateDeck();
	useLoader.preload(TextureLoader, loadTexture("back"));
	deck.forEach((card) => {
		useLoader.preload(TextureLoader, loadTexture(card.value + card.color));
	})


    deck.forEach((card) => {
        const img = new Image();
        img.src = `/assets/${card.value}${card.color}.png`;
    });

	const bgimg = new Image();
	bgimg.src = "/assets/bg_game.png"

    const back = new Image();
    back.src = "/assets/back.png";
}

export function loadTexture(name: string) : string {
  const textures = new Map([
    ["6heart", H6],
    ["7heart", H7],
    ["8heart", H8],
    ["9heart", H9],
    ["10heart", H10],
    ["Jheart", HJ],
    ["Qheart", HQ],
    ["Kheart", HK],
    ["Aheart", HA],
    ["6diamond", D6],
    ["7diamond", D7],
    ["8diamond", D8],
    ["9diamond", D9],
    ["10diamond", D10],
    ["Jdiamond", DJ],
    ["Qdiamond", DQ],
    ["Kdiamond", DK],
    ["Adiamond", DA],
    ["6club", C6],
    ["7club", C7],
    ["8club", C8],
    ["9club", C9],
    ["10club", C10],
    ["Jclub", CJ],
    ["Qclub", CQ],
    ["Kclub", CK],
    ["Aclub", CA],
    ["6spade", S6],
    ["7spade", S7],
    ["8spade", S8],
    ["9spade", S9],
    ["10spade", S10],
    ["Jspade", SJ],
    ["Qspade", SQ],
    ["Kspade", SK],
    ["Aspade", SA],
    ["back", Back],
  ]);
  const text = textures.get(name)
  if (text) return text;
  else return Back;
}
