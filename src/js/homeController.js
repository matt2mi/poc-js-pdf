'use strict';

angular.module('angularGruntSeed')

.controller('HomeController', ['$scope','$sce','$http','$window',
    function($scope, $sce, $http, $window) {
        $scope.urlServer = '/buildPDF';
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
        $scope.brief = {
            pc: 'pc1',
            name: 'brief1',
            chaine: 'M6',
            mode: 'SAS',
            indice: [{label: 'standard', value: 1000}, {label: 'standard+', value: 2000}]
        };
        $scope.label = '';

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
        $scope.exportPDFPost = function() {
            var htmlToPost = '';
            for (var i = 0; i < $scope.result.length; i++) {
                htmlToPost += $sce.getTrustedHtml($scope.result[i]);
            }
            $http.post($scope.urlServer, {htmlToRender: htmlToPost})
                .then(function(data) {
                     console.log('success');

                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:attachment/pdf,' + encodeURI(data.data);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'ticket2.pdf';
                    hiddenElement.click();
                }, function(err) {
                     console.log('error : ');
                     console.log(err.data);
                });
        };
        $scope.exportPDFGet = function() {
            $http.get($scope.urlServer)
                .then(function(data) {
                    console.log('success');

                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:attachment/pdf,' + encodeURI(data.data);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'ticket2.pdf';
                    hiddenElement.click();
                }, function(err) {
                    console.log('error : ');
                    console.log(err.data);
                });
        };
    }
]);
