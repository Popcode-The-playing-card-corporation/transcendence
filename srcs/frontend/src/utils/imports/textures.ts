import C10 from "../../assets/cards/10Clubs.png";
import D10 from "../../assets/cards/10Diamonds.png";
import H10 from "../../assets/cards/10Hearts.png"
import S10 from "../../assets/cards/10Spades.png"
import C6 from "../../assets/cards/6Clubs.png"

export function loadTexture(name: string): string {
  const textures = {
    "10Clubs": C10,
    "10Diamonds": D10,
  };
  return textures[name];
}
