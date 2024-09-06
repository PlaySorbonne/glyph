import FondJaune from "./fond_jaune.png";
import FondRouge from "./fond_rouge.png";
import FondVert from "./fond_vert.png";
import LogoJaune from "./logo_jaune.png";
import LogoRouge from "./logo_rouge.png";
import LogoVert from "./logo_vert.png";
import FondBlanc from "./fond_blanc.png";

import LogoFlat from "../logo-flat.png";

let Fraternities = {
  pietr: {
    fond: FondJaune,
    logo: LogoJaune,
  },
  saka: {
    fond: FondRouge,
    logo: LogoRouge,
  },
  foli: {
    fond: FondVert,
    logo: LogoVert,
  },
  default: {
    fond: FondBlanc,
    logo: LogoFlat,
  },
};

export function getBackground(fraternityId?: number) {
  switch (fraternityId) {
    case 1:
      return Fraternities.pietr.fond;
    case 2:
      return Fraternities.saka.fond;
    case 3:
      return Fraternities.foli.fond;
    default:
      return Fraternities.default.fond;
  }
}

export function getLogo(fraternityId?: number | null) {
  switch (fraternityId) {
    case 1:
      return Fraternities.pietr.logo;
    case 2:
      return Fraternities.saka.logo;
    case 3:
      return Fraternities.foli.logo;
    default:
      return Fraternities.default.logo;
  }
}

export function getName(fraternityId?: number | null) {
  return { 1: "Pietr", 2: "Saka", 3: "Foli" }[fraternityId || 0] || "Inconnue";
}

export default Fraternities;
