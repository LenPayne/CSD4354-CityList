function WKTPointToLatLng(wkt) {
    pattern = /\-?\d+(\.\d+)?\s+\-?\d+(\.\d+)?/;
    values = wkt.match(pattern)[0].split(' ');
    return {
        lat: parseFloat(values[1]),
        lng: parseFloat(values[0])
    };
}

// Allowing global access
var map;
var markers = [];

function initMap() {
    var myLatLng = { lat: 42.975226, lng: -82.347707 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Lambton College'
    });
    markers.push(marker);
}

function clearMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

(function () {
    'use strict';

    var MyApp = angular.module('myApp', ['ngRoute', 'ngAnimate']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'Partials/list.html',
                controller: 'UpdateController'
            }).
            when('/edit/:id', {
                templateUrl: 'Partials/edit.html',
                controller: 'EditController'
            }).
            otherwise('/');
    }]);
    MyApp.factory('CityService', ['$http', function ($http) {

        var urlBase = 'http://localhost:50869/api';
        var CityService = {};
        CityService.getCities = function () {
            return $http.get(urlBase + '/Cities');
        };

        CityService.getCity = function (id) {
            return $http.get(urlBase + '/Cities/' + id);
        }

        CityService.addCity = function (name, country, lat, lng) {
            return $http.post(urlBase + '/Cities',
                {
                    "Name": name,
                    "Country": country,
                    "Location": {
                        "Geography": {
                            "CoordinateSystemId": 4326,
                            "WellKnownText": "POINT (" + lng + " " + lat + ")"
                        }
                    }
                });
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
            clearMap();
            for (var i = 0; i < cities.data.length; i++) {
                if (cities.data[i].WKT != null) {
                    console.log(cities.data[i].WKT);
                    console.log(WKTPointToLatLng(cities.data[i].WKT));
                    markers.push(new google.maps.Marker({
                        position: WKTPointToLatLng(cities.data[i].WKT),
                        map: map,
                        title: cities.data[i].Name
                    }));
                }
            }
        },
        function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
}

        $scope.addCity = function () {
            CityService.addCity($scope.newName, $scope.newCountry, $scope.newLat, $scope.newLng)
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
            if (typeof($scope.id) == undefined || $scope.id == '') $scope.addCity();
            else {
                CityService.editCity($scope.id, $scope.newName, $scope.newCountry)
                .then(getCities,
                function (error) {
                    $scope.status = 'Unable to save city: ' + error.message;
                });
            }
        };
    });
    MyApp.controller('EditController', function ($scope, $routeParams, $location, CityService) {
        console.log()
        CityService.getCity($routeParams.id)
        .then(function (city) {
            $scope.city = city.data;
        },
        function (error) {
            $scope.status = 'Unable to load city: ' + error.message;            
        });

        $scope.saveCity = function () {
            CityService.editCity($scope.city.Id, $scope.city.Name, $scope.city.Country)
            .then($location.path('/'),
            function (error) {
                $scope.status = 'Unable to save city: ' + error.message;
            });
        }
    });    
})();