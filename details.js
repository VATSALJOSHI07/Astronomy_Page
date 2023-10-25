var app = angular.module('AstronomyApp', []);

app.controller('DetailsController', function ($scope) {
    $scope.selectedItem = {
        name: 'Selected Item Name', // Replace with your selected item's name
        description: 'Description of the selected item', // Replace with your selected item's description
    };

    $scope.goBack = function () {
        // Use JavaScript to navigate back in the browser's history
        window.history.back();
    };
});
