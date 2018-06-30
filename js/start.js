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
  localStorage.timeout = 5000; // ajax

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

    //alert(1);

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

    // GPS enabled?
    /*
    if (device.platform != "iOS") {
    cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
    if (!enabled) { geoIP(); }
  }, function (error) {
  alert("The following error occurred: " + error);
});
}
*/
phonegap.receivedEvent('deviceready');

// SPLASHSCREEN (CONFIG.XML BUGFIX)
setTimeout(function () {
  //navigator.splashscreen.hide();
  //StatusBar.hide();
}, 500);


StatusBar.hide();
//StatusBar.backgroundColorByName("red");
start();
//geo();

},
// Update DOM on a Received Event
receivedEvent: function (id) {
  /*var parentElement = document.getElementById(id);
  var listeningElement = parentElement.querySelector('.listening');
  var receivedElement = parentElement.querySelector('.received');
  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');*/
  console.log('Received Event: ' + id);
}
};
