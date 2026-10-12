import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";

export default function Login() {
  return (
    <>
      <Hero {...heroFor("login")} />
      <section className="wrap page-body">
        <h2>Sign Up / Login</h2>
        <p>Content for this page goes here.</p>
      </section>
    </>
  );
}
