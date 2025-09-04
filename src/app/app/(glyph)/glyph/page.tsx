import { getSession, getUserFromSession } from "@/actions/auth";
import { getFinishedMainQuests, getFinishedOnMainHistory } from "@/actions/quests";
import { glyphStringToArray } from "@/utils";
import GlyphGallery from "./GlyphGallery";
import { randomInt } from "crypto";

export default async function Page() {
  const user = (await getUserFromSession())!;

  const finishedHistory = await getFinishedOnMainHistory(user.id);

  const galleryProps = finishedHistory.map((h) => ({
    quest_title: h.quest!.title,
    glyph: glyphStringToArray(h.quest!.glyph)!,
    id: randomInt(1, 1000000),
    found_on: h.date,
  }));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        padding: "2rem",
      }}
    >
      {galleryProps.length > 0 ? (
        <GlyphGallery glyphs={[...galleryProps, ...galleryProps]} />
      ) : (
        <p>Page vérouillée</p>
      )}
    </div>
  );
}
