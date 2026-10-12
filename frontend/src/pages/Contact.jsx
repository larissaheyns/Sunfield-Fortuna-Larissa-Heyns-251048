import { useState } from "react";
import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";
import { api } from "../lib/api";

export default function Contact() {
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending", msg: "" });
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      form.reset();
      setStatus({ state: "ok", msg: "Thank you – your message has been sent." });
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  }

  return (
    <>
      <Hero {...heroFor("contact")} />
      <section className="wrap page-body">
        <h2>Send us a message</h2>
        <form className="form" onSubmit={submit}>
          <label>Name<input name="name" required maxLength={100} /></label>
          <label>Email<input name="email" type="email" required maxLength={150} /></label>
          <label>Message<textarea name="message" rows={6} required maxLength={2000} /></label>
          <button className="btn" disabled={status.state === "sending"}>
            {status.state === "sending" ? "Sending…" : "Send message"}
          </button>
          {status.msg && <p className={`form-msg ${status.state}`} role="status">{status.msg}</p>}
        </form>
      </section>
    </>
  );
}
