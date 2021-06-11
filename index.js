const {Storage} = require('@google-cloud/storage');
const moment = require('moment');

const storage = new Storage({keyFilename: "sa.json"});
const bucket = `ivi-owned-media`;
const newsletterPath = `capdecision/focusnews/auto/newsletter-${moment().format('YYYYMMDD')}.html`;

async function download(file) {
    await storage
        .bucket(bucket)
        .file(file)
        .download({destination: "downloaded.html"})
}

async function getMetadata(file) {
    const [{contentType, metadata: {subject}}] = await storage.bucket(bucket).file(file).getMetadata();
    return {contentType, subject};
}

download(newsletterPath)
    .catch(console.error)
    .then(_ => console.log("downloaded!"));

getMetadata(newsletterPath)
    .catch(console.error)
    .then(({contentType, subject}) => console.log(`Subject:\t\t${subject}\nContent-Type:\t${contentType}`));