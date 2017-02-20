angular
  .module('app')
  .component('topBar', {
    templateUrl: 'app/commons/topBar.html',
    controller: function ($scope, $timeout, $state, GeneralService) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        currentUser: GeneralService.getCurrentUser()
      };

      // Tools
      ctrl.fabDialIsOpen = false;
      ctrl.fabDialSelectedMode = 'md-scale md-fab-top-right';
      ctrl.fabDialSelectedDirection = 'down';
      ctrl.fabDialDataList = [
        {
          label: 'Editar meu perfil', icon: 'account_box',
          toState: 'user.edit', prevFn: 'defaultUserAttending',
          userPermition: ['usuario', 'recepcao', 'profissional', 'administrador']
        },
        {
          label: 'Meu prontuário', icon: 'history',
          toState: 'emr', prevFn: 'defaultUserAttending',
          userPermition: ['usuario']
        },
        {
          label: 'Prontuário para impressão', icon: 'print',
          toState: 'resume', prevFn: 'printEmr',
          userPermition: ['usuario']
        },
        {
          label: 'Registrar novo usuário', icon: 'person_add',
          toState: 'user.new', prevFn: '',
          userPermition: ['recepcao', 'profissional', 'administrador']
        },
        {
          label: 'Selecionar usuário', icon: 'group',
          toState: 'user.select', prevFn: '',
          userPermition: ['recepcao', 'profissional', 'administrador']
        },
        {
          label: 'Gerenciar modelos', icon: 'assignment',
          toState: 'auxs.appointmentTemplates', prevFn: '',
          userPermition: ['profissional', 'administrador']
        },
        {
          label: 'Sair deste perfil', icon: 'logout',
          toState: 'logout', prevFn: '',
          userPermition: ['usuario', 'recepcao', 'profissional', 'administrador']
        }
      ];

      // Labels
      ctrl.labels = {

      };

      // Labels buttons
      ctrl.btns = {
        lblShowMenu: 'Mostrar menu principal'
      };

      // Functions
      ctrl.fns = {
        showState: function (state, prevFn) {
          if (prevFn !== '') { ctrl.fns[prevFn](); }
          $state.go(state, {}, {reload: true});
        },
        defaultUserAttending: function () {
          GeneralService.setCucurrentAttendingUser(GeneralService.getCurrentUser());
        }
      };
    }
  });
