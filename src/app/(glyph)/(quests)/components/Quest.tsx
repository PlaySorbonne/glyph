import type { Quest } from "@prisma/client";
import Link from "next/link";

export default function Quest({ quest }: { quest: Quest }) {
  if (!quest) {
    return <div className="text-center text-gray-500 p-4">error : got no quest</div>;
  }

  return (
    <Link
      href={`/quest/${quest.id}`}
      className="bg-white rounded-lg max-w-sm mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4">{quest.title}</h1>
      <p className="text-gray-700">{quest.description}</p>
    </Link>
  );
}
