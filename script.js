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
let videoCount = 20;
const getData = () => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.value}&type=video&maxResults=${videoCount}&key=${API_KEY}`;
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

function getChannelData(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    return sendRequest(url, 'GET')

}
function getChannelAva(channelId, avatarElement){
    getChannelData(channelId)
        .then(response => {
            const channelInfo = response.items
            channelInfo.forEach((channel) => {
                avatarElement.src = `${channel.snippet.thumbnails.default.url}`
            })
        })
}
function getChannelSubscribes(channelId){
    getChannelData(channelId)
    .then(response => {
        console.log(response)
        const subscribes = document.querySelectorAll('.subscribes_count');
        subscribes.forEach(subscribe => {
            subscribe.innerText = `${response.items[0].statistics.subscriberCount} subscribes`;
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
                    <h3 class="video_title">${video.snippet.title}</h3>
                    <div class="video_channel">
                        <a href="#" class="channel_name">${video.snippet.channelTitle}</a>
                    </div>
                    <div class="video_stats">
                        <span class="video_views">100K views</span>
                    </div>
                </div>
            </div>
        </div>
        `
        videoElement.querySelectorAll('.video_avatar').forEach(avatar => {
            getChannelAva(video.snippet.channelId, avatar)
        })

        videoElement.addEventListener('click', (e) => {
            fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
                .then(videoData => videoData.json())
                .then(data => {
                    const videoInfo = data.items[0];
                    loadOpenVideo(`https://www.youtube.com/embed/${videoInfo.id}`)

                    openVideo(videoInfo.id)

                    document.querySelectorAll('.channel_name').forEach(channelName => {
                        channelName.innerText = `${videoInfo.snippet.channelTitle}`;
                    })
                    document.querySelectorAll('.videoDescription').forEach(description => {
                        description.innerText = `${videoInfo.snippet.description}`;
                    })
                    document.querySelectorAll('.viewsCount').forEach(count => {
                        count.innerText = `${videoInfo.statistics.viewCount} views`
                    })
                    document.querySelectorAll('.open_video-channel').forEach(channelAva => {
                        channelAva.querySelectorAll('.video_avatar').forEach(avatar => {
                            getChannelAva(video.snippet.channelId, avatar)
                        })
                    })
                    document.querySelectorAll('.subscribes_count').forEach(subscribes => {
                        getChannelSubscribes(video.snippet.channelId)
                    })
                    document.querySelectorAll('.video_title').forEach(title => {
                        title.innerText = `${video.snippet.title}`
                    })
                })
        })
        loadedVideo.appendChild(videoElement);
    })
}

function openVideo(videoId){
    history.pushState({videoOpen: true}, '', `?video=${videoId}`)
    document.querySelector('.videoPlayer').style.display = 'block'
    document.querySelector('.main_block-video').style.display = 'none'
    document.getElementById('homepageAside').style.display = 'none'

}
window.addEventListener('popstate', (event) => {
    if (!event.state?.videoOpen) {
        document.querySelector('.videoPlayer').style.display = 'none';
        document.querySelector('.main_block-video').style.display = 'block';
        document.getElementById('homepageAside').style.display = 'block';
    }
});
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');

    if (videoId) {
        openVideo(videoId);
    }
});

const burger = document.querySelectorAll('.burger__button');
const burgerBg = document.querySelector('.open_burger');
const leftMenu = burgerBg.querySelector('.open_burger-block');

burger.forEach(element => {
    element.addEventListener('click', (e) => {
        burgerBg.classList.add('open_burger-bg');
        leftMenu.classList.add('open_burger-block-active');
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

window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        getData();
    }
});
const openVideoDescription = document.getElementById('openVideoDescription');
openVideoDescription.addEventListener('click', () => {
    openVideoDescription.classList.toggle('open_description');
})