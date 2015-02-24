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
    var resetDataAndMessage = function(message){
      vm.message = message;
      vm.appId = '';
      vm.appKey = '';
    }
    vm.saveAppDetails = function(){
      console.log(settings)
      if(!vm.appId || !vm.appKey){
        resetDataAndMessage('App ID & App Key must both be filled in. Re-enter application details.');
        return;
      }
      if (!localStorageService.set('appId', vm.appId)){
        resetDataAndMessage("Saving Application ID failed, please try again.");
        return
      }
      if (!localStorageService.set('appKey', vm.appKey)){
        resetDataAndMessage("Saving Application Key failed, please try again.");
        return;
      }
      vm.message = "saved!";
      IdtBeyond.resetHeaders();
    }
    console.log(settings)
  });
