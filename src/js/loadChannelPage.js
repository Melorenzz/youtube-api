import {getChannelData} from "./getChannelInfo.js";
import {pushStateChannelPage} from "./loadPage.js";
import {API_KEY} from "./main.js";
import {clickOnVideo} from "./clickOnVideo.js";
import {getUserInfo} from "./userProfile.js";

const openChannelUsername = document.getElementById('openChannelUsername');
const openChannelDisplayName = document.getElementById('openChannelDisplayName');
const openChannelDescription = document.getElementById('openChannelDescription');
const openChannelAva = document.getElementById('openChannelAva');
const openChannelSubscribers = document.getElementById('openChannelSubscribers');

export function loadChannelPage(channelId) {
    if(channelId){
        getChannelData(channelId)
            .then(data => {
                console.log('HERE DATA' + ' ' + data)
                console.log(data)
                const channelInfo = data.items[0];
                openChannel()
                console.log(channelInfo);

                openChannelUsername.innerText = channelInfo.snippet.customUrl;
                openChannelDisplayName.innerText = channelInfo.snippet.title;
                openChannelDescription.innerText = channelInfo.snippet.description;
                openChannelAva.src = channelInfo.snippet.thumbnails.high.url;
                openChannelSubscribers.innerText = channelInfo.statistics.subscriberCount + ' subscribers';
                getChannelBanner(channelId, document.getElementById('openChannelBanner'));
                getChannelVideos(channelId);
            })
    }else{
        openChannel()
        if(getCookie('username')){
            loadUserInfo()

        }else{
            getUserInfo()
            loadUserInfo()
        }
    }

}
function loadUserInfo(){

    openChannelUsername.innerText = '@' + getCookie('username');
    openChannelDisplayName.innerText = getCookie('displayName');
    openChannelDescription.innerText = getCookie('userDescription');
    openChannelAva.src = getCookie('userAvatar');
    document.getElementById('openChannelBanner').src = getCookie('userBanner');
}
export function getCookie(name) {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

function openChannel(){
    document.querySelector('.videoPlayer').style.display = 'none'
    document.querySelector('.main_block-video').style.display = 'none'
    document.getElementById('homepageAside').style.display = 'block'
    document.getElementById('channelPage').style.display = 'flex';
}
function getChannelBanner(channelId, banner){
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${API_KEY}`)
        .then(response => response.json())
    .then(data => {
        console.log('data banner')
        console.log(data);
        banner.src = data.items[0].brandingSettings.image.bannerExternalUrl;
    })
}
function getChannelVideos(channelId){
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${data.items[0].contentDetails.relatedPlaylists.uploads}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                // const videoInfo = data.items;
                // videoInfo.forEach((video) => {
                //     console.log('all viedos')
                //     console.log(video);
                // })
                loadChannelVideos(data);
            })
        })
}

function loadChannelVideos(data) {
    const videoInfo = data.items;
    const container = document.querySelector('.channel_videos');
    container.innerHTML = '';

    videoInfo.forEach((video) => {
        console.log('TTTT')
        console.log(video)
        const videoId = video.id;
        const videoElement = document.createElement('div');
        videoElement.classList.add('channel_video-block');
        videoElement.innerHTML = `
          <img src="${video.snippet.thumbnails.high.url}" class="video_thumbnail">
          <div class="video_info">
            <div class="video_details">
              <h3 class="video_title">${video.snippet.title}</h3>
              <p class="video_views">100K views</p>
            </div>
          </div>
        `;

        videoElement.addEventListener('click', () => {
            clickOnVideo(videoId, video);
        });

        container.appendChild(videoElement);
    });
}