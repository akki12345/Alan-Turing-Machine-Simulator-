var Inp = function() {
	this.curstate = '0';
	this.inp = '0';
	this.nextstate = '0';
	this.write = '1';
	this.move = 'R';
};
var TapeItem = function(){
	this.val= '0';
	this.active = '';
};

var Controller = function($scope, $interval){
	$scope.state = 0;
	$scope.demo = '';
	$scope.inputs = [
		new Inp(),
		new Inp(),
		new Inp(),
		new Inp()
	];
	$scope.tapeItems = [];
	for (var i = 0; i < 15; i++)
		$scope.tapeItems.push(new TapeItem());
	$scope.tapeItems[0].active = 'active';
	$scope.pointer = (function(){
		var pos = 0;
		return {
			getPos: function(){return pos;},
			moveTo: function(n){
				$scope.tapeItems[pos].active = '';
				pos = n;
				if(pos < 0) pos = 0;
				else if(pos > $scope.tapeItems.length-1) pos = $scope.tapeItems.length-1;
				$scope.tapeItems[pos].active = 'active';
			},
			move: function(n){this.moveTo(this.getPos()+n);},
			moveLeft: function(){this.move(-1);},
			moveRight: function(){this.move(1);}
		};
	}());
	$scope.go = function(e){
		var inp = $scope.tapeItems[$scope.pointer.getPos()].val;
		var inpi = 0;
		var inps = $scope.inputs;
		while(inpi < inps.length &&
			(parseInt(inps[inpi].curstate) != $scope.state ||
			inps[inpi].inp != $scope.tapeItems[$scope.pointer.getPos()].val))
				inpi++;
		if(inpi >= inps.length) return false;
		if(inps[inpi].inp == $scope.tapeItems[$scope.pointer.getPos()].val){
			$scope.tapeItems[$scope.pointer.getPos()].val = inps[inpi].write;
			$scope.state = inps[inpi].nextstate;
			switch(inps[inpi].move){
				case 'L':
					$scope.pointer.moveLeft();
					break;
				case 'R':
				default:
					$scope.pointer.moveRight();
					break;
			}
		}
	}
	var playing = false;
	var interval;
	$scope.togglePlay = function(e){
		if(playing){
			$interval.cancel(interval);
			interval = undefined;
			playing = false;
			document.querySelector('#play').value = 'Play';
		} else {
			interval = $interval($scope.go, 200);
			playing = true;
			document.querySelector('#play').value = 'Pause';
		}
	}
	$scope.addRule = function(){
		$scope.inputs.push(new Inp());
	}
	$scope.removeRule = function(){
		$scope.inputs.pop();
	}
}
