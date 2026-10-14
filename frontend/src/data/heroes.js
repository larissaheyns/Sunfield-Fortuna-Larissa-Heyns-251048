const files = import.meta.glob("../assets/heroes/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" });
const img = (key) => Object.entries(files).find(([p]) => p.split("/").pop().startsWith(key + "."))?.[1];

const HEROES = {
  home: {
    tag: "COMMUNITY – SUPPORT – HOPE",
    title: "Sunfield Fortuna",
    sub: "Supporting lives,\nbuilding community.",
    text: "Since 1991 we have been caring for upward of 70 residents, providing for their social, physical and medical needs.",
    cta: { label: "Learn about Sunfield", to: "/mission" },
    alt: "A caregiver embracing a child",
  },
  mission: { title: "Our Mission", sub: "Building stronger,\nhealthier communities." },
  involved: {
    tag: "GET INVOLVED",
    title: "Make a difference today",
    text: "Your support helps us to provide essential resources, care and opportunities for people with disabilities and their families.",
    cta: { label: "Donate Now", to: "/donate" },
    alt: "A smiling girl with her caregiver",
    compact: false,
  },
  donate: { tag: "DONATE", title: "Give to Sunfield Fortuna", sub: "Every gift makes\na difference." },
  news: { title: "News Stories", sub: "What's happening\nat Sunfield." },
  contact: { title: "Contact", sub: "We'd love to\nhear from you." },
  login: { title: "Sign Up / Login", sub: "Welcome back." },
};

export function heroFor(key) {
  const h = HEROES[key];
    return { ...h, image: img(key) ?? img("home"), compact: h.compact ?? key !== "home" };
}
