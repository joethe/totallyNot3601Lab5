'use strict';

angular.module('3601S16Lab5JsonDataProcessingApp.auth', [
  '3601S16Lab5JsonDataProcessingApp.constants',
  '3601S16Lab5JsonDataProcessingApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
