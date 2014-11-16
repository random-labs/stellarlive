var app = angular.module("stellarFire", ["nvd3ChartDirectives"]);

app.controller("MainCtrl", function($scope, $interval) {
  //How many data points to keep
  var limit = 15;
  $scope.transactions = [ ];
  //Websocket to stellar
  //TODO: convert to factory
  var ws = new WebSocket("wss://live.stellar.org:9001");

   ws.onopen = function() {
      var msg = {
          command: "subscribe",
          streams: [ "transactions_rt" ]
        }


      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = function(message) {
        msg = JSON.parse(message.data);
        if(msg.engine_result_code === 0 && msg.transaction.TransactionType === "Payment"){
            var transactionData = {
              "transactionAmount": msg.transaction.Amount,
              "transactionFee": msg.transaction.Fee,
              "transactionHash": msg.transaction.hash.substring(0, 6),
              "timestamp": Math.floor(new Date().getTime()/1000)
            };

            $scope.transactions.push(transactionData);
            $scope.transactions = $scope.transactions.slice(-limit);
        }

    };

  $interval(function() {
      $scope.plotData = [
                          {
                            "key":"Series 1",
                            "area": true,
                             "values":[]
                          }
                         ]
       for (var i = 0; i < $scope.transactions.length; i++) {
         var transaction = [ $scope.transactions[i].timestamp ,$scope.transactions[i].transactionAmount/1000000]
          if($scope.plotData[0].values.length >=limit){
              $scope.plotData[0].values.push(transaction);
              $scope.plotData[0].values = $scope.plotData[0].values.slice(-limit);
          }else{
            $scope.plotData[0].values.push(transaction);
          }
       }

  }, 100/10);

});
