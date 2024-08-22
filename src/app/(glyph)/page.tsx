import { cookies } from "next/headers";

export default async function Home() {

  let name = cookies().get("name");

  return (
    <main>
      {name?.value ?? "Welcome to the site!"}
    </main>
  );
}
