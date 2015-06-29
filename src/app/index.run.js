(function() {
  'use strict';

  angular
    .module('splunktiv8')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
