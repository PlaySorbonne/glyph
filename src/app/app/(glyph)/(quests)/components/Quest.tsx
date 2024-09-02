import { cutString } from "@/utils";
import type { Quest } from "@prisma/client";
import Link from "next/link";

export default function Quest({ quest }: { quest: Quest }) {
  if (!quest) {
    return <div className="text-center text-gray-500 p-4">error : got no quest</div>;
  }

  return (
    <Link
      href={`/app/quest/${quest.id}`}
      className="bg-white rounded-lg max-w-sm mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4">{quest.title}</h1>
      <p className="text-gray-700">{cutString(quest.description, 100)}</p>
      {quest.description && quest.description.length > 100 && (
        <p className="text-gray-700 text-right font-bold">{"Plus..."}</p>
      )}
    </Link>
  );
}
