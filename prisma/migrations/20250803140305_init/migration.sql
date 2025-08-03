/*
Manually written script for initial database setup
*/

INSERT INTO "TheGame" ("id","description") VALUES (1, "");

INSERT INTO "Fraternity" ("id", "name", "description") VALUES 
(1, "Pietr", ""),
(2, "Saka", ""),
(3, "Foli", "");


INSERT INTO "Quest" ("id", "title", "mission", "description", "lieu", "points", "secondary") VALUES
(1, "Quêtes principales", NULL, NULL, NULL, 0, false),
(2, "Quêtes secondaires", NULL, NULL, NULL, 0, true),
(3, "Lieux cachés", NULL, NULL, NULL, 0, true),
(4, "Les Associations", NULL, NULL, NULL, 0, true);