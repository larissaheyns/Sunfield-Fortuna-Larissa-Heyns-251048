import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";

export default function Involved() {
  return (
    <>
      <Hero {...heroFor("involved")} />
      <section className="wrap page-body">
        <h2>Ways to get involved</h2>
        <p>Content for this page goes here.</p>
      </section>
    </>
  );
}
