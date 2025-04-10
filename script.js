const API_KEY = "AIzaSyDe14bZpQLJTWc_rFsTC-CQPjmXQKvU6tQ";
const query = document.getElementById('userSearch');
const searchBtn = document.getElementById('searchBtn');
const loadedVideo = document.getElementById('loadedVideos');
const logo = document.getElementById('logo');

logo.addEventListener('click', (e) => {
    query.value = '';
    searchBtn.click()
})

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
            const userRegion = document.querySelectorAll('.userRegion')
            userRegion.forEach(region => {
                region.innerText = response.regionCode;
            })
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
                    <h3 class="video_title"></h3>
                    <div class="video_channel">
                        <a href="#" class="channel_name"></a>
                    </div>
                    <div class="video_stats">
                        <span class="video_views">100K views</span>
                    </div>
                </div>
            </div>
        </div>
        `
        videoElement.querySelectorAll('.video_avatar').forEach(avatar => {
            getChannelData(video.snippet.channelId, avatar)
        })

        document.querySelectorAll('.channel_name').forEach(channelName => {
            channelName.innerText = `${video.snippet.channelTitle}`;
        })

        document.querySelectorAll('.video_title').forEach(videoName => {
            videoName.innerText = `${video.snippet.title}`;
        })
        videoElement.addEventListener('click', () => {
            fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
                .then(videoData => videoData.json())
                .then(data => {
                    console.log(data)
                    loadOpenVideo(`https://www.youtube.com/embed/${data.items[0].id}`)

                    document.querySelector('.videoPlayer').style.display = 'block'
                    document.querySelector('.main_block-video').style.display = 'none'
                    document.getElementById('homepageAside').style.display = 'none'
                })
        })
        loadedVideo.appendChild(videoElement);
    })
}

const burger = document.querySelectorAll('.burger__button');
const burgerBg = document.querySelector('.open_burger');
const leftMenu = burgerBg.querySelector('.open_burger-block');
burger.forEach(element => {
    element.addEventListener('click', (e) => {
        burgerBg.classList.toggle('open_burger-bg');
        leftMenu.classList.toggle('open_burger-block-active');
    })
})

leftMenu.addEventListener('click', (e) => {
    e.stopPropagation()
})
burgerBg.addEventListener('click', () => {
    burgerBg.classList.remove('open_burger-bg');
    leftMenu.classList.remove('open_burger-block-active');
})
function loadOpenVideo(url){
    document.getElementById('iframeVideo').src = url;
}