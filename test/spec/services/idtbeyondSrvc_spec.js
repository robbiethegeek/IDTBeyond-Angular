'use strict';

describe('Service: IdtBeyond', function () {

  beforeEach(module('idtbeyondAngularDemoApp'));

  var IdtBeyond, $httpBackend, localStorageService, $q, deferred;
  var expectedHeaders = {
    'x-idt-beyond-app-id': 'appId',
    'x-idt-beyond-app-key': 'appKey'
  };
  var successCallback = jasmine.createSpy('success');
  var errorCallback = jasmine.createSpy('error');
  beforeEach(module(function($provide) {
    localStorageService = {
      get: function(value){
        return value;
      }
    };
    $provide.value('localStorageService', localStorageService);
  }));
  beforeEach(inject(function ($injector, _IdtBeyond_) {
    IdtBeyond = _IdtBeyond_;
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    deferred = $q.defer();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the headers from local storage on instantiation', function () {
    expect(IdtBeyond.credentialsSet()).toBe(true);
  });

  it('should /v1/iatu/products/reports/all when getProducts is called.', function(){
    $httpBackend.expectGET('https://api.idtbeyond.com/v1/iatu/products/reports/all',
    function(headers){
      return (headers['x-idt-beyond-app-id'] === expectedHeaders['x-idt-beyond-app-id']) &&
        headers['x-idt-beyond-app-key'] === expectedHeaders['x-idt-beyond-app-key']
    }).respond(deferred);
    IdtBeyond.getProducts();
    $httpBackend.flush();
  });

  it('should /v1/iatu/number-validator when validateNumber is called with the correct params.', function(){
    var phoneNumber = 'phone-number';
    var countryCode = 'country-code';
    $httpBackend.expectGET('https://api.idtbeyond.com/v1/iatu/number-validator?country_code='.concat(
      countryCode, '&mobile_number=', phoneNumber),
      function(headers){
        return (headers['x-idt-beyond-app-id'] === expectedHeaders['x-idt-beyond-app-id']) &&
          headers['x-idt-beyond-app-key'] === expectedHeaders['x-idt-beyond-app-key']
      }).respond(deferred);
    IdtBeyond.validateNumber(phoneNumber, countryCode);
    $httpBackend.flush();
  });

  //it('should //v1/iatu/topups when postTopup is called with the correct params.', function(){
  //  var phoneNumber = 'phone-number';
  //  var countryCode = 'country-code';
  //  var params = {
  //    countryCode: 'country-code',
  //    phoneNumber: 'phone-number',
  //    carrierCode: 'carrier-code',
  //    amount: 'amount'
  //  }
  //  var clientRegex = new RegExp('appId-\\d+');
  //  $httpBackend.expectPOST('/v1/iatu/topups',jasmine.objectContaining(
  //    'country_code': params.countryCode,
  //    'carrier_code': params.carrierCode,
  //    'mobile_number': params.phoneNumber,
  //    'plan':'Sandbox',
  //    'amount': params.amount,
  //    'terminal_id': 'termId'
  //  ),
  //    function(headers){
  //      return (headers['x-idt-beyond-app-id'] === expectedHeaders['x-idt-beyond-app-id']) &&
  //        headers['x-idt-beyond-app-key'] === expectedHeaders['x-idt-beyond-app-key']
  //    }).respond(deferred);
  //  IdtBeyond.postTopup(params);
  //  $httpBackend.flush();
  //});

});
