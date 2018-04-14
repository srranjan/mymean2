/**
 * Created by Rajiv Ranjan on 2017-06-20.
 Essentially calling Spring Boot Rest services
 */

module.exports = {
    'remoteUrl' : 'http://localhost:9091/clients/',
	'mykubermongo' : 'mymongo',       //Comment out if not using Kubernetes, otherwise this will break the code in other environments
    'other' : ''
}