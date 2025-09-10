import { Quest } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

export const SESSION_TTL = -1;

export const GLYPH_MAX_SIZE = 29; // glyph max size, 29x29 pixels

export const NB_MAIN_QUESTS = 8; // number of main quests

// cf prisma/migrations/..._init_db
export const SECONDARYQUESTS_WRAPPERID = 1; // id of the wrapper for secondary quests in the database

export const HeroGlyphString =
  "00100000,01110000,11101000,01110100,11110011,10110000,00010000";
export const HeroGlyphBool = glyphStringToArray(HeroGlyphString)!;

// Cache for keepRandomPercentOfGlyph function
const glyphCache = new Map<string, boolean[][]>();

export function keepRandomPercentOfGlyph(glyph: boolean[][], percent = 30) {
  if (!glyph || glyph.length === 0 || glyph[0].length === 0) {
    return glyph;
  }

  // Create cache key from glyph content and percent
  const glyphString = glyphArrayToString(glyph);
  const cacheKey = `${glyphString}-${percent}`;

  // Check cache first
  if (glyphCache.has(cacheKey)) {
    return glyphCache.get(cacheKey)!;
  }

  // Create a deterministic seed based on the glyph content and percent
  const seed = createHash("sha256")
    .update(`${glyphString}-${percent}`)
    .digest("hex");

  // Convert seed to a number for seeded random generation
  let seedValue = parseInt(seed.substring(0, 8), 16);

  // Simple seeded random number generator (Linear Congruential Generator)
  const seededRandom = () => {
    seedValue = (seedValue * 1664525 + 1013904223) % Math.pow(2, 32);
    return seedValue / Math.pow(2, 32);
  };

  // Find all true pixels and their positions
  const truePixels: [number, number][] = [];
  for (let row = 0; row < glyph.length; row++) {
    for (let col = 0; col < glyph[row].length; col++) {
      if (glyph[row][col]) {
        truePixels.push([row, col]);
      }
    }
  }

  // Calculate how many pixels to keep
  const pixelsToKeep = Math.floor((truePixels.length * percent) / 100);

  // Shuffle the true pixels array using seeded random
  const shuffledPixels = [...truePixels];
  for (let i = shuffledPixels.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffledPixels[i], shuffledPixels[j]] = [shuffledPixels[j], shuffledPixels[i]];
  }

  // Keep only the first pixelsToKeep pixels
  const pixelsToKeepSet = new Set(
    shuffledPixels.slice(0, pixelsToKeep).map(([row, col]) => `${row},${col}`)
  );

  // Create the result glyph
  const result: boolean[][] = glyph.map((row, rowIndex) =>
    row.map((pixel, colIndex) => {
      if (!pixel) return false; // Keep false pixels as false
      return pixelsToKeepSet.has(`${rowIndex},${colIndex}`);
    })
  );

  // Cache the result before returning
  glyphCache.set(cacheKey, result);
  return result;
}

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
}

export function glyphStringToArray(glyph: string | null | undefined) {
  return glyph
    ?.split(",")
    .map((line) => line.split("").map((char) => char === "1"));
}

export function glyphArrayToString(glyph: boolean[][] | null | undefined) {
  if (glyph && glyph.length === 0) return "";
  return glyph
    ?.map((line) => line.map((char) => (char ? "1" : "0")).join(""))
    .join(",");
}

export function smallestContainingAllOnes(matrix: boolean[][]): {
  matrix: boolean[][];
  coords: [number, number];
} {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return { matrix: [], coords: [0, 0] };
  }
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

export function fillMatrixToSize(
  matrix: boolean[][],
  size: [number, number],
  coords = [0, 0] as [number, number]
) {
  const [rows, cols] = size;
  if (matrix.length === 0 || matrix[0].length === 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(false));
  }

  const mRows = matrix.length;
  const mCols = matrix[0].length;

  const newMatrix = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let i = 0; i < mRows; i++) {
    for (let j = 0; j < mCols; j++) {
      const ni = i + coords[0];
      const nj = j + coords[1];
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
        newMatrix[ni][nj] = matrix[i][j];
      }
    }
  }
  return newMatrix;
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

export function hash(str: string, pepper: string | undefined = process.env.PEPPER) {
  if (!pepper) {
    throw new Error("No pepper provided");
  }
  return createHash("sha256")
    .update(str + pepper)
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
    question:
      "Je suis bloqué dans une quête à qui puis-je demander des indices ?",
    answer:
      "À l'accueil si c'est dans une bibliothèque. Sinon les Personnes Sympa et Utiles qui sont au stand de PSU devant la Maison Vie Étudiante ou qui se baladent. Mais aussi sur le serveur discord de Play Sorbonne Université !",
  },
  {
    question: "Dois-je faire les quêtes principales dans l'ordre ?",
    answer:
      "Non ! Hormis la dernière quête, vous pouvez faire les quêtes principales dans l'ordre que vous voulez, en fonction de vos disponibilités.",
  },
  {
    question: "J'ai d'autres questions, qui puis-je contacter ?",
    answer:
      "Vous pouvez soit envoyer un message à play_sorbonne_u sur instagram, ou nous écrire à glyph@playsorbonne.fr, ou nous contacter sur le serveur discord de Play Sorbonne Université.",
  },
  {
    question: "Je souhaite supprimer mes données, que faire ?",
    answer:
      "Envoyez un mail à dev@playsorbonne.fr en précisant votre nom d'utilisateur et les données à supprimer. Pour information, nous ne stockons aucune donnée personnelle sauf votre adresse mail chiffrée (hashée) si vous utilisez une méthode de connexion tel que google ou discord.",
  },
];

export function isQuestAvailable(quest: Quest) {
  return (
    (!quest.starts || quest.starts <= new Date()) &&
    (!quest.ends || quest.ends >= new Date())
  );
}

const words = [
  "citron",
  "clementine",
  "kiwi",
  "mandarine",
  "noix",
  "orange",
  "poire",
  "raisin",
  "pomme",
  "fraise",
  "cerise",
  "mangue",
  "papaye",
  "fruit",
  "abricot",
  "ananas",
  "framboise",
  "groseille",
  "cassis",
  "myrtille",
  "betterave",
  "chou",
  "carotte",
  "brocoli",
  "epinard",
  "salade",
  "celeri",
  "potiron",
  "patate",
  "poireau",
  "navet",
  "mache",
  "laitue",
  "rhubarbe",
  "oignon",
  "pois",
  "blette",
  "asperge",
  "radis",
  "feve",
  "aubergine",
  "tomate",
  "concombre",
  "courgette",
  "prune",
  "figue",
  "pasteque",
  "mais",
  "artichaut",
  "poivron",
  "fenouil",
  "noisette",
  "melon",
  "haricot",
  "panais",
  "coing",
  "endive",
  "chataigne",
  "echalote",
  "ciboulette",
  "safran",
  "ail",
  "aneth",
  "coriandre",
  "persil",
  "pissenlit",
  "tournesol",
  "moutarde",
  "quinoa",
  "citrouille",
  "butternut",
  "courge",
  "amande",
  "lentille",
  "soja",
  "basilic",
  "menthe",
  "origan",
  "romarin",
  "thym",
  "avoine",
  "ble",
  "riz",
  "oseille",
  "piment",
  "ampli",
  "ampoule",
  "aquarium",
  "arbalete",
  "armoire",
  "assiette",
  "auto",
  "avion",
  "avocat",
  "badge",
  "balai",
  "batte",
  "banane",
  "bocal",
  "boite",
  "peinture",
  "bougie",
  "boule",
  "boulet",
  "bouteille",
  "broche",
  "brosse",
  "brouette",
  "bus",
  "bateau",
  "caddie",
  "cadeau",
  "cafe",
  "cafetiere",
  "cage",
  "calculette",
  "camion",
  "voiture",
  "canne",
  "carosse",
  "carte",
  "casque",
  "chantier",
  "champignon",
  "chocolat",
  "chateau",
  "maison",
  "dossier",
  "ecran",
  "telephone",
  "corne",
  "cuillere",
  "dragon",
  "epee",
  "enclume",
  "faux",
  "vrai",
  "fer",
  "metal",
  "air",
  "eau",
  "four",
  "onde",
  "fusee",
  "livre",
];
