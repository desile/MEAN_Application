/**
 * Created by DeSile on 9/24/2016.
 */
meanapp.controller('advertDetailsController', function ($http, $uibModalInstance, advert, loggedAs) {
    var $ctrl = this;
    $ctrl.advert = advert;
    $ctrl.loggedAs = loggedAs;
    $ctrl.imgPath = url + "/adverts/img?id=" + advert._id;
    $ctrl.respond = 0;

    $http.post(url + "/adverts/checkrespond", {id: advert._id}).then(
        function(res){
            $ctrl.respond = res.data.respond;
        }
    );

    $http({
        method: 'GET',
        url: url + "/adverts/responds",
        params: {id: advert._id, createdBy: advert.createdBy}
    }).then(
        function(res){
            if (!res.data.error){
                $ctrl.responds = res.data.responds;
            }
        }
    );

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

    $ctrl.makeRespond = function () {
        $http.post(url + "/adverts/responds", {id: advert._id, respond: $ctrl.respond});
    };

    $ctrl.isUserHasPermissions = function () {
        return $ctrl.isCurrentUserOwner() || loggedAs.role == 'admin';
    };

    $ctrl.isCurrentUserOwner = function () {
        return loggedAs.login == advert.createdBy;
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