// Cookie notice bar. This site sets no cookies of its own; the notice explains the third-party content on some pages and links to the Privacy and cookie notice.
// The choice is remembered in localStorage (not a cookie). If analytics are switched on later, gate them on localStorage "fc-cookies" === "ok".
(() => {
let seen = false;
try { seen = localStorage.getItem("fc-cookies") === "ok"; } catch (e) {}
if (!seen) {
  const bar = document.createElement("div");
  bar.className = "cookie-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Cookie notice");
  bar.innerHTML = '<p>This website sets no cookies of its own. Some pages show maps, weather and fonts from other companies, which may set theirs. <a href="privacy.html#cookies">Privacy and cookie notice</a></p><button type="button">OK</button>';
  bar.querySelector("button").addEventListener("click", () => { try { localStorage.setItem("fc-cookies", "ok"); } catch (e) {} bar.remove(); });
  document.addEventListener("DOMContentLoaded", () => document.body.append(bar));
}
})();
