/**
 * Created by Rajiv Ranjan on 2017-06-20.
 Essentially calling Spring Boot Rest services
 */

module.exports = {
    'remoteUrl' : 'http://localhost:9091/clients/',
      //Value below changed from mymongo to mongdb-persistent val for openshift template requirement
	'mykubermongo' : 'mongodb',       //Comment out if not using Kubernetes, otherwise this will break the code in other environments
    //The above is for Openshift or K8, the below is for local
    //'mykubermongo' : 'localhost',
	//'mykubermongo' : 'mymongo',       //Comment out if not using Kubernetes, Reverting to mymongo
    'other' : ''
}
