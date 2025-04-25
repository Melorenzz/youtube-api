import {loadChannelPage} from './loadChannelPage';

const userAva = document.getElementById("userAva");
userAva.addEventListener("click", function () {
    loadChannelPage()
})
function setCookie(name, value, options = {}) {
    options = { // То же самое что и options.name = 'Mykhailo';
        ...options,
        secure: true,
        path: '/'
    }
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updateCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value); // encoding меняет например пробел на %

    for (const optionKey in options) {
        updateCookie += '; ' + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updateCookie += '=' + optionValue;
        }
    }
    document.cookie = updateCookie;

}
export function getUserInfo(){
    const userName = prompt('Enter your username');
    const displayName = prompt('Enter your display name');
    const userDescription = prompt('Enter your description');
    const userAvatar = prompt('Paste the link to your avatar');
    const userBanner = prompt('Paste the link to your banner');

    setCookie('username', userName);
    setCookie('displayName', displayName);
    setCookie('userDescription', userDescription);
    setCookie('userAvatar', userAvatar);
    setCookie('userBanner', userBanner);
}

