meanapp.controller('advertCreateController', function ($http, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.advert = {
        name: ''
    };
    $http.defaults.withCredentials = true;

    $ctrl.ok = function () {
        $http.put(url + "/adverts", {name:$ctrl.advert.name}).then(
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