const API_KEY = "AIzaSyDe14bZpQLJTWc_rFsTC-CQPjmXQKvU6tQ";

const query = document.getElementById('userSearch');
const searchBtn = document.getElementById('searchBtn');
const loadedVideo = document.getElementById('loadedVideos');
const logo = document.getElementById('logo');
const title = document.getElementById('title');

const subscribesCountOpenVideo = document.getElementById('subscribesCountOpenVideo')

logo.addEventListener('click', (e) => {
    query.value = '';
    searchBtn.click()
})

document.addEventListener('DOMContentLoaded', () => {
    getData();
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    const query = urlParams.get('query');
    console.log(videoId);
    if (videoId) {
        openVideo(videoId);
    }else if(query){
        console.log(query)
        pushStateQuery(query);
    }
})
query.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})
searchBtn.addEventListener('click', () => {
    loadedVideo.innerHTML = '';
    console.log(query.value)
    pushStateQuery(query.value)
    getData()
})

const sendRequest = (url, method) => {
    return fetch(url, {
        method: method
    })
        .then(response => response.json())
}
let videoCount = 20;
const getDataTest = () => {
    const urlParams = new URLSearchParams(window.location.search);
    query.value = urlParams.get('query');
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.value}&type=video&maxResults=${videoCount}&key=${API_KEY}`;
    return sendRequest(url, 'GET')
}
const getData = () => {
    getDataTest()
        .then(response => {
            console.log(response)
            const userRegion = document.querySelectorAll('.userRegion')
            userRegion.forEach(region => {
                region.innerText = response.regionCode;
            })
            loadOpenVideo(response);
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
function getChannelSubscribers(channelId){
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

function clickOnVideo(videoId, video){
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`)
        .then(videoData => videoData.json())
        .then(data => {
            const videoInfo = data.items[0];
            loadOpenVideoUrl(`https://www.youtube.com/embed/${videoId}`);
            openVideo(videoId);


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
function loadOpenVideo(data) {
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
function loadOtherVideos(data) {
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

function loadOpenVideoUrl(url){
    document.getElementById('iframeVideo').src = url;
}

window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        getData();
    }
})
const openVideoDescription = document.getElementById('openVideoDescription');
const showLessBtn = document.getElementById('lessDescriptionBtn')
let isOpenDescription = false;

function openDescription(){
    openVideoDescription.classList.add('open_description');
    document.getElementById('lessDescriptionBtn').innerText = 'Show less';
    openVideoDescription.classList.add('clickedDescription')
    isOpenDescription = true;
}

openVideoDescription.addEventListener('click', () => {
    if(!isOpenDescription){
        openDescription();
    }
})
showLessBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if(isOpenDescription){
        openVideoDescription.classList.remove('open_description');
        document.getElementById('lessDescriptionBtn').innerText = '...more';
        openVideoDescription.classList.remove('clickedDescription')
        isOpenDescription = false;
    }else{
        openDescription()
    }
})

function openVideo(videoId){
    history.pushState({videoOpen: true}, '', `?video=${videoId}`)
    document.querySelector('.videoPlayer').style.display = 'block'
    document.querySelector('.main_block-video').style.display = 'none'
    document.getElementById('homepageAside').style.display = 'none'
    loadVideo(videoId)
}
window.addEventListener('popstate', (event) => {
    if (!event.state?.videoOpen) {
        document.querySelector('.videoPlayer').style.display = 'none';
        document.querySelector('.main_block-video').style.display = 'block';
        if(window.innerWidth <= 870){
            document.getElementById('homepageAside').style.display = 'none';
        }else{
            document.getElementById('homepageAside').style.display = 'block';
        }
    }
});

function loadVideo(videoId) {
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

function pushStateQuery(userQuery){
    history.pushState({}, '', `?query=${userQuery}`)
    query.value = userQuery;
    title.innerText = userQuery + ' - YouTube';
}

//===============GET COMMENTS UNDER VIDEO=======================

function getComments(videoId){
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

//==============================================================

// TODO LIST
// 1. Add comments under video
// 2. Add channel page