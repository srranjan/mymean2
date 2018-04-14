(function() {
    var customersFactory = function($http) {
    
        var factory = {};
        
        factory.getCustomers = function() {
            return $http.get('/users');
        };
        
        factory.getCustomer = function(customerId) {
            return $http.get('/users/' + customerId);
        };

        //Need to change the Json data due to slightly different Rest endpoints in this version(mongoDB), in comparison to the different  version (one using Spring provider)
        factory.updateCust = function(data) {

            var data1 = {};

            data1.userid = parseInt(data.userid) ;
            data1.name = data.name ;
            data1.phone = data.phone ;
            data1.address = data.address ;
            data1.potalCd = data.potalCd ;
            data1.balance = data.balance ;


            return $http.put('/users/' + data.userid, data1);
        };

        factory.deleteCust = function(data) {

            var data1 = {};

            data1.userid = parseInt(data.userid) ;
            data1.name = data.name ;
            data1.phone = data.phone ;
            data1.address = data.address ;
            data1.potalCd = data.potalCd ;
            data1.balance = data.balance ;

            return $http.delete('/users/' + data.userid, data1);
        };

        factory.addCust = function(data) {

            var data1 = {};

            data1.userid = parseInt(data.userid) ;
            data1.name = data.name ;
            data1.phone = data.phone ;
            data1.address = data.address ;
            data1.potalCd = data.potalCd ;
            data1.balance = data.balance ;

            return $http.post('/users/', data1); // Did some flip flop between data and data1.
        };

        return factory;
    };
    
    customersFactory.$inject = ['$http'];
        
    angular.module('customersApp').factory('customersFactory', 
                                           customersFactory);
                                           
}());

