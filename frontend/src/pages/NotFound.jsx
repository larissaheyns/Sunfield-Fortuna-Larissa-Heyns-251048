import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="wrap page-body">
      <h2>Page not found</h2>
      <p><Link className="more" to="/">← Back to home</Link></p>
    </section>
  );
}
