const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.getElementsByClassName("wrapper");

function toggleForm(formType){
    if(formType === 'signup'){
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
        container.classList.add("signup-height");       
    } else {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    }
}

document.querySelectorAll('.redirect-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(e.target.dataset.form);
        toggleForm(e.target.dataset.form);
    });
});

