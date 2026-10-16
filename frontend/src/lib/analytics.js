import { useSyncExternalStore } from "react";

const ID = import.meta.env.VITE_GA_ID;
const KEY = "sf_cookie_choice"; 
let loaded = false;

export const analyticsConfigured = Boolean(ID);

export function getChoice() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
export function setChoice(value) {
  try { localStorage.setItem(KEY, value); } catch { /* private mode: choice lasts until reload */ }
  if (value !== "accepted") clearGaCookies();
  window.dispatchEvent(new Event("sf-consent"));
}
const subscribe = (cb) => {
  window.addEventListener("sf-consent", cb);
  return () => window.removeEventListener("sf-consent", cb);
};
export const useConsent = () => useSyncExternalStore(subscribe, getChoice, () => null);

export function loadAnalytics() {
  if (!ID || loaded) return;
  loaded = true;
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); }; 
  window.gtag("js", new Date());
  window.gtag("config", ID, { send_page_view: false }); 
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`;
  document.head.appendChild(s);
}

export function trackPage(path) {
  if (loaded && window.gtag) {
    window.gtag("event", "page_view", { page_path: path, page_location: window.location.origin + path, page_title: document.title });
  }
}

function clearGaCookies() {
  if (ID) window[`ga-disable-${ID}`] = true;
  const parts = location.hostname.split(".");
  const domains = [location.hostname, ...parts.slice(1).map((_, i) => "." + parts.slice(i + 1).join("."))];
  document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga")).forEach((n) =>
    domains.forEach((d) => { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`; }));
}
