let pressedKeys = {};
let aa = 0;

document.addEventListener('keydown', function(event) {
    pressedKeys[event.key] = true;
    if(Object.keys(pressedKeys).join('') === 'seva' && aa === 0){
        document.getElementById('pshlka').style.display = 'flex';
        aa = 1;
    }
});

document.addEventListener('keyup', function(event) {
    delete pressedKeys[event.key];
});
document.getElementById('yes').addEventListener('click', function(event) {
    document.getElementById('smile').classList.add('yes'); // Добавляем класс "yes", чтобы изменить scale
    setTimeout(() => {
        document.getElementById('pshlka').style.display = 'none';
    }, 11000)
    removeEventListener('')
})
document.getElementById('no').addEventListener('click', function(event) {
    document.getElementById('no').style.display = 'none';
})
