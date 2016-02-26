(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./controllers/homeController":2}],2:[function(require,module,exports){
// HomeController

module.exports = function($scope, $sce, $http) {
        $scope.titleModules = [
            {value: '', type: 'h1'},
            {value: '', type: 'h2'},
            {value: '', type: 'h3'},
            {value: '', type: 'h4'},
            {value: '', type: 'h5'}
        ];
        $scope.result = [];
        $scope.nbCols = 0;
        $scope.nbRows = 0;
        $scope.label = '';
        $scope.briefs = [];


        $scope.addModule = function(index) {
            $scope.result.push($sce.trustAsHtml('<' + $scope.titleModules[index].type + '>' + $scope.label + '</' + $scope.titleModules[index].type + '>'));
            $scope.clearInputs();
        };
        $scope.addTabModule = function() {
            var temp = '<table style="margin-top: 10px;">';
            for(var i=0; i<$scope.nbRows; i++) {
                temp += '<tr>';
                for(var j=0; j<$scope.nbCols; j++) {
                    temp += '<td class="all-border">' + $scope.label + '</td>';
                }
                temp += '</tr>';
            }
            temp += '</table>';
            $scope.clearInputs();
            $scope.result.push($sce.trustAsHtml(temp));

        };
        $scope.clearInputs = function() {
            $scope.label = '';
            $scope.nbCols = 0;
            $scope.nbRows = 0;
        };
        $scope.upModule = function(id) {
            /// TODO : underscore / lodash ?
            if(id > 0) {
                var moduleTemp = $scope.result[id];
                $scope.deleteModule(id);
                $scope.result.splice(id - 1, 0, moduleTemp);
            }
        };
        $scope.deleteModule = function(id) {
            $scope.result.splice(id, 1);
        };
        $scope.downModule = function(id) {
            if(id < $scope.result.length - 1) {
                var moduleTemp = $scope.result[id];
                $scope.deleteModule(id);
                $scope.result.splice(id + 1, 0, moduleTemp);
            }
        };


        $scope.getPDF = function() {
            $http.get('/getPDF', {responseType:'arraybuffer'})
                .then(function(data) {
                    console.log('getPDF success');

                    var file = new Blob([data.data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, function(err) {
                    console.log('getPDF error : ');
                    console.log(err);
                });
        };
        $scope.exportPDFPost = function() {
            var htmlToPost = '';
            for (var i = 0; i < $scope.result.length; i++) {
                htmlToPost += $sce.getTrustedHtml($scope.result[i]);
            }
            $http.post('/buildPDF', {htmlToRender: htmlToPost}, {responseType:'arraybuffer'})
                .then(function() {
                    console.log('buildPDF success');
                    $scope.getPDF();
                }, function(err) {
                    console.log('buildPDF error : ');
                    console.log(err);
                });
        };

        $scope.getBrief = function() {
            $http.get('/getBriefs')
                .then(function(data) {
                    console.log('getBriefs success');
                    $scope.briefs = data;
                }, function(err) {
                    console.log('getBriefs error : ');
                    console.log(err);
                });
        };
    };
},{}]},{},[1]);
