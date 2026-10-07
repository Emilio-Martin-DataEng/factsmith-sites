const WA = "27833004725";            // on WhatsApp (client, 2026-10-06)
const EMAIL = "bookings@khayalamanzi.co.za";
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Mobile menu
const menu = $(".menu"), list = $("#navlist");
menu?.addEventListener("click", () => menu.setAttribute("aria-expanded", list.classList.toggle("open")));

// Gallery lightbox (native <dialog>)
const lb = $("#lb");
if (lb) {
  $$(".gi").forEach(b => b.addEventListener("click", () => {
    const im = b.querySelector("img"); if (!im) return;
    lb.querySelector("img").src = b.dataset.full; lb.querySelector("img").alt = im.alt; lb.showModal();
  }));
  lb.addEventListener("click", ev => { if (ev.target === lb || ev.target.closest(".lb-x")) lb.close(); });
}

// Enquiry form: preselect from ?unit= / ?type=, hand off to WhatsApp or email.
// ponytail: no backend; swap for Formspree / Cloudflare form handler at go-live (scope: emailed submissions).
const form = $("#enq");
if (form) {
  const q = new URLSearchParams(location.search);
  if (q.get("unit")) $("#f-unit").value = q.get("unit");
  if (q.get("type")) $("#f-type").value = q.get("type");
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    const f = new FormData(form);
    const body = `Enquiry: ${$("#f-type").selectedOptions[0].text}\nRoom: ${$("#f-unit").selectedOptions[0].text}\nDates: ${f.get("arrive")} to ${f.get("leave")}\nGuests: ${f.get("guests")}\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\n\n${f.get("message")}`;
    location.href = ev.submitter?.value === "mail"
      ? `mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`
      : `https://wa.me/${WA}?text=${encodeURIComponent(body)}`;
  });
}

// Weather + sea (Open-Meteo, no key). Lodge coords; swell point just offshore.
const wx = $("#wx");
if (wx) {
  const W = "https://api.open-meteo.com/v1/forecast?latitude=-30.5749&longitude=30.5726&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=Africa%2FJohannesburg&forecast_days=7";
  const M = "https://marine-api.open-meteo.com/v1/marine?latitude=-30.59&longitude=30.62&daily=swell_wave_height_max,swell_wave_period_max&hourly=sea_surface_temperature&timezone=Africa%2FJohannesburg&forecast_days=7";
  const WMO = {0:"Clear",1:"Mostly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Fog",51:"Drizzle",53:"Drizzle",55:"Drizzle",
    61:"Light rain",63:"Rain",65:"Heavy rain",80:"Showers",81:"Showers",82:"Heavy showers",95:"Thunderstorms",96:"Thunderstorms",99:"Thunderstorms"};
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  Promise.all([W, M].map(u => fetch(u).then(r => { if (!r.ok) throw r.status; return r.json(); }))).then(([{ daily: d }, m]) => {
    const sst = m.hourly.sea_surface_temperature;
    wx.innerHTML = d.time.map((t, i) => {
      const day = sst.slice(i * 24, i * 24 + 24).filter(x => x != null), sea = day.length ? Math.round(day.reduce((a, b) => a + b) / day.length) : null;
      return `<div class="wx"><div class="d">${i ? DAYS[new Date(t + "T12:00").getDay()] : "Today"}</div>
        <div class="t">${Math.round(d.temperature_2m_max[i])}&deg; <span>/ ${Math.round(d.temperature_2m_min[i])}&deg;</span></div>
        <div class="r">${WMO[d.weather_code[i]] ?? "Mixed"} &middot; ${d.precipitation_probability_max[i]}% rain</div>
        <div class="r">${sea != null ? `Sea ${sea}&deg; &middot; ` : ""}swell ${m.daily.swell_wave_height_max[i].toFixed(1)} m</div>
        <div class="r">UV ${Math.round(d.uv_index_max[i])} &middot; wind ${Math.round(d.wind_speed_10m_max[i])} km/h</div></div>`;
    }).join("");
  }).catch(() => wx.innerHTML = "<p>Forecast unavailable right now.</p>");
}
