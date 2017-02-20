angular
  .module('app')
  .config(function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/login');

    function checkRequireLogin($state, $window, $location, requireLogin) {
      var token = false;
      if (!(typeof $window.sessionStorage === 'undefined')) {
        if (!(typeof $window.sessionStorage.token === 'undefined')) {
          token = true;
        }
      }
      if (requireLogin && !(token)) {
        $location.path("/access/login");
      }
    }

    $stateProvider
      .state('auxs', {url: '/auxs', component: 'auxs',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('auxs.appointmentTemplates', {url: '/appointmentTemplates', component: 'auxsAppointmentTemplates',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('emr', {url: '/emr', component: 'emr',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('emr.showAppointment', {url: '/showAppointment', component: 'emrShowAppointment',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('login', {url: '/access/login', component: 'login',
        data: {requireLogin: false},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('logout', {url: '/access/logout', component: 'logout',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('resume', {url: '/', component: 'resume',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('user', {url: '/user', component: 'user',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('user.edit', {url: '/edit', component: 'userEdit',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('user.new', {url: '/new', component: 'userNew',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })
      .state('user.select', {url: '/select', component: 'userSelect',
        data: {requireLogin: true},
        onEnter: ['$state', '$window', '$location', function ($state, $window, $location) {
          checkRequireLogin($state, $window, $location, this.data.requireLogin);
        }]
      })

    ;
  });

/** @ngInject */
