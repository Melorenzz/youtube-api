import {loadVideosHomepage} from "./loadVideosHomepage.js";
import {query} from "./loadPage.js";
import {API_KEY} from "./main.js";

let videoCount = 20;
export const getDataTest = () => {
    const urlParams = new URLSearchParams(window.location.search);
    query.value = urlParams.get('query');
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.value}&type=video&maxResults=${videoCount}&key=${API_KEY}`;
    return sendRequest(url, 'GET')
}
export const getData = () => {
    getDataTest()
        .then(response => {
            console.log(response)
            const userRegion = document.querySelectorAll('.userRegion')
            userRegion.forEach(region => {
                region.innerText = response.regionCode;
            })
            loadVideosHomepage(response);
        })
}
export const sendRequest = (url, method) => {
    return fetch(url, {
        method: method
    })
        .then(response => response.json())
}