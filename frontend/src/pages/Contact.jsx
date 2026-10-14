import { useState } from "react";
import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";
import { SITE } from "../data/site";
import { api } from "../lib/api";
import "../styles/contact.css";

const HOURS = SITE.hours ?? "Mon – Fri|08:00 – 16:00";
const FACEBOOK = SITE.facebook ?? "Sunfield Fortuna";
const FACEBOOK_URL = SITE.facebookUrl ?? "https://www.facebook.com/";

const SUBJECTS = ["General question", "Volunteering", "Donating items", "Donating money", "Partnerships", "Other"];

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Plant = ({ className }) => (
  <svg className={className} viewBox="0 0 100 200" fill="currentColor" aria-hidden="true">
    <path d="M50 200V40" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="30" cy="90" rx="14" ry="30" transform="rotate(-30 30 90)" />
    <ellipse cx="70" cy="120" rx="14" ry="30" transform="rotate(30 70 120)" />
    <ellipse cx="32" cy="150" rx="14" ry="30" transform="rotate(-30 32 150)" />
    <ellipse cx="50" cy="26" rx="10" ry="22" fill="#f1b84f" />
  </svg>
);

const lines = (s) => s.split("|").map((l, i) => <span key={i}>{l}</span>);

const DETAILS = [
  { tone: "green", label: "Phone", note: HOURS,
    icon: <Icon><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>,
    value: <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a> },
  { tone: "gold", label: "Email", note: "We’ll get back to you|as soon as possible.",
    icon: <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>,
    value: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> },
  { tone: "green", label: "Address", note: "Visit us|We’d love to meet you!",
    icon: <Icon><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>,
    value: SITE.address },
  { tone: "gold", label: "Follow us", note: "Stay up to date with|our latest news and stories.",
    icon: <Icon><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></Icon>,
    value: <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">{FACEBOOK}</a> },
];

export default function Contact() {
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending", msg: "" });
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      form.reset();
      setStatus({ state: "ok", msg: "Thank you – your message has been sent. We will be in touch soon." });
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  }

  return (
    <div className="contact-page">
      <Hero
        {...heroFor("contact")}
        tag="GET IN TOUCH"
        title="We’d love to hear from you"
        sub=""
        text="Whether you have a question, want to get involved, or just want to say hello — we’re here for you."
      />

      <section className="wrap contact-grid">
        <div>
          <h2>Our Contact Details</h2>
          <ul className="details">
            {DETAILS.map((d) => (
              <li className="detail" key={d.label}>
                <span className={`dot ${d.tone}`}>{d.icon}</span>
                <div><strong>{d.label}</strong>{typeof d.value === "string" ? d.value : d.value}</div>
                <p className="note">{lines(d.note)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="decor" aria-hidden="true">
          <p className="hand">Together<br />we can<br />make a<br />difference.</p>
          <Icon><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" /></Icon>
          <Plant className="plant" />
        </div>

        <div className="form-card">
          <h2>Send us a message</h2>
          <p className="intro">Fill in the form below and we’ll get back to you as soon as we can.</p>
          <form className="form contact-form" onSubmit={submit}>
            <div className="form-row">
              <label className="field"><span>Name *</span><input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" /></label>
              <label className="field"><span>Email *</span><input name="email" type="email" required maxLength={150} autoComplete="email" placeholder="your@email.com" /></label>
            </div>
            <label className="field">
              <span>Subject *</span>
              <select name="subject" required defaultValue="">
                <option value="" disabled>Select an option</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="field"><span>Message *</span><textarea name="message" rows={4} required maxLength={2000} placeholder="How can we help you?" /></label>
            <button className="btn" disabled={status.state === "sending"}>
              <Icon><path d="m22 2-7 20-4-9-9-4zM22 2 11 13" /></Icon>
              {status.state === "sending" ? "Sending…" : "Send Message"}
            </button>
            {status.msg && <p className={`form-msg ${status.state}`} role="status">{status.msg}</p>}
          </form>
        </div>
      </section>

      <div className="contact-band">
        <p className="hand">Kindness builds<br />stronger communities.</p>
        <Plant className="plant" />
      </div>
    </div>
  );
}
