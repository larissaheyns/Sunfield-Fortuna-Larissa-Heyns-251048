import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function save(e) {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const r = await api("/me/profile", { method: "PATCH", body: JSON.stringify(body) });
      setUser(r.user);
      setStatus({ state: "ok", msg: "Your details have been updated." });
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  }

  return (
    <section className="history dash-pad-x page-top">
      <h2>Your profile</h2>
      <p className="history-sub">Keep your details up to date.</p>
      <form className="form profile-form" onSubmit={save}>
        <div className="form-row">
          <label>First name<input name="first_name" defaultValue={user.first_name} required maxLength={50} autoComplete="given-name" /></label>
          <label>Last name<input name="last_name" defaultValue={user.last_name} required maxLength={50} autoComplete="family-name" /></label>
        </div>
        <label>Email<input value={user.email} disabled readOnly /><small>To change your email address, <Link to="/contact">contact us</Link>.</small></label>
        <button className="btn" disabled={status.state === "sending"}>{status.state === "sending" ? "Saving…" : "Save changes"}</button>
        {status.msg && <p className={`form-msg ${status.state}`} role="status">{status.msg}</p>}
      </form>
    </section>
  );
}
