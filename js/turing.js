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
	$scope.$watch('demo',function(ne, old){
		if(ne != old){
			var l = $scope.tapeItems.length;
			for (var i = 0; i < l-1; i++) {
				$scope.tapeItems[i].val = '';
			};
			$scope.tapeItems[l-1].val = '#';
			$scope.inputs = [
				{curstate: '0', inp: '', nextstate: '1', write: '1', move: 'R'},
				{curstate: '0', inp: '0', nextstate: '1', write: '1', move: 'R'},
				{curstate: '0', inp: '1', nextstate: '0', write: '0', move: 'L'},
				{curstate: '0', inp: '#', nextstate: '1', write: '#', move: 'R'},
				{curstate: '1', inp: '0', nextstate: '1', write: '0', move: 'R'},
				{curstate: '1', inp: '1', nextstate: '1', write: '1', move: 'R'},
				{curstate: '1', inp: '#', nextstate: '0', write: '#', move: 'L'},
			];
			$scope.pointer.moveTo(l-1);
		}
	});
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
