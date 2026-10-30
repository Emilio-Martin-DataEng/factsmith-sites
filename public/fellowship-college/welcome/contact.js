// Enquiry form: no backend; opens the visitor's email app. Swap for a form handler at go-live.
const form = document.getElementById("enq");
form.addEventListener("submit", ev => {
  ev.preventDefault();
  const f = new FormData(form);
  const body = `Enquiry about: ${f.get("about")}\nName: ${f.get("name")}\nEmail or phone: ${f.get("contact")}\n\n${f.get("message")}`;
  location.href = `mailto:principal@thefellowship.co.za?subject=${encodeURIComponent("Website enquiry: " + f.get("about"))}&body=${encodeURIComponent(body)}`;
});
