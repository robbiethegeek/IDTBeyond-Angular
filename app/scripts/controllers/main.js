'use strict';

/**
 * @ngdoc function
 * @name idtbeyondAngularDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the idtbeyondAngularDemoApp
 */
angular.module('idtbeyondAngularDemoApp')
  .controller('MainCtrl', function (IdtBeyond) {
    var vm = this;
    vm.products = {};
    vm.appDetailsSet = IdtBeyond.credentialsSet();
    vm.selectedCountry = '';
    vm.selectedCarrierAmount = '';
    vm.phoneNumber = '';
    vm.allowValidation = function(){
      return !(!!vm.phoneNumber && !!vm.selectedCarrierAmount && !!vm.selectedCountry);
    }
    vm.validateTopup = function(){
      IdtBeyond.validateNumber(vm.phoneNumber, vm.selectedCountry)
        .success(function(data){
          console.log("success")
          console.log(data)
        })
        .error(function(data, status){
          console.log("error")
          console.log(data)
          console.log(status)
        });
    };

    if (vm.appDetailsSet){
      IdtBeyond.getProducts().then(function(products){
        vm.countries = {};
        angular.forEach(products.data , function(product){
          vm.countries[product.countryCode] = product.country;
          var countryCode = product.countryCode;
          if (!vm.products[countryCode]){
            vm.products[countryCode] = [];
          }
          vm.products[countryCode].push(product);
        })
      });
    }
  });
