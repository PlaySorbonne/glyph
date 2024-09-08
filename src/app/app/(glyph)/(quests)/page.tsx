import { getRecenltyActiveQuests } from "@/actions/quests";
import Quests from "./components/Quests";
import { appUrl } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  let liveQuests = await getRecenltyActiveQuests();

  return (
    <div>
      <div>
        <Link href={appUrl("/book")}>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{
              fontFamily: "DCC-Ash",
              letterSpacing: "0.2rem",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "0.5rem",
              padding: "1rem",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            Continuez de reconstituer le Glyph principal !
          </h2>
        </Link>

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

        {liveQuests.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Quêtes nouvellement annoncées
            </h2>
            <Quests quests={liveQuests} />
          </section>
        )}
      </div>
    </div>
  );
}
