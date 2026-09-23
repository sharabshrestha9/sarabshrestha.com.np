const form = document.querySelector("#contact-form");
const note = document.querySelector("#form-note");

if (form && note) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.setAttribute("novalidate", "true");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message || !emailPattern.test(email)) {
      const errors = [];
      if (!name) errors.push("Please enter your name.");
      if (!email || !emailPattern.test(email)) errors.push("Please provide a valid email address.");
      if (!message) errors.push("Please enter a message.");

      note.textContent = errors.join(" ");
      note.setAttribute("role", "alert");
      return;
    }

    const subject = `Portfolio message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    note.textContent = "Opening your email app… If nothing happens, email sharabshrestha@proton.me directly.";
    note.setAttribute("role", "status");
    window.location.href = `mailto:sharabshrestha@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
