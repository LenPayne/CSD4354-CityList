(function () {
    'use strict';

    var MyApp = angular.module('myApp', []);
    MyApp.factory('CityService', ['$http', function ($http) {

        var urlBase = 'http://localhost:50869/api';
        var CityService = {};
        CityService.getCities = function () {
            return $http.get(urlBase + '/Cities');
        };

        CityService.addCity = function (name, country) {
            return $http.post(urlBase + '/Cities', { "Name": name, "Country": country });
        };

        CityService.deleteCity = function (id) {
            return $http.delete(urlBase + '/Cities/' + id);
        };

        CityService.editCity = function (id, name, country) {
            return $http.put(urlBase + '/Cities/' + id, { "Id": id, "Name": name, "Country": country });
        }

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

        $scope.addCity = function () {
            CityService.addCity($scope.newName, $scope.newCountry)
            .then(getCities,
            function (error) {
                $scope.status = 'Unable to save city: ' + error.message;
            });
        };

        $scope.deleteCity = function (id) {
            CityService.deleteCity(id)
            .then(getCities,
            function (error) {
                $scope.status = 'Unable to delete city: ' + error.message;
            });
        };

        $scope.editCity = function (city) {
            $scope.newName = city.Name;
            $scope.newCountry = city.Country;
            $scope.id = city.Id;
        };

        $scope.saveCity = function () {
            if (typeof $scope.id == undefined || $scope.id == '') $scope.addCity();
            else {
                CityService.editCity($scope.id, $scope.newName, $scope.newCountry)
                .then(getCities,
                function (error) {
                    $scope.status = 'Unable to save city: ' + error.message;
                });
            }
        };
    });
})();