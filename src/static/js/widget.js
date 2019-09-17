export const store = {
    get(item) {
        return localStorage.getItem(item);
    },
    set(key, value) {
        return localStorage.setItem(key, value);
    },
    remove(item) {
        return localStorage.removeItem(item);
    },
};

export function getHomePage() {
    const link = location.pathname.slice(
        0,
        location.pathname.lastIndexOf('/') + 1
    );
    const homePage = link.charAt(link.length - 1) == '/' ? link : link + '/';
    return location.origin + homePage;
}

export function loading(el) {
    return {
        show: () => el[0] && el.addClass('visible'),
        hide: () => el[0] && el.removeClass('visible'),
    };
}

export function getQuery(name) {
    const url = decodeURIComponent(location.href);
    const search = location.search.substr(1) || url.split('?')[1] || '';
    const hash = location.hash.substr(1) || url.split('?')[1] || '';
    const data = Object.assign(parseQuery(search), parseQuery(hash));
    const result = data[name];
    return result ? result : null;
}

export function parseQuery(query) {
    const str = decodeURIComponent(query);
    let result = {},
        param = '',
        params = [];

    if (str) params = str.split('&');

    for (let i = 0; i < params.length; i++) {
        param = params[i].split('=');
        param[0]
            ? (result[param[0]] = param[1] === undefined ? null : param[1])
            : '';
    }

    return result;
}

let timer = null;
export function toast(content = '', delay = 2000) {
    const $toast = $(
        `<div class="Widget toast js-toast"><p class="content">${content}</p></div>`
    );
    $('.js-toast').length == 0
        ? $toast.appendTo('body')
        : $('.js-toast')
              .show()
              .find('.content')
              .text(content);
    clearTimeout(timer);
    timer = setTimeout(() => $('.js-toast').hide(), delay);
}

export function getCookie(name) {
    var arr = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    );
    if (arr != null) return decodeURIComponent(arr[2]);
    return null;
}

export function setCookie(name, value, timer) {
    var Days = timer || 30; //默认30天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie =
        name +
        '=' +
        encodeURIComponent(value) +
        ';expires=' +
        exp.toUTCString();
}

//cbk(visibility)
export function pageVisibilityChange(cbk) {
    var hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
        // Firefox up to v17
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        // Chrome up to v32, Android up to v4.4, Blackberry up to v10
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (
        typeof document.addEventListener === 'undefined' ||
        typeof document[hidden] === 'undefined'
    ) {
        console.log('浏览器不支持 Page Visibility API');
    } else {
        // Handle page visibility change
        document.addEventListener(
            visibilityChange,
            function() {
                cbk(document.visibilityState);
            },
            false
        );
    }
}
