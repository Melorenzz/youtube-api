import {getChannelData, getChannelBanner, getChannelVideos, getCookie} from "../hooks/loadChannelData.js";
import {clickOnVideo} from "../hooks/clickOnVideo.js";
import {getUserInfo} from "./userProfile.js";

const openChannelUsername = document.getElementById('openChannelUsername');
const openChannelDisplayName = document.getElementById('openChannelDisplayName');
const openChannelDescription = document.getElementById('openChannelDescription');
const openChannelAva = document.getElementById('openChannelAva');
const openChannelSubscribers = document.getElementById('openChannelSubscribers');

export function loadChannelPage(channelId) {
    if (channelId) {
        getChannelData(channelId)
            .then(data => {
                const channelInfo = data.items[0];
                openChannel();

                openChannelUsername.innerText = channelInfo.snippet.customUrl;
                openChannelDisplayName.innerText = channelInfo.snippet.title;
                openChannelDescription.innerText = channelInfo.snippet.description;
                openChannelAva.src = channelInfo.snippet.thumbnails.high.url;
                openChannelSubscribers.innerText = channelInfo.statistics.subscriberCount + ' subscribers';

                // Получаем баннер
                getChannelBanner(channelId)
                    .then(bannerUrl => {
                        document.getElementById('openChannelBanner').src = bannerUrl;
                    });

                // Загружаем видео
                getChannelVideos(channelId)
                    .then(data => loadChannelVideos(data));
            });
    } else {
        openChannel();
        if (getCookie('username')) {
            loadUserInfo();
        } else {
            getUserInfo();
            loadUserInfo();
        }
    }
}

function openChannel() {
    document.querySelector('.videoPlayer').style.display = 'none';
    document.querySelector('.main_block-video').style.display = 'none';
    document.getElementById('homepageAside').style.display = 'block';
    document.getElementById('channelPage').style.display = 'flex';
}

function loadUserInfo() {
    openChannelUsername.innerText = '@' + getCookie('username');
    openChannelDisplayName.innerText = getCookie('displayName');
    openChannelDescription.innerText = getCookie('userDescription');
    openChannelAva.src = getCookie('userAvatar');
    document.getElementById('openChannelBanner').src = getCookie('userBanner');
}

function loadChannelVideos(data) {
    const videoInfo = data.items;
    const container = document.querySelector('.channel_videos');
    container.innerHTML = '';

    videoInfo.forEach((video) => {
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
