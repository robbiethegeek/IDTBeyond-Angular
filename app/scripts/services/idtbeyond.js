'use strict';

/**
 * @ngdoc service
 * @name idtbeyondAngularDemoApp.IdtBeyond
 * @description
 * # IdtBeyond
 * Service in the idtbeyondAngularDemoApp.
 */
angular.module('idtbeyondAngularDemoApp')
  .service('IdtBeyond', function ($http, localStorageService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var setHeaders = function(){
      return  {
        'x-idt-beyond-app-id': (localStorageService.get('appId')) ? localStorageService.get('appId') : '',
        'x-idt-beyond-app-key': (localStorageService.get('appKey')) ? localStorageService.get('appKey') :''
      };
    };
    var url = 'https://api-dev.idtbeyond.com';
    var headers = setHeaders();
    this.getProducts = function(){
      console.log("headers", headers);
      return $http.get(url + '/v1/iatu/products/reports/all', {headers: headers});
    };
    this.credentialsSet = function(){
      return !!headers['x-idt-beyond-app-id'] && !!headers['x-idt-beyond-app-key'];
    }
    this.resetHeaders = function(){
      headers = setHeaders();
    }
    this.validateNumber = function(phoneNumber, countryCode){
      console.log(arguments)
      var result = {
          success: false,
          message: '',
          result: ''
      };
      return $http.get(
        url.concat(
          '/v1/iatu/number-validator?country_code', countryCode, '&mobile_number=', phoneNumber),
        {
          headers: headers
        });
    };
  });
