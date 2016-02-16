'use strict';

angular.module('3601S16Lab5JsonDataProcessingApp', [
  '3601S16Lab5JsonDataProcessingApp.auth',
  '3601S16Lab5JsonDataProcessingApp.admin',
  '3601S16Lab5JsonDataProcessingApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
