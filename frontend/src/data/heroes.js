// One entry per page. The Hero image is picked up automatically from
// src/assets/heroes/<key>.(png|jpg|jpeg|webp), e.g. mission.jpg for "mission".
// Pages without their own image fall back to home.*
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
  involved: { title: "Get Involved", sub: "Volunteer, partner\nor make a difference." },
  news: { title: "News Stories", sub: "What's happening\nat Sunfield." },
  contact: { title: "Contact", sub: "We'd love to\nhear from you." },
  login: { title: "Sign Up / Login", sub: "Welcome back." },
};

export function heroFor(key) {
  const h = HEROES[key];
  return { ...h, image: img(key) ?? img("home"), compact: key !== "home" };
}
