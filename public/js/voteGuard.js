var app = angular.module('myApp',['ngRoute', 'ui.bootstrap', 'ngMaterial', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',  function($routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/',{
        templateUrl: '../views/ballot.html',
        controller: 'Ctrl',
        reloadOnSearch: false
    })
    .when('/view',{
        templateUrl: '../views/vote.html',
        controller: 'Ctrl',
        reloadOnSearch: false
    })
    .otherwise({
        redirectTo: "/"
    })

}]);

app.run(function($rootScope, $location, $window, $route){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		console.log("routeChangeStart fired.");
        if($window.sessionStorage.getItem('ballot') === null) {
            console.log("ballot not found.");
            if(next.templateUrl !== "../views/vote.html" ) {
                console.log("redirect to button page.");
                $location.replace();
                $location.url( "/" );
            }
        }
    });

    $rootScope.$on('$routeUpdate', function(event, next){
        console.log("routeUpdate fired");
        $route.reload();
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

});

app.directive('arrowNavigation', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.outletDropdownShow){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_' + $rootScope.outletArr.length).focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('row_' + $rootScope.outletArr.length).focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        console.log(document.activeElement.id);
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index++;
                            if(index > $rootScope.outletArr.length){
                                document.getElementById('row_0').focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            });
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}]);

app.directive('profileArrowNav', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.showNavDropdown){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_2').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('navLink_2').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index++;
                            if(index > 2){
                                document.getElementById('navLink_0').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            });
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}]);

app.factory('commonDataFactory', function(){
    let commonDataFactory = {};
    console.log("inside commonDataFactory.");
    // Object containing all the stored data. To be emptied upon logout or tab close.
    commonDataFactory.storedDataObj = {};

    commonDataFactory.declareVariablesFunc = function(){
        console.log("Variable declaration function called inside commonDataFactory.");

        commonDataFactory.storedDataObj.ballot = [];

    };

    commonDataFactory.declareVariablesFunc();

    return commonDataFactory;
});

app.factory('apiCall', function($http, $window, $location, commonDataFactory, alertsAndDialogs){

    let apiCall = {};

    apiCall.ballot = function(ballotApiCallback){
        console.log("inside login API call.");
        return $http.post('/ballot')
        .then(function(response){
            console.log("success response.data : %j ",response);
            if(response.data.success === -1){
                alertsAndDialogs.alert('#alertContainer', 'Error', 'Error getting ballot', 'OK');
            }

            ballotApiCallback(response);

        })
        .catch(function(error){
            console.log("FAILED!!!");
            console.log("fail response.data : %j ",error);
            alertsAndDialogs.alert('#alertContainer', 'Error', 'Some error occurred, please try again', 'OK');
            ballotApiCallback(error);
        })
    };


    return apiCall;
});

app.factory('alertsAndDialogs', function($mdDialog, $route){

let alertsAndDialogs = {};

    alertsAndDialogs.alert = function(parentContainer, title, text, btn){
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector(parentContainer)))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(text)
                .ariaLabel('Alert Dialog')
                .ok(btn)
                .targetEvent()
        );
        $route.reload();
        //$mdSidenav('rightOffer').open();
    };

return alertsAndDialogs;

});

app.factory('commonFunctions', function(){

    let commonFunctions = {};

    commonFunctions.isEqual = function(val1, val2){
        let type = Object.prototype.toString.call(val1);
        if(type !== Object.prototype.toString.call(val2)){
            return false;
        }
        let val1length = type === '[object Array]' ? val1.length : Object.keys(val1).length;
        let val2length = type === '[object Array]' ? val2.length : Object.keys(val2).length;
        if(val1length !== val2length){
            return false;
        }

        let compare = function(item1, item2){
            let itemType = Object.prototype.toString.call(item1);
            if(['[object Array]', '[object Object]'].indexOf(itemType) > -1){
                if(!commonFunctions.isEqual(item1, item2)){
                    return false;
                }
            }
            else{
                if(item1 !== item2){
                    return false;
                }
            }
        };

        if(type === '[object Array]'){
            for(let i = 0; i < val1.length; i++){
                if(compare(val1[i], val2[i]) === false){
                    return false;
                }
            }
        }
        else{
            for(let key in val1){
                if(val1.hasOwnProperty(key)){
                    if(compare(val1[key], val2[key]) === false){
                        return false;
                    }
                }
            }
        }
        return true;
    };

    return commonFunctions;

});

app.controller('Ctrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside loginCtrl.");
    $scope.voteVariablesObj = {};
    $scope.ballot = JSON.parse($window.sessionStorage.getItem('ballot'));

    $scope.viewBallot = function(){
        apiCall.ballot(function(response){
            if(response.status !== 200){
                if(response.status === -1){
                    console.log("Not connected to internet.");
                    $scope.voteVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    $timeout(function(){
                    }, 5000)
                }
                else{
                    console.log("Sorry, there was an error. Please try again.");
                    document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                }
            }
            else{
                if(response.data.success === 1){
                    let ballot = JSON.stringify(response.data.ballot)
                    $window.sessionStorage.setItem('ballot', ballot);
                    $location.url('/view');

                }
                else{
                    console.log("Error: " + response.data.message);
                    if(response.data.success === -1){
                        $route.reload();
                    }
                }
            }
        });
    }

}]);
