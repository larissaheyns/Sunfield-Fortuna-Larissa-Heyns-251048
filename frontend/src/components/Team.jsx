import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const GRADIENTS = [
  "linear-gradient(135deg,#c9c1b8,#8c8279)", "linear-gradient(135deg,#6b5a55,#2a1f1f)",
  "linear-gradient(135deg,#a8553a,#2f2523)", "linear-gradient(135deg,#3f87a8,#1f4f68)",
];
const FALLBACK = [
  { id: 1, name: "Brenda Mendes", role: "General Manager" },
  { id: 2, name: "Anabel Snyman", role: "Stimulation Teacher" },
  { id: 3, name: "Elsie Nhlapo", role: "Cleaning and Laundry Manager" },
  { id: 4, name: "Joannah Quimba", role: "House Mother and Caregiver Manager" },
];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

function measure(el) {
  const step = el.children.length > 1 ? el.children[1].offsetLeft - el.children[0].offsetLeft : el.clientWidth;
  return { step, perView: Math.max(1, Math.round(el.clientWidth / step)) };
}

export default function Team() {
  const track = useRef(null);
  const [team, setTeam] = useState(FALLBACK);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    api("/team").then((rows) => rows.length && setTeam(rows)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = track.current;
    const update = () => {
      const { step, perView } = measure(el);
      const count = Math.max(1, Math.ceil(team.length / perView));
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      setPages(count);
      setPage(atEnd ? count - 1 : Math.min(count - 1, Math.round(el.scrollLeft / (step * perView))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [team.length]);

  const goTo = (p) => {
    const { step, perView } = measure(track.current);
    track.current.scrollTo({ left: p * perView * step, behavior: "smooth" });
  };

  return (
    <section className="team wrap" aria-labelledby="team-h">
      <h2 id="team-h">Meet our Team</h2>
      <div className="carousel">
        <button className="arrow prev" aria-label="Previous team members" disabled={page === 0} onClick={() => goTo(page - 1)}>‹</button>
        <div className="track" ref={track} tabIndex={0} aria-label="Team members">
          {team.map((p, i) => (
            <article className="person" key={p.id}>
              <div className="ph" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                {p.photo_url
                  ? <img src={p.photo_url} alt={p.name} style={{ objectPosition: p.photo_position || "center" }} />
                  : initials(p.name)}
              </div>
              <div className="info"><h3>{p.name}</h3><p>{p.role}</p></div>
            </article>
          ))}
        </div>
        <button className="arrow next" aria-label="Next team members" disabled={page === pages - 1} onClick={() => goTo(page + 1)}>›</button>
      </div>
      <div className="dots">
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} aria-label={`Show team page ${i + 1}`} aria-current={i === page} onClick={() => goTo(i)} />
        ))}
      </div>
    </section>
  );
}