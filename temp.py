a = """
Animal favori : 
Poisson-zebre
Grenouille-Taureau
Lapin-chameau

Sport favori : 
Hockey sur gazon
Hockey sur glace
Hockey en salle

Plat favori :
Pâtes au beurre
Beurre aux pâtes
Pâtes aux pâtes 

Si vous êtes en triste que faites vous : 
Je pleure
J'utilise l'appel à un ami
J'arrête 

Cliquez sur l'image qui vous fait ressentir le plus de bonheur :
Chienvoiture
Kirbyfok
Champsu

Si vous rencontrez un puma, que faites vous : 
J'achète une casquette
Je rugis plus fort que lui
Je grimpe a un arbre
"""

a = list(map(lambda x : x.split("\n"), a.split("\n\n")))
b = list(map(lambda x : list(filter(lambda y : y != "", x)), a))

print(b)

out = "["
for e in b:
  out += '{ "question" : "' + e[0] + '", "reponses" : ['
  for i in range(1, len(e)):
    out += '"' + e[i] + '",'
  out += "]},"
  
out += "]"

print("out", out)