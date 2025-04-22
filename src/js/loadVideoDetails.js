import {getChannelData} from "./getChannelInfo.js";
import {getDataTest} from "./loadVideos.js";
import {loadOtherVideos} from "./loadOtherVideos.js";
import {title} from "./loadPage.js";
import {API_KEY} from "./loadVideos.js";

export function loadOpenVideoUrl(url){
    document.getElementById('iframeVideo').src = url;
}
export function getChannelSubscribers(channelId){
    getChannelData(channelId)
        .then(response => {
            console.log(response)
            document.getElementById('subscribesCountOpenVideo').innerText = `${response.items[0].statistics.subscriberCount} subscribers`;
            // const subscribesCountOpenVideo = document.querySelectorAll('subscribesCountOpenVideo');
            // subscribes.forEach(subscribe => {
            //     subscribe.innerText = `${response.items[0].statistics.subscriberCount} subscribers`;
            // })
        })
}
export function loadVideo(videoId) {
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
        .then(videoData => videoData.json())
        .then(data => {
            console.log(data)
            const videoInfo = data.items[0];
            loadOpenVideoUrl(`https://www.youtube.com/embed/${videoId}`);
            getChannelSubscribers(videoInfo.snippet.channelId)
            document.getElementById('videoTitleOpenVideo').innerText = `${data.items[0].snippet.title}`;
            title.innerText = `${data.items[0].snippet.title}`;
            document.getElementById('channelNameOpenVideo').innerText = `${videoInfo.snippet.channelTitle}`;
            document.getElementById('viewsCountOpenVideo').innerText = `${videoInfo.statistics.viewCount} views`;
            document.getElementById('videoDescriptionOpen').innerText = `${videoInfo.snippet.description}`;

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(videoInfo.snippet.publishedAt);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            document.getElementById('publishedDateOpenVideo').innerText = `${month} ${day}, ${year}`;

            const avatar = document.getElementById('openVideoAva');
            if (avatar) {
                getChannelData(videoInfo.snippet.channelId)
                    .then(data => {
                        avatar.src = data.items[0].snippet.thumbnails.default.url;
                        subscribesCountOpenVideo.innetText = data.items[0].statistics.subscriberCount;
                        // document.querySelectorAll('.subscribes_count').forEach(subs => {
                        //     getChannelSubscribers(video.snippet.channelId);
                        // });
                    })
            }


        });
    getComments(videoId);

    getDataTest()
        .then(response => {
            loadOtherVideos(response);
        })

}
export function getComments(videoId){
    fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            console.log('UNDER COMMENTS API')
            console.log(data)
            const commentInfo = data.items;
            const videoComments = document.getElementById('videoComments');
            videoComments.innerHTML = '';
            commentInfo.forEach(comment => {
                videoComments.innerHTML += `
                    <div class="comment">
                        <img class="comment_ava" src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="Ava">
                        <div class="comment_info">
                            <p class="comment_username">${comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
                            <p class="comment_text">${comment.snippet.topLevelComment.snippet.textDisplay}</p>
                        </div>
                    </div>
            `;
            })

        })
}