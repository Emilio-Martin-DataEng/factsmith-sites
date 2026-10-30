// Enquiry form: no backend. WhatsApp first (needs WA from wa.js), email as the alternative. Swap for a form handler at go-live.
const form = document.getElementById("enq");
if (!WA) document.getElementById("wa-tbc").hidden = false;
form.addEventListener("submit", ev => {
  ev.preventDefault();
  const f = new FormData(form);
  const body = `Enquiry about: ${f.get("about")}\nName: ${f.get("name")}\nEmail or phone: ${f.get("contact")}\n\n${f.get("message")}`;
  const mail = `mailto:principal@thefellowship.co.za?subject=${encodeURIComponent("Website enquiry: " + f.get("about"))}&body=${encodeURIComponent(body)}`;
  location.href = ev.submitter?.value === "wa" && WA ? `https://wa.me/${WA}?text=${encodeURIComponent(body)}` : mail;
});
