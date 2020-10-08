/* eslint-disable */

const App = require('../react/Server').default;
const fs = require('fs');
const ReactDOMServer = require('react-dom/server');
const moment = require('moment');

const DNS_NAME = 'www.pt-bergedorf.de';

global.window = {
    location: {
        href: ''
    }
};

function markup2Text(markup) {
    return markup
        .replace(/\n/g, '')
        .replace(/<\/?[^>]+(>|$)/g, '');
}

function getBaseUrl() {
    return `https://${DNS_NAME}`;
}

function renderMicroData(path, title = '', content = '', breadCrumb = []) {
    const baseUrl = getBaseUrl();
    const microData = {
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        url: `${baseUrl}${path}`,
        name: title,
        lastReviewed: moment().toISOString(),
        mainContentOfPage: 'main',
        about: 'Personal Trainig Bergedorf'

    };

    return `
    <script type="application/ld+json">
        ${JSON.stringify(microData)}
    </script>`;
}

function renderMetaTags(path, title, description = '') {
    const descriptionText = description;
    const baseUrl = getBaseUrl();
    const metaTitle = title;
    const metaTags = `
    <title>${metaTitle}</title>
    <meta name="keywords" content="Personal Training, Bergedorf, Fitness, PT, Florentin Fuger, Flo Fuger">
    <meta id="og-title" property="og:title" content="${metaTitle}" />
    <meta id="og-url" property="og:url" content="${baseUrl}${path}" />
    <meta id="og-description" property="og:description" name="description" content="${descriptionText}" />
    <meta id="og:locale" property="og:locale" content="de_DE" />
    <meta id="og-type" property="og:type" content="website" />
    <meta id="og-image" property="og:image" content="${baseUrl}/assets/meta.jpg" />
    <meta id="og-image-alt" property="og:image:alt" content="${metaTitle}" />
    <meta id="og-image-width" property="og:image:width" content="2125" />
    <meta id="og-image-height" property="og:image:height" content="3187" />
    `;


    return metaTags;
}

function createFolder(path) {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    } catch (e) {
        console.error(e);
    }
}

function renderStatic(path, title, content) {
    createFolder(`./dist${path}`);

    const app = App();

    const html = ReactDOMServer.renderToString(app);

    const metaTags = renderMetaTags(path, title, content);
    const microData = renderMicroData(path, title, content);
    fs.readFile('./tmp/index.html', 'utf8', (err, fileData) => {
        const document = fileData
            .replace(/<div id="app"><\/div>/, `<div id="app">${html}</div>`)
            .replace(/<!-- meta_data_placeholder -->/, metaTags)
            .replace(/<!-- micro_data_placeholder -->/, microData);

        fs.writeFileSync(`./dist${path}index.html`, document);
    });
}

/* render start page */
//renderStatic('/', 'Personal Training Bergedorf', 'Personal Training Bergedorf by Flo Fuger');

