//================================================
// GLOBAL PAGE INIT
//================================================
app.on('pageInit', function (page) {
  // do something on page init
  console.log('pageInit: '+page.name);
  initForm();

  // JQUERY VALIDATION
  $("form").validate({
    errorElement: 'div',
    errorPlacement: function(error, element) {
      error.addClass("item-input-error-message").insertAfter(element);
    },
    highlight: function(element, errorClass, validClass) {
      $(element).closest("li").addClass("item-input-with-error-message");
      $(element).closest("div").find(".item-input-info").hide();
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest("li").removeClass("item-input-with-error-message");
      $(element).closest("div").find(".item-input-info").show();
    }
  });
});
app.on('panelOpen', function (panel) {
  console.log('Panel ' + panel.side + ': open');
});

//================================================
// NOTIFICATIONS
//================================================
var notificationConex = app.notification.create({
  icon: '<i class="fas fa-exclamation-triangle"></i>',
  title: 'Razor',
  titleRightText: 'agora',
  subtitle: 'A conexão falhou',
  text: 'Tentando novamente...',
  closeTimeout: 3000,
  closeOnClick: true,
  closeButton: true
});
$$(document).on('click', '.open-full', function (e) {
  notificationConex.open();
});

//================================================
// DIALOGS
//================================================
$$(document).on('click', '.open-adm', function () {
  var count = $("#admList li").length;
  if (count>=5) {
    app.dialog.alert("Remova um administrador para adicionar outro.", 'Limite atingido.');
    return false;
  }
  app.dialog.prompt('Informe o celular do novo administrador:', function (name) {
    if (name) {
      app.dialog.confirm('Esta pessoa terá acesso irrestrito ao seu rastreador. Deseja continuar?', function () {
        admInsert(name);
      });
    }
  });
  $(".dialog-input").addClass("phone_with_ddd").css("color", "#666").css("font-weight", "bold").focus();
  initForm();
});

//================================================
// SWIPEOUT
//================================================
$$(document).on('swipeout:deleted', '.deleted-callback', function () {
  var adm_phone = $(this).attr("data-phone");
  if (adm_phone == localStorage.cli_phone) {
    app.dialog.alert("Você não pode remover a si mesmo.");
    return false;
  }
  admDelete(adm_phone);
});

//================================================
// LINKS
//================================================
$$(document).on('click', '#autoList a', function (e) {
  var id = $(this).attr("data-id");
  var imei = $(this).attr("data-imei");
  console.log("id="+id+" imei="+imei);
  sessionStorage.auto_id = id;
  sessionStorage.auto_imei = imei;
  window.location.href="index.html";
});
$$(document).on('click', '.link', function (e) {
  console.log("click .link");
});
$$(document).on('click', '.index', function (e) {
  window.location.href="index.html";
});

//================================================
// AJAX DEFAULT SETUP & CALLBACKS
//================================================
$.ajaxSetup({
  type: 'GET',
  dataType: 'jsonp',
  jsonp: 'callback',
  timeout: localStorage.timeout,
  beforeSend: function(xhr, options) {
    //console.log("--> sending data: "+options.url);
    if (sessionStorage.online == "false") {
      xhr.abort();
      console.log("*** ajax abort (offline)");
    }
    else {app.preloader.show("green");}
  },
  complete: function() { app.preloader.hide(); },
  success: function(data) { },
  error: function() { ajaxFail(); }
});
function ajaxError(res) {
  if (res===null) { return true; }
  if (res.error) {
    if (res.error == "1") {
      alert("Suas credenciais foram alteradas, o aplicativo será reiniciado.");
      sessionStorage.clear();
      localStorage.clear();
      window.location.href="index.html";
    }
    else {
      app.dialog.alert(res.error, 'Erro externo');
    }
    return true;
  }
  return false;
}
function ajaxLog(fn, res) {
  console.log(fn+" <-- reading data...");
  console.log(res);
}
function ajaxFail() {
  app.dialog.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.');
}
function ajaxUserData() {
  var data_user = {};
  data_user.cli_id = localStorage.cli_id;
  data_user.cli_email = localStorage.cli_email;
  data_user.cli_pass = localStorage.cli_pass;
  data_user.cli_phone = localStorage.cli_phone;
  if (typeof sessionStorage.auth_token !== "undefined") {
    data_user.auth_token = sessionStorage.auth_token;
  }
  return data_user;
}
function ajaxDevData() {
  var data = {};
  if (typeof sessionStorage.device_model === "undefined") {
    alert("Device 0");
    var data = {
      dev_model:0,
      dev_platform:0,
      dev_platform_ver:0,
      dev_manufacturer:0,
      dev_cordova:0,
      dev_uuid:0,
      dev_serial:0
    };
  }
  else {
    data.dev_model = sessionStorage.device_model;
    data.dev_platform = sessionStorage.device_platform;
    data.dev_platform_ver = sessionStorage.device_version;
    data.dev_manufacturer = sessionStorage.device_manufacturer;
    data.dev_cordova = sessionStorage.device_cordova;
    data.dev_uuid = sessionStorage.device_uuid;
    data.dev_serial = sessionStorage.device_serial;
  }
  return data;
}

//================================================
// GEOLOCATION
//================================================
function geo(position) {
  alert(JSON.stringify(position));
  sessionStorage.user_lat = position.coords.latitude;
  sessionStorage.user_lng = position.coords.longitude;
}

// onError Callback receives a PositionError object
//
function geoError(error) {
  alert('code: '    + error.code    + '\n' +
  'message: ' + error.message + '\n');
}

// Options: throw an error if no update is received every 30 seconds.
//
