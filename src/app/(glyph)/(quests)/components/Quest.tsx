import type { Quest } from "@prisma/client";

export default function Quest({ quest }: { quest: Quest }) {
    if (!quest) {
        return <div>Got no quest</div>;
    }
    
    return <div>
        <h1>{quest.title}</h1>
        <p>{quest.description}</p>
    </div>
}