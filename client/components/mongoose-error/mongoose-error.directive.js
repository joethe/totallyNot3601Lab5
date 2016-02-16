'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('3601S16Lab5JsonDataProcessingApp')
  .directive('mongooseError', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', () => ngModel.$setValidity('mongoose', true));
      }
    };
  });
