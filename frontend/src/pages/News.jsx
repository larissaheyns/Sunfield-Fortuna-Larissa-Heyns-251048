import Hero from "../components/Hero";
import CallToAction from "../components/CallToAction";
import { heroFor } from "../data/heroes";
import "../styles/news.css";

const STORIES = [
  {
    title: "Uncertain Future",
    source: "News24",
    date: "2022-08-22",
    summary: "Care home’s disabled residents face uncertain future as social development dept orders relocation",
    url: "https://www.news24.com/southafrica/news/care-homes-disabled-residents-face-uncertain-future-as-social-development-dept-orders-relocation-20220822",
  },
  {
    title: "Sunfield’s own Veggies",
    source: "The Citizen",
    date: "2021-06-02",
    url: "https://www.citizen.co.za/heidelberg-nigel-heraut/news-headlines/2021/06/02/sunfield-home-fortuna-grows-its-own-vegetables/",
  },
  {
    title: "Sunfield Home Fortuna",
    source: "The Citizen",
    date: "2020-10-03",
    url: "https://www.citizen.co.za/heidelberg-nigel-heraut/news-headlines/2020/10/03/sunfield-home-fortuna/",
  },
];

const fmt = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function News() {
  return (
    <>
      <Hero {...heroFor("news")} />
      <section className="wrap news" aria-label="News stories">
        <div className="news-grid">
          {STORIES.map((s) => (
            <details className="news-card" key={s.url}>
              <summary>
                <span>{s.title}</span>
                <span className="chev" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </summary>
              <div className="news-body">
                <p className="news-meta">{s.source} · {fmt(s.date)}</p>
                {s.summary && <p>{s.summary}</p>}
                <a className="btn" href={s.url} target="_blank" rel="noopener noreferrer">
                  Read on {s.source} <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>
      <CallToAction />
    </>
  );
}
