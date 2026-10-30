// WhatsApp-first: every a[data-wa] opens a WhatsApp chat with the school with that text pre-filled.
// WA = the school's WhatsApp number, digits only with country code (e.g. 27215550000). TBC from the school: until it is set,
// the buttons send visitors to the Contact page enquiry form instead.
const WA = "";
document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("a[data-wa]").forEach(a => {
  if (WA) { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa)}`; a.target = "_blank"; a.rel = "noopener"; }
  else { a.href = "contact.html#enquiry"; a.title = "WhatsApp number to be confirmed"; }
}));
