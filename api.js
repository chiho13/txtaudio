const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const port = process.env.PORT || 3002;

let rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

app.get('/', (req, res) => {
    // const postBody = request.body;
    // console.log(postBody);
   console.log("hello");
   res.send("nothing here")
});

app.post('/txttospeech', (req, res) => {
    const postBody = JSON.parse(req.rawBody);
    // console.log(postBody.text);
    // res.send(postBody);
    // The text to synthesize
    const text = postBody.text;

// Construct the request
    const request = {
        input: {text: text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'en-US',  "name":"en-US-Wavenet-D", ssmlGender: 'MALE'},
        // Select the type of audio encoding
        audioConfig: {audioEncoding: 'LINEAR16'},
    };

    client.synthesizeSpeech(request, (err, response) => {
        if (err) {
            console.error('ERROR:', err);
            return;
        }
        res.send(response);
    });
});

//localhost: 3002;
app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});