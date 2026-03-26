const loginForm = document.getElementById("login-form");
const feedbackEl = document.getElementById("login-feedback");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  showMessage("");

  if (!email) {
    showMessage("Please enter your email.");
    return;
  }

  if (!password) {
    showMessage("Please enter your password.");
    return;
  }

  const appData = loadAppData();

  const found = appData.users.filter(
    (u) => u.email && u.email.toLowerCase() === email
  );

  if (found.length === 0) {
    showMessage("No account found with that email.");
    return;
  }

  const user = found[0];
  if (user.password !== password) {
    showMessage("Wrong password.");
    return;
  }

  appData.currentUserId = user.id;
  saveAppData(appData);

  window.location.href = "../feed/feed.html";
});
