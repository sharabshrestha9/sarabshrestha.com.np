const form = document.querySelector("#contact-form");
const note = document.querySelector("#form-note");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `Portfolio message from ${data.get("name")}`;
  const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
  window.location.href = `mailto:sharabshrestha@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Opening your email app…";
});
