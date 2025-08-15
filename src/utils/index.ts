import { Quest } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

export const SESSION_TTL = -1;

export const GLYPH_MAX_SIZE = 29; // glyph max size, 29x29 pixels

export const NB_MAIN_QUESTS = 8; // number of main quests

export const MAINQUESTS_WRAPPERID = 1; // id of the wrapper for main quests in the database

export const isQuestSecondary = (quest: Quest) => quest.secondary; // May change so 

export function keepKeysFromObject<T extends object, K extends keyof T>(
  obj: T,
  keys: K[] | readonly K[]
): { [key in K]: T[key] } {
  const result = {} as { [key in K]: T[key] };
  for (const key of keys) result[key] = obj[key];
  return result;
}

export function keepKeysFromObjectArray<T extends object, K extends keyof T>(
  arr: T[],
  keys: K[] | readonly K[]
): Array<{ [key in K]: T[key] }> {
  return arr.map((obj) => keepKeysFromObject(obj, keys));
};

export function glyphStringToArray(glyph: string | null | undefined) {
  return glyph
    ?.split(",")
    .map((line) => line.split("").map((char) => char === "1"));
}

export function glyphArrayToString(glyph: boolean[][] | null | undefined) {
  return glyph
    ?.map((line) => line.map((char) => (char ? "1" : "0")).join(""))
    .join(",");
}

export function smallestContainingAllOnes(matrix: boolean[][]): {
  matrix: boolean[][];
  coords: [number, number];
} {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let minRow = rows,
    maxRow = -1;
  let minCol = cols,
    maxCol = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c]) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  if (maxRow === -1) return { matrix: [], coords: [0, 0] };

  // Rectangle dimensions
  const height = maxRow - minRow + 1;
  const width = maxCol - minCol + 1;

  const result = [];
  for (let r = minRow; r <= maxRow; r++) {
    const row = [];
    for (let c = minCol; c <= maxCol; c++) {
      row.push(matrix[r][c]);
    }
    result.push(row);
  }

  // coords of the most left up pixel in the original matrix
  return { matrix: result, coords: [minRow, minCol] };
}

// 4 first characters are random, 11 next characters are the date it was generated, last characters are the user id in hex
export function generateSession(id: string) {
  return `${randomBytes(2)
    .toString("hex")
    .padStart(5, "0")}${Date.now().toString(16)}${id
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("")}`;
}

export function generateCode(): `${string}-${string}-${string}` {
  function getRandomElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  return `${getRandomElement(words)}-${getRandomElement(
    words
  )}-${getRandomElement(words)}`;
}

export function appUrl(relativePath: string) {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("NEXT_PUBLIC_MAIN_URL is not defined");
  }
  return new URL(
    `/app${relativePath}`,
    process.env.NEXT_PUBLIC_MAIN_URL
  ).toString();
}

export function cutString(str: string | null | undefined, maxLength: number) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export function convertDDMMToDate(
  ddmmString?: string,
  year = new Date().getFullYear()
) {
  if (!ddmmString) {
    return undefined;
  }
  const [day, month] = ddmmString.split("/").map((num) => parseInt(num, 10));

  // Validate input
  if (
    isNaN(day) ||
    isNaN(month) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    throw new Error("Invalid date format. Expected DD/MM");
  }

  // Create Date object (month is 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);

  // Validate that the date is valid (e.g., not 31/04 for April 31st)
  if (date.getDate() !== day || date.getMonth() !== month - 1) {
    throw new Error("Invalid date");
  }

  return date;
}

export function hash(str: string, salt: string | undefined = process.env.SALT) {
  if (!salt) {
    throw new Error("No salt provided");
  }
  return createHash("sha256")
    .update(str + salt)
    .digest("hex");
}

export const FAQ = [
  {
    question:
      "Je ne suis pas étudiant de Sorbonne Université, puis-je participer ?",
    answer:
      "Vous pouvez participer au tournois des trois familles MAIS vous serez bloqués dans la quête principale certaines quêtes nécessite d'avoir des identifiants SU.",
  },
  {
    question: "Mon téléphone ne peut pas scanner de QR code puis-je jouer ?",
    answer:
      "Certains navigateurs tels que firefox et chrome propose la fonction de scanner des QR code lorsqu'on clique sur la barre d'URL.",
  },
  {
    question:
      "Je suis bloqué dans une quête à qui puis-je demander des indices ?",
    answer:
      "Quête principale : les porteurs de brassard vert avec les pins qui sont dans le lieu de la quête. Autres quêtes : les Personnes Sympa et Utiles avec des brassards verts et pins qui sont au stand de PSU ou qui se baladent.",
  },
  {
    question: "J'ai oublié de faire valider une de mes quêtes que faire ?",
    answer:
      "Retournez simplement voir le donneur de quête ou la personne référente du lieu pour qu'il vous donne le QR code de validation de votre quête.",
  },
  {
    question: "Dois-je faire les quêtes principales dans l'ordre ?",
    answer:
      "Non ! Hormis la dernière quête, vous pouvez faire les quêtes principales dans l'ordre que vous voulez, en fonction de vos disponibilités.",
  },
  {
    question: "J'ai d'autres questions, qui puis-je contacter ?",
    answer:
      "Envoyer un message à play_sorbonne_u sur instagram ou bien en nous écrivant à glyph@playsorbonne.fr.",
  },
  {
    question: "Je souhaite supprimer mes données, que faire ?",
    answer:
      "Envoyer un mail à dev@playsorbonne.fr en précisant votre nom d'utilisateur et les données à supprimer.",
  },
];

export function isQuestAvailable(quest: Quest) {
  return (
    (!quest.starts || quest.starts <= new Date()) &&
    (!quest.ends || quest.ends >= new Date())
  );
}

const words = [
  "autour",
  "chaud",
  "des",
  "que",
  "eux",
  "guerre",
  "abord",
  "autre",
  "chemin",
  "descendre",
  "exemple",
  "acheter",
  "avancer",
  "cher",
  "deux",
  "haut",
  "action",
  "avant",
  "chercher",
  "devant",
  "faim",
  "heure",
  "adresser",
  "avec",
  "cheval",
  "devenir",
  "faire",
  "heureux",
  "affaire",
  "avoir",
  "chez",
  "devoir",
  "fait",
  "hier",
  "afin",
  "chien",
  "dieu",
  "falloir",
  "histoire",
  "age",
  "bas",
  "chose",
  "dimanche",
  "famille",
  "hiver",
  "agir",
  "battre",
  "ciel",
  "diner",
  "faux",
  "homme",
  "ah",
  "beau",
  "cinq",
  "dire",
  "femme",
  "honneur",
  "ailleurs",
  "beaucoup",
  "classe",
  "diriger",
  "fenetre",
  "huit",
  "aimer",
  "besoin",
  "coeur",
  "dix",
  "fer",
  "ainsi",
  "bete",
  "coin",
  "donc",
  "fermer",
  "ici",
  "air",
  "bien",
  "combien",
  "donner",
  "fete",
  "idee",
  "ajouter",
  "bientot",
  "comme",
  "dont",
  "feu",
  "il",
  "ils",
  "aller",
  "blanc",
  "commencer",
  "dormir",
  "feuille",
  "instant",
  "alors",
  "bleu",
  "comment",
  "doute",
  "figure",
  "interet",
  "amener",
  "boire",
  "comprendre",
  "doux",
  "fille",
  "ami",
  "bois",
  "compter",
  "droit",
  "fils",
  "jamais",
  "amour",
  "bon",
  "connaitre",
  "fin",
  "jardin",
  "amuser",
  "bonheur",
  "content",
  "eau",
  "finir",
  "je",
  "an",
  "bord",
  "continuer",
  "ecole",
  "fleur",
  "jeter",
  "ancien",
  "bout",
  "contre",
  "ecouter",
  "fois",
  "jeu",
  "animal",
  "bras",
  "corps",
  "ecrire",
  "fond",
  "jeune",
  "annee",
  "bruit",
  "cote",
  "en",
  "effet",
  "force",
  "joie",
  "annoncer",
  "coucher",
  "eleve",
  "foret",
  "joli",
  "apercevoir",
  "ça",
  "couleur",
  "elle",
  "elles",
  "former",
  "jouer",
  "appeler",
  "cacher",
  "coup",
  "embrasser",
  "fort",
  "jour",
  "apporter",
  "campagne",
  "cour",
  "empêcher",
  "foule",
  "joyeux",
  "apprendre",
  "car",
  "courir",
  "emporter",
  "frais",
  "jusque",
  "approcher",
  "cas",
  "cours",
  "en",
  "franc",
  "apres",
  "cause",
  "couvrir",
  "encore",
  "français",
  "arbre",
  "ces",
  "cette",
  "crier",
  "enfant",
  "frapper",
  "argent",
  "cela",
  "croire",
  "enfin",
  "frere",
  "laisser",
  "arreter",
  "celui",
  "ensemble",
  "froid",
  "lecon",
  "arriver",
  "cent",
  "dame",
  "ensuite",
  "lendemain",
  "asseoir",
  "cependant",
  "dans",
  "entendre",
  "gagner",
  "lequel",
  "assez",
  "certain",
  "des",
  "du",
  "entier",
  "garcon",
  "lettre",
  "assurer",
  "chacun",
  "decider",
  "entre",
  "garder",
  "leur",
  "attendre",
  "chambre",
  "deja",
  "entrer",
  "gauche",
  "lever",
  "au",
  "aux",
  "champ",
  "demain",
  "envoyer",
  "general",
  "lieu",
  "aucun",
  "changer",
  "demander",
  "esperer",
  "gens",
  "lire",
  "aujourdhui",
  "chanter",
  "demi",
  "esprit",
  "gout",
  "lit",
  "aussi",
  "chaque",
  "depuis",
  "et",
  "grace",
  "livre",
  "aussitot",
  "charger",
  "dernier",
  "etat",
  "grand",
  "loi",
  "autant",
  "chat",
  "derriere",
  "etre",
  "gros",
  "loin",
  "long",
  "neuf",
  "pays",
  "puisque",
  "sentir",
  "train",
  "longtemps",
  "peine",
  "sept",
  "travail",
  "lorsque",
  "nid",
  "pendant",
  "quand",
  "service",
  "pomme",
  "abricot",
  "avocat",
  "banane",
  "concombre",
  "datte",
  "citron",
  "orange",
  "cerise",
  "fraise",
  "framboise",
  "melon",
  "citrouille",
  "pasteque",
  "poire",
  "peche",
  "raisin",
  "tomate",
  "fraise",
  "framboise",
  "melon",
  "citrouille",
  "pasteque",
  "poire",
  "peche",
  "raisin",
  "tomate",
];
