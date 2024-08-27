import { randomBytes } from "crypto";

import fs from "fs";

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
  return new URL(`/app/${relativePath}`, process.env.APP_URL).toString();
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
  "forêt",
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
  "losrque",
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
];
