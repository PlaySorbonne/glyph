import icons from "@/assets/icons";
import Image from "next/image";

export default function Map() {
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <Image
          src={icons.lock}
          alt="lock"
          className="w-32 h-32 text-gray-400 mb-4 mx-auto"
        />
        <p className="text-xl text-gray-600">
          Faites au moins une mission principale pour débloquer
        </p>
      </div>
    </div>
  );
}
