const API_KEY = "YOUR_API_KEY";
const query = document.getElementById('userSearch');
const searchBtn = document.getElementById('searchBtn');


document.addEventListener('DOMContentLoaded', () => {
    getData();
})
query.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})
searchBtn.addEventListener('click', () => {
    document.getElementById('loadedVideos').innerHTML = '';
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


function loadVideo(data) {
    const videoInfo = data.items;
    videoInfo.forEach((video) => {
        console.log(video.snippet);
        document.getElementById('loadedVideos').innerHTML += `
        <div class="video_grid-block">
            <img class="video_thumbnail" src="${video.snippet.thumbnails.high.url}" alt="">
            <div class="video_info">
                <img class="video_avatar" src="avatar.jpg" alt="Channel avatar">
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
    })
}