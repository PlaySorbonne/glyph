import { getClassement } from "@/actions/fraternity";
import { getUsers } from "@/actions/users";
import styles from "./page.module.css";
import { getLogo } from "@/assets/fraternities";
import Image from "next/image";
import TopFraternities from "../components/TopFraternities";

export const dynamic = "force-dynamic";

export const revalidate = 3600; // invalidate every hour

export default async function ScorePage() {
  let fraternities = await getClassement();
  let users = await getUsers({ sortByPoint: true, n: 10 });

  while (fraternities.length < 3) {
    fraternities.push({
      id: fraternities.length,
      name: "Fraternité " + (fraternities.length + 1),
      description: "",
      score: 0,
    });
  }

  return (
    <div
      style={{
        width: "95vw",
      }}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <TopFraternities fraternities={fraternities} />
        <div className={styles.wrapper}>
          <h2
            className="text-2xl font-semibold mb-4 text-center"
            style={{
              fontFamily: "DCC-Ash",
              letterSpacing: "0.1rem",
              color: "rgba(0, 0, 0, 0.8)",
            }}
          >
            Top 10
          </h2>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-md"
              >
                <div className="flex items-center">
                  <Image
                    src={getLogo(user.fraternityId)}
                    width={50}
                    height={50}
                    alt={`${user.fraternityId} logo`}
                    style={{
                      padding: "3px",
                    }}
                  />
                  <h3 className="text-lg font-medium text-gray-800">
                    {user.name}
                  </h3>
                </div>
                <p className="text-lg font-semibold text-indigo-600">
                  {user.score} points
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
