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
    var resetAllValues = function(){
      vm.countries = {};
      vm.selectedCountryCode = '';
      vm.selectedCarrierCode = '';
      vm.selectedAmount = '';
      vm.phoneNumber = '';
      vm.phoneNumberValid = false;
      vm.phoneNumberValidated = false;
      vm.topUpPrepared = false;
      vm.localValueAmount = '';
      vm.localValueCurrency = '';
      vm.localValueResults = '';
    };

    vm.inDevMode = IdtBeyond.developmentMode();

    vm.appDetailsSet = IdtBeyond.credentialsSet();

    vm.productsSet = function(){
      return !angular.equals({}, vm.products);
    };

    vm.allowValidation = function(){
      return !(!!vm.phoneNumber &&
        !!vm.selectedCarrierCode &&
        !!vm.selectedCountryCode &&
        !!vm.selectedAmount);
    };

    vm.getLocalValue = function(){
      if (!vm.selectedAmount && !vm.selectedCarrierCode && !vm.selectedCountryCode){
        return false;
      }
      var currentProducts = vm.products[vm.selectedCountryCode][vm.selectedCarrierCode];

      if (currentProducts.openRange){
        angular.forEach(currentProducts, function(product){
          if (product.minDenomination !== product.maxDenomination){
            if (vm.selectedAmount < product.minDenomination || vm.selectedAmount > product.maxDenomination){
              vm.message = 'Amount not within the acceptable range for this product. Minimum : '.concat(
                product.minDenomination, ' Maximum: ', product.maxDenomination);
              vm.alertDanger = true;
              return;
            }
          }
        });
      }
      IdtBeyond.getLocalValue({
        carrierCode: vm.selectedCarrierCode,
        countryCode: vm.selectedCountryCode,
        amount: vm.selectedAmount,
        currencyCode: 'USD'
      }).success(function(results){
        vm.localValueResults = results;
        vm.localValueAmount = results.local_amount;
        vm.localValueCurrency = results.local_currency;
        vm.message = 'Estimated local value:'.concat(vm.localValueAmount,' ', vm.localValueCurrency);
        vm.alertInfo = true;
      }).error(function(err){
        vm.localValueResults = {};
        vm.message = err.error;
        vm.alertDanger = true;
        vm.localValueAmount = null;
        vm.localValueCurrency = null;
      });
    };

    vm.validatePhoneNumber = function(){
      IdtBeyond.validateNumber(vm.phoneNumber, vm.selectedCountryCode)
        .success(function(data){
          vm.phoneNumberValidated = true;
          if (data.valid){
            vm.phoneNumberValid = true;
          } else {
            vm.phoneNumberValid = false;
          }
          vm.validatePhoneResponse = data;
        })
        .error(function(err){
          vm.message = err.error;
          vm.alertDanger = true;
          vm.phoneNumberValidated = true;
          vm.validatePhoneResponse = {};
          vm.phoneNumberValid = false;
        });
    };

    vm.cancelTopup = function() {
      vm.topUpPrepared = false;
    };

    vm.resetAllValues = function() {
      resetAllValues();
    };

    vm.submitTopup = function() {
      if (!vm.selectedAmount && !vm.selectedCarrierCode && !vm.selectedCountryCode && !vm.phoneNumber){
        return false;
      }
      IdtBeyond.postTopup({
        carrierCode: vm.selectedCarrierCode,
        countryCode: vm.selectedCountryCode,
        amount: vm.selectedAmount,
        currencyCode: 'USD',
        phoneNumber: vm.phoneNumber
      }).success(function(results){
        vm.message = 'Topup successfully submitted, client transaction id: '.concat(results.client_transaction_id, '.');
        vm.alertSuccess = true;
        resetAllValues();
      }).error(function(err){
        console.log(err);
        vm.topUpPrepared = false;
        vm.message = 'Error occurred. '.concat(err.toString());
        vm.alertDanger = true;
      });
    };

    vm.prepareTopup = function(){
      vm.message = '';
      vm.topUpPrepared = true;
      vm.prepareFailed = {
        success: false,
        message: ''
      };
      if (!vm.phoneNumberValidated){
        vm.message = 'Please validate the phone number before preparing topup.';
        vm.alertDanger = true;
        return;
      }
      if (vm.phoneNumberValidated && !vm.phoneNumberValid){
        vm.message = 'Please update phone number and re-validate.';
        vm.alertDanger = true;
        return;
      }
      if (!vm.localValueAmount || !vm.localValueCurrency) {
        vm.getLocalValue();
      }
      return;
    };

    vm.clearMessage = function(){
      vm.message = '';
      vm.alertDanger = false;
      vm.alertSuccess = false;
      vm.alertInfo = false;
    };

    resetAllValues();

    if (vm.appDetailsSet){
      IdtBeyond.getProducts().then(function(results){
        var products = {};
        angular.forEach(results.data , function(product){
          vm.countries[product.countryCode] = product.country;
          var countryCode = product.countryCode;
          var carrierCode = product.carrierCode;
          if (!products[countryCode]){
            products[countryCode] = {};
          }
          if (!products[countryCode][carrierCode]){
            products[countryCode][carrierCode] = {
              values: [],
              openRange: false
            };
          }
          if (product.maxDenomination !== product.minDenomination){
            products[countryCode][carrierCode].openRange = true;
          }
          products[countryCode][carrierCode].values.push({
              minDenomination: product.minDenomination,
              maxDenomination: product.maxDenomination
          });
        });
        vm.products = products;
      });
    }

  });
