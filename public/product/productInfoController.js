/**
 * Created by DeSile on 9/24/2016.
 */
meanapp.controller('productInfoController', function ($http, $uibModalInstance, product, loggedAs) {
    var $ctrl = this;
    $ctrl.product = product;
    $ctrl.loggedAs = loggedAs;

    $ctrl.delete = function () {
        $http({
                method: 'DELETE',
                url: url + '/products',
                data:  {name:$ctrl.product.name},
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        }).then(
            function(res) {
                $uibModalInstance.close('delete');
            });
    };

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