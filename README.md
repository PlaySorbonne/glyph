
# Glyph

Site web utilisé lors du jeu de piste Glyph de Play Sorbonne Université au mois de septembre 2024.

https://glyph.playsorbonne.fr


# Documentation

je met juste qlq note ici en attendant de faire une vraie doc

# ENV variables

- MAIN_URL: l'url de l'instance de production (ex: https://glyph.playsorbonne.fr)

- NO_AUTH: utilisé en dev uniquement <!>, saute le middleware donc juste de vérification de l'authentification.


- NO_REGISTER: le jeu n'a pas encore commencé donc pas d'inscription (sauf @psu). (p-ê donner un meilleur nom)
- DISABLE_LOGIN: le jeu est fini donc pas de connexion (sauf @psu).(p-ê donner un meilleur nom)
- NO_SCAN: Désactive le scan de QR code. 


- AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET: codes pour l'authentification google
- AUTH_DISCORD_ID et AUTH_DISCORD_SECRET: codes pour l'authentification discord

- SALT: une chaîne de caractère aléatoire pour le hachage des emails, peut-être passer en un salt unique pas utilisateur
