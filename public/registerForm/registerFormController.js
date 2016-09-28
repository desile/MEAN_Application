meanapp.controller('registerFormController', function($http, $uibModalInstance){
    var $ctrl = this;
    $ctrl.reg = {};

    $ctrl.ok = function () {
        $http.post(url + "/register", $ctrl.reg).then(
            function(res){
                if('error' in res.data) {
                    $ctrl.error = res.data.error;
                    $('#registerError').show();
                } else {
                    $uibModalInstance.close({login:$ctrl.reg.login});
                }
            },
            function(errResponse){
                console.log("error");
                console.log(errResponse);
            });
    };

    $ctrl.closeError = function() {
        $('#registerError').hide();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});