
# Glyph

Site web utilisé lors du jeu de piste Glyph de Play Sorbonne Université au mois de septembre 2024.

https://glyph.playsorbonne.fr


# Documentation

je met juste qlq notes ici en attendant de faire une vraie doc (surtout les particularités un peu bizarre du site)

## ENV variables

- NEXT_PUBLIC_MAIN_URL: l'url de l'instance de production (ex: https://glyph.playsorbonne.fr)

- NO_AUTH: utilisé en dev uniquement <!>, saute le middleware donc juste de vérification de l'authentification.


- NO_REGISTER: le jeu n'a pas encore commencé donc pas d'inscription (sauf @psu). (p-ê donner un meilleur nom)
- DISABLE_LOGIN: le jeu est fini donc pas de connexion (sauf @psu).(p-ê donner un meilleur nom)
- NO_SCAN: Désactive le scan de QR code. 


- AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET: codes pour l'authentification google
- AUTH_DISCORD_ID et AUTH_DISCORD_SECRET: codes pour l'authentification discord

- SALT: une chaîne de caractère aléatoire pour le hachage des emails, peut-être passer en un salt unique pas utilisateur

## Quêtes accueil & fin

- /welcome est la page d'accueil du jeu, mais au moment de la création du compte, on fait scanner autimatiquement le qrcode "/notwelcome". Donc pensez à attribuer ce qrcode à la quête d'accueil. cf `/src/lib/auth/index.ts` ligne 66.
- La quête de fin n'est pas encore gérée correctement.
  - Mais si le qrcode commence par `/ending` et que toutes les autres quêtes principales sont pas encore terminées. La quête de fin n'est pas validée. (cf `src/actions/code.ts` ligne 192).

## Connexion

ça va changer donc attention <!> 

mais pour l'instant les étapes de créations de compte sont `/welcome` -> `/welcome/2` -> `/app/welcome` -> `/app/welcome/1` -> `/app/welcome/2` -> `/app/welcome/3`.

Peut-être faire en sorte que `/welcome` soit une page qui félicite d'avoir scanné le QR code et réaliser la première quête, et que `/welcome/2` soit la page de connexion ? on sera redirigé vers /2 si on clique sur rejointre glyph sur le site principal.

Pourquoi ? `/app/*` nécessite d'être connecté (cf middleware) alors que `/*` non.  
Pourquoi rien puis 2 puis rien puis 1 puis 2 ? Vous posez trop de questions.

# Bugs


- `/app/quest/[id]` la largeur du contenue et dynamique donc quand il y a pas grand chose c'est miniscule. Peut-être donner une largeur minimum au conteneur 
- 
