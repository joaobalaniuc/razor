$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  //===========================
  // MAPBOX
  //===========================
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hb2JhbGFuaXVjIiwiYSI6ImNqaXFnb2RyMjA0b3ozdm12NmNva2hjNXUifQ.SSIY_rae1SE0Xsb_XYyn1Q';
  var lat = 0;
  var lng = 0;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    /*zoom: 0,
    center: [lat, lng]*/
    center: [-40.2903928, -20.3407937],
    zoom: 15
  });

  var el = document.createElement('div');
  el.className = 'pulse';
  var marker = new mapboxgl.Marker(el)
  .setLngLat([-40.2903928, -20.3407937])
  .addTo(map);
  /*
  var el2 = document.createElement('div');
  el2.className = 'pin';
  var marker2 = new mapboxgl.Marker(el2)
  .setLngLat([-40.2903928, -20.3407937])
  .addTo(map);
  */
  
  sessionStorage.auto_lat = lat;
  sessionStorage.auto_lng = lng;
  if (typeof marker !== "undefined") {
    delete marker;
  }
  //===========================
  // GPS
  //===========================
  if (isApp) {
    if (typeof localStorage.dev_push === "undefined" && typeof sessionStorage.turnon === "undefined") {
      setTimeout(function() {
        app.router.navigate("/turnon/");
      }, 1000);
      return false;
    }
  }
  //===========================
  // INICIANDO AGORA
  //===========================
  if (typeof sessionStorage.autoId_0 === "undefined") {
    if (typeof sessionStorage.auth_token === "undefined") { Auth(autoList); }
    else { autoList(); }
  }
  //===========================
  // APP EM USO
  //===========================
  else {
    if (typeof sessionStorage.auth_token === "undefined") { Auth(autoListSession); }
    else { autoListSession(); }
    if (typeof localStorage.auto_id === "undefined") {
      localStorage.auto_id = sessionStorage.autoId_0;
      localStorage.auto_imei = sessionStorage.autoImei_0;
    }
    sessionStorage.auto_id = localStorage.auto_id;
    sessionStorage.auto_imei = localStorage.auto_imei;
  }
});

$$(document).on('click', '.torpedo', function (e) {
  var msg0 = $(this).attr("data-msg0");
  var msg1 = $(this).attr("data-msg1");
  var cb = $(this).attr("data-cb");
  cb = window[cb];
  setTimeout(function() {
    torpedo(msg0, msg1, cb); // bugfix
  }, 500);
});
function ligar() {
  setTimeout(function() {
    window.location.href="tel://"+sessionStorage.auto_phone
  },500); // click effect bugfix
}
function torpedo(msg0, msg1, cb) {
  var number = sessionStorage.auto_phone;
  var pass = sessionStorage.auto_pass;
  var message = msg0 + pass + " " + msg1;
  var options = {
    replaceLineBreaks: false, // true to replace \n by a new line, false by default
    android: {
      intent: 'INTENT'  // send SMS with the native android SMS messaging
      //intent: '' // send SMS without open any other app
    }
  };
  if (typeof cb !== "undefined" && typeof cb !== "function") { cb = window[cb]; }
  if (!isApp) { if (typeof cb === "function") { cb(); } }
  else {
    setTimeout(function() {
      sms.send(number, message, options, function() {
        if (typeof cb === "function") { cb(); }
      });
    },500); // click effect bugfix
  }
}

//========================================================
// MODO MONITOR/TRACKER
//========================================================
function modeMonitorOn() {
  //alert("monitor on");
  var data_auto = {
    auto_id: sessionStorage.auto_id,
    auto_param_mode: "monitor"
  };
  $("#modeMonitorOn").show();
  $("#modeTrackerOn").hide();
  autoUpdate(data_auto);
}
function modeTrackerOn() {
  //alert("tracker on");
  var data_auto = {
    auto_id: sessionStorage.auto_id,
    auto_param_mode: "tracker"
  };
  $("#modeMonitorOn").hide();
  $("#modeTrackerOn").show();
  autoUpdate(data_auto);
}
$$(document).on('click', '#modeTrackerOn', function (e) {
  app.dialog.create({
    title: 'Ativar Modo Escuta',
    text: 'É necessário enviar um comando via SMS para ativar esta função.',
    buttons: [
      { text: 'Ativar Modo Escuta', cssClass: 'bold' },
      { text: 'Cancelar' }
    ],
    onClick: function(dialog, i) {
      if (i == 0) { torpedo("monitor", "", "modeMonitorOn"); }
    },
    closeByBackdropClick:true,
    verticalButtons: true,
  }).open();
});
$$(document).on('click', '#modeMonitorOn', function (e) {
  app.dialog.create({
    title: 'Modo Escuta',
    //text: 'É necessário enviar um comando via SMS para ativar esta função.',
    buttons: [
      { text: 'Ouvir Agora', cssClass: 'bold' },
      { text: 'Desativar Modo Escuta' },
      { text: 'Cancelar' }
    ],
    onClick: function(dialog, i) {
      if (i == 0) { ligar(); }
      if (i == 1) { torpedo("monitor", "", "modeTrackerOn"); }
    },
    closeByBackdropClick:true,
    verticalButtons: true,
  }).open();
});
//========================================================
// CORRENTE LIBERADA/CORTADA
//========================================================
$$(document).on('click', '#modeCutOff', function (e) {
  app.dialog.create({
    title: 'Cortar Corrente',
    text: 'O veículo permanecerá imóvel até que você desative esta função.',
    buttons: [
      { text: 'Cortar Corrente', cssClass: 'bold' },
      { text: 'Cancelar' }
    ],
    onClick: function(dialog, i) {
      if (i == 0) { torpedo("quickstop", "", "modeCutOff"); }
    },
    closeByBackdropClick:true,
    verticalButtons: true,
  }).open();
});
$$(document).on('click', '#modeCutOn', function (e) {
  app.dialog.create({
    title: 'Liberar Corrente',
    text: 'O veículo poderá se mover novamente.',
    buttons: [
      { text: 'Liberar Corrente', cssClass: 'bold' },
      { text: 'Cancelar' }
    ],
    onClick: function(dialog, i) {
      if (i == 0) { torpedo("resume", "", "modeCutOn"); }
    },
    closeByBackdropClick:true,
    verticalButtons: true,
  }).open();
});
function modeCutOff() {
  var data_auto = {
    auto_id: sessionStorage.auto_id,
    auto_param_cutoff: 1
  };
  $("#modeCutOn").show();
  $("#modeCutOff").hide();
  autoUpdate(data_auto);
}
function modeCutOn() {
  var data_auto = {
    auto_id: sessionStorage.auto_id,
    auto_param_cutoff: 0
  };
  $("#modeCutOn").hide();
  $("#modeCutOff").show();
  autoUpdate(data_auto);
}
