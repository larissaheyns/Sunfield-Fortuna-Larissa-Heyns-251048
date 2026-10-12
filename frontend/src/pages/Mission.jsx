import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";

export default function Mission() {
  return (
    <>
      <Hero {...heroFor("mission")} />
      <section className="wrap page-body">
        <h2>Our Mission</h2>
        <p>Content for this page goes here.</p>
      </section>
    </>
  );
}
