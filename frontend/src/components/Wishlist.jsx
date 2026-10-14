import { useEffect, useState } from "react";
import { api } from "../lib/api";
import "../styles/wishlist.css";

const FALLBACK = ["Butter", "Eggs", "Milk", "Vitamins", "Diapers", "Toilet Paper", "Fruits", "Vegetables", "Cereal", "Toothpaste"]
  .map((item, id) => ({ id, item }));

export default function Wishlist() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api("/wishlist").then((rows) => rows.length && setItems(rows)).catch(() => {});
  }, []);

  return (
    <section className="wrap wishlist" id="wishlist" aria-labelledby="wishlist-h">
      <p className="wishlist-intro">
        These are some of the items we urgently need. Every donation, big or small, helps us create a safer,
        healthier and more inclusive environment.
      </p>
      <div className="paper-wrap">
        <div className="paper">
          <h2 id="wishlist-h">Wishlist</h2>
          <ul>{items.map((w) => <li key={w.id}>{w.item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
