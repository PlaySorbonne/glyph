import Link from "next/link";
import Fraternities, { getBackground, getName, getLogo } from "@/assets/fraternities";
import Image from "next/image";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { fraternityId: string };
}) {
  const fraternityId = searchParams.fraternityId;
  const background = getBackground(parseInt(fraternityId));
  const fraternity = getName(parseInt(fraternityId));
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    <Image src={getLogo(parseInt(fraternityId))} alt={fraternity} width={100} height={100} />
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{
          fontFamily: "DCC-Ash",
          letterSpacing: "0.2rem",
        }}>
          Hmm... {fraternity} !
        </h1>
        <p className="text-lg mb-8 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
          voluptate beatae maxime rerum quibusdam tempore temporibus molestias
          ex, cumque possimus qui? Ex ipsa tempore nemo, modi vitae alias
          aliquam magni iure dolor debitis odit autem rerum sit sequi, tenetur
          quos.
        </p>
        <Link
          href="/app"
          className="block w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
        >
          Commencer
        </Link>
      </div>
    </div>
  );
}
