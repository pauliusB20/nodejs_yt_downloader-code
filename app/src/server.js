import bodyParser from 'body-parser';
import express from 'express';
import yt from 'yt-converter';
import ytdl from 'ytdl-core';
import path from 'path';
import Randomstring from 'randomstring';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from "module";
import fs from 'fs';
import cors from 'cors';

const require = createRequire(import.meta.url);
const configData = require("../config.json");

const app = express();
const httpPort = process.env.PORT || configData.server_port;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadPath = path.join(__dirname, configData.downloadFolder)
const AdmZip = require("adm-zip");


app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

app.post('/download', (req, res) => {
    let data = req.body;
    let downloadLink = data.ytLink; 
    console.log(`Received youtube link: ${JSON.stringify(data)}`);

    let tmpFolder = Randomstring.generate();        
    let tmpDir = path.join(downloadPath, tmpFolder);
    fs.mkdirSync(tmpDir);


    yt.convertAudio({
        url: downloadLink,
        itag: 140,
        directoryDownload: tmpDir,
        title: "audio"
    }, onDownload, onFinished) 

    function onDownload(status)
    {
        const currentProgress = Math.round(status);
        console.log(`Youtube file download status: ${currentProgress}% / 100%`)

    }
    async function createZipArchive(fileName, filePath) {
        const zip = new AdmZip();
        // Add temp name for zip
        const outputFilePath = path.join(downloadPath, `${fileName}.zip`);
        zip.addLocalFolder(filePath);
        zip.writeZip(outputFilePath);
        console.log(`Created ${outputFilePath} successfully`);

        return outputFilePath
      }
    
    async function onFinished()
    {
        
        console.log("Finished downloading!");
        console.log(tmpDir);

        const fileName = path.basename(tmpDir);           
        var audioZipFile = await createZipArchive(fileName, tmpDir);                

        if (audioZipFile)
        {
             res.sendFile(audioZipFile, function (err) {
                if (err) {
                    console.log(`File error: ${err}`)
                } else {
                    console.log('Sent:', `${fileName}.zip`);
                    fs.rmSync(tmpDir, { recursive: true, force: true });
                    console.log(`Deleted ${tmpDir} folder`);
                }
            });
        }
    }     

});



// const server = https.createServer({key: key, cert: cert }, app);
app.listen(httpPort, () => {
    console.log(`Localhost is runing on port=${httpPort}`)
})