import prisma from "@/lib/db";
import QRCode from "react-qr-code";

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
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
      }}
    >
      {code && <h1 style={{
        fontSize: "2rem",
        textAlign: "center",
        fontFamily: "DCC-Ash",
      }}>{code.isQuest ? code.quest?.title : "Code à points"}</h1>}
      <QRCode value={`${process.env.MAIN_URL}/${params.code}`} />
      {code && (
        <h1 style={{
          fontSize: "2rem",
          textAlign: "center",
        }}>{code.isQuest ? code.quest?.points : code.points} Points</h1>
      )}
    </div>
  );
}
