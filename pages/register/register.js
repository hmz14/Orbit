
const registerForm = document.getElementById("register-form");
const feedbackEl   = document.getElementById("register-feedback");
const passwordEl   = document.getElementById("reg-password");

function showMessage(msg) {
  feedbackEl.textContent = msg;
}

function nextUserId(users) {
  let biggest = 0;
  for (let i = 0; i < users.length; i++) {
    const piece = users[i].id.replace("u", "");
    const num = Number(piece);
    if (num > biggest) biggest = num;
  }
  return "u" + (biggest + 1);
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

registerForm.addEventListener("submit", (event) => {
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
