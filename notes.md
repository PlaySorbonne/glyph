# faire un tuto

-> scanner /welcome 
  -> tuto & présentation de comment utilsier l'app
  -> fasse faire directement : pour te familiariser déssine le héro
  -> lore blabla le héros tout ça
  -> dès le début on l'habitut à colorer le glyph
  -> lui expliquer que c'est comme ça qu'on valide les quêtes
  -> bulle d'aide si il est golmon

  -> faire des animations ? faire que c'est une pièce du puzzle, genre une animation qui place le glyph déssiné dans le gros truc dézoomer

  -> ensuite lui donner une ou deux quêtes facile à faire et faisable un peu tout le temps
    -> genre va à tel endroit pour faire x quête, on montre que ça. Pour pas l'embourber 
      -> ça peut être genre venir nous voir

    -> et ensuite on lui montre les autres quêtes

-> peut-être le guide du héros ? histoire d'encourager le mec à lire les explications.


# les quêtes

faire la liste de tout les mecs pour les quêtes

le matos aussi et comment faire

- Les quêtes principales ont juste le paramètre `secondary` à `false`
- Les quêtes secondaires :
  - J'affiche dans le dashboard ceux qui ont pour parentId `SECONDARYQUESTS_WRAPPERID`
Pourquoi ? Parce que si je query que ceux qui ont `secondary` à `true`, j'aurais les quêtes wrapper ET les subquests. Donc faut nécessairement filtrer par `parentId`.