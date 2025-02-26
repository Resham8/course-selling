window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  const scrollValue = window.scrollY;

  // Calculate opacity based on scroll (max 1)
  const opacity = Math.min(scrollValue / 100, 1);

  if (scrollValue < 50) {
    navbar.classList.remove("nav-bg");
  } else {
    navbar.classList.add("nav-bg");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
});

const COURSES_URL = "http://localhost:3000/course";

// preview
function fetchCourses() {
  fetch(`${COURSES_URL}/preview`)
    .then((response) => {
      if (!response.ok) {
        console.log(response.status);
      }
      return response.json();
    })
    .then((courses) => {
      courses.courses.forEach((course) => addCourseToDOM(course));
    })
    .catch((error) => console.log(error));
}

function addCourseToDOM(course) {
  const section = document.querySelector(".course-preview");
  const container = document.getElementById("course-container");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const cardImage = document.createElement("img");
  cardImage.src = course.imageUrl;

  cardDiv.appendChild(cardImage);

  const cardText = document.createElement("div");
  cardText.classList.add("card-content");

  const title = document.createElement("h2");
  title.classList.add("card-title");
  title.textContent = course.title;

  cardText.appendChild(title);

  const price = document.createElement("span");
  price.classList.add("price");
  price.textContent = course.price;

  cardText.appendChild(price);

  const enrollBtn = document.createElement("button");
  enrollBtn.textContent = "Enroll Now";

  enrollBtn.addEventListener("click", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "login.html";
      return;
    }

    if (role === "admin") {
      alert("Admins are not allowed to enroll in courses.");
      return;
    }

    enrollInCourse(course._id);
  });

  cardText.appendChild(enrollBtn);

  cardDiv.appendChild(cardText);

  container.appendChild(cardDiv);
}

function setRole(role) {
  localStorage.setItem("role", role);
  window.location.href = "login.html";
  console.log(role);
}

function enrollInCourse(courseId) {
  fetch("http://localhost:3000/course/purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token")
    },
    body: JSON.stringify({ courseId: courseId }) 
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Enrollment failed");
      }
      return response.json();
    })
    .then(data => {
      alert(data.message); 
    })
    .catch(error => {
      console.error("Error during enrollment:", error);
      alert("Enrollment error. Please try again.");
    });
}

