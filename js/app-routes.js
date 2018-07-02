var ts = Date.now();

routes = [
  {
    path: '/register/',
    url: './pages/register.html?'+ts,
  },
  {
    path: '/auto/',
    url: './pages/auto.html?'+ts,
  },
  {
    path: '/device/',
    url: './pages/device.html?'+ts,
  },
  {
    path: '/sync/',
    url: './pages/sync.html?'+ts,
  },
  {
    path: '/wait/',
    url: './pages/wait.html?'+ts,
  },
  {
    path: '/login/',
    url: './pages/login.html?'+ts,
  },
  {
    path: '/test/',
    url: './pages/test.html?'+ts,
  },
  {
    path: '/home/',
    url: './pages/home.html?'+ts,
    on: {
      pageMounted: function (event, page) {
        //alert(1);
      },
      pageBeforeIn: function (event, page) {
        /*console.log("blah");
        var mapView = app.views.create('#view-map', { url: '/map/' });
        var menuView = app.views.create('#view-home', { url: '/menu/' });
        var confView = app.views.create('#view-conf', { url: '/conf/' });*/
      }
    }
  },
  {
    path: '/about/:name/',
    templateUrl: './pages/about.html',
    options: {
      animate: true,
    },
    on: {
      pageBeforeIn: function (event, page) {
        // do something before page gets into the view
      },
      pageAfterIn: function (event, page) {
        // do something after page gets into the view
      },
      pageInit: function (event, page) {
        //alert(1);
        // do something when page initialized
      },
      pageBeforeRemove: function (event, page) {
        // do something before page gets removed from DOM
      },
    }
  },
  {
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
