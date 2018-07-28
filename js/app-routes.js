var ts = Date.now();

routes = [
  {
    // Criar conta
    path: '/register/',
    url: './pages/register.html?'+ts,
  },
  {
    // Inserir / Editar Veículo
    path: '/auto/',
    url: './pages/auto.html?'+ts,
  },
  {
    // Iniciar Sincronização
    path: '/sync/',
    url: './pages/sync.html?'+ts,
  },
  {
    // Ativar Notificações / GPS
    path: '/turnon/',
    url: './pages/turnon.html?'+ts,
  },
  {
    // Entrar
    path: '/login/',
    url: './pages/login.html?'+ts,
  },
  {
    // Ver / Editar Perfil
    path: '/profile/',
    url: './pages/profile.html?'+ts,
  },
  {
    path: '/home/',
    url: './pages/home.html?'+ts,
    on: {
      pageMounted: function (event, page) {
        //alert(0);
      },
      pageBeforeIn: function (event, page) {
        //alert(1);
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

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
