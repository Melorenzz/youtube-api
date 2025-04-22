import {getData} from "./loadVideos.js";
import {loadVideo} from "./loadVideoDetails.js";

import './openDescription.js'
import {loadedVideo} from "./loadOpenVideo.js";

export const title = document.getElementById('title');
export const query = document.getElementById('userSearch');

document.addEventListener('DOMContentLoaded', () => {
    getData();
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    const query = urlParams.get('query');
    console.log(videoId);
    if (videoId) {
        openVideo(videoId);
    }else if(query){
        console.log(query)
        pushStateQuery(query);
    }
})
window.addEventListener('popstate', (event) => {
    if (!event.state?.videoOpen) {
        document.querySelector('.videoPlayer').style.display = 'none';
        document.querySelector('.main_block-video').style.display = 'block';
        if(window.innerWidth <= 870){
            document.getElementById('homepageAside').style.display = 'none';
        }else{
            document.getElementById('homepageAside').style.display = 'block';
        }
    }
});
export function openVideo(videoId){
    history.pushState({videoOpen: true}, '', `?video=${videoId}`)
    document.querySelector('.videoPlayer').style.display = 'block'
    document.querySelector('.main_block-video').style.display = 'none'
    document.getElementById('homepageAside').style.display = 'none'
    loadVideo(videoId)
}

function pushStateQuery(userQuery){
    history.pushState({}, '', `?query=${userQuery}`)
    query.value = userQuery;
    title.innerText = userQuery + ' - YouTube';
}
window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        getData();
    }
})
query.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})
const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', () => {
    loadedVideo.innerHTML = '';
    console.log(query.value)
    pushStateQuery(query.value)
    getData()
})