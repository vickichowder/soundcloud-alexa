var dotenv = require('dotenv');
dotenv.load();

var http = require('http');
var request = require('request');
var util = require('util');
var SC = require('soundcloud');
console.log(1);
var AlexaSkill = require('./AlexaSkill');
console.log(2);
var APP_ID = process.env.APP_ID;
console.log(3);

console.log(4);
var SC_USER_ID = process.env.SOUNDCLOUD_USER;
var SC_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT;
var SC_USERNAME = process.env.SOUNDCLOUD_USERNAME;
var resolve_url = 'http://api.soundcloud.com/resolve?';

var PLAYLIST_MAP = {
    odesza: "odesza-no-sleep",
    galimatias: "2619526011",
    songs: "songs"
    ChetFaker: "15690151",
    Flume: "165797011",
    TaKu: "11055981"
};

SC.initialize({
    client_id: SC_CLIENT_ID
});

var SoundCloudPlay = function(){
  AlexaSkill.call(this, APP_ID)
};

SoundCloudPlay.prototype = Object.create(AlexaSkill.prototype);
SoundCloudPlay.prototype.constructor = SoundCloudPlay;
SoundCloudPlay.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId)
};

SoundCloudPlay.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Hello from Sound Cloud. ' +
    'What playlist do you want to hear?'

  var reprompt = 'Which artist do you want to hear?';
  response.ask(output, reprompt)

  console.log("onLaunch requestId: " + launchRequest.requestId
      + ", sessionId: " + session.sessionId)
};

// function handleListRequests(intent, session, response){
//   var playlistNames = [];
//   data.forEach(function(playlist){
//     var playlistName = playlist.permalink.replace(/\.\s*/g, '').replace(/\-\s*/g, '');
//     playlistNames.push(playlistName);
//   });
//   return playlistNames;
// };

function handlePlayRequest(intent, session, response){
  var playlist = intent.slots.Playlist.value.replace(/\.\s*/g, '')
  var playlistName = PLAYLIST_MAP[playlist]

  var speechText = "Playing " + playlist + " from Soundcloud"

  speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);

  $scope.streamTrack = function( track_url ){
       var formatted_url = 'http://soundcloud.com' + track_url;

       SC.get( '/resolve', { url: formatted_url }, function( track ){
           SC.stream( '/tracks/' + track.id, function( sm_object ){
               $scope.tracks.push( sm_object );
               console.log( sm_object.url );
              //  return( sm_object.url );
           });
       });
   }
};


function handlePauseRequest(intent, session, response){
};

SoundCloudPlay.prototype.intentHandlers = {
  // WIP
  // ListIntent: function(intent, session, response){
  //   var listPlaylists = handleListPlaylistRequest(intent, session, response);
  //   response.tell(listPlaylists);
  // },

  "PlayIntent": function(intent, session, response){
    handlePlayRequest(intent, session, response)
  },

  "PauseIntent": function(intent, session, response){
    handlePauseRequest(intent, session, response)
  },

  "HelpIntent": function(intent, session, response){
    var speechOutput = 'What playlist do you want to hear?'
    response.ask(speechOutput)
  }
};

exports.handler = function(event, context) {
    var soundCloudPlay = new SoundCloudPlay()
    soundCloudPlay.execute(event, context)
};
console.log('last line');
