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
            loadProducts();
        })
    };

    app.logout = function () {
        $http.get(url + "/logout").success(function(){
            app.loggedAs = {};
        })
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

    app.productInfo = function (product){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'product/productInfoModal.html',
            controller: 'productInfoController',
            controllerAs: 'app',
            resolve: {
                product: function () {
                    return product;
                },
                loggedAs: function () {
                    return app.loggedAs;
                }
            }
        });

        modalInstance.result.then(function (action) {
            if(action == 'delete') {
                loadProducts();
            }
        });
    };

    app.createProduct = function (){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'product/productCreateModal.html',
            controller: 'productCreateController',
            controllerAs: 'app'
        });

        modalInstance.result.then(function () {
            loadProducts();
        });
    };


    function loadProducts() {
        $http.get(url + "/products").success(function (products) {
            app.products = products;
        })
    }

    function getSession(){
        $http.get(url).success(function (session) {
            app.loggedAs = session;
        })
    }

    getSession();
    loadProducts();
}]);