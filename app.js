var app = angular.module('AstronomyApp', []);

app.controller('AstronomyController', function ($scope, $http, $window) {
    $scope.category = '';
    $scope.selectedData = {};
    $scope.stars = [];
    $scope.planets = [];
    $scope.galaxies = [];

    $http.get('data.json').then(function (response) {
        $scope.stars = response.data.stars;
        $scope.planets = response.data.planets;
        $scope.galaxies = response.data.galaxies;
    });

    $scope.loadData = function (category) {
        $scope.category = category;
    };

    $scope.showDetails = function (itemName) {
        $window.open('details.html?name=' + itemName, '_blank');
    };

    $scope.showDetails = function () {
        window.location.href = '/details.html';
    };
    
});
