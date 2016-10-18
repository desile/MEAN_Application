meanapp.controller('loginFormController', function ($http, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.typed = {
        login:'',
        pass:''
    };
    $http.defaults.withCredentials = true;

    $ctrl.ok = function () {
        $http.post(url + "/login", $ctrl.typed).then(
            function(res){
                if('error' in res.data) {
                    $ctrl.error = res.data.error;
                    $('#loginError').show();
                } else {
                    $uibModalInstance.close($ctrl.typed);
                }
            },
            function(errResponse){
                console.log("error");
                console.log(errResponse);
            });
    };

    $ctrl.closeError = function () {
        $('#loginError').hide();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});