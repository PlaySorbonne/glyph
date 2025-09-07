import { getUserFromSession } from "@/actions/auth";
import {
  getFinishedOnMainHistory,
} from "@/actions/quests";
import { glyphStringToArray } from "@/utils";
import GlyphGallery from "./GlyphGallery";

export default async function Page() {
  const user = (await getUserFromSession())!;

  const finishedHistory = await getFinishedOnMainHistory(user.id);

  const galleryProps = finishedHistory.map((h) => {
    if (!h.quest || !h.quest.glyph) return null;
    if (!h.quest.glyphPositionX || !h.quest.glyphPositionY) return null;
    let glyphArray = glyphStringToArray(h.quest.glyph);
    if (!glyphArray) glyphArray = [];
    return {
      quest_title: h.quest.title,
      glyph: glyphArray,
      id: h.quest.id,
      found_on: h.date,
      coords: [h.quest.glyphPositionX, h.quest.glyphPositionY] as [
        number,
        number
      ],
    };
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        padding: "2rem",
      }}
    >
      {galleryProps.length > 0 ? (
        <GlyphGallery glyphs={galleryProps} />
      ) : (
        <p>Page vérouillée</p>
      )}
    </div>
  );
}
