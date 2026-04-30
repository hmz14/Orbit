const API = "http://localhost:3000";

const registerForm = document.getElementById("register-form");
const feedbackEl   = document.getElementById("register-feedback");
const passwordEl   = document.getElementById("reg-password");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

const rules = {
  length: { el: document.getElementById("rule-length"), test: (p) => p.length >= 8 },
  upper:  { el: document.getElementById("rule-upper"),  test: (p) => /[A-Z]/.test(p) },
  number: { el: document.getElementById("rule-number"), test: (p) => /[0-9]/.test(p) },
  symbol: { el: document.getElementById("rule-symbol"), test: (p) => /[^A-Za-z0-9]/.test(p) },
};

function validatePassword(pw) {
  let allPass = true;
  for (let key in rules) {
    const rule = rules[key];
    const pass = rule.test(pw);
    rule.el.dataset.state = pass ? "pass" : "fail";
    if (!pass) allPass = false;
  }
  return allPass;
}

passwordEl.addEventListener("input", () => {
  validatePassword(passwordEl.value);
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email    = document.getElementById("reg-email").value.trim();
  const password = passwordEl.value;
  const confirm  = document.getElementById("reg-confirm").value;

  showMessage("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }

  if (!validatePassword(password)) {
    showMessage("Password does not meet the requirements below.");
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch(`${API}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.status === 409) {
      showMessage("That username or email is already registered.");
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showMessage(err.error || "Registration failed. Please try again.");
      return;
    }

    const user = await res.json();
    localStorage.setItem("orbit-uid", user.id);
    window.location.href = "../feed/feed.html";
  } catch (err) {
    console.error("Register error:", err);
    showMessage("Could not connect to server. Is it running?");
  }
});
