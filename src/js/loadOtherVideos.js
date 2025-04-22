import {clickOnVideo} from "./clickOnVideo.js";

export function loadOtherVideos(data) {
    const videoInfo = data.items;
    const container = document.querySelector('.open_video-other');
    container.innerHTML = '';

    videoInfo.forEach((video) => {
        const videoId = video.id.videoId;
        const videoElement = document.createElement('div');
        videoElement.classList.add('open_video-block');
        videoElement.innerHTML = `
            <img class="video_thumbnail" src="${video.snippet.thumbnails.high.url}" alt="Video thumbnail">
            <div class="video_info">
                <div class="video_details">
                    <h3 class="video_title">${video.snippet.title}</h3>
                    <div class="video_channel">
                        <a href="#" class="channel_name">${video.snippet.channelTitle}</a>
                    </div>
                    <div class="video_stats">
                        <span class="video_views">100K views</span>
                    </div>
                </div>
            </div>
        `;

        videoElement.addEventListener('click', () => {
            clickOnVideo(videoId, video);
        });

        container.appendChild(videoElement);
    });
}
