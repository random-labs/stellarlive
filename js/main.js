var app = angular.module("stellarFire", ["firebase","nvd3ChartDirectives"]);

app.controller("MainCtrl", function($scope, $firebase, $interval) {
  var ref = new Firebase("https://stellarlive.firebaseio.com/");
  var sync = $firebase(ref);
  // create a synchronized array for use in our HTML code
  var transactions = sync.$asArray();


  $interval(function() {

    transactions.$loaded().then(function() {
      $scope.transactions = transactions.slice(-10);
      $scope.plotData = [
                          {
                            "key":"Series 1",
                             "values":[]
                          },
                          {
                            "key":"Series 2",
                             "values":[]
                          }

                         ]

       for (var i = 0; i < transactions.length; i++) {
         var transaction = [ transactions[i].timestamp ,transactions[i].transactionAmount/1000000]
         var fee = [ transactions[i].timestamp ,transactions[i].transactionFee]
        //  {
        //                     "x":transactions[i].transactionAmount/1000000,
        //                     "y":transactions[i].transactionFee,
        //                     "size":1
        //                   }
          if($scope.plotData[0].values.length >=10){
              $scope.plotData[0].values.push(transaction);
              $scope.plotData[0].values = $scope.plotData[0].values.slice(-10);
          }else{
            $scope.plotData[0].values.push(transaction);
            // $scope.plotData[1].values.push(fee);
          }
       }
    });

  }, 100/10);



});
