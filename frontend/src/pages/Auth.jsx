import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SITE } from "../data/site";
import "../styles/auth.css";

const files = import.meta.glob("../assets/auth.{png,jpg,jpeg,webp}", { eager: true, import: "default" });
const photo = Object.values(files)[0];

export default function Auth({ mode }) {
  const signup = mode === "signup";
  const { user, ready, login, register } = useAuth();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  if (ready && user) return <Navigate to="/dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    const { confirm, ...body } = Object.fromEntries(new FormData(e.currentTarget));
    if (signup && body.password !== confirm) return setStatus({ state: "err", msg: "The two passwords don’t match." });
    setStatus({ state: "sending", msg: "" });
    try {
      await (signup ? register(body) : login(body));
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  }

  const type = show ? "text" : "password";
  const toggle = <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</button>;

  return (
    <section className="auth">
        <div className="auth-head">
            <Link className="back" to="/">← Back to home</Link>
            <h1>{signup ? "Join the Sunfield Home Community" : "Welcome back"}</h1>
            <p className="auth-sub">{signup ? "Come be a part of the Sunfield Home Family." : "Log in to your Sunfield account."}</p>
        </div>
      <div className="auth-main">
      
        

        <div className="auth-card">
          <div className="tabs">
            <Link to="/signup" aria-current={signup ? "page" : undefined}>Sign up</Link>
            <Link to="/login" aria-current={!signup ? "page" : undefined}>Log in</Link>
          </div>

          <form className="form auth-form" onSubmit={submit}>
            {signup && (
              <div className="form-row">
                <label>First name<input name="first_name" required maxLength={50} autoComplete="given-name" placeholder="Jane" /></label>
                <label>Last name<input name="last_name" required maxLength={50} autoComplete="family-name" placeholder="Doe" /></label>
              </div>
            )}
            <label>Email<input name="email" type="email" required maxLength={150} autoComplete="email" placeholder="email@example.com" /></label>
            <label>{signup ? "Create password" : "Password"}
              <span className="pw">
                <input name="password" type={type} required minLength={signup ? 8 : undefined} maxLength={72}
                  autoComplete={signup ? "new-password" : "current-password"} placeholder="Password" />
                {toggle}
              </span>
              {signup && <small>At least 8 characters</small>}
            </label>
            {signup && (
              <label>Confirm password
                <input name="confirm" type={type} required autoComplete="new-password" placeholder="Re-enter password" />
              </label>
            )}
            <button className="btn" disabled={status.state === "sending"}>
              {status.state === "sending" ? "Please wait…" : signup ? "Create account" : "Log in"} <span aria-hidden="true">→</span>
            </button>
            {status.msg && <p className={`form-msg ${status.state}`} role="alert">{status.msg}</p>}
          </form>
        </div>

         
      </div>

      <div className="auth-photo">
        {photo && <img src={photo} alt="" />}
        <p>{SITE.tagline}</p>
      </div>
    </section>
  );
}
