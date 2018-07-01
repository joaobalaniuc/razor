// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'br.com.nickford.razor', // App bundle ID
  name: 'Razor', // App name
  theme: 'md', // Automatic theme detection
  cache: false, /* disable caching */
  cacheDuration: 0, /* set caching expire time to 0 */
  //domCache: false,
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
  // Others
  statusbar: {
    iosOverlaysWebView: true,
  }
});
app.on('pageInit', function (page) {
  // do something on page init
  console.log('pageInit: '+page.name);
  sessionStorage.page = page.name;
  initForm();
});
app.on('panelOpen', function (panel) {
  console.log('Panel ' + panel.side + ': open');
});

// Notifications
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

// Dialogs
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

// Swipeout callbacks
$$(document).on('swipeout:deleted', '.deleted-callback', function () {
  var adm_phone = $(this).attr("data-phone");
  if (adm_phone == localStorage.cli_phone) {
    app.dialog.alert("Você não pode remover a si mesmo.");
    return false;
  }
  admDelete(adm_phone);
});

// BUGFIX: Smart select
/*
$$(document).on('click', '.smart-select-page .back', function (e) {
sessionStorage.smartselect_bugfix=1;
setTimeout(function() {
sessionStorage.smartselect_bugfix=0;
},1000);
});*/

// Init/Create views
var indexView = app.views.create('#view-index');

// Global events
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
