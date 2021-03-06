/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * ArangoDB service
 *
 * Manages all data retrieval from the
 * ArangoDB database instance.
 */
dssApp.service('ArangoDBService', ['$http', '$q', function($http, $q){

    //Set Authorization header
    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('root:CATech2014!');

    this.ARANGODB_BASE_URL = 'http://dss.tools.modaclouds.eu/';
    this.XSD_SERVICE_BASE_URL = 'http://dss.tools.modaclouds.eu:443/';

    //Closures
    var self = this;

    //FOXX API endpoints
    this.FOXX_API = {
        getUrl: function (url) {
            return self.ARANGODB_BASE_URL + 'crud/nodes/' + url
        },
        postUrl: function () {
            return self.ARANGODB_BASE_URL + 'crud/nodes';
        },
        getBSOIA: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/bsoia'
        },
        getTOIA: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/toia'
        },
        getRisks: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/risk';
        },
        getTreatments: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/treatment';
        },
        getPotentialRisks: function(selectedBsoias, selectedToias){
            //Build correct URL from selectedBsoias/Toias lists
            var firstBsoia = firstToia = true;
            var url = self.ARANGODB_BASE_URL + 'graph/potentialRisks?';
            _.each(selectedBsoias, function(bsoia){
               if(firstBsoia){
                   firstBsoia = false;
                   url += 'bsoias=' + bsoia.name;
               } else {
                   url += ',' + bsoia.name;
               }
            });
            _.each(selectedToias, function(toia){
               if(firstToia){
                   firstToia = false;
                   url += '&toias=' + toia.asset.name;
               } else {
                   url += ',' + toia.asset.name;
               }
            });
            return url;
        },
        getPotentialTreatments: function(selectedRisks){
            var firstRisk = true;
            var url = self.ARANGODB_BASE_URL + 'graph/potentialTreatments?';
            _.each(selectedRisks, function(risk){
                if(firstRisk){
                    firstRisk = false;
                    url += 'risks=' + risk;
                } else {
                    url += ',' + risk
                }
            });
            return url;
        },
        getRisksTreatmentsMapping: function(){
            return self.ARANGODB_BASE_URL + 'graph/risksTreatmentsMapping';
        },
        getTOIARisksMapping: function(){
            return self.ARANGODB_BASE_URL + 'graph/toiaRisksMapping';
        },
        getTreatmentsConnectionsPerCloudAndServiceTypes: function(cloudType, serviceType){
            return self.ARANGODB_BASE_URL + 'graph/treatmentsConnectionsPerCloudAndServiceTypes?cloudType=' + cloudType + '&serviceType=' + serviceType;
        },
        getProposalsByCloudAndServiceTypes: function(cloudType, serviceType){
            return self.ARANGODB_BASE_URL + 'graph/lookupServices?queryType=1&cloudType=' + cloudType + '&serviceType=' + serviceType;
        },
        validateDocument: function(){
            return self.XSD_SERVICE_BASE_URL + 'validateDSSXML';
        }
    };

    /**
     * Retrieves BSOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getBSOIA = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getBSOIA()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves TOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTOIA = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getTOIA(), headers: {}})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves risks from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getRisks = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getRisks()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves treatments from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTreatments = function(callback) {
        $http({method: 'GET', url: self.FOXX_API.getTreatments()})
            .success(function (data, status, headers, config) {
                callback(null, data);
            })
            .error(function (data, status, headers, config) {
                callback(data, null);
            });
    };

    /**
     * Retrieves potential risks by looking up
     * risks connected to BSOIA or TOIA assets.
     * @param bsoia List of BSOIA assets.
     * @param toia List of TOIA assets.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getPotentialRisks = function(bsoia, toia, callback) {
        $http({method: 'GET', url: self.FOXX_API.getPotentialRisks(bsoia, toia)})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function (data, status, headers, config){
               callback(data, null);
            });
    };

    /**
     * Retrieves potential treatments connected to
     * a list of risks.
     * @param risks List of risks.
     * @param callback Callback fn to execute.
     * on data retrieval.
     */
    this.getPotentialTreatments = function(risks, callback){
        $http({method: 'GET', url: self.FOXX_API.getPotentialTreatments(risks)})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves risks-treatments mapping.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getRisksTreatmentsMapping = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getRisksTreatmentsMapping()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves toia-risks mapping.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getTOIARisksMapping = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getTOIARisksMapping()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves treatments connected to services of a certain cloud and service type.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getTreatmentsConnectionsPerCloudAndServiceTypes = function(cloudType, serviceType, callback){
        $http({method: 'GET', url: self.FOXX_API.getTreatmentsConnectionsPerCloudAndServiceTypes(cloudType, serviceType)})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Get all the data from the given url API endpoint
     * @param {string} urlEndPoint - valid url end point
     * @returns {promise}
     */
    this.getAll = function (urlEndPoint, callback) {
        $http.get(self.FOXX_API.getUrl(urlEndPoint)).success(function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err, null);
        });
    };

    /**
     * Get a list of cloud service possibilities given a cloud and service types.
     * @param {string} cloudType The cloud type we are interested in (IaaS,PaaS,SaaS).
     * @param {string} serviceType The service type we are interested in.
     * @returns Service proposal array matching requested criteria.
     */
    this.getProposalsByCloudAndServiceTypes = function(cloudType, serviceType, callback){
        $http.get(self.FOXX_API.getProposalsByCloudAndServiceTypes(cloudType, serviceType))
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Save new object
     * @param {string} urlEndPoint - valid url end point
     * @param {object} data - data to be saved
     * @returns {promise}
     */
    this.save = function (urlEndPoint, data) {
        var deffered = $q.defer();
        $http.post(self.FOXX_API.postUrl(), data).success(function (data) {
            deffered.resolve(data);
        }).error(function (err) {
            deffered.reject(err);
        });

        return deffered.promise;
    };

    /**
     * Update existing object
     * @param {string} urlEndPoint - valid url end point - need to contain the key
     * @param {object} data - data to be saved
     * @returns {promise}
     */
    this.update = function (urlEndPoint, data) {
        var deffered = $q.defer();
        $http.put(self.FOXX_API.getUrl(urlEndPoint), data).success(function (data) {
            deffered.resolve(data);
        }).error(function (err) {
            deffered.reject(err);
        });

        return deffered.promise;
    };

    /**
     * Validates a cloud descriptor XML file using server-side validation
     * @param xmlString XML string to validate.
     * @param callback Callback fn to execute.
     */
    this.validateSchema = function(xmlString, callback){
        $http({method: 'POST', url: self.FOXX_API.validateDocument(), data: {xmlString: xmlString}})
            .success(function (data) {
                callback(null, data);
            })
            .error(function (err) {
                callback(err, null);
            });
    };

}]);
