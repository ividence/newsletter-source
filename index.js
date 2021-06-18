const {Storage} = require('@google-cloud/storage');
const moment = require('moment');

const storage = new Storage({keyFilename: "sa.json"});
const bucket = `ivi-owned-media`;
const categories = ['auto', 'deco', 'eco', 'people'];

async function download(source, destination) {
    await storage
        .bucket(bucket)
        .file(source)
        .download({destination});
}

async function getMetadata(file) {
    const [{contentType, metadata: {subject}}] = await storage.bucket(bucket).file(file).getMetadata();
    return {contentType, subject};
}

categories.forEach(category => {
    const today = moment().format('YYYYMMDD');
    const newsletterPath = `capdecision/focusnews/${category}/newsletter-${today}.html`;
    const dest = `${today}-${category}.html`

    download(newsletterPath, dest)
        .catch(console.error)
        .then(_ => console.log(`${dest} downloaded!`));

    getMetadata(newsletterPath)
        .catch(console.error)
        .then(({contentType, subject}) => console.log(`Category: ${category}\nSubject: ${subject}\nContent-Type: ${contentType}\nFile: ${dest}\n====`));
})

