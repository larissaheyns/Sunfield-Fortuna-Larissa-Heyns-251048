import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";
import { SITE } from "../data/site";
import { analyticsConfigured, setChoice, useConsent } from "../lib/analytics";
import "../styles/cookie.css";

export default function Privacy() {
  const choice = useConsent();
  return (
    <>
      <Hero title="Privacy Notice" sub="How we look after your information." compact image={heroFor("home").image} />
      <section className="wrap page-body privacy">
        <p>Last updated: TODO (date). {SITE.name} (“we”) respects your privacy and processes personal information in line with the Protection of Personal Information Act (POPIA).</p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Account details</strong> – your name, email address and a password (stored only as a one-way scrambled hash, never as plain text) when you sign up.</li>
          <li><strong>Donation records</strong> – items or money you donate, the date and the status, so we can thank you and show your history.</li>
          <li><strong>Messages</strong> – the name, email, subject and message you send through our contact form.</li>
          <li><strong>Cookies</strong> – a login cookie that keeps you signed in (strictly necessary), and Google Analytics cookies only if you accept them.</li>
        </ul>

        <h2>Why we use it</h2>
        <p>To run your account, record and acknowledge donations, reply to your messages, keep the website secure and, if you accept analytics, understand how the website is used so we can improve it.</p>

        <h2>Who we share it with</h2>
        <p>We do not sell your information. Our website and database are hosted on Microsoft Azure. If you accept analytics cookies, Google Analytics receives information about how you use the site.</p>

        <h2>Your rights</h2>
        <p>You may ask to see, correct or delete the personal information we hold about you. <Link to="/contact">Contact us</Link> to do so.</p>
        <p>Information Officer: TODO (name), <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>

        {analyticsConfigured && (
          <>
            <h2>Your cookie choice</h2>
            <p>Analytics cookies are currently: <strong>{choice === "accepted" ? "accepted" : choice === "declined" ? "declined" : "not chosen yet"}</strong>.</p>
            <div className="cookie-actions">
              <button className="btn" onClick={() => setChoice("accepted")}>Accept analytics cookies</button>
              <button className="btn-ghost" onClick={() => setChoice("declined")}>Decline</button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
