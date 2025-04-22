const burger = document.querySelectorAll('.burger__button');
const burgerBg = document.querySelector('.open_burger');
const leftMenu = burgerBg.querySelector('.open_burger-block');

burger.forEach(element => {
    element.addEventListener('click', (e) => {
        burgerBg.classList.toggle('open_burger-bg');
        leftMenu.classList.toggle('open_burger-block-active');

    })
})
leftMenu.addEventListener('click', (e) => {
    e.stopPropagation()
})
burgerBg.addEventListener('click', () => {
    burgerBg.classList.remove('open_burger-bg');
    leftMenu.classList.remove('open_burger-block-active');
})
