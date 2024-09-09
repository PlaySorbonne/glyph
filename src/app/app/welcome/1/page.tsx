import { getUserFromSession } from "@/actions/auth";
import Fraternities from "@/assets/fraternities";
import { appUrl } from "@/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  let user = await getUserFromSession();
  if (user!.name && user!.fraternityId) return redirect(appUrl("/"));

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${Fraternities.default.fond.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center" style={{
          fontFamily: "DCC-Ash",
          letterSpacing: "0.2rem",
        }}>
          Glyph... ?
        </h1>
        <p className="text-lg mb-8 text-center">
          Votre mission : <b>reconstituer le Glyph Ancestral</b> en explorant le
          campus, en relevant des défis donnés par notre site ou nos donneurs de
          missions en brassard et en résolvant des énigmes pour retrouver les
          fragments cachés.
        </p>
        <Link
          href="/app/welcome/2"
          className="block w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
        >
          Commencer l&apos;aventure
        </Link>
      </div>
    </div>
  );
}
