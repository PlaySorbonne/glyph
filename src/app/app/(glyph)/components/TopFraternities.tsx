import { getLogo } from "@/assets/fraternities";
import Image from "next/image";

export default function TopFraternities({
  fraternities,
}: {
  fraternities: {
    id: number;
    name: string;
    score: number;
    description: string | null;
  }[];
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.7)",
        padding: "1rem",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <h2
        className="font-semibold mb-4 text-center"
        style={{
          fontSize: "2rem",
          fontFamily: "DCC-Ash",
          letterSpacing: "0.1rem",
          color: "rgba(0, 0, 0, 0.8)",
        }}
      >
        Podium des Fratries
      </h2>
      <div className="flex justify-center items-end h-64 mb-8">
        {/* 2nd place */}
        <div className="w-1/4 mx-2">
          <div className="h-40 flex flex-col justify-end items-center p-2 rounded-t-lg">
            <span className="text-2xl font-bold text-gray-700">2</span>
            <Image
              src={getLogo(fraternities[1].id)}
              width={100}
              height={100}
              alt={`${fraternities[1].name} logo`}
            />
            <h3 className="text-lg font-medium text-gray-800 text-center">
              {fraternities[1].name}
            </h3>
            <p className="text-md font-semibold text-indigo-600">
              {fraternities[1].score} pts
            </p>
          </div>
        </div>
        {/* 1st place */}
        <div className="w-1/3 mx-2">
          <div className="bg-yellow-200 h-52 flex flex-col justify-end items-center p-2 rounded-t-lg">
            <span className="text-3xl font-bold text-yellow-700">1</span>
            <Image
              src={getLogo(fraternities[0].id)}
              width={100}
              height={100}
              alt={`${fraternities[0].name} logo`}
            />
            <h3 className="text-xl font-medium text-gray-800 text-center">
              {fraternities[0].name}
            </h3>
            <p className="text-lg font-semibold text-indigo-600">
              {fraternities[0].score} pts
            </p>
          </div>
        </div>
        {/* 3rd place */}
        <div className="w-1/4 mx-2">
          <div className="bg-orange-200 h-32 flex flex-col justify-end items-center p-2 rounded-t-lg">
            <span className="text-xl font-bold text-orange-700">3</span>
            <Image
              src={getLogo(fraternities[2].id)}
              width={100}
              height={100}
              alt={`${fraternities[2].name} logo`}
            />
            <h3 className="text-lg font-medium text-gray-800 text-center">
              {fraternities[2].name}
            </h3>
            <p className="text-md font-semibold text-indigo-600">
              {fraternities[2].score} pts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
