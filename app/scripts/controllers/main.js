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
    vm.name = "robbie";
    vm.products = [];
    vm.appDetailsSet = IdtBeyond.credentialsSet();
    if (vm.appDetailsSet){
      IdtBeyond.getProducts().then(function(products){
        vm.countries = {};
          angular.forEach(products.data , function(product){
          vm.countries[product.countryCode] = product.country;
          if (!vm.products[product.countryCode]){
            vm.products[product.countryCode] = [];
          }
          vm.products[product.countryCode].push(product);

          console.log(product);
        })
        console.log(vm.countries);
      });
    }
  });
