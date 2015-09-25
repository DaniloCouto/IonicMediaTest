angular.module('starter')
.factory('AllDeviceMedias',function($cordovaFile,$q){
    var context = this;
    var EXTENXIONS = ['.ogg', '.wav', '.m4a'];
    var FILES = [];
    function getPersistentPath(){
        var deffered = $q.defer();
         window.requestFileSystem(
         LocalFileSystem.PERSISTENT,
         0,
         function(fileSystem){
            deffered.resolve(fileSystem.root);
         },
         function(error){
             deffered.reject();
             console.log('File System Error: ' + error.code);
        })
        return deffered.promise;
    };
    function dealWithEntries(entries, recursive, level){
        var deffered = $q.defer();
        var appFile;
        var extension;
        for (var i = 0; i < entries.length; i++) {
           var promises = [];
           if (entries[i].name === '.'){
               continue;
           }
           (function(index){
                   extension = entries[index].name.substr(entries[index].name.lastIndexOf('.'));
                   if (entries[index].isDirectory === true && recursive === true){
                       readEntities(entries[index], recursive, level + 1).then(function(success){
                           deffered.resolve(success);
                       },function(){
                           deffered.reject()
                       })
                   }else if(entries[index].isFile === true && EXTENXIONS.indexOf(extension) >= 0){
                       FILES.push({name: entries[index].name, fullPath: entries[index].fullPath})
                       deffered.resolve(FILES);
                       console.log('File saved: ' , entries[index].fullPath);
                   }
           })(i);
        }
        return deffered.promise;
    }
    function readEntities(directoryEntry, recursive, level){
        var deffered = $q.defer();
        if (level === undefined){
            level = 0;
        }
        if(!directoryEntry.isDirectory){
           console.log('The provided path is not a directory');
           deffered.reject();
           return;
        }
        directoryEntry.createReader().readEntries(
           function(entries) {
              dealWithEntries(entries, recursive, level).then(function(success){
                  console.log("Read Entities after resolve:",success,directoryEntry);
                  deffered.resolve(success);
              },function(error){
                  console.error("Reject");
                  deffered.reject();
              })
           },
           function(error) {
               deffered.reject();
               console.log('Unable to read the directory. Errore: ', error.code);
           }
        );
        return deffered.promise;
    }
    function getterMedias(entries, recursive){
        var deffered = $q.defer();
        readEntities(entries, recursive).then(function(success){
            console.log('Getter');
            deffered.resolve(success);
        },function(error){
            deffered.reject(error);
        })
        return deffered.promise;
    }
    context.searchMidias = function(){
        var deffered = $q.defer();
        FILES = [];
        getPersistentPath().then(function(root){
            getterMedias(root,true).then(function(success){
                console.log('Search');
                deffered.resolve(success);
            },function(error){
                deffered.reject();
            })
        },function(error){
            deffered.reject();
        })
        return deffered.promise;
    }
    context.getFiles = function(){
        return FILES;
    }
    return context;
})
