const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const container = document.getElementsByClassName("wrapper");

let isSigningUp = false;

function toggleForm(formType) {
  if (formType === "signup") {
    loginContainer.style.display = "none";
    signupContainer.style.display = "flex";
  } else {
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
  }
}

document.querySelectorAll(".redirect-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForm(e.target.dataset.form);
  });
});

const USER_URL = "http://localhost:3000/user";
const ADMIN_URL = "http://localhost:3000/admin";

const role = localStorage.getItem("role");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    if (isSigningUp) return;
    isSigningUp = true;
    console.log("signup clicked");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("signup-email");
    const password = document.getElementById("signup-password");

    const bodyData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    const endpoint = "signup";
    let responseData = null;

    if (role == "admin") {
      responseData = await postData(ADMIN_URL, bodyData, endpoint);
    } else if (role == "user") {
      responseData = await postData(USER_URL, bodyData, endpoint);
    }
    alert(responseData.msg);
  },
  false
);

loginForm.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    console.log("login clicked");

    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");

    const bodyData = {
      email: email.value,
      password: password.value,
    };
    const endpoint = "login";
    console.log(endpoint);
    
    let responseData = null;

    if (role == "admin") {
      responseData = await postData(ADMIN_URL, bodyData, endpoint);
    } else if (role == "user") {
      responseData = await postData(USER_URL, bodyData, endpoint);
    }
    console.log(responseData);
    const token = responseData.token;
    localStorage.setItem("token", token);

    if (token && role == 'admin') {
      window.location.href = "admin.html";
    } else if(token){
      window.location.href = "index.html";
    }
  },
  false
);

async function postData(URL, bodyData, endpoint) {
  try {
    const response = await fetch(`${URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
}
