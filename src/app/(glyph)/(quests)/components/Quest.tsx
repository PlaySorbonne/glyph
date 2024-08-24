import type { Quest } from "@prisma/client";
import Link from "next/link";

export default function Quest({ quest }: { quest: Quest }) {
  if (!quest) {
    return <div className="text-center text-gray-500 p-4">error : got no quest</div>;
  }

  return (
    <Link
      href={`/quest/${quest.id}`}
      className="bg-white shadow-md rounded-lg p-6 m-4 max-w-sm mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4 text-purple-600">{quest.title}</h1>
      <p className="text-gray-700">{quest.description}</p>
    </Link>
  );
}
