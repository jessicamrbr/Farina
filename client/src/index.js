angular
  .module('app', ['ui.router', 'ngAnimate', 'ngAria', 'ngMessages', 'ngMaterial', 'ngMdIcons',
    'ngMask', 'displayMask',
    'angularMoment', 'angular.viacep', 'smoothScroll', 'ui.tinymce'])
  .factory('fnInterceptor',
    ['$q', '$window', '$state', '$rootScope', '$timeout', 'GeneralService',
    function ($q, $window, $state, $rootScope, $timeout, GeneralService) {
      return {
        request: function (config) {
          if (config.url.search("http://") === 0 || config.url.search("https://") === 0) {
            $rootScope.$broadcast('httpStartNewReq');
          }

          config.headers = config.headers || {};

          if (!(typeof $window.sessionStorage.token === "undefined") &&
             (config.url.search(GeneralService.getServerAddress()) === 0)) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }

          return config;
        },
        requestError: function (rejection) {
          $rootScope.$broadcast('httpStopNewReq');
          return $q.reject(rejection);
        },
        response: function (response) {
          $rootScope.$broadcast('httpStopNewReq');
          return response;
        },
        responseError: function (rejection) {
          $rootScope.$broadcast('httpStopNewReq');
          $rootScope.$broadcast('httpErrorReturn', {message: rejection.data.message});
          if (rejection.status === 401 || rejection.status === 403) {
            delete $window.sessionStorage.token;
            $state.go('/login', {}, {reload: true});
          }
          return $q.reject(rejection);
        }
      };
    }
  ])
  .factory('showsForReqResHttp', function ($rootScope, $mdToast) {
    return {
      startLoading: function () {
        var toastTpl = '<md-toast>';
        toastTpl += '  <span class="md-toast-text" flex>Carregando </span>';
        toastTpl += '  <md-progress-circular md-diameter="50"></md-progress-circular>';
        toastTpl += '</md-toast>';

        if (typeof $rootScope.loadingNotify === "undefined") {
          $rootScope.loadingNotify = $mdToast.hide().then(function () {
            $mdToast.show({
              template: toastTpl,
              parent: angular.element(document.body),
              position: "bottom left",
              hideDelay: false
            });
          });
        }
      },
      stopLoading: function () {
        $mdToast.hide($rootScope.loadingNotify);
        delete $rootScope.loadingNotify;
      },
      alertError: function (message) {
        var toastTpl = '<md-toast>';
        toastTpl += '  <ng-md-icon icon="error" style="fill: #FF5252" size="30" flex="10"></ng-md-icon>';
        toastTpl += '  <span class="md-toast-text" flex>';
        toastTpl += '    <strong md-colors="{color: \'red-A200\'}">Aviso:</strong> ' + message;
        toastTpl += '  </span>';
        toastTpl += '</md-toast>';

        $mdToast.hide();
        $mdToast.show({
          template: toastTpl,
          parent: angular.element(document.body),
          position: "bottom left",
          hideDelay: 12000
        });
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('fnInterceptor');
  })
  .config(function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('green');
  })
  .config(function ($mdGestureProvider) {
    $mdGestureProvider.skipClickHijack();
  })
  .run(function (amMoment) {
    amMoment.changeLocale('pt-br');
  })
  .config(['moment', function ($mdDateLocaleProvider, moment) {
    $mdDateLocaleProvider.months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    $mdDateLocaleProvider.shortMonths = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    $mdDateLocaleProvider.days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábaado'];
    $mdDateLocaleProvider.shortDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, "DD-MM-YYYY", true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.formatDate = function (date) {
      var m = moment(date);
      return m.isValid() ? m.format("DD/MM/YYYY") : '';
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendário';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendário';
  }])
  .config(function ($compileProvider) {
    $compileProvider.preAssignBindingsEnabled(true);
  })
  .run(function runApp($rootScope, showsForReqResHttp) {
    $rootScope.$on('httpStartNewReq', function () {showsForReqResHttp.startLoading();});
    $rootScope.$on('httpStopNewReq', function () {showsForReqResHttp.stopLoading();});
    $rootScope.$on('httpErrorReturn', function (event, eventData) {
      showsForReqResHttp.alertError(eventData.message);
    });
  })
  .directive("formScrollValidationed", ['smoothScroll', '$mdToast', function (smoothScroll, $mdToast) {
    return {
      restrict: 'A',
      link: function (scope, elem) {
        elem.on('click', function () {
          var firstInvalidElem = elem[0].form.querySelector('.ng-invalid');
          if (firstInvalidElem) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Campos inválidos, por favor verifique os dados informados.')
                .position('bottom left')
                .hideDelay(12000)
            );
            smoothScroll(firstInvalidElem, {offset: 100, containerId: "bodyMdContente"});
          }
        });
      }
    };
  }]);
