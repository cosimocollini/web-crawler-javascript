import { JSDOM } from 'jsdom';

const normalizeURL = (url) => {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`;
    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a');

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href');

            try {
                // convert any relative URLs to absolute URLs
                href = new URL(href, baseURL).href;
                urls.push(href);
            } catch (err) {
                console.log(`${err.message}: ${href}`);
            }
        }
    }

    return urls;
};

const getHTMLBody = async (currentURL) => {
    let res;
    try {
        res = await fetch(currentURL);
    } catch (err) {
        throw new Error(`Got Network error: ${err.message}`);
    }

    if (res.status > 399) {
        throw new Error(`Got HTTP error: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
        throw new Error(`Got non-HTML response: ${contentType}`);
    }

    return res.text();
};

const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
    const currentURLObj = new URL(currentURL);
    const baseURLObj = new URL(baseURL);
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeURL(currentURL);

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }
    pages[normalizedURL] = 1;

    console.log(`\n🔎 crawling ${currentURL}`);
    let html = '';
    try {
        html = await getHTMLBody(currentURL);
    } catch (err) {
        console.log(`${err.message}`);
        return pages;
    }

    const nextURLs = getURLsFromHTML(html, baseURL);
    const crawlPromises = nextURLs.map(nextURL => crawlPage(baseURL, nextURL, pages));

    await Promise.all(crawlPromises);

    return pages;
};

export {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
};