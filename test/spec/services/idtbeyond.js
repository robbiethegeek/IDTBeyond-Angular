'use strict';

describe('Service: IdtBeyond', function () {

  // load the service's module
  beforeEach(module('idtbeyondAngularDemoApp'));

  // instantiate service
  var IdtBeyond;
  beforeEach(inject(function (_IdtBeyond_) {
    IdtBeyond = _IdtBeyond_;
  }));

  it('should do something', function () {
    expect(!!IdtBeyond).toBe(true);
  });

});
