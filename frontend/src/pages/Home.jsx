import Hero from "../components/Hero";
import ActionCards from "../components/ActionCards";
import Team from "../components/Team";
import CallToAction from "../components/CallToAction";
import { heroFor } from "../data/heroes";

export default function Home() {
  return (
    <>
      <Hero {...heroFor("home")} />
      <ActionCards />
      <Team />
      <CallToAction />
    </>
  );
}
