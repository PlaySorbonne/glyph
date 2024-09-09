import { StaticImageData } from "next/image";
import creature from "./creature.png";
import elixir from "./elixir.png";
import heros from "./heros.png";
import lion from "./lion.png";
import plume from "./plume.png";
import sceptre from "./sceptre.png";
import troisYeux from "./trois_yeux.png";
import vaisseau from "./vaisseau.png";

const Glyphs = {
  creature,
  elixir,
  heros,
  lion,
  plume,
  sceptre,
  troisYeux,
  vaisseau,
};

export function getGlyph(glyph?: string | null): StaticImageData {
  if (!glyph) return heros;
  // @ts-ignore
  return Glyphs[glyph] ?? heros;
}

export default Glyphs;
