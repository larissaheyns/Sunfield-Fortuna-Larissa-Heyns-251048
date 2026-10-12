import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";

export default function News() {
  return (
    <>
      <Hero {...heroFor("news")} />
      <section className="wrap page-body">
        <h2>Latest stories</h2>
        <p>Content for this page goes here.</p>
      </section>
    </>
  );
}
