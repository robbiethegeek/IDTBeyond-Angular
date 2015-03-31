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

    var setAlertLevel = function(level){
		switch (level){
			case 'danger':
				vm.alertDanger = true;
				vm.alertSuccess = false;
				vm.alertInfo = false;
				vm.alertWarning = false;
				return;
			case 'info':
				vm.alertInfo = true;
				vm.alertSuccess = false;
				vm.alertDanger = false;
				vm.alertWarning = false;
				return;
			case 'success':
				vm.alertSuccess = true;
				vm.alertDanger = false;
				vm.alertInfo = false;
				vm.alertWarning = false;
				return;
			case 'warning':
				vm.alertWarning = true;
				vm.alertSuccess = false;
				vm.alertDanger = false;
				vm.alertInfo = false;
				return;
			default:
				vm.alertSuccess = false;
				vm.alertDanger = false;
				vm.alertInfo = false;
				vm.alertWarning = false;
				return;
		}
	};

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
              setAlertLevel('danger');
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
        /* jshint ignore:start */
        vm.localValueAmount = results.local_amount;
        vm.localValueCurrency = results.local_currency;
        /* jshint ignore:end */
        vm.localValueResults = results;
        vm.message = 'Estimated local value:'.concat(vm.localValueAmount,' ', vm.localValueCurrency);
        setAlertLevel('info');
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
            vm.message = 'Phone number is valid.';
            setAlertLevel('info');
            vm.phoneNumberValid = true;
          } else {
            setAlertLevel('warning');
            vm.message = 'Phone number is not valid. Please check and try again.';
            vm.phoneNumber = '';
          }
          vm.validatePhoneResponse = data;
        })
        .error(function(err){
          setAlertLevel('danger');
          vm.message = err.error;
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
        vm.message = 'Topup successfully submitted, client transaction id: '.
          concat(results.client_transaction_id, '.'); // jshint ignore:line
        setAlertLevel('success');
        resetAllValues();
      }).error(function(err){
        vm.topUpPrepared = false;
        vm.message = 'Error: '.concat(err.error);
        setAlertLevel('danger');
      });
    };

    vm.prepareTopup = function(){
      vm.message = '';
      vm.topUpPrepared = true;

      if (!vm.phoneNumberValidated){
        vm.message = 'Please validate the phone number before preparing topup.';
        setAlertLevel('danger');
        return;
      }
      if (vm.phoneNumberValidated && !vm.phoneNumberValid){
        vm.message = 'Please update phone number and re-validate.';
        setAlertLevel('danger');
        return;
      }
      return;
    };

    vm.clearMessage = function(){
      vm.message = '';
      setAlertLevel();
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
            products[countryCode][carrierCode].minDenomination = product.minDenomination;
            products[countryCode][carrierCode].maxDenomination = product.maxDenomination;
          }
          products[countryCode][carrierCode].values.push({
              minDenomination: product.minDenomination,
              maxDenomination: product.maxDenomination
          });
        });
        vm.products = products;
      });
    }
		vm.resetCarrierValues = function(all){
			if (all){
				vm.selectedCarrierCode = '';
			}
			vm.selectedAmount = '';
		};

  });
