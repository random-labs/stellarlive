var app = angular.module("stellarFire", ["firebase","nvd3ChartDirectives"]);

app.controller("MainCtrl", function($scope, $firebase, $interval) {
  var ref = new Firebase("https://stellarlive.firebaseio.com/");
  var sync = $firebase(ref);
  // create a synchronized array for use in our HTML code
  transactions = sync.$asArray();

  $interval(function() {

    transactions.$loaded().then(function() {
      $scope.plotData = [{"key":"Series 1",
                             "values":[]
                         }]

       for (var i = 0; i < transactions.length; i++) {
         var unixtime = new Date().getTime() / 1000
         var transaction = [ unixtime ,transactions[i].transactionAmount/1000000]
        //  {
        //                     "x":transactions[i].transactionAmount/1000000,
        //                     "y":transactions[i].transactionFee,
        //                     "size":1
        //                   }
          // if($scope.plotData[0].values.length >=100){
          //     $scope.plotData[0].values.push(transaction);
          //     $scope.plotData[0].values = $scope.plotData[0].values.slice(-100);
          // }else{
          //   $scope.plotData[0].values.push(transaction);
          // }
       }
    });

  }, 1000);



});
