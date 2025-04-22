import {getChannelAva} from "./getChannelInfo.js";
import {loadOtherVideos} from "./loadOtherVideos.js";
import {clickOnVideo} from "./clickOnVideo.js";

export const loadedVideo = document.getElementById('loadedVideos');

export function loadOpenVideo(data) {
    const videoInfo = data.items;
    videoInfo.forEach((video) => {
        console.log('test')
        console.log(video.snippet);
        const videoId = video.id.videoId
        const videoElement = document.createElement('div');
        videoElement.classList.add('video_grid-block');
        videoElement.innerHTML = `
        <div id="videoBlock" class="video_grid-block">
            <img class="video_thumbnail" src="${video.snippet.thumbnails.high.url}" alt="">
            <div class="video_info">
                <img class="video_avatar" src="" alt="Channel avatar">
                <div class="video_details">
                    <h3 class="video_title">${video.snippet.title}</h3>
                    <div class="video_channel">
                        <a href="#" class="channel_name">${video.snippet.channelTitle}</a>
                    </div>
                    <div class="video_stats">
                        <span class="viewsCount">100K views</span>
                    </div>
                </div>
            </div>
        </div>
        `
        videoElement.querySelectorAll('.video_avatar').forEach(avatar => {
            getChannelAva(video.snippet.channelId, avatar)
        })

        videoElement.addEventListener('click', () => {
            clickOnVideo(videoId, video);
            loadOtherVideos(data)
        })
        loadedVideo.appendChild(videoElement);
    })
}