describe('quandlCtrl', function() {
	beforeEach(module('quandlTimeSeriesApp'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('Testing formatDate function!', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('quandlCtrl', { $scope: $scope });
		});

		it('should convert a date variable to this format MM-D-YYYY', function() {
			var aDate = new Date(2017,5,8);
			var formattedDateStr = '8-6-2017';
			expect($scope.formatDate(aDate)).toEqual(formattedDateStr);
		});

	});

	describe('Testing capitalizeFirstLetter function!', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('quandlCtrl', { $scope: $scope });
		});

		it('should capitalize the first letter of a String', function() {
			var name = 'john';
			var resultName = 'John';
			expect($scope.capitalizeFirstLetter(name)).toEqual(resultName);
		});

	});

	describe('Testing clear function!', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('quandlCtrl', { $scope: $scope });
		});

		it('should clear the chart container content and reset some variables', function() {
			//Creating the Chart element and adding it to the test page
			$scope.chartContainer = document.createElement("div");
			$scope.chartContainer.id = "chartContainer";
			$scope.chartContainer.innerHTML = '<div style="width: 100%;" id="chartContainer" ng-show="succeded" class=""><iframe class="chartjs-hidden-iframe" tabindex="-1" style="display: block; overflow: hidden; border: 0px; margin: 0px; top: 0px; left: 0px; bottom: 0px; right: 0px; height: 100%; width: 100%; position: absolute; pointer-events: none; z-index: -1;"></iframe><canvas width="1631" height="815" id="myChart" style="display: block; width: 1631px; height: 815px;"></canvas></div>';
			document.body.appendChild($scope.chartContainer);
			//Applying the clear function
			$scope.clear();
			//Testing the result of the function
			expect($scope.succeded).toEqual(false);
			expect($scope.chartContainer.innerHTML).toEqual("s");
			if($scope.requestResponse!==undefined){
				if($scope.requestResponse.data!==undefined){
					expect($scope.requestResponse.data.length).toEqual(0);
				}
			}
		});

	});
	
	
	describe('Testing drawChart function!', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('quandlCtrl', { $scope: $scope });
		});

		it('should create a canvas element in the chart container and add graph', function() {
			
			$scope.datasetCode = 'AAPL';
			$scope.startDate = new Date(2016,5,13);
			$scope.endDate = new Date(2017,5,13);
			$scope.collapse = 'none';
			
			//Creating the Chart element and adding it to the test page
			$scope.chartContainer = document.createElement("div");
			$scope.chartContainer.id = "chartContainer";
			document.body.appendChild($scope.chartContainer);

			var labels = ["2017-05-30", "2017-05-31", "2017-06-01", "2017-06-02", "2017-06-05", "2017-06-06", "2017-06-07", "2017-06-08", "2017-06-09", "2017-06-12"];
			var openValues = [153.42, 153.97, 153.17, 153.58, 154.34, 153.9, 155.02, 155.25, 155.19, 145.74];
			var highValues = [154.43, 154.17, 153.33, 155.45, 154.45, 155.81, 155.98, 155.54, 155.19, 146.09];
			var lowValues = [153.33, 152.38, 152.22, 152.89, 153.46, 153.78, 154.48, 154.4, 146.02, 142.51];
			var closeValues = [153.67, 152.76, 153.18, 155.45, 153.93, 154.45, 155.37, 154.99, 148.98, 145.32];
			
			
			//Applying the drawChart function
			$scope.drawChart(labels, openValues, highValues, lowValues, closeValues);
			
			//Testing the result of the function
			expect($scope.chartContainer.hasChildNodes()).toEqual(true);
			expect($scope.chartContainer.childNodes.length).toEqual(2);
		});

	});

});
