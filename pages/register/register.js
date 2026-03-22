// Register page — Lab 5 DOM + events, Lab 6 localStorage through storage.js

const registerForm = document.getElementById("register-form");
const feedbackEl = document.getElementById("register-feedback");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

function nextUserId(users) {
  let biggest = 0;
  for (let i = 0; i < users.length; i++) {
    const piece = users[i].id.replace("u", "");
    const num = Number(piece);
    if (num > biggest) {
      biggest = num;
    }
  }
  return "u" + (biggest + 1);
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;

  showMessage("");

  if (password !== confirm) {
    showMessage("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password should be at least 6 characters.");
    return;
  }

  const appData = loadAppData();

  const sameEmail = appData.users.filter(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (sameEmail.length > 0) {
    showMessage("That email is already registered.");
    return;
  }

  const sameName = appData.users.filter(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (sameName.length > 0) {
    showMessage("That username is taken.");
    return;
  }

  const newUser = {
    id: nextUserId(appData.users),
    username: username,
    email: email,
    password: password,
    profilePicture: "images/default.png",
    bio: "",
    following: [],
    followers: []
  };

  appData.users.push(newUser);
  saveAppData(appData);

  window.location.href = "../login/login.html";
});
