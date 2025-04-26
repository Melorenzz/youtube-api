import {sendRequest} from "./loadVideosAPI.js";
import {API_KEY} from "../main.js";

export function getChannelData(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    return sendRequest(url, 'GET')
}
export function getChannelAva(channelId, avatarElement){
    getChannelData(channelId)
        .then(response => {
            const channelInfo = response.items
            channelInfo.forEach((channel) => {
                avatarElement.src = `${channel.snippet.thumbnails.default.url}`
            })
        })
}