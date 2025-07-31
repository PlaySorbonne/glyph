"use client";

import { useState, useTransition } from "react";

export default function SubQuestsChooser({
  name,
  quests,
  onAdd,
  onRemove,
  defaultSelected = [],
}: {
  name?: string;
  quests: { id: number; title: string }[];
  onAdd?: (id: number) => Promise<void>;
  onRemove?: (id: number) => Promise<void>;
  defaultSelected?: number[];
}) {
  let [selectedQuests, setSelectedQuests] = useState<number[]>(defaultSelected);
  let [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();


  // Filtrer les quêtes selon la recherche et celles déjà sélectionnées
  const filteredQuests = quests.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) &&
      !selectedQuests.includes(q.id)
  );

  function addQuest(id: number) {
    setSelectedQuests((prev) => [...prev, id]);
    setSearch(""); // reset search après ajout
    if (onAdd) {
      startTransition(() => {
        onAdd(id);
      });
    }
  }

  function removeQuest(id: number) {
    setSelectedQuests((prev) => prev.filter((qid) => qid !== id));
    if (onRemove) {
      startTransition(() => {
        onRemove(id);
      });
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={selectedQuests.join(",")} />
      {/* Input de recherche */}
      <input
        type="text"
        placeholder="Rechercher une quête..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />
      {/* Liste des quêtes filtrées */}
      {filteredQuests.length > 0 && (
        <ul
          style={{
            border: "1px solid #ccc",
            maxHeight: 150,
            overflowY: "auto",
            padding: 0,
            margin: 0,
          }}
        >
          {filteredQuests.map((q) => (
            <li
              key={q.id}
              style={{
                listStyle: "none",
                cursor: "pointer",
                padding: 4,
              }}
              onClick={() => addQuest(q.id)}
            >
              {q.title}
            </li>
          ))}
        </ul>
      )}
      {/* Quêtes sélectionnées */}
      {selectedQuests.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Quêtes sélectionnées :</strong>
          <ul style={{ padding: 0, margin: 0 }}>
            {selectedQuests.map((id) => {
              const quest = quests.find((q) => q.id === id);
              return (
                <li
                  key={id}
                  style={{
                    listStyle: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>{quest?.title}</span>
                  <button
                    type="button"
                    onClick={() => removeQuest(id)}
                    style={{ marginLeft: 8, color: "red" }}
                  >
                    Retirer
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {/* Vous pouvez afficher un indicateur de chargement si besoin */}
      {isPending && <div style={{ color: "gray" }}>Mise à jour...</div>}
    </div>
  );
}
