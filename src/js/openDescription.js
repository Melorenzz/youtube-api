const openVideoDescription = document.getElementById('openVideoDescription');
const showLessBtn = document.getElementById('lessDescriptionBtn')
let isOpenDescription = false;

function openDescription(){
    openVideoDescription.classList.add('open_description');
    document.getElementById('lessDescriptionBtn').innerText = 'Show less';
    openVideoDescription.classList.add('clickedDescription')
    isOpenDescription = true;
}

openVideoDescription.addEventListener('click', () => {
    if(!isOpenDescription){
        openDescription();
    }
})
showLessBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if(isOpenDescription){
        openVideoDescription.classList.remove('open_description');
        document.getElementById('lessDescriptionBtn').innerText = '...more';
        openVideoDescription.classList.remove('clickedDescription')
        isOpenDescription = false;
    }else{
        openDescription()
    }
})