import { Link } from "react-router-dom";

const ACTIONS = [
  {
    title: "Get Support",
    text: "Access the help and resources you need",
    link: "Learn more",
    to: "/contact",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M32 22c-8-10-20 2-8 12l8 6 8-6c12-10 0-22-8-12z" />
        <path d="M8 38c6 0 10 4 14 8l8 4M56 38c-6 0-10 4-14 8l-8 4" />
      </svg>
    ),
  },
  {
    title: "Get Involved",
    text: "Volunteer, partner or make a difference.",
    link: "Learn more",
    to: "/involved",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 40 24 20l16 12 20-14v26H4z" />
        <path d="M14 40v14M50 40v14M24 20v20M32 26v14" />
      </svg>
    ),
  },
  {
    title: "Donate",
    text: "Help us create lasting change in our community.",
    link: "Give now",
    to: "/donate",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="32" cy="32" r="18" strokeDasharray="3 5" />
        <g fill="currentColor">
          <circle cx="32" cy="10" r="3" /><circle cx="54" cy="32" r="3" />
          <circle cx="32" cy="54" r="3" /><circle cx="10" cy="32" r="3" />
        </g>
      </svg>
    ),
  },
  {
    title: "Our Mission",
    text: "Building stronger, healthier communities",
    link: "Learn more",
    to: "/mission",
    icon: (
      <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
        <path d="M50 8C28 8 14 22 14 40l-8 14 12-8c20 2 32-12 32-38z" />
      </svg>
    ),
  },
];

export default function ActionCards() {
  return (
    <section className="wrap cards" aria-label="How we can help">
      {ACTIONS.map(({ title, text, link, to, icon }) => (
        <article className="card" key={title}>
          {icon}
          <h2>{title}</h2>
          <p>{text}</p>
          <Link className="more" to={to}>{link} →</Link>
        </article>
      ))}
    </section>
  );
}
