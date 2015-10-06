var app = angular.module('oCompiler', []);

app.controller('mainCtrl', function($scope){
    $scope.output = "";
    $scope.inputs = [];

    $scope.sendData = function(){
        var input = document.getElementById("txtArea").value
        console.log(input.length);
        for (i = input.length; i > 0; i--){
            $scope.inputs.push(input[i]);
            console.log(input[i]);
            if (input[i] == '>' && input[i-1] == '>' && input[i-2] == '>'){
                console.log($scope.inputs);
                return true;
            }
        }
    }
    $scope.queryData = function(){
        return output = "BLAH";
    }
    $scope.onTestChange = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.sendData();
            $scope.output = '\n' + $scope.output + '\n' + $scope.queryData();
            document.getElementById("txtArea").value =  document.getElementById("txtArea").value + "\n >>>";
            return false;
        }
        else {
            return true;
        }
    }
});

