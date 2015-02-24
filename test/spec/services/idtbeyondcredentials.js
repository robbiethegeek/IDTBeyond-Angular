'use strict';

describe('Service: IdtBeyondCredentials', function () {

  // load the service's module
  beforeEach(module('idtbeyondAngularDemoApp'));

  // instantiate service
  var IdtBeyondCredentials;
  beforeEach(inject(function (_IdtBeyondCredentials_) {
    IdtBeyondCredentials = _IdtBeyondCredentials_;
  }));

  it('should do something', function () {
    expect(!!IdtBeyondCredentials).toBe(true);
  });

});
