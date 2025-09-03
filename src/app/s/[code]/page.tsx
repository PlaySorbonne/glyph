import Fraternities from "@/assets/fraternities";
import prisma from "@/lib/db";
import QRCode from "react-qr-code";
import Image from "next/image";
import Link from "next/link";

export default async function CodePage(props: {
  params: Promise<{ code: string }>;
}) {
  let params = await props.params;
  let [code] = await prisma.code.findMany({
    where: {
      code: params.code,
    },
    include: {
      quest: true,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
        rowGap: "50px",
      }}
    >
      {code && (
        <h1
          style={{
            fontSize: "2rem",
            textAlign: "center",
            fontFamily: "DCC-Ash",
          }}
        >
          {code.isQuest ? code.quest?.title : "Code à points"}
        </h1>
      )}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
        <Image
          src={Fraternities.default.logo}
          alt="Glyph logo"
          style={{
            paddingBottom: "10px",
          }}
          width={300}
        />
        <QRCode value={`${process.env.NEXT_PUBLIC_MAIN_URL}/${params.code}`} />
        <p>
          {params.code}
        </p>
        <Link href={process.env.NEXT_PUBLIC_MAIN_URL || "/"} style={{
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>
          <p>Cet élément fait parti du jeu de piste GLYPH : {process.env.NEXT_PUBLIC_MAIN_URL}</p>
          <p>Il sera retiré le 15 octobre</p>
        </Link>
      </div>
      {code && (
        <h1
          style={{
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {code.isQuest ? code.quest?.points : code.points} Points
        </h1>
      )}
    </div>
  );
}
