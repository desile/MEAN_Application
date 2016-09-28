meanapp.controller('advertCreateController', function ($http, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.advert = {};

    $http.defaults.withCredentials = true;

    $ctrl.ok = function () {
        $http.put(url + "/adverts", $ctrl.advert).then(
            function(res) {
                if(res.data.err) {
                    console.log(res.data);
                    $ctrl.data = res.data;
                    $('#createAdvertError').show();
                }else {
                    $uibModalInstance.close();
                }
            });
    };

    $ctrl.closeError = function () {
        $('#loginError').hide();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});