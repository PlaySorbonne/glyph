import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/logo-flat.png";
import Champsu from "@/assets/champsu.png";
import Dlc from "@/assets/dlc.png";
import styles from "./page.module.css";
import Carrousel from "./components/Carrousel";

import { FAQ } from "@/utils";
import { getLogo } from "@/assets/fraternities";
import { getClassement } from "@/actions/fraternity";
import { getUsers } from "@/actions/users";

export default async function Page() {
  let fraternities = await getClassement();
  let users = await getUsers({ sortByPoint: true, n: 10 });

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "80px",
          zIndex: "100",
          position: "fixed",
          top: "0",
          width: "100vw",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Link href="/" className={styles.link}>
          <Image src={Logo} alt="logo" width={70} />
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="https://playsorbonne.fr"
            target="_blank"
            className={styles.link}
          >
            <Image src={Champsu} alt="logo" height={70} />
          </Link>
          <Link
            href="https://playsorbonne.fr/dlc"
            target="_blank"
            className={styles.link}
          >
            <Image src={Dlc} alt="logo" height={70} />
          </Link>
        </div>
      </header>
      <section>
        <Carrousel />
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "DCC-Ash",
            }}
          >
            Le Jeu est fini ! Rendez-vous l'année prochaine !
          </h1>
          <p>
            Lors du mois de septembre, les étudiants de la Sorbonne ont pu
            découvrir le campus. Les Joueurs ont pu explorer les différents
            bâtiments, les lieux importants, les activités proposées et bien
            plus encore ! Ils ont pu relever des défis, et participer à la
            victoire de leur fraternité !
          </p>
          <p>
            Merci à tous les participants pour leur implication et leur bonne
            humeur. Nous espérons que vous avez apprécié ce jeu autant que nous
            avons aimé le créer !
          </p>
          <p>
            Lors du{" "}
            <Link href="https://playsorbonne.fr/festival">
            <span style={{color: "blue"}}>
              Play Sorbonne Festival
            </span>
            </Link>{" "}
            les fraternités ont pu s'affronter une dernière fois avant de
            recevoir les résultats finaux :
          </p>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "DCC-Ash",
            }}
          >
            Voici les résultats finaux :
          </h1>
          <div>
            <div
              style={{
                width: "100%",
              }}
            >
              <div>
                <div className={styles.wrapper}>
                  <h2
                    className="font-semibold mb-4 text-center"
                    style={{
                      fontSize: "2rem",
                      fontFamily: "DCC-Ash",
                      letterSpacing: "0.1rem",
                      color: "rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    Podium des Fratries
                  </h2>
                  <div className="flex justify-center items-end h-64 mb-8">
                    {/* 2nd place */}
                    <div className="w-1/4 mx-2">
                      <div className="h-40 flex flex-col justify-end items-center p-2 rounded-t-lg">
                        <span className="text-2xl font-bold text-gray-700">
                          2
                        </span>
                        <Image
                          src={getLogo(fraternities[1].id)}
                          width={100}
                          height={100}
                          alt={`${fraternities[1].name} logo`}
                        />
                        <h3 className="text-lg font-medium text-gray-800 text-center">
                          {fraternities[1].name}
                        </h3>
                        <p className="text-md font-semibold text-indigo-600">
                          {fraternities[1].score} pts
                        </p>
                      </div>
                    </div>
                    {/* 1st place */}
                    <div className="w-1/3 mx-2">
                      <div className="bg-yellow-200 h-52 flex flex-col justify-end items-center p-2 rounded-t-lg">
                        <span className="text-3xl font-bold text-yellow-700">
                          1
                        </span>
                        <Image
                          src={getLogo(fraternities[0].id)}
                          width={100}
                          height={100}
                          alt={`${fraternities[0].name} logo`}
                        />
                        <h3 className="text-xl font-medium text-gray-800 text-center">
                          {fraternities[0].name}
                        </h3>
                        <p className="text-lg font-semibold text-indigo-600">
                          {fraternities[0].score} pts
                        </p>
                      </div>
                    </div>
                    {/* 3rd place */}
                    <div className="w-1/4 mx-2">
                      <div className="bg-orange-200 h-32 flex flex-col justify-end items-center p-2 rounded-t-lg">
                        <span className="text-xl font-bold text-orange-700">
                          3
                        </span>
                        <Image
                          src={getLogo(fraternities[2].id)}
                          width={100}
                          height={100}
                          alt={`${fraternities[2].name} logo`}
                        />
                        <h3 className="text-lg font-medium text-gray-800 text-center">
                          {fraternities[2].name}
                        </h3>
                        <p className="text-md font-semibold text-indigo-600">
                          {fraternities[2].score} pts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.wrapper}>
                  <h2
                    className="text-2xl font-semibold mb-4 text-center"
                    style={{
                      fontFamily: "DCC-Ash",
                      letterSpacing: "0.1rem",
                      color: "rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    Top 10
                  </h2>
                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-md"
                      >
                        <div className="flex items-center">
                          <Image
                            src={getLogo(user.fraternityId)}
                            width={50}
                            height={50}
                            alt={`${user.fraternityId} logo`}
                            style={{
                              padding: "3px",
                            }}
                          />
                          <h3 className="text-lg font-medium text-gray-800">
                            {user.name}
                          </h3>
                        </div>
                        <p className="text-lg font-semibold text-indigo-600">
                          {user.score} points
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="faq"
        style={{
          backgroundColor: "#eee",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "2rem",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "DCC-Ash",
              letterSpacing: "0.1rem",
            }}
          >
            Qualitatively Anticipated Fake Frequently Asked Questions :
          </h1>
          {FAQ.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "1rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {item.question}
              </h2>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
