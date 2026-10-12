import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const GRADIENTS = [
  "linear-gradient(135deg,#c9c1b8,#8c8279)", "linear-gradient(135deg,#6b5a55,#2a1f1f)",
  "linear-gradient(135deg,#a8553a,#2f2523)", "linear-gradient(135deg,#3f87a8,#1f4f68)",
];
// Shown until the API answers (or if the backend is offline)
const FALLBACK = [
  { id: 1, name: "Brenda Mendes", role: "General Manager" },
  { id: 2, name: "Anabel Snyman", role: "Stimulation Teacher" },
  { id: 3, name: "Elsie Nhlapo", role: "Cleaning and Laundry Manager" },
  { id: 4, name: "Joannah Quimba", role: "House Mother and Caregiver Manager" },
];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function Team() {
  const track = useRef(null);
  const [team, setTeam] = useState(FALLBACK);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api("/team").then((rows) => rows.length && setTeam(rows)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = track.current;
    const onScroll = () => {
      const step = el.children[0].offsetWidth + 25;
      setActive(Math.min(team.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [team.length]);

  const goTo = (i) => track.current.children[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });

  return (
    <section className="team wrap" aria-labelledby="team-h">
      <h2 id="team-h">Meet our Team</h2>
      <div className="track" ref={track} tabIndex={0} aria-label="Team members">
        {team.map((p, i) => (
          <article className="person" key={p.id}>
            <div className="ph" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
              {p.photo_url ? <img src={p.photo_url} alt={p.name} /> : initials(p.name)}
            </div>
            <div className="info"><h3>{p.name}</h3><p>{p.role}</p></div>
          </article>
        ))}
      </div>
      <div className="dots">
        {team.map((p, i) => (
          <button key={p.id} aria-label={`Show ${p.name}`} aria-current={i === active} onClick={() => goTo(i)} />
        ))}
      </div>
    </section>
  );
}
