angular.module('starter')
.controller('MainScreenCtrl',function($scope,AllDeviceMedias,$ionicPlatform,$cordovaMedia,$timeout){
    $scope.items = [];
    var actualMusic = null;
    var playing = false;
    function disableAllPauseSounds(){
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].playing = false;
        }
    }
    $scope.playSound = function(item){
            if(item.playing == true){
                actualMusic.stop();
                actualMusic = null;
            }
            playing = true;
            actualMusic = $cordovaMedia.newMedia(item.fullPath);
            actualMusic.play();
    }
    $scope.pauseSound = function(item){
            playing = false;
            if(actualMusic != null){
                actualMusic.stop();
                actualMusic = null;
            }
    }

    $ionicPlatform.ready(function(){
        if(window.cordova){
            AllDeviceMedias.searchMidias().then(function(success){
                $scope.items = success;
            },function(error){
                console.log('Callback Returns:',error)
                console.log('Device Files on getFiles:',AllDeviceMedias.getFiles());
            });
        }else{
                $scope.items = [
                    {name: "Coisas",fullPath:"/media"},
                    {name: "Coisas1",fullPath:"/media"},
                    {name: "Coisas2",fullPath:"/media"},
                ];
        }

    });

})
