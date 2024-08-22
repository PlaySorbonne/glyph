import { getSession } from "@/actions/auth";
import { updateUserWelcomed } from "@/actions/users";
import Link from "next/link";

export default async function WelcomePage() {
  await updateUserWelcomed((await getSession()) as string);

  return (
    <div>
      <h1>Bienvenue sur Glyph !</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
        voluptate beatae maxime rerum quibusdam tempore temporibus molestias ex,
        cumque possimus qui? Ex ipsa tempore nemo, modi vitae alias aliquam
        magni iure dolor debitis odit autem rerum sit sequi, tenetur quos.
      </p>
      <Link href="/welcome/1">Continuer</Link>
    </div>
  );
}
