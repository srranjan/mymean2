(function() {
    
    var app = angular.module('customersApp', ['ngRoute']);
    
    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'CustomersController',
                templateUrl: 'app/views/customers.html'
            })
            .when('/:id', {
                controller: 'DetailsController',
                templateUrl: 'app/views/details.html'
            })
            .otherwise( { redirectTo: '/' } );
    });
    
}());