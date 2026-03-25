// Login page — Lab 5 form + Lab 6 localStorage (storage.js)

const loginForm = document.getElementById("login-form");
const feedbackEl = document.getElementById("login-feedback");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  showMessage("");

  const appData = loadAppData();

  const found = appData.users.filter(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (found.length === 0) {
    showMessage("Username not found.");
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
