/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$rootScope', '$scope', 'AssetsService', 'CloudService', 'localStorageService', function($rootScope, $scope, AssetsService, CloudService, localStorageService){

    //Initialization
    $scope.taAssets = AssetsService.getTA();                            // The list of TA assets read from the cloud services descriptor xml file
    localStorageService.bind($scope, 'taAssets', $scope.taAssets);      // Bind the taAssets to localStorage

    $scope.isMulticloudDeployment = AssetsService.getDeploymentType();
    localStorageService.bind($scope, 'isMulticloudDeployment', $scope.isMulticloudDeployment);

    $scope.criticityBoundModels = AssetsService.getCriticityBoundModels();
    localStorageService.bind($scope, 'criticityBoundModels', $scope.criticityBoundModels);

    // Kind of a hack: this is necessary when loading TA assets from local storage,
    // since the reference seems to be lost when setting the new TA assets in the service
    // variable.
    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTA){
        $scope.taAssets = newTA;
        console.log('ola ke ase');
    }, true);


    /**
     * Removes a TA asset from the list of assets selected
     * by the user, by calling the Assets service.
     * @param taAsset The TA asset to be removed.
     */
    $scope.removeTaAsset = function(taAsset){
        AssetsService.removeTA(taAsset);
    };

    /**
     * When a TA acceptability slider has moved, we have to recompute
     * related risks unacceptability.
     */
    $scope.$on('sliderValueChanged', function($event, element){
        console.log(element);
        console.log($scope.criticityBoundModels);
        $rootScope.$broadcast('acceptabilityValueChanged');
    });

}]);