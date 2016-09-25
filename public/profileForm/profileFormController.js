meanapp.controller('profileFormController', function ($http, $uibModalInstance, user) {
    var $ctrl = this;
    $ctrl.user = user;

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