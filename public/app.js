/**
 * Created by DeSile on 9/17/2016.
 */
var meanapp = angular.module("meanapp",['ui.bootstrap']);
var url = "http://localhost:3111";

meanapp.controller("AppCtrl",['$http', '$uibModal', function($http,$uibModal){
    var app = this;

    app.loggedAs = null;
    $http.defaults.withCredentials = true;

    app.saveProduct = function (newProduct) {
        $http.post(url + "/add", {name:newProduct}).success(function(){
            loadAdverts();
        })
    };

    app.logout = function () {
        $http.get(url + "/logout").success(function(){
            app.loggedAs = {};
        })
    };

    app.openProfileForm = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'profileForm/profileFormModal.html',
            controller: 'profileFormController',
            controllerAs: 'app',
            resolve: {
                user: function () {
                    return app.loggedAs;
                }
            }
        });
    };

    app.openLoginForm = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginForm/loginFormModal.html',
            controller: 'loginFormController',
            controllerAs: 'app'
        });

        modalInstance.result.then(function (session) {
            app.loggedAs = session;
        });
    };

    app.openRegisterForm = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'registerForm/registerFormModal.html',
            controller: 'registerFormController',
            controllerAs: 'app'
        });

        modalInstance.result.then(function (session) {
            app.loggedAs = session;
        });
    };

    app.advertDetails = function (advert){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'advert/advertDetailsModal.html',
            controller: 'advertDetailsController',
            controllerAs: 'app',
            resolve: {
                advert: function () {
                    return advert;
                },
                loggedAs: function () {
                    return app.loggedAs;
                }
            }
        });

        modalInstance.result.then(function (action) {
            if(action == 'delete') {
                loadAdverts();
            }
        });
    };

    app.createAdvert = function (){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'advert/advertCreateModal.html',
            controller: 'advertCreateController',
            controllerAs: 'app'
        });

        modalInstance.result.then(function () {
            loadAdverts();
        });
    };


    function loadAdverts() {
        $http.get(url + "/adverts").success(function (adverts) {
            app.adverts = adverts;
        })
    }

    function getSession(){
        $http.get(url).success(function (session) {
            app.loggedAs = session;
        })
    }

    getSession();
    loadAdverts();
}]);