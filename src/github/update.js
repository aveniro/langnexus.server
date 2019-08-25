const express = require('express');
const nodemailer = require('nodemailer');
const nodemailerConfig = require('../../nodemailer.config.json');
const config = require('../../config.json');
const { spawn } = require('child_process');

const update = express.Router();

update.post('/', (req, res) => {
    if (req.body.action === 'closed' && req.body.pull_request.merged) {
        // Get the new commits

        spawn('git', ['pull'], { cwd: config.langnexusPath })
            .on('close', () => {
                spawn('npm', ['run-script', 'build'], { cwd: config.langnexusPath });
            });


        let transporter = nodemailer.createTransport(nodemailerConfig.transporter);

        let info = transporter.sendMail({
            from: '"Langnexus" <noreply@langnexus.io>', // sender address
            to: config.sysadmin, // list of receivers
            subject: 'Langnexus has been successfully updated.', // Subject line
            text: 'this' // plain text body
        });
    }

    res.send();
});

module.exports = update;