import { Link } from "react-router-dom";

// Props come from heroFor(pageKey) in data/heroes.js
export default function Hero({ tag, title, sub, text, cta, image, alt = "", compact }) {
  return (
    <section className={compact ? "hero hero--compact" : "hero"}>
      <div className="wrap">
        <div className="hero-txt">
          {tag && <p className="tag">{tag}</p>}
          <h1>{title}</h1>
          {sub && (
            <p className="sub">
              {sub.split("\n").map((line, i, a) => (
                <span key={i}>{line}{i < a.length - 1 && <br />}</span>
              ))}
            </p>
          )}
          {text && <p className="lede">{text}</p>}
          {cta && <Link className="btn" to={cta.to}>{cta.label} <span aria-hidden="true">→</span></Link>}
        </div>
      </div>
      {image && <img className="hero-img" src={image} alt={alt} />}
    </section>
  );
}
