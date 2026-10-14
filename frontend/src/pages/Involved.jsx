import Hero from "../components/Hero";
import Wishlist from "../components/Wishlist";
import CallToAction from "../components/CallToAction";
import { heroFor } from "../data/heroes";

export default function Involved() {
  return (
    <>
      <Hero {...heroFor("involved")} />
      <Wishlist />
      <CallToAction to="/contact" label="Get in touch" />
    </>
  );
}
