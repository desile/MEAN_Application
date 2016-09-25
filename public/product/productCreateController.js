meanapp.controller('productCreateController', function ($http, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.product = {
        name: ''
    };
    $http.defaults.withCredentials = true;

    $ctrl.ok = function () {
        $http.put(url + "/products", {name:$ctrl.product.name}).then(
            function(res) {
                $uibModalInstance.close();
            });
    };

    $ctrl.closeError = function () {
        $('#loginError').hide();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});