import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { rand } from "../components/DonationList";
import { heroFor } from "../data/heroes";
import { SITE } from "../data/site";
import { DONATE } from "../data/donate";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import "../styles/donate.css";

const Icon = ({ children }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{children}</svg>
);

const OPTIONS = [
  {
    key: "money",
    title: "Donate money (EFT)",
    text: "Pay directly from your bank into our account.",
    icon: <Icon><circle cx="32" cy="32" r="22" /><path d="M32 18v28M38 25c-1-3-4-4-6-4-4 0-7 2-7 5 0 7 14 3 14 11 0 3-3 5-7 5-3 0-6-2-7-5" /></Icon>,
  },
  {
    key: "items",
    title: "Donate goods",
    text: "Food, clothing, toiletries and other essentials.",
    icon: <Icon><path d="M8 24h48v10H8zM12 34h40v22H12zM32 24v32" /><path d="M32 24c-6-12-18-10-14-4s14 4 14 4zm0 0c6-12 18-10 14-4s-14 4-14 4z" /></Icon>,
  },
];
const QUICK = [100, 250, 500, 1000];

function Copy({ value, label }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch { /* clipboard blocked: the text is still on screen */ }
  }
  return <button type="button" className="copy" onClick={copy} aria-label={`Copy ${label}`}>{done ? "Copied ✓" : "Copy"}</button>;
}

// Step 1: the donor says how much they plan to give; we save it as "pending" and hand back a payment reference.
function PledgeForm({ onDone }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      onDone(await api("/me/donations/money", { method: "POST", body: JSON.stringify({ amount }) }));
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  }

  return (
    <form className="form pledge" onSubmit={submit}>
      <p className="step"><strong>Step 1.</strong> Tell us how much you plan to give, so we can match your payment and show it in your donation history.</p>
      <div className="quick">
        {QUICK.map((q) => (
          <button type="button" key={q} className={Number(amount) === q ? "on" : ""} onClick={() => setAmount(String(q))}>R{q}</button>
        ))}
      </div>
      <label>Amount (R)
        <input type="number" inputMode="decimal" min="1" max="1000000" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button className="btn" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Please wait…" : "Get my payment reference"} <span aria-hidden="true">→</span>
      </button>
      {status.msg && <p className="form-msg err" role="alert">{status.msg}</p>}
    </form>
  );
}

function Confirmation({ pledge, onAgain }) {
  return (
    <div className="pledge-done" role="status">
      <h4>Thank you! Your donation of {rand(pledge.amount)} is noted.</h4>
      <p><strong>Step 2.</strong> Make your EFT using the bank details below and use this as the payment reference:</p>
      <p className="ref"><strong>{pledge.reference}</strong><Copy value={pledge.reference} label="payment reference" /></p>
      <p className="fine">
        It shows as <em>Pending</em> in your <Link to="/dashboard">dashboard</Link> until we see the payment in our bank account.
        Nothing has been paid yet.
      </p>
      <button type="button" className="copy" onClick={onAgain}>Record another donation</button>
    </div>
  );
}

function BankDetails() {
  const b = DONATE.bank;
  return (
    <dl className="bank">
      <div><dt>Bank</dt><dd>{b.bank}</dd></div>
      <div><dt>Account name</dt><dd>{b.accountName}</dd></div>
      <div><dt>Branch</dt><dd>{b.branch}</dd></div>
      <div><dt>Account number</dt><dd><strong>{b.accountNumber}</strong><Copy value={b.accountNumber} label="account number" /></dd></div>
      <div><dt>Account type</dt><dd>{b.accountType}</dd></div>
    </dl>
  );
}

function Money() {
  const { user, ready } = useAuth();
  const [pledge, setPledge] = useState(null);

  if (!DONATE.verified) {
    return (
      <>
        <p>{DONATE.fundsPurpose}</p>
        <p className="fine"><strong>Our banking details will be shown here shortly.</strong> In the meantime please <Link to="/contact">contact us</Link> and we will gladly share them.</p>
      </>
    );
  }

  return (
    <>
      <p>{DONATE.fundsPurpose}</p>
      {pledge ? (
        <Confirmation pledge={pledge} onAgain={() => setPledge(null)} />
      ) : ready && user ? (
        <PledgeForm onDone={setPledge} />
      ) : ready ? (
        <p className="login-prompt">
          <Link to="/signup">Create an account</Link> or <Link to="/login">log in</Link> to record your donation. You will get a payment
          reference to use on your EFT, and your gift will show in your donation history. You can also pay without an account using the details below.
        </p>
      ) : null}

      <BankDetails />
      <p className="fine">
        Please double-check the account number before you pay.
        {!pledge && <> If you would like us to thank you, email your proof of payment to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</>}
      </p>
    </>
  );
}

function Goods() {
  return (
    <>
      <p>The home looks after more than 70 residents and always needs basic supplies. The most needed items are usually:</p>
      <ul className="need-list">
        {DONATE.priorityItems.map((i) => <li key={i.title}><strong>{i.title}</strong><span>{i.text}</span></li>)}
      </ul>
      <p className="fine">See exactly what is needed right now on our <Link to="/involved">wishlist</Link>.</p>

      <h4>How to deliver goods</h4>
      <p>Please phone ahead to arrange a time to bring your donation to the home:</p>
      <ul className="contact-list">
        {DONATE.contacts.map((c) => (
          <li key={c.name}>
            <strong>{c.name}</strong>{c.role && <span> – {c.role}</span>}
            <span className="phones">{c.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Donate() {
  const [choice, setChoice] = useState("money");
  const current = OPTIONS.find((o) => o.key === choice);

  return (
    <>
      <Hero {...heroFor("donate")} />
      <section className="wrap page-body donate">
        <aside className="donate-notice" aria-labelledby="notice-h">
          <h2 id="notice-h">How donating works</h2>
          <p>
            Donations are <strong>not made through this website</strong>. We do not take payments or collect goods here.
            Money is paid by EFT from your own bank straight into Sunfield Home Fortuna’s bank account, and goods are
            delivered to the home. This page gives you the details you need.
          </p>
        </aside>

        <h2>How would you like to give?</h2>
        <div className="donate-options">
          {OPTIONS.map((o) => (
            <button key={o.key} className="option" aria-pressed={choice === o.key} onClick={() => setChoice(o.key)}>
              {o.icon}
              <strong>{o.title}</strong>
              <span>{o.text}</span>
            </button>
          ))}
        </div>

        <div className="donate-panel" aria-live="polite">
          <h3>{current.title}</h3>
          {choice === "money" ? <Money /> : <Goods />}
        </div>
      </section>
    </>
  );
}
