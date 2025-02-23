
window.addEventListener('scroll', function(){
    const navbar = document.getElementById("navbar")
    const scrollValue = window.scrollY;
    if(scrollValue < 150){
        navbar.classList.remove('nav-bg');
    } else {
        navbar.classList.add('nav-bg');
    }
    
})