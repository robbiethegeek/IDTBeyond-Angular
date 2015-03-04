'use strict';

/**
 * @ngdoc function
 * @name idtbeyondAngularDemoApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the idtbeyondAngularDemoApp
 */
angular.module('idtbeyondAngularDemoApp')
  .controller('SettingsCtrl', function (localStorageService, IdtBeyond) {
    var vm = this;
    vm.appId = localStorageService.get('appId');
    vm.appKey = localStorageService.get('appKey');
    vm.developmentMode = (localStorageService.get('developmentMode')) ? true : false;
    vm.termId = localStorageService.get('termId');
    vm.message = '';

    var resetDataAndMessage = function(message){
      vm.message = message;
      vm.appId = '';
      vm.appKey = '';
      vm.termId = '';
      vm.developmentMode = null;
    };

    vm.clearApplicationData = function(){
      localStorageService.clearAll();
      resetDataAndMessage("Application Data cleared.");
    };

    vm.saveAppDetails = function(){
      if(!vm.appId || !vm.appKey || !vm.termId){
        resetDataAndMessage('App ID, App Key & Term ID must both be filled in. Re-enter application details.');
        return;
      }
      if (!localStorageService.set('appId', vm.appId)){
        resetDataAndMessage('Saving Application ID failed, please try again.');
        return;
      }
      if (!localStorageService.set('appKey', vm.appKey)){
        resetDataAndMessage('Saving Application Key failed, please try again.');
        return;
      }
      if (!localStorageService.set('termId', vm.termId)){
        resetDataAndMessage('Saving Terminal ID failed, please try again.');
        return;
      }
      var devModeForLocalStorage = (vm.developmentMode) ? 1 : 0;
      if (!localStorageService.set('developmentMode', devModeForLocalStorage)){
        resetDataAndMessage('Saving Application Key failed, please try again.');
        return;
      }
      vm.message = 'saved!';
      IdtBeyond.resetAppData();
    };
  });
