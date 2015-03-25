angular.module('starter.controllers', ['starter.services'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.withCredentials = true;
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
   var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, Contact) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
// Simple POST request example (passing data) :
$http({
  method: 'POST',
  url: 'http://localhost:8080/bm/bmapp/LogonBMApp.do',
  data: {"dto(login)":$scope.loginData.username, "dto(companyLogin)":$scope.loginData.company, "dto(password)":$scope.loginData.password, "dto(language)":"en","dto(rememberInfo)":true}
}).success(function(data, status, headers, config) {
  //console.log('Login ok', data);
  $scope.closeLogin();
}).
error(function(data, status, headers, config) {
 console.log('Login Error', data);
});

};
})


.controller('ContactsCtrl', function($scope, Contact,$timeout) {
  $scope.page = 1;
  $scope.contacts = Contact.query({'pageParam(pageNumber)':$scope.page});
  
  $scope.doRefresh = function() {
    $scope.page = 1;
    $scope.contacts = Contact.query({'pageParam(pageNumber)':$scope.page});

    $scope.contacts.$promise.then(function (results){
      $scope.contacts = results;
      $scope.$broadcast('scroll.refreshComplete');  
    });
  };

  
  $scope.loadMore = function() {
    console.log('Loading more!');
    $scope.page = $scope.page + 1;
    $scope.newContacts = Contact.query({'pageParam(pageNumber)':$scope.page});
    $scope.newContacts.$promise.then(function(results){
      $scope.contacts = $scope.contacts.concat(results);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });

    
    
  }


})

.controller('ContactCtrl', function($scope, $stateParams, Contact) {
  $scope.contact = Contact.get({contactId: $stateParams.contactId, "dto(addressId)": $stateParams.addressId, "dto(contactPersonId)": $stateParams.contactPersonId, "dto(addressType)": $stateParams.addressType});
}
);
