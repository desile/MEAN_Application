/**
 * Created by DeSile on 9/24/2016.
 */
meanapp.controller('advertDetailsController', function ($http, $uibModalInstance, advert, loggedAs) {
    var $ctrl = this;
    $ctrl.advert = advert;
    $ctrl.loggedAs = loggedAs;
    $ctrl.imgPath = url + "/adverts/img?id=" + advert._id;

    $ctrl.delete = function () {
        $http({
                method: 'DELETE',
                url: url + '/adverts',
                data:  {id: advert._id, createdBy: advert.createdBy},
                headers: {'Content-Type': 'application/json;charset=utf-8'}
        }).then(
            function(res) {
                $uibModalInstance.close('delete');
            });
    };

    $ctrl.canDelete = function () {
        return app.loggedAs.login == app.advert.createdBy || loggedAs.role == 'admin';
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