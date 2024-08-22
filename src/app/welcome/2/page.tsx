import Link from "next/link";

export default async function WelcomePage() {

  return (
    <div>
      <h1>Si y a plus de bla bla</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
        voluptate beatae maxime rerum quibusdam tempore temporibus molestias ex,
        cumque possimus qui? Ex ipsa tempore nemo, modi vitae alias aliquam
        magni iure dolor debitis odit autem rerum sit sequi, tenetur quos.
      </p>
      <Link href="/">Commencer</Link>
    </div>
  );
}
