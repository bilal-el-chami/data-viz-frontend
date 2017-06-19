var quandlTimeSeriesApp = angular.module("quandlTimeSeriesApp", []);

quandlTimeSeriesApp.filter('formatData', function (numberFilter) {
	return function(dataElement) {
		if(isNaN(dataElement)){
			return dataElement;
		}else{
			if(!isDecimal(dataElement)){
				return numberFilter(dataElement);
			}else{
				return numberFilter(dataElement, 3);
			}
		}
	};
});

function isDecimal(number){
	return Math.floor(number) !== number;
}

quandlTimeSeriesApp.controller("quandlCtrl", function($scope, $http){
	
	$scope.collapseOptions = ["none", "daily", "weekly", "monthly", "quarterly", "annual"];

	$scope.transformationOptions = ["none", "diff", "rdiff", "rdiff_from", "cumul", "normalize"];

	$scope.orderOptions = ["asc", "desc"];
	
	var domain = 'https://data-viz-v1.herokuapp.com';

	var url = domain + "/dummyRequest";
	var apiKey = "DKczFdjuL_16KZVxeZKk";
	$scope.datasetCode = "AAPL";
	$scope.databaseCode = "WIKI";
	var responseFormat = "json";

	$scope.succeded = false;

	$scope.loading = false;

	$scope.startDate = new Date();
	$scope.endDate = new Date();
	//One year before
	$scope.startDate.setFullYear( $scope.endDate.getFullYear() - 1 );

	$scope.order = "asc";
	$scope.collapse = "none";
	$scope.transformation = "none";

	$scope.limit = 0;
	$scope.colIndex = -1;
	
	$scope.formatDate = function(date) {
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
			];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + '-' + (monthIndex+1) + '-' + year;
	}

	$scope.capitalizeFirstLetter = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	$scope.clear = function(){
		$scope.succeded = false;
		$scope.chartContainer = document.getElementById("chartContainer");
		$scope.chartContainer.innerHTML = "";
		if($scope.requestResponse!==undefined){
			if($scope.requestResponse.data!==undefined){
				$scope.requestResponse.data.length=0;
			}
		}
	}

	$scope.search = function (){
		$scope.clear();
		$scope.loading = true;
		var params = "api_key=" + apiKey 
		+ "&dataset_code=" + $scope.datasetCode
		+ "&database_code=" + $scope.databaseCode
		+ "&start_date=" + $scope.formatDate($scope.startDate)
		+ "&end_date=" + $scope.formatDate($scope.endDate) 
		+ "&order=" + $scope.order 
		+ "&collapse=" + $scope.collapse
		+ "&transformation=" + $scope.transformation;

		if($scope.limit>0){
			params = params + "&limit=" + $scope.limit;
		}
		if($scope.colIndex!=-1){
			params = params + "&column_index=" + $scope.colIndex
		}

		$http.get( url + "?" + params )
		.then(function(response){
			$scope.requestResponse = response.data.dataset;
			$scope.stockName = response.data.dataset.name;
//			document.getElementById('request-description').innerHTML = response.data.dataset.description;
			$scope.newestAvailableDate = response.data.dataset.newest_available_date;
			$scope.oldestAvailableDate = response.data.dataset.oldest_available_date;
			$scope.succeded = true;
			$scope.loading = false;

			var labels = [];
			var openValues = [];
			var highValues = [];
			var lowValues = [];
			var closeValues = [];

			for (var i = 0; i < $scope.requestResponse.data.length; i++) {
				labels.push($scope.requestResponse.data[i][0]);
				openValues.push($scope.requestResponse.data[i][1]);
				highValues.push($scope.requestResponse.data[i][2]);
				lowValues.push($scope.requestResponse.data[i][3]);
				closeValues.push($scope.requestResponse.data[i][4]);
			}

			$scope.drawChart(labels, openValues, highValues, lowValues, closeValues);
		});

	}

	$scope.drawChart = function (labels, openValues, highValues, lowValues, closeValues){
		$scope.chartContainer = document.getElementById("chartContainer");

		var ctx = document.createElement("canvas");
		ctx.width = 500;
		ctx.height = 250;
		ctx.id = "myChart";

		$scope.chartContainer.appendChild(ctx);

		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: 'Open Values',
					data: openValues,
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1,
					fill: false
				},{
					label: 'High Values',
					data: highValues,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
					fill: false
				},{
					label: 'Low Values',
					data: lowValues,
					backgroundColor: 'rgba(255, 206, 86, 0.2)',
					borderColor: 'rgba(255, 206, 86, 1)',
					borderWidth: 1,
					fill: false
				},{
					label: 'Close Values',
					data: closeValues,
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
					fill: false
				}]
			},
			options: {
				title:{
					display:true,
					text: $scope.datasetCode + ' Stock Price Variation From "' + $scope.formatDate($scope.startDate) + '" To "' + $scope.formatDate($scope.endDate) + '" - Collapse: ' + $scope.capitalizeFirstLetter($scope.collapse)
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:false
						}
					}]
				}
			}
		});
		myChart.update();
	}
});