angular
  .module('app')
  .factory('GetListForSearch', function ($http, $q, GeneralService) {
    return {
      listResult: function (qString, addressList) {
        return $http.post(GeneralService.getServerAddress() + addressList, {queryString: qString})
          .then(function (response) {
            if (typeof response.data === 'object') {
              if (addressList === "/col_aux_cids/list") {
                var arrayGeted = [];
                response.data.forEach(function (element) {
                  var elemTempPos = Object.assign({}, element);
                  elemTempPos.fld_situacao = "Possível";
                  var elemTempPro = Object.assign({}, element);
                  elemTempPro.fld_situacao = "Provável";
                  var elemTempDef = Object.assign({}, element);
                  elemTempDef.fld_situacao = "Definitivo";
                  arrayGeted.push(elemTempPos);
                  arrayGeted.push(elemTempPro);
                  arrayGeted.push(elemTempDef);
                });
                return arrayGeted;
              }
              return response.data;
            }
            return $q.reject(response.data);
          }, function (response) {
            return $q.reject(response.data);
          });
      }
    };
  });
