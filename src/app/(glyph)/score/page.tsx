import { getClassement } from "@/actions/fraternity";
import { getUsers } from "@/actions/users";

export default async function ScorePage() {
    let fraternities = await getClassement();
    let users = await getUsers({ sortByPoint: true, n: 10 });
    
    while (fraternities.length < 3) {
        fraternities.push({ id: fraternities.length, name: "Fraternité " + (fraternities.length + 1), description: "", score: 0 });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">Classements</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Podium des Fraternités</h2>
                    <div className="flex justify-center items-end h-64 mb-8">
                        {/* 2nd place */}
                        <div className="w-1/4 mx-2">
                            <div className="bg-gray-200 h-40 flex flex-col justify-end items-center p-2 rounded-t-lg">
                                <span className="text-2xl font-bold text-gray-700">2</span>
                                <h3 className="text-lg font-medium text-gray-800 text-center">{fraternities[1].name}</h3>
                                <p className="text-md font-semibold text-indigo-600">{fraternities[1].score} pts</p>
                            </div>
                        </div>
                        {/* 1st place */}
                        <div className="w-1/3 mx-2">
                            <div className="bg-yellow-200 h-52 flex flex-col justify-end items-center p-2 rounded-t-lg">
                                <span className="text-3xl font-bold text-yellow-700">1</span>
                                <h3 className="text-xl font-medium text-gray-800 text-center">{fraternities[0].name}</h3>
                                <p className="text-lg font-semibold text-indigo-600">{fraternities[0].score} pts</p>
                            </div>
                        </div>
                        {/* 3rd place */}
                        <div className="w-1/4 mx-2">
                            <div className="bg-orange-200 h-32 flex flex-col justify-end items-center p-2 rounded-t-lg">
                                <span className="text-xl font-bold text-orange-700">3</span>
                                <h3 className="text-lg font-medium text-gray-800 text-center">{fraternities[2].name}</h3>
                                <p className="text-md font-semibold text-indigo-600">{fraternities[2].score} pts</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Top 10 Utilisateurs</h2>
                    <div className="space-y-4">
                        {users.map((user, index) => (
                            <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold mr-3 text-gray-700">{index + 1}.</span>
                                    <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                                </div>
                                <p className="text-lg font-semibold text-indigo-600">{user.score} points</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}