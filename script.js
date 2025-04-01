const API_KEY = "AIzaSyDe14bZpQLJTWc_rFsTC-CQPjmXQKvU6tQ";
const query = document.getElementById('userSearch');
const searchBtn = document.getElementById('searchBtn');
const loadedVideo = document.getElementById('loadedVideos');

document.addEventListener('DOMContentLoaded', () => {
    getData();
})
query.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})
searchBtn.addEventListener('click', () => {
    loadedVideo.innerHTML = '';
    getData()
})

const sendRequest = (url, method) => {
    return fetch(url, {
        method: method
    })
        .then(response => response.json())
}
const getData = () => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.value}&type=video&maxResults=20&key=${API_KEY}`;
    sendRequest(url, 'GET')
        .then(response => {
            console.log(response)
            document.getElementById('userRegion').innerText = response.regionCode;
            loadVideo(response);
        })
}

function getChannelData(channelId, avatarElement) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    sendRequest(url, 'GET')
        .then(response => {
            console.log(response)
            const channelInfo = response.items
            channelInfo.forEach((channel) => {
                avatarElement.src = `${channel.snippet.thumbnails.default.url}`

            })
        })
}

function loadVideo(data) {
    const videoInfo = data.items;
    videoInfo.forEach((video) => {
        getChannelData(video.snippet.channelId)
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
                        <a href="#" class="video_channel-name">${video.snippet.channelTitle}</a>
                    </div>
                    <div class="video_stats">
                        <span class="video_views">100K views</span>
                    </div>
                </div>
            </div>
        </div>
        `
        const avatarElement = videoElement.querySelector('.video_avatar');
        getChannelData(video.snippet.channelId, avatarElement)



        videoElement.addEventListener('click', () => {
            fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
                .then(videoData => videoData.json())
                .then(data => {
                    console.log(data)
                })
        })
        loadedVideo.appendChild(videoElement);
    })
}

