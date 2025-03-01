const ADMIN_URL = "http://localhost:3000/admin";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
  
  fetchCourses();
});

const modal = document.getElementById("courseModal");

const openModal = document.getElementById("openModal");
openModal.addEventListener("click", function () {
  modal.showModal();
});

const closeModal = document.getElementById("closeModalBtn");
closeModal.addEventListener("click", function () {
  modal.close();
});

async function checkAdminAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized access!");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch("/api/auth/me", {
    headers: { token: `${token}` },
  });

  const user = await res.json();
  if (!user.isAdmin) {
    alert("Access Denied!");
    window.location.href = "index.html";
  }
}

const addForm = document.getElementById("add-new-form");

addForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const imgUrl = document.getElementById("imgUrl");
  const price = document.getElementById("price");

  const bodyData = {
    title: title.value,
    description: description.value,
    imageUrl: imgUrl.value,
    price: price.value,
  };

  const courseIdInput = document.getElementById("courseId");
  let endpoint = "course";
  let method = "POST";

  if (courseIdInput && courseIdInput.value) {
    bodyData.courseId = courseIdInput.value
    endpoint = `course`;
    method = "PUT";    
  }

  const response = await postData(bodyData, endpoint, method);
  if (!response) {
    alert("Failed to add course");
    return;
  }

  console.log(response);
  alert(response.message);
  
  if (response.courseId || (courseIdInput && courseIdInput.value)) {
    modal.close();
    fetchCourses();

    addForm.reset();
    if (courseIdInput) {
      courseIdInput.value = "";
    }
  }
});

async function editCourse(courseId) {
  token = localStorage.getItem("token");

  try {
    const response = await fetch(`${ADMIN_URL}/course/${courseId}`, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        token: token,
      },
    });

    if (!response.ok) {
      console.log("error while getting course details");
    }

    const data = await response.json();
    modal.showModal();
    
    document.getElementById("title").value = data.course.title;
    document.getElementById("description").value = data.course.description;
    document.getElementById("imgUrl").value = data.course.imageUrl;
    document.getElementById("price").value = data.course.price;
   
    let courseIdInput = document.getElementById("courseId");

    if (!courseIdInput) {
      courseIdInput = document.createElement("input");
      courseIdInput.type = "hidden";
      courseIdInput.id = "courseId";
      courseIdInput.name = "courseId";
      addForm.appendChild(courseIdInput);
    }
    courseIdInput.value = data.course._id;
  } catch (error) {
    console.log(error);
  }
}

function addCourseToDOM(course) {
  const container = document.getElementById("course-container");
  const courseCard = document.createElement("div");
  courseCard.classList.add("course-card");

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("course-image");

  const courseImage = document.createElement("img");
  courseImage.src = course.imageUrl;

  imgDiv.appendChild(courseImage);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");

  editBtn.setAttribute("data-id", course._id);
  editBtn.addEventListener("click", function () {
    const courseId = this.dataset.id;
    editCourse(courseId);
  });

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pencil");

  editBtn.appendChild(editIcon);

  imgDiv.appendChild(editBtn);
  courseCard.appendChild(imgDiv);

  const courseContent = document.createElement("div");
  courseContent.classList.add("course-content");

  const title = document.createElement("h3");
  title.classList.add("course-title");
  title.textContent = course.title;

  courseContent.appendChild(title);

  const description = document.createElement("p");
  description.classList.add("course-description");
  description.textContent = course.description;

  courseContent.appendChild(description);

  const price = document.createElement("div");
  price.classList.add("course-price");
  price.textContent = course.price;

  courseContent.appendChild(price);

  courseCard.appendChild(courseContent);
  container.appendChild(courseCard);
}

async function postData(bodyData, endpoint, method) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${ADMIN_URL}/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(bodyData),
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

function fetchCourses() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("course-container");
  container.innerHTML = "";
  fetch(`${ADMIN_URL}/course/bulk`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response.status);
      }
      return response.json();
    })
    .then((courses) => {
      courses.courses.forEach((course) => addCourseToDOM(course));
      // console.log(courses)
    })
    .catch((error) => console.log(error));
}
