// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'br.com.nickford.razor', // App bundle ID
  name: 'Razor', // App name
  theme: 'md', // Automatic theme detection
  cache: false, // Disable caching
  cacheDuration: 0, // Set caching expire time to 0
  domCache: false,
  routes: routes, // App routes
  // Others
  statusbar: {
    iosOverlaysWebView: true,
  },
  smartSelect: {
    closeOnSelect: true,
    openIn: 'popup'
  }
});

// Init/Create views
var indexView = app.views.create('#view-index');

//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

  // App config
  localStorage.appname = "Razor";
  localStorage.version = "1.0.0";

  // Server
  localStorage.server = "http://nickford.com.br/razor/";
  localStorage.server_img = "/upload/";

  // Dev
  sessionStorage.debug = 1;

  // Ajax timeout
  localStorage.timeout = 7000; // ajax

  // Login?
  if (typeof localStorage.cli_id === "undefined") { localStorage.cli_id = 0; }

  console.log(localStorage);
  console.log(sessionStorage);
}

var phonegap = {

  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },

  // Bind Event Listeners
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("online", onOnline, false);
    function onOnline() { sessionStorage.online = true; }
    document.addEventListener("offline", onOffline, false);
    function onOffline() { sessionStorage.online = false; }
  },

  // deviceready Event Handler
  onDeviceReady: function () {

    // device info
    sessionStorage.device_model = device.model;
    sessionStorage.device_platform = device.platform;
    sessionStorage.device_version = device.version;
    sessionStorage.device_manufacturer = device.manufacturer;
    sessionStorage.device_cordova = device.cordova;
    sessionStorage.device_uuid = device.uuid;
    sessionStorage.device_serial = device.serial;

    // push
    phonegap.push = PushNotification.init({
      "android": {},
      "ios": {
        "sound": true,
        "vibration": true,
        "badge": true
      },
      "windows": {}
    });
    phonegap.push.on("registration", function(data) {
      localStorage.dev_push = data.registrationId;
      //alert(JSON.stringify(data));
    });
    phonegap.push.on("error", function(e) {
      //alert("push error = " + e.message);
    });
    phonegap.push.on("notification", function(data) {
      //alert("notification event = "+JSON.stringify(data));
    });

    // geo coords
    function geo(position) { sessionStorage.user_lat = position.coords.latitude; sessionStorage.user_lng = position.coords.longitude; }
    function geoError(error) { /*alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');*/ }
    //navigator.geolocation.watchPosition(geo, geoError, { timeout: 30000 });

    window.navigator.geolocation.getCurrentPosition(function(location) {
      console.log('Location from Phonegap');
    });

    // razor data
    start();









    alert(0);
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'http://nickford.com.br/razor/ws.php',
      httpHeaders: {
        'X-FOO': 'bar'
      }
    });
    alert(1);
    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        ws("bla");
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      ws("error");
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      ws("start");
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      ws("stop");
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      ws("auth: "+JSON.stringify(status));
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert('Location services are disabled', 'Would you like to open location settings?', [
          { text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings() },
          { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
        ]);
      }
    });

    BackgroundGeolocation.on('background', () => {
      ws("background");
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      ws("foreground");
      console.log('[INFO] App is in foreground');
    });
    alert(2);
    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    BackgroundGeolocation.start();
    alert(3);











    phonegap.receivedEvent('deviceready');

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    console.log('Received Event: ' + id);
  }
};

function ws(str) {
  var data = { data:str };
  $.ajax({
    url: localStorage.server + "/ws.php",
    data: data,
    beforeSend: function() {}, // não usar preloader
    error: function() { alert("fail"); } // não usar fail default (alert)
  })
  .done(function (res) {
    alert(JSON.stringify(res.data));
  }); // after ajax
}

/*
var number = "28999652165";
var message = "teste";
//CONFIGURATION
var options = {
replaceLineBreaks: false, // true to replace \n by a new line, false by default
android: {
intent: 'INTENT'  // send SMS with the native android SMS messaging
//intent: '' // send SMS without open any other app
}
};
var success = function () { alert('Message sent successfully'); };
var error = function (e) { alert('Message Failed:' + e); };
//sms.send(number, message, options, success, error);
//alert(2);
*/



/*

*/
