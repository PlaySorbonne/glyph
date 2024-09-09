import { getAvailableSecondaryQuests, getFinishedQuests } from "@/actions/quests";
import Quests from "./components/Quests";
import { appUrl } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";
import { getUserFromSession } from "@/actions/auth";
import { getGlyph } from "@/assets/glyphs";
import Image from "next/image";

export default async function Home() {
  let user = await getUserFromSession();
  let quests = await getAvailableSecondaryQuests(user!.id);
  let finishedQuests = await getFinishedQuests(user!.id).then((quests) =>
    quests.filter((quest) => !quest.secondary)
  );

  return (
    <div>
      <div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "0.5rem",
            padding: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "2px solid rgba(0, 0, 0, 0.9)",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Link href={appUrl("/book")}>
            <h2
              className="text-2xl font-semibold mb-4"
              style={{
                fontFamily: "DCC-Ash",
                letterSpacing: "0.2rem",
                textAlign: "center",
              }}
            >
              Continuez de reconstituer le Glyph principal !
            </h2>

            <div
              style={{
                height: 200,
                width: 200,
              }}
            >
              {finishedQuests.map((quest, index) => (
                <Image
                  src={getGlyph(quest.img)}
                  alt="glyph"
                  width={200}
                  key={index}
                  style={{
                    position: "absolute",
                    left: "20%",
                    imageRendering: "pixelated",
                  }}
                />
              ))}
            </div>
          </Link>
        </div>

        <div
          style={{
            fontFamily: "DCC-Ash",
            letterSpacing: "0.1rem",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "0.5rem",
            padding: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            fontSize: "1.5rem",
          }}
        >
          <p>
            Retrouvez-nous à nos permanences devant la maison de vie étudiante
            pour plus de quêtes !
          </p>
        </div>

        {quests.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Quêtes secondaires disponibles
            </h2>
            <Quests quests={quests} />
          </section>
        )}
      </div>
    </div>
  );
}
