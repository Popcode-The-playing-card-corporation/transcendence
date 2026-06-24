import C6 from "../../../public/assets/cards/6Clubs.png";
import C7 from "../../../public/assets/cards/7Club.png";
import C8 from "../../../public/assets/cards/8Clubs.png";
import C9 from "../../../public/assets/cards/9Clubs.png";
import C10 from "../../../public/assets/cards/10Clubs.png";
import CJ from "../../../public/assets/cards/JClubs.png";
import CQ from "../../../public/assets/cards/QClubs.png";
import CK from "../../../public/assets/cards/KClubs.png";
import CA from "../../../public/assets/cards/AClubs.png";
import D6 from "../../../public/assets/cards/6Diamonds.png";
import D7 from "../../../public/assets/cards/7Diamonds.png";
import D8 from "../../../public/assets/cards/8Diamonds.png";
import D9 from "../../../public/assets/cards/9Diamonds.png";
import D10 from "../../../public/assets/cards/10Diamonds.png";
import DJ from "../../../public/assets/cards/JDiamonds.png";
import DQ from "../../../public/assets/cards/QDiamonds.png";
import DK from "../../../public/assets/cards/KDiamonds.png";
import DA from "../../../public/assets/cards/ADiamonds.png";
import H6 from "../../../public/assets/cards/6Hearts.png";
import H7 from "../../../public/assets/cards/7Hearts.png";
import H8 from "../../../public/assets/cards/8Hearts.png";
import H9 from "../../../public/assets/cards/9Hearts.png";
import H10 from "../../../public/assets/cards/10Hearts.png";
import HJ from "../../../public/assets/cards/JHearts.png";
import HQ from "../../../public/assets/cards/QHearts.png";
import HK from "../../../public/assets/cards/KHearts.png";
import HA from "../../../public/assets/cards/AHearts.png";
import S6 from "../../../public/assets/cards/6Spades.png";
import S7 from "../../../public/assets/cards/7Spades.png";
import S8 from "../../../public/assets/cards/8Spades.png";
import S9 from "../../../public/assets/cards/9Spades.png";
import S10 from "../../../public/assets/cards/10Spades.png";
import SJ from "../../../public/assets/cards/JSpades.png";
import SQ from "../../../public/assets/cards/QSpades.png";
import SK from "../../../public/assets/cards/KSpades.png";
import SA from "../../../public/assets/cards/ASpades.png";
import Back from "../../../public/assets/cards/back.png";

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
