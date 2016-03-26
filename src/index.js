require('dotenv').load();

var http       = require('http'),
    AlexaSkill = require('./AlexaSkill'),
    APP_ID     = process.env.APP_ID,
    SC = require('soundcloud'),
    SC_USER_ID    = process.env.SOUNDCLOUD_USER,
    SC_CLIENT_ID  = process.env.SOUNDCLOUD_CLIENT;

var PLAYLIST_MAP = {
    OdeszaNoSleep: "206787028",
    // GalimatiasVoyage: "2619526011",
    Songs: "149439366"
    // ChetFaker: "15690151",
    // Flume: "165797011",
    // TaKu: "11055981",
    // Kai: "1000"
};

SC.initialize({
    client_id: SC_CLIENT_ID,
});

var SoundCloudPlay = function(){
  AlexaSkill.call(this, APP_ID);
};

var player;

SoundCloudPlay.prototype = Object.create(AlexaSkill.prototype);
SoundCloudPlay.prototype.constructor = SoundCloudPlay;

SoundCloudPlay.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){
  // What happens when the session starts? Optional
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);
};

SoundCloudPlay.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Hello from Sound Cloud. ' +
    'What playlist do you want to hear?';

  var reprompt = 'Which artist do you want to hear?';
  response.ask(output, reprompt);

  console.log("onLaunch requestId: " + launchRequest.requestId
      + ", sessionId: " + session.sessionId);
};

// var handleListPlaylistRequest = function(intent, session, response){
//   var playlistNames = [];
//   data.forEach(function(playlist){
//     var playlistName = playlist.permalink.replace(/\.\s*/g, '').replace(/\-\s*/g, '');
//     playlistNames.push(playlistName);
//   });
//   return playlistNames;
// };

var handlePlayPlaylistRequest = function(intent, session, response){
  var playlistId = PLAYLIST_MAP[intent.slots.playlist.value];
  player = SC.stream('playlist/' + playlistId);
  speechText = "Playing " + intent.slots.playlist.value + " from Sound Cloud.";
  speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
  player.then(function(player){
    player.play();
  });
};

var handlePauseRequest = function(intent, session, response){
  player.then(function(player){
    player.pause();
  });
};

SoundCloudPlay.prototype.intentHandlers = {
  // WIP
  // ListPlaylistIntent: function(intent, session, response){
  //   var listPlaylists = handleListPlaylistRequest(intent, session, response);
  //   response.tell(listPlaylists);
  // },

  PlayPlaylistIntent: function(intent, session, response){
    handlePlayPlaylistRequest(intent, session, response);
  },

  PauseIntent: function(intent, session, response){
    handlePauseRequest(intent, session, response);
  },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'What playlist do you want to hear?';
    response.ask(speechOutput);
  }
};

exports.handler = function(event, context) {
    var skill = new SoundCloudPlay();
    skill.execute(event, context);
};
