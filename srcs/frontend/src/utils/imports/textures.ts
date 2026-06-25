import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import generateDeck from "../createDeck";

const C6 = "/assets/cards/6Clubs.png";
const C7 = "/assets/cards/7Club.png";
const C8 = "/assets/cards/8Clubs.png";
const C9 = "/assets/cards/9Clubs.png";
const C10 = "/assets/cards/10Clubs.png";
const CJ = "/assets/cards/JClubs.png";
const CQ = "/assets/cards/QClubs.png";
const CK = "/assets/cards/KClubs.png";
const CA = "/assets/cards/AClubs.png";
const D6 = "/assets/cards/6Diamonds.png";
const D7 = "/assets/cards/7Diamonds.png";
const D8 = "/assets/cards/8Diamonds.png";
const D9 = "/assets/cards/9Diamonds.png";
const D10 = "/assets/cards/10Diamonds.png";
const DJ = "/assets/cards/JDiamonds.png";
const DQ = "/assets/cards/QDiamonds.png";
const DK = "/assets/cards/KDiamonds.png";
const DA = "/assets/cards/ADiamonds.png";
const H6 = "/assets/cards/6Hearts.png";
const H7 = "/assets/cards/7Hearts.png";
const H8 = "/assets/cards/8Hearts.png";
const H9 = "/assets/cards/9Hearts.png";
const H10 = "/assets/cards/10Hearts.png";
const HJ = "/assets/cards/JHearts.png";
const HQ = "/assets/cards/QHearts.png";
const HK = "/assets/cards/KHearts.png";
const HA = "/assets/cards/AHearts.png";
const S6 = "/assets/cards/6Spades.png";
const S7 = "/assets/cards/7Spades.png";
const S8 = "/assets/cards/8Spades.png";
const S9 = "/assets/cards/9Spades.png";
const S10 = "/assets/cards/10Spades.png";
const SJ = "/assets/cards/JSpades.png";
const SQ = "/assets/cards/QSpades.png";
const SK = "/assets/cards/KSpades.png";
const SA = "/assets/cards/ASpades.png";
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
