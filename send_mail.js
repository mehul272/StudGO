const express = require("express")
const dotenv = require("dotenv")
const router = express.Router()

const nodemailer = require('nodemailer')
const { google } = require('googleapis')


1//04yz_j9ebMMJyCgYIARAAGAQSNwF-L9IrbuSrFpsEdX6l0nYlBMBe8fYGexHFRAiisCy_kOhn6oqOHnwOsuueyCbw1Aodzj6qEBE
// ya29.A0ARrdaM92Kv2hxTXxhg8R9lSHJGjkOky8SIMUVa4rnIhiaVDL1iqI9vhabyTXjD1q9xsFJkS2lABbgY28GV8NzGid34PmvwGhU8NkK3enzM7pnAq1QrpOxAO03ftLNHQFV5H2HxIy0yJTofbT3quqEciHI75g

const CLIENT_ID = '849935446100-p15r55lingri1hfqdr3aifctmo27idhc.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04yz_j9ebMMJyCgYIARAAGAQSNwF-L9IrbuSrFpsEdX6l0nYlBMBe8fYGexHFRAiisCy_kOhn6oqOHnwOsuueyCbw1Aodzj6qEBE'


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials(
    {
        refresh_token: REFRESH_TOKEN
    }
)

async function sendMail(email, name, phone, text) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mehulpansari07@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'mehulpansari07@gmail.com',
            to: email,
            subject: 'Stud Go User',
            text: text,
            html: text,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}



router.post("/email", function (req, res) {
    const message_name = req.body.name
    const message_email = req.body.email
    const message_phone = req.body.phone
    const message_text = req.body.message

    console.log(message_name)
    console.log(message_email)
    console.log(message_phone)
    console.log(message_text)

    sendMail(message_email, message_name, message_phone, message_text)
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));
})


module.exports = router;