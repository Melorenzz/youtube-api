import {getChannelData} from "./getChannelInfo.js";
import {pushStateChannelPage} from "./loadPage.js";
import {API_KEY} from "./main.js";

export function loadChannelPage(channelId) {
    getChannelData(channelId)
        .then(data => {
            const channelInfo = data.items[0];
            openChannel()
            console.log(channelInfo);

            document.getElementById('openChannelUsername').innerText = channelInfo.snippet.customUrl;
            document.getElementById('openChannelDisplayName').innerText = channelInfo.snippet.title;
            document.getElementById('openChannelDescription').innerText = channelInfo.snippet.description;
            document.getElementById('openChannelAva').src = channelInfo.snippet.thumbnails.high.url;
            getChannelBanner(channelId, document.getElementById('openChannelBanner'));
        })
}
function openChannel(){
    document.querySelector('.videoPlayer').style.display = 'none'
    document.querySelector('.main_block-video').style.display = 'none'
    document.getElementById('channelPage').style.display = 'flex';
}
function getChannelBanner(channelId, banner){
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${API_KEY}`)
        .then(response => response.json())
    .then(data => {
        console.log(data);
        banner.src = data.items[0].brandingSettings.image.bannerExternalUrl;
    })
}