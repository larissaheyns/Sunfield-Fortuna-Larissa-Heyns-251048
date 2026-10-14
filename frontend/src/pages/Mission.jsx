import Hero from "../components/Hero";
import CallToAction from "../components/CallToAction";
import { heroFor } from "../data/heroes";
import "../styles/mission.css";

const photos = import.meta.glob("../assets/mission.{png,jpg,jpeg,webp}", { eager: true, import: "default" });
const photo = Object.values(photos)[0];

export default function Mission() {
  return (
    <>
      <Hero
        {...heroFor("mission")}
        tag="ABOUT US"
        title="Sunfield Fortuna"
        sub={"Building stronger,\nhealthier communities."}
        text="Since 1991 we have been caring for upward of 70 residents, providing for their social, physical and medical needs."
      />

      <section className="mission" aria-labelledby="mission-h">
        <div className="wrap">
          <h2 id="mission-h">Our mission</h2>
          <div className="mission-grid">
            {photo
              ? <img className="mission-photo" src={photo} alt="Residents at Sunfield Fortuna" />
              : <div className="mission-photo placeholder" aria-hidden="true" />}
            <div className="mission-card">
              <p>
                To provide a caring home for physically and mentally disabled individuals — meeting their social,
                physical, and medical needs with dignity, as we have since 1991.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
