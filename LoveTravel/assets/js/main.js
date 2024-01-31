

const menuBtn = document.querySelector('.navbar__menu');
const menu = document.querySelector('.app__menu');
const closeMenuBtn = document.querySelector('.app__menu-close')

menuBtn.onclick = function() {
    menu.classList.add('open');
}

closeMenuBtn.onclick = function() {
    menu.classList.remove('open')
}