/**
 * Created by DeSile on 9/24/2016.
 */
meanapp.controller('productInfoController', function ($http, $uibModalInstance, product) {
    var $ctrl = this;
    $ctrl.product = product;

    $ctrl.ok = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.closeError = function () {
        $('#loginError').hide();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});