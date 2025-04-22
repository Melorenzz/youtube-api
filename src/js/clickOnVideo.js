import {loadOpenVideoUrl} from "./loadVideoDetails.js";
import {openVideo} from "./loadPage.js";
import {getChannelSubscribers} from "./loadVideoDetails.js";
import {getComments} from "./loadVideoDetails.js";
import {title} from "./loadPage.js";
import {API_KEY} from "./main.js";

import './openDescription.js'

export function clickOnVideo(videoId, video){
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
        .then(videoData => videoData.json())
        .then(data => {
            const videoInfo = data.items[0];
            loadOpenVideoUrl(`https://www.youtube.com/embed/${videoId}`);
            openVideo(videoId);

            const subscribesCountOpenVideo = document.getElementById('subscribesCountOpenVideo')

            document.getElementById('channelNameOpenVideo').innerText = `${videoInfo.snippet.channelTitle}`;

            subscribesCountOpenVideo.innerText = `${videoInfo.statistics.subscriberCount}`;

            document.getElementById('viewsCountOpenVideo').innerText = `${videoInfo.statistics.viewCount} views`;

            document.getElementById('videoDescriptionOpen').innerText = `${videoInfo.snippet.description}`;

            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const date = new Date(videoInfo.snippet.publishedAt);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            document.getElementById('publishedDateOpenVideo').innerText = `${month} ${day}, ${year}`;

            document.querySelectorAll('.subscribes_count').forEach(subs => {
                getChannelSubscribers(video.snippet.channelId);
            });

            document.getElementById('videoTitleOpenVideo').innerText = `${video.snippet.title}`;
            title.innerText = `${video.snippet.title}`;

            getComments(videoId)
        });
}
