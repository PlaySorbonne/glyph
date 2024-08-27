import { getUserFromSession } from "@/actions/auth";
import { getFraternity } from "@/actions/fraternity";

export default async function Account() {
  let user = await getUserFromSession();
  let fraternity = await getFraternity(user!.fraternityId);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">
        Mon Compte
      </h1>
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Informations Personnelles
          </h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Nom:</span> {user!.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Score:</span> {user?.score} points
            </p>
            {fraternity && (
              <p className="text-lg">
                <span className="font-semibold">Fraternité:</span>{" "}
                {fraternity?.name}
              </p>
            )}
          </div>
        </section>
        <section></section>
      </div>
    </div>
  );
}
