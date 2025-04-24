import {getChannelAva} from "./getChannelInfo.js";
import {loadOtherVideos} from "./loadOtherVideos.js";
import {clickOnVideo} from "./clickOnVideo.js";
import {loadChannelPage} from "./loadChannelPage.js";
import {Logger} from "sass";
import {pushStateChannelPage} from "./loadPage.js";

export const loadedVideo = document.getElementById('loadedVideos');

export function loadVideosHomepage(data) {
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

        videoElement.addEventListener('click', (e) => {
            clickOnVideo(videoId, video);
            loadOtherVideos(data)
        })
        const channelName = videoElement.querySelector('.video_channel .channel_name');
        channelName.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(video.snippet.channelId)
            pushStateChannelPage(video.snippet.channelId)
            // loadChannelPage(video.snippet.channelId);
        });

        loadedVideo.appendChild(videoElement);
    })
}
