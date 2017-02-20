angular
  .module('app')
  .service('GeneralService', function ($window, $rootScope) {
    // Private vars
    var currentAppointmentData;
    var currentAppointmentPointer = {}; // A id of DRG and a id of appointment
    var currentAttendingUser; // Name, type, id
    var currentDrgList; // A array of DRGs Object
    var currentPrivateNotesList; // Name, type, id
    var currentTemplateInputsList; // Name, type, id
    var currentUser; // Name, type, id, (especiality)
    var serverAddress = "https://localhost:3060";

    // Public vars
    this.getCurrentAppointmentData =
      function () { return currentAppointmentData; };
    this.setCurrentAppointmentData =
      function (_currentAppointmentData) { currentAppointmentData = _currentAppointmentData; };

    this.getCurrentAppointmentPointer =
      function () { return currentAppointmentPointer; };
    this.setCurrentAppointmentPointer =
      function (_idEmr, _idAppointment) {
        currentAppointmentPointer._idEmr = _idEmr;
        currentAppointmentPointer._idAppointment = _idAppointment;
      };

    this.getCurrentAttendingUser = function () {
      currentAttendingUser = ((typeof currentAttendingUser === "undefined") ? currentUser : currentAttendingUser);
      return currentAttendingUser;
    };
    this.setCucurrentAttendingUser =
      function (_currentAttendingUser) { currentAttendingUser = _currentAttendingUser; };

    this.getCurrentDrgList =
      function () { return currentDrgList; };
    this.setCurrentDrgList =
      function (_currentDrgList) {
        currentDrgList = _currentDrgList;
        $rootScope.$broadcast('currentDrgList:updated');
      };

    this.getCurrentPrivateNotesList =
      function () { return currentPrivateNotesList; };
    this.setCurrentPrivateNotesList =
      function (_currentPrivateNotesList) { currentPrivateNotesList = _currentPrivateNotesList; };

    this.getCurrentTemplateInputsList =
      function () {

        return currentTemplateInputsList;
      };
    this.setCurrentTemplateInputsList =
      function (_currentTemplateInputsList) { currentTemplateInputsList = _currentTemplateInputsList; };

    this.getCurrentUser =
      function () { return currentUser; };
    this.setCurrentUser =
      function (_currentUser) { currentUser = _currentUser; };
    this.initCurrentUser = function () {
      if (typeof $window.sessionStorage.token !== "undefined") {
        currentUser = JSON.parse(decodeURIComponent(escape(atob($window.sessionStorage.token.split('.')[1]))));
      }
    };

    this.getServerAddress =
      function () { return serverAddress; };
    this.setServerAddress =
      function (_serverAddress) { serverAddress = _serverAddress; };

    this.initCurrentUser();
  });
