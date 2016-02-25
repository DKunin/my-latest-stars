#!/usr/bin/node

var request = require('superagent');
var elegantStatus = require('elegant-status');
var mainRequest = elegantStatus('Gazing at the stars');
var gitHubName = process.env.GIT_HUB_USER;
var argv = require('yargs')
    .usage('Usage: my-latest-stars [options]')
    .help('h')
    .alias('h', 'help')
    .describe('l', 'Limit of the stars to show, default is 10. 0 = no limit.')
    .alias('l', 'limit')
    .default('l', 10)
    .epilogue('Made by DKunin http://dkunin.github.io/').argv;

if (!gitHubName) {
    throw new Error('GIT_HUB_USER global variable must be defined');
}

request('https://api.github.com/users/' + gitHubName + '/starred').end(function(err, data) {
    if (err) {
        mainRequest();
        console.log(err);
        return false;
    }
    mainRequest(true);
    var list = data.body.map(function(singleStar, index) {
        if (argv.l && argv.l <= index) {
            return null;
        }
        return (index + 1) + ') ' + singleStar.name + ' (' + singleStar.description +  ') : ' + singleStar.html_url; // jscs:disable
    }).filter(function(singleStar) {return singleStar;}).join('\n');
    console.log(list);
});
