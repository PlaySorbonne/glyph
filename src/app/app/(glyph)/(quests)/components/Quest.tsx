import { cutString } from "@/utils";
import type { Quest } from "@prisma/client";
import Link from "next/link";

export default function Quest({ quest }: { quest: Quest }) {
  if (!quest) {
    return (
      <div className="text-center text-gray-500 p-4">error : got no quest</div>
    );
  }

  return (
    <Link
      href={`/app/quest/${quest.id}`}
      className="rounded-lg max-w-sm mx-auto"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "0.5rem",
        padding: "1rem",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "2px solid rgba(0, 0, 0, 0.9)",
        width: "100%",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}>
        <h1 className="text-2xl font-bold mb-4">{quest.title}</h1>
        {quest.starts &&
          quest.starts >
            new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) && (
            <p>{"nv!"}</p>
          )}
      </div>
      <p className="text-gray-700">{cutString(quest.mission, 100)}</p>
      <p className="text-gray-700 text-right font-bold">{"Plus..."}</p>
    </Link>
  );
}
