document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const myCoursesContainer = document.getElementById('my-courses-container');
    const browseCoursesContainer = document.getElementById('browse-courses-container');
    const tabs = document.querySelectorAll('.dashboard-tab');
    let browseCoursesLoaded = false;
  
    function checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
      }
      return token;
    }
    const token = checkAuth();

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    // Tab switching logic
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.getAttribute('data-tab');
        if (tabName === 'my-courses') {
          myCoursesContainer.style.display = 'grid';
          browseCoursesContainer.style.display = 'none';
          loadPurchasedCourses();
        } else {
          myCoursesContainer.style.display = 'none';
          browseCoursesContainer.style.display = 'grid';
          if (!browseCoursesLoaded) {
            loadBrowseCourses();
          }
        }
      });
    });
  

    async function loadPurchasedCourses() {
      try {
        const response = await fetch('http://localhost:3000/user/purchases', {
          method: 'GET',
          headers: { token }
        });
        if (!response.ok) console.log('Failed to fetch purchased courses');
        const data = await response.json();
        myCoursesContainer.innerHTML = '';
        if (data.courses && data.courses.length) {
          data.courses.forEach(course => {
            myCoursesContainer.appendChild(createCourseCard(course, true));
          });
        } else {
          const emptyEl = createEmptyState(
            'No courses yet',
            "You haven't purchased any courses yet. Browse courses to get started!",
            'Browse Courses'
          );
          myCoursesContainer.appendChild(emptyEl);
          const browseNowBtn = document.getElementById('browse-now-btn');
          if (browseNowBtn) {
            browseNowBtn.addEventListener('click', () => switchTab('browse-courses'));
          }
        }
      } catch (error) {
        console.error('Error loading purchased courses:', error);
        myCoursesContainer.innerHTML = '';
        const errorEl = createErrorState(
          'Something went wrong',
          "We couldn't load your courses. Please try again.",
          'retry-purchases-btn'
        );
        myCoursesContainer.appendChild(errorEl);
        const retryBtn = document.getElementById('retry-purchases-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', loadPurchasedCourses);
        }
      }
    }

    async function loadBrowseCourses() {
      try {
        const response = await fetch('http://localhost:3000/course/preview');
        if (!response.ok) console.log('Failed to fetch courses');
        const data = await response.json();
        browseCoursesContainer.innerHTML = '';
        browseCoursesLoaded = true;
        if (data.courses && data.courses.length) {
          data.courses.forEach(course => {
            browseCoursesContainer.appendChild(createCourseCard(course, false));
          });
        } else {
          const emptyEl = createEmptyState(
            'No courses available',
            'There are currently no courses available. Please check back later!'
          );
          browseCoursesContainer.appendChild(emptyEl);
        }
      } catch (error) {
        console.error('Error loading available courses:', error);
        browseCoursesContainer.innerHTML = '';
        const errorEl = createErrorState(
          'Something went wrong',
          "We couldn't load the available courses. Please try again.",
          'retry-browse-btn'
        );
        browseCoursesContainer.appendChild(errorEl);
        const retryBtn = document.getElementById('retry-browse-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', loadBrowseCourses);
        }
      }
    }
  
    function createCourseCard(course, isPurchased) {
      const card = document.createElement('div');
      card.classList.add('course-card');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('course-image');
      const imgEl = document.createElement('img');
      imgEl.src = course.imageUrl;
      imgEl.alt = course.title || 'Course Image';
      imageDiv.appendChild(imgEl);
      card.appendChild(imageDiv);
  
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('course-content');
  
      const titleEl = document.createElement('h3');
      titleEl.classList.add('course-title');
      titleEl.textContent = course.title || 'Untitled Course';
      contentDiv.appendChild(titleEl);
  
      const descEl = document.createElement('p');
      descEl.classList.add('course-description');
      descEl.textContent = course.description || 'No description available';
      contentDiv.appendChild(descEl);
  
      const priceEl = document.createElement('div');
      priceEl.classList.add('course-price');
      priceEl.textContent = isPurchased ? 'Purchased ✓' : `$${course.price || 0}`;
      contentDiv.appendChild(priceEl);
  
      const button = document.createElement('button');
      button.classList.add(isPurchased ? 'view-course-btn' : 'purchase-btn');
      button.dataset.id = course._id;
      button.textContent = isPurchased ? 'Access Course' : 'Purchase Now';
      contentDiv.appendChild(button);
  
      card.appendChild(contentDiv);  
  
      return card;
    }

    function createEmptyState(title, description, btnText = '') {
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('empty-state');
  
      const iconDiv = document.createElement('div');
      iconDiv.classList.add('empty-state-icon');
      iconDiv.textContent = '📚';
      emptyDiv.appendChild(iconDiv);
  
      const titleEl = document.createElement('h3');
      titleEl.classList.add('empty-state-title');
      titleEl.textContent = title;
      emptyDiv.appendChild(titleEl);
  
      const descEl = document.createElement('p');
      descEl.classList.add('empty-state-description');
      descEl.textContent = description;
      emptyDiv.appendChild(descEl);
  
      if (btnText) {
        const button = document.createElement('button');
        button.classList.add('browse-courses-btn');
        button.id = 'browse-now-btn';
        button.textContent = btnText;
        emptyDiv.appendChild(button);
      }
  
      return emptyDiv;
    }
  
   
    function createErrorState(title, message, btnId) {
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('error-state');
  
      const titleEl = document.createElement('h3');
      titleEl.classList.add('error-title');
      titleEl.textContent = title;
      errorDiv.appendChild(titleEl);
  
      const messageEl = document.createElement('p');
      messageEl.classList.add('error-message');
      messageEl.textContent = message;
      errorDiv.appendChild(messageEl);
  
      const button = document.createElement('button');
      button.classList.add('retry-btn');
      button.id = btnId;
      button.textContent = 'Retry';
      errorDiv.appendChild(button);
  
      return errorDiv;
    }
  
    function switchTab(tabName) {
      tabs.forEach(t => t.classList.remove('active'));
      const tab = document.querySelector(`[data-tab="${tabName}"]`);
      if (tab) {
        tab.classList.add('active');
      }
      myCoursesContainer.style.display = tabName === 'my-courses' ? 'grid' : 'none';
      browseCoursesContainer.style.display = tabName === 'browse-courses' ? 'grid' : 'none';
    }
  
    async function purchaseCourse(courseId) {
      try {
        const response = await fetch('/api/courses/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token
          },
          body: JSON.stringify({ courseId })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || 'Course purchased successfully!');
          loadPurchasedCourses();
          switchTab('my-courses');
        } else {
          alert(data.message || 'Failed to purchase course. Please try again.');
        }
      } catch (error) {
        console.error('Error purchasing course:', error);
        alert('An error occurred while purchasing the course. Please try again.');
      }
    }

    loadPurchasedCourses();
  });
  