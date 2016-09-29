meanapp.controller('advertCreateController', function ($http, $scope, $uibModalInstance, FileUploader) {
    var $ctrl = this;
    var uploader = $scope.uploader = new FileUploader({
        url: url + '/adverts/img',
        alias: 'advImg',
        queueLimit: 1
    });
    $scope.uploader.onBeforeUploadItem = onBeforeUploadItem;
    function onBeforeUploadItem(item) {
        item.formData.push({id: 'data'});
        console.log(item);
    }

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
                    console.log(uploader.queue);
                    console.log(res.data._id);
                    $scope.uploader.onBeforeUploadItem = onBeforeUploadItem;
                    function onBeforeUploadItem(item) {
                        item.formData.push({id: res.data._id});
                        console.log(item);
                    }
                    uploader.uploadAll();
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