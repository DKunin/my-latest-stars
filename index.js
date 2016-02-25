#!/usr/bin/env node

var request = require('superagent');
var elegantStatus = require('elegant-status');
var mainRequest = elegantStatus('Gazing at the stars');
var argv = require('yargs')
    .usage('Usage: my-latest-stars [options]')
    .help('h')
    .alias('h', 'help')
    .describe('l', 'Limit of the stars to show, default is 10. 0 = no limit.')
    .alias('l', 'limit')
    .default('l', 10)
    .describe('u', 'If you don\'t want to make global username variable, you can just pass in your github username as argument')
    .alias('u', 'user')
    .epilogue('Made by DKunin http://dkunin.github.io/').argv;

var gitHubName = argv.u || process.env.GIT_HUB_USER;

if (!gitHubName) {
    throw new Error('GIT_HUB_USER global variable must be defined, or you can pass it as -u option');
}

request('https://api.github.com/users/' + gitHubName + '/starred').end(function(err, data) {
    if (err) {
        mainRequest();
        process.stdout.write(err);
        return false;
    }
    mainRequest(true);
    var list = data.body.map(function(singleStar, index) {
        if (argv.l && argv.l <= index) {
            return null;
        }
        return (index + 1) + ') ' + singleStar.name + ' (' + singleStar.description +  ') : ' + singleStar.html_url; // jscs:disable
    }).filter(function(singleStar) {return singleStar;}).join('\n');
    process.stdout.write(list + '\n\r');
});
