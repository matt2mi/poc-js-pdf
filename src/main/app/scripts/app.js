//var angular = require('angular');
//var angularRoute = require('angular-route');

angular.module('pocJsPdf', [
    'ngRoute'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })
        .otherwise({ redirectTo: '/' });
}])
.controller('HomeController', require('./controllers/homeController'));