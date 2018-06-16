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
});
app.on('pageInit', function (page) {
  // do something on page init
  console.log('pageInit: '+page.name);
  sessionStorage.page = page.name;
  initForm();
  var jsFile = "pages/"+page.name+".js";
  if (page.name !== null && doesFileExist(jsFile)) {
    $.getScript(jsFile);
  }
});

// Init/Create views
var indexView = app.views.create('#view-index');
//app.router.navigate("/");

$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  //alert(1);
});

$$(document).on('click', '#autoList a', function (e) {
  var id = $(this).attr("data-id");
  console.log(id);
});
