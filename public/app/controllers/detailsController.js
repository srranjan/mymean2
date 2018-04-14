(function() {
    
    var DetailsController = function ($scope, $log, $routeParams, $location, customersFactory) {
        var customerId = $routeParams.id;
        $scope.customer = null;
        
        function init() {
             customersFactory.getCustomer(customerId)
                .success(function(customer) {
                    $scope.custDetails = customer;
                })
                .error(function(data, status, headers, config) {
                    //handle error
                    $log.log('init() :: Status: ' + status + ' ::Error: ' + data.error);
                });
        }        

        init();

        $scope.getAllCusts = function(){


            $location.path("app/views/customers.html");

        }


        $scope.updateCust = function(){

            customersFactory.updateCust($scope.custDetails)
                .success(function(customer) {
                    $scope.custDetails = customer;
                })
                .error(function(data, status, headers, config) {
                    //handle error
                    $log.log('updateCust :: Status: ' + status + ' ::Error: ' + data.error);
                });

            $location.path("app/views/customers.html");

        }

        $scope.deleteCust = function(){

            customersFactory.deleteCust($scope.custDetails)
                .success(function(customer) {
                    $scope.custDetails = customer;
                })
                .error(function(data, status, headers, config) {
                    //handle error
                    $log.log('deleteCust :: Status: ' + status + ' ::Error: ' + data.error);
                });

            $location.path("app/views/customers.html");

        }

        $scope.addCust = function(){

            customersFactory.addCust($scope.custDetails)
                .success(function(customer) {
                    $scope.custDetails = customer;
                })
                .error(function(data, status, headers, config) {
                    //handle error
                    $log.log('addCust :: Status: ' + status + ' ::Error: ' + data.error);
                });

            $location.path("app/views/customers.html");

    }};

    DetailsController.$inject = ['$scope', '$log', '$routeParams', '$location', 'customersFactory'];

    angular.module('customersApp')
      .controller('DetailsController', DetailsController);
    
}());


