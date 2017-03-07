(function () {
    'use strict';

    var MyApp = angular.module('myApp', []);
    MyApp.factory('CityService', ['$http', function ($http) {

        var urlBase = 'http://localhost:50869/api';
        var CityService = {};
        CityService.getCities = function () {
            return $http.get(urlBase + '/Cities');
        };

        return CityService;
    }]);
    MyApp.controller('UpdateController', function ($scope, CityService) {

        getCities();

        function getCities() {
            CityService.getCities()
                .then(function (cities) {
                    $scope.cities = cities.data;

                },
                function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                });
        }
    });
})();