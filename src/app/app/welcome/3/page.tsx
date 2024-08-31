import Link from "next/link";
import Fraternities, { getBackground } from "@/assets/fraternities";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { fraternityId: string };
}) {
  const fraternityId = searchParams.fraternityId;
  const background = getBackground(parseInt(fraternityId));
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Si y a plus de bla bla
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
