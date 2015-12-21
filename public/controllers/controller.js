"use strict";

var myApp = angular.module('myApp', []);
myApp.controller('todoCtrl', ['$scope', '$http', function($scope, $http) {
	var notePerPage = 5; //Set the note quantity for each page
	var curPage = 0;	//Set the current page index

	//Find the notes according to the current page index
	var findPage = function() {
		$scope.todos = $scope.allTodos.slice(curPage*notePerPage, (curPage+1)*notePerPage);
	};

	//Find the notes list for pre page
	$scope.prePage = function() {
		curPage -= 1;
		if (curPage < 0) {
			curPage = 0;
		}
		findPage();
	};

	//Find the notes list for next page
	$scope.nextPage = function() {
		curPage += 1;
		if (curPage > Math.floor($scope.todos.length/notePerPage+1)) {
			curPage = Math.floor($scope.todos.length/notePerPage+1);
		}
		findPage();
	};

	//set the Date variables
	var d = new Date();
	var month_name = ['January','February', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'Octorber', 'Novmenber', 'December'];
	var month = month_name[d.getMonth()];
	var year = d.getFullYear();
	var first_date = month+" "+1+" "+year;
	var tmp = new Date(first_date).toDateString();
	var first_day = tmp.substring(0, 3);
	var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var day_no = day_name.indexOf(first_day);
	var days = new Date(year, d.getMonth()+1, 0).getDate();

	var getCalenderDays = function(date) {
		var first_date = date.month+" "+1+" "+date.year;
		var tmp = new Date(first_date).toDateString();
		var first_day = tmp.substring(0, 3);
		var day_no = day_name.indexOf(first_day);
		var days = new Date(year, d.getMonth()+1, 0).getDate();

		return {day_no: day_no, days: days};
	}

	var refreshCalendar = function() {

		if ($scope.month==undefined && $scope.day==undefined && $scope.year==undefined) {
			//set the Date variables
			var d = new Date();
			var month_name = ['January','February', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'Octorber', 'Novmenber', 'December'];
			var month = month_name[d.getMonth()];

			var year = d.getFullYear();
			var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

			var getDays = getCalenderDays({month: month, year: year});
			var day_no = getDays.day_no;
			var days = getDays.days;

			$scope.month = month;
			$scope.day = d.getDate();
			$scope.year = year;
		} else {
			var getDays = getCalenderDays({month: $scope.month, year: $scope.year});
			var day_no = getDays.day_no;
			var days = getDays.days;
		}

		var calendar = get_calendar(day_no,days);
		document.getElementById('calendar-month-year').innerHTML = month+" "+year;
		var thisNode = document.getElementById('calendar-dates');
		while (thisNode.firstChild) {
			thisNode.removeChild(thisNode.firstChild);
		}
		document.getElementById('calendar-dates').appendChild(calendar);
	}

	//Refresh the note list by researching the database
	var refresh = function(){
		$http.post('/tododay', {year: year, month: month}).success(function(response) {
			$scope.allTodos = response;
			findPage();
		});

		$http.post('/tododate',{year: year, month: month}).success(function(response) {
			$scope.tododate = response;
			console.log(response);
			refreshCalendar();
		});
	};

	refresh();

	//Add a new todo to the database
	$scope.addTodo = function() {
		var todo = {'date': d.getDate(), 'month': month, 'year': year , 'title': 'todo title', 'class': "normal", 'todo': 'This is a new todo', 'complete': false, 'alarm': false};
		$http.post('/tododay', todo).success(function(response) {
			refresh();
		});
	};

	//Delete the todo from database
	$scope.deleteTodo = function(todo) {
		$http.delete('/tododay/'+todo._id).success(function(response) {
			refresh();
		});
	};

	//Update the todo data in the database
	$scope.saveTodo = function(todo) {
		// console.log(todo);
		$http.put('/tododay/'+todo._id, todo).success(function(response) {
			refresh()	
		});
	};

	//Update the todo details according to the details page's information
	$scope.update = function() {
		var todo = {'_id': $scope.thisId, 'title': 'toto title', 'class': "normal", 'todo': 'This is a new todo', 'complete': false, 'alarm': false};
		todo.title = $(".leftPage #noteTitle").val();
		todo.todo = $(".leftPage #noteTodo").val();
		switch($(".leftPage #noteClass").get(0).selectedIndex) {
			case 0:
				todo.class = "emergency";
				break;
			case 1:
				todo.class = "normal";
				break;
			case 2:
				todo.class = "not important";
				break;
		}
		todo.complete = $(".leftPage #noteComplete").prop("checked");
		todo.alarm = $(".leftPage #noteAlarm").prop("checked");
		$scope.saveTodo(todo);
	}

	//Start editing the note details
	$scope.edit = function(todo) {
		console.log(todo);
		//Bind the select note details to note details' page
		$(".leftPage #noteTitle").val(todo.title);
		$(".leftPage #noteTodo").val(todo.todo);
		var temp = $(".leftPage #noteClass");
		switch(todo.class) {
			case "emergency":
				temp.get(0).selectedIndex = 0;
				break;
			case "normal":
				temp.get(0).selectedIndex = 1;
				break;
			case "not important":
				temp.get(0).selectedIndex = 2;
				break;
		}
		if (todo.complete) {
			$(".leftPage #noteComplete").checked = true;
		} else {
			$(".leftPage #noteComplete").checked = false;
		}
		if (todo.alarm) {
			$(".leftPage #noteAlarm").checked = true;
		} else {
			$(".leftPage #noteAlarm").checked = false;
		}

		$scope.thisId = todo._id;
		var calendarSectionWidth = $(".leftPage .calendarSection").width();
		//Change the left page for the note details
		var styles1 = {
			transform: "translateX(110%)"
		};
		var styles2 = {
			transform: "translateX(0%)"
		};

		$(".leftPage .noteDetails").css(styles2);
		$(".leftPage .calendarSection").css(styles1);
	}
	
	//Change the left page to the calendar page
	$scope.back = function() {
		var styles1 = {
			transform: "translateX(0%)"
		};
		var styles2 = {
			transform: "translateX(-110%)"
		};
		$(".leftPage .noteDetails").css(styles2);
		$(".leftPage .calendarSection").css(styles1);
	}

	//Change the calendar width with the note details page
	// $scope.noteDetailsWidth = $(".leftPage .noteDetails").width();
	// $scope.$watch($scope.noteDetailsWidth,function(){
	// 	$(".leftPage .calendarSection").width($scope.noteDetailsWidth);
	// });


	//Build the calendar
	function get_calendar(day_no, days) {
		var table = document.createElement('table');
		var tr = document.createElement('tr');

		for (var i=0; i<=6; i+=1) {
			var td = document.createElement('td');
			td.innerHTML = "SMTWTFS"[i];
			tr.appendChild(td);
		}
		table.appendChild(tr);

		//create 2nd row
		tr = document.createElement('tr');
		for (var c=0; c<=6; c+=1) {
			if (c == day_no) {
				break;
			}
			var td = document.createElement('td');
			td.innerHTML = "";
			tr.appendChild(td);
		}

		var count = 1;
		for (var c= 0; c<=6-day_no; c+=1) {
			var td = document.createElement('td');
			td.innerHTML = count;
			count+=1;
			tr.appendChild(td);
		}
		table.appendChild(tr);

		//rest of the date rows
		for (var r=3; r<=6; r+=1) {
			tr = document.createElement('tr');
			for (var c=0; c<=6; c+=1) {
				if (count > days) {
					table.appendChild(tr);
					count = "";
				}
				var td = document.createElement('td');
				td.innerHTML= count;
				if (count!=="") {
					count+=1;
				}
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		return table;
	}
}]);

// document.querySelectorAll("#calendar-dates td")
$("#calendar-dates").on("click", function(e) {
	var dateNo = e.target.outerText;
	if (parseInt(dateNo)) {
		$("#Day").text(dateNo);
	}
	// console.log(e.target.outerText);
});

//Change the date color
$("#oneDateMark").on("click", function(e) {
	// console.log(e.target.id);
	var color = e.target.id;
	switch(color) {
		case "blue":
			color = "#00b5d1";
			break;
		case "yellow":
			color = "#EBF056";
			break;
		case "green": 
			color = "#99E8A8";
			break;
	}
	var styles1 = {
		"border-color": color
	};
	var styles2 = {
		"background-color": color
	}
	var styles3 = {
		"border-color": color,
		"border-width": "1px",
		"border-radius": "50%",
		"border-style": "solid"
	}
	$("#oneDate").css(styles1);
	$("#oneDateUpside").css(styles2);
	// console.log($("#Day").text());
	// console.log($("#calendar-dates").find("td").find(":contains("+$("#Day").text()+")"));
	var matchText = $("#Day").text();
	$("#calendar-dates").find("td").filter(function() {
		if ($(this).text()==matchText) {
			$(this).css(styles3);
		}
	});

	$http.put('/tododay/'+{month: $scope.month, year: $scope.year}).success(function(response) {
		refreshCalendar();
	});

	$http.put('/tododate/'+{month: $scope.month, year: $scope.year}).success(function(response) {
		refreshCalendar();
	});
});

//Set the news sliders
$('.variable-width').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: true,
  variableWidth: true,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false
});