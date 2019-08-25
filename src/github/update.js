const express = require('express');
const nodemailer = require('nodemailer');
const nodemailerConfig = require('../../nodemailer.config.json');
const config = require('../../config.json');
const nodegit = require('nodegit');
const path = require('path');

const update = express.Router();

update.post('/', (req, res) => {
    if (req.body.action === 'closed' && req.body.pull_request.merged) {
        // Get the new commits
        let repository;

        nodegit.Repository.open(config.langnexusPath)
            .then((repo) => {
                repository = repo;

                return repository.fetchAll({
                    callbacks: {
                        credentials(url, userName) {
                            return nodegit.Cred.sshKeyFromAgent(userName);
                        },
                        certificateCheck() {
                            return 0;
                        }
                    }
                });
            })
            .then(function () {
                return repository.mergeBranches("production", "origin/production");
            })
            .done(function () {
                let transporter = nodemailer.createTransport(nodemailerConfig.transporter);

                let info = transporter.sendMail({
                    from: '"Langnexus" <noreply@langnexus.io>', // sender address
                    to: config.sysadmin, // list of receivers
                    subject: 'Langnexus has been successfully updated.', // Subject line
                    text: 'this' // plain text body
                });
            });
    }

    res.send();
});

module.exports = update;