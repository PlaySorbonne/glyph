import { getUserFromSession } from "@/actions/auth";
import {
  getNewlyCreatedQuests,
  getAvailableSecondaryQuests,
} from "@/actions/quests";
import { cookies } from "next/headers";
import Quests from "./components/Quests";
import { appUrl } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  let session = cookies().get("session")?.value;
  let user = await getUserFromSession(session);
  let liveQuests = await getNewlyCreatedQuests(user!.id);
  let secondaryQuests = await getAvailableSecondaryQuests(user!.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <Link href={appUrl("/book")}>
          <h2 className="text-2xl font-semibold mb-4" style={{
            fontFamily: "DCC-Ash",
            letterSpacing: "0.2rem",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "0.5rem",
            padding: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}>
            Continuez de reconstituer le Glyph principale !
          </h2>
        </Link>
        
        {liveQuests.length > 0 && (
          <section className={styles.section}>
            <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
              Quêtes nouvellement annoncées
            </h2>
            <Quests quests={liveQuests} />
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Quêtes disponibles :
          </h2>
          <Quests quests={secondaryQuests} />
        </section>
      </div>
    </div>
  );
}
