const API = "http://localhost:3000";
const loginForm = document.getElementById("login-form");
const feedbackEl = document.getElementById("login-feedback");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email    = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  showMessage("");

  if (!email)    { showMessage("Please enter your email.");    return; }
  if (!password) { showMessage("Please enter your password."); return; }

  try {
    const res = await fetch(`${API}/api/users?email=${encodeURIComponent(email)}`);

    if (res.status === 404) {
      showMessage("No account found with that email.");
      return;
    }

    if (!res.ok) {
      showMessage("Login failed. Please try again.");
      return;
    }

    const user = await res.json();

    if (user.password !== password) {
      showMessage("Wrong password.");
      return;
    }

    localStorage.setItem("orbit-uid", user.id);
    window.location.href = "../feed/feed.html";
  } catch (err) {
    console.error("Login error:", err);
    showMessage("Could not connect to server. Is it running?");
  }
});
