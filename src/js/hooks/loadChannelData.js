import {sendRequest} from "./loadVideosAPI.js";
import {API_KEY} from "../main.js";

export function getChannelData(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    return sendRequest(url, 'GET');
}

export function getChannelBanner(channelId) {
    return fetch(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => data.items[0].brandingSettings.image.bannerExternalUrl);
}

export function getChannelVideos(channelId) {
    return fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            return fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${data.items[0].contentDetails.relatedPlaylists.uploads}&key=${API_KEY}`)
                .then(response => response.json());
        });
}

export function getCookie(name) {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}
