var module = angular.module('controllers', []);

module.controller('LockscreenCtrl', function ($scope) {

});

module.controller('NotificationCtrl', function ($scope) {

});

module.controller('EventsCtrl', function ($scope, $location, db, _) {
	var events = db.getAll('events');
	$scope.events = _.groupBy(events, function (e) {
		return e.date;
	});

	$scope.selectEvent = function (e) {
		$location.path('/events/' + e.id);
	}

});

module.controller('EventCtrl', function ($scope, $routeParams, $history, db) {
	var date = $routeParams.date;
	var id = $routeParams.id;
    var emptyEvent = { name: '', date: '', time: '', place: '', frequency: 0, notification: 0 };
    var evt = db.getOne('events', id) || emptyEvent;
	$scope.evt = $scope.clone(evt);
    $scope.editing = false;
    $scope.editable = '';
    $scope.fieldType = '';
    $scope.hasNotifcation = false;

    var s = document.getElementById('select-edit');
    if (s) {
        s.selectedIndex = $scope.evt.frequency;
    }

    $scope.add = function (e) {
    	var s = document.getElementById('select-add');
        e.frequency = s.selectedIndex;

        db.add('events', e);
        console.log(e);
        $scope.back();
    };

    $scope.save = function (e) {
    	var s = document.getElementById('select-edit');
    	var evt = {
    		id: e.id,
            name: e.name,
            time: e.time,
            date: e.date,
            place: e.place,
            frequency: s.selectedIndex,
            notification: e.notification
        };

    	db.update('events', evt);
    	$scope.back();
    };

    $scope.delete = function (e) {
    	db.delete('events', e.id);
    	$history.pop(2);
    };

    $scope.editField = function (f, t) {
        $scope.editable = f;
        $scope.fieldType = t;
        $scope.editing = true;
    }

});

module.controller('TasksCtrl', function ($scope, $location, db, settings, _) {
    var tasks = db.getAll('tasks');
    $scope.tasks = tasks;
    $scope.category = settings.get('category');
    $scope.categories = _.uniq(_.map(tasks, function (val) { return val.category; }));

    $scope.$watch('category', function (newVal, oldVal) {
        console.log(newVal, oldVal);
        settings.update('category', newVal);
        var c;
        if (newVal === 'all') {
            $scope.tasks = tasks;
        } else {
            $scope.tasks = _.filter(tasks, function (e) {
                return e.category === newVal;
            });

        }
        console.log($scope.tasks);
    });
    $scope.selectTask = function (e) {
        $location.path('/tasks/' + e.id);
    }

    $scope.changeCategory = function (c) {
        console.log(c);
        $scope.category = c;
    }
});

module.controller('TaskCtrl', function ($scope, $routeParams, db, $history) {
    var id = $routeParams.id;
    var emptyTask = { name: '', dueDate: '', dueTime: '', done: false, category: 'none', notification: 0 };
    var task = db.getOne('tasks', id) || emptyTask;
    $scope.task = $scope.clone(task);
    $scope.editing = false;
    $scope.editable = '';
    $scope.fieldType = '';
    $scope.hasNotifcation = false;

    var s = document.getElementById('category-add');
    if (s) {
        s.value = $scope.task.category;
    }

    $scope.add = function (t) {
    	var s = document.getElementById('category-add');
        var op = s.selectedOptions[0];
        t.category = op.value;

        db.add('tasks', t);
        $scope.back();
    };

    $scope.save = function (t) {
    	var s = document.getElementById('category-add');
        var op = s.selectedOptions[0];
        t.category = op.value;

        db.update('tasks', t);
        $scope.back();
    };

    $scope.delete = function (t) {
        db.delete('tasks', t.id);
        $history.pop(2);
    };

    $scope.editField = function (f, t) {
        $scope.editable = f;
        $scope.fieldType = t;
        $scope.editing = true;
    }

});

module.controller('NotesCtrl', function ($scope, $history, db) {
    var notes = db.getAll('notes');
    $scope.notes = notes;

    $scope.selectNote = function (n) {
        $history.push('/notes/' + n.id);
    }
});

module.controller('NoteCtrl', function ($scope, $routeParams, $history, db) {
    var id = $routeParams.id;
    var emptyNote = { title: '', content: '' };
    var note = db.getOne('notes', id) || emptyNote;
    $scope.note = $scope.clone(note);
    $scope.editing = false;
    $scope.editable = '';
    $scope.fieldType = '';

    $scope.add = function (n) {
        db.add('notes', n);
        $scope.back();
    };

    $scope.save = function (n) {
        db.update('notes', n);
        $scope.back();
    };

    $scope.delete = function (n) {
        db.delete('notes', n.id);
        $history.pop(2);
    };

    $scope.editField = function (f, t) {
        $scope.editable = f;
        $scope.fieldType = t;
        $scope.editing = true;
    }
});

module.controller('SettingsCtrl', function ($scope, settings) {
    $scope.profile = settings.get('profile');

    $scope.$watch('profile', function (newVal, oldVal) {
        console.log(newVal, oldVal);
        settings.update('profile', newVal);
    });

});

module.controller('HomeCtrl', function ($scope) {

});

module.controller('SpeechCtrl', function ($scope, $location, $timeout, $speech, $history, db, moment) {

    $scope.message = "What can I help you with?";
    var obj = {};
    var commands = {
        'yes': function () {
            console.log('yes');
            $speech.abort();

            buildObj();
        },
        'no': function () {
            console.log('no');
            $scope.message = "What can I help you with?";
            obj = {};
        },
        'schedule *evt for tomorrow at *time in *place': function (evt, time, place) {
            console.log(evt, time, place);
            $scope.message = '"Schedule a ' + evt + ' for tomorrow at ' + time + ' in ' + place + '". Do you confirm?';

            obj.type = 'event';
            obj.name = capitaliseFirstLetter(evt);
            obj.place = capitaliseFirstLetter(place);
            obj.date = moment().add('d', 1).format('YYYY-MM-DD');
            obj.time = moment(time, 'h a').format('HH:mm');
            obj.frequency = 0;
            obj.notification = 0;
        },
        'schedule *evt for tomorrow at *time at *place': function (evt, time, place) {
            console.log(evt, time, place);
            $scope.message = '"Schedule a ' + evt + ' for tomorrow at ' + time + ' at ' + place + '". Do you confirm?';

            obj.type = 'event';
            obj.name = capitaliseFirstLetter(evt);
            obj.place = capitaliseFirstLetter(place);
            obj.date = moment().add('d', 1).format('YYYY-MM-DD');
            obj.time = moment(time, 'h a').format('HH:mm');
            obj.frequency = 0;
            obj.notification = 0;
        },
        'schedule *evt for tomorrow at *time': function (evt, time) {
            console.log(evt, time);
            $scope.message = '"Schedule a ' + evt + ' for tomorrow at ' + time + '". Do you confirm?';

            obj.type = 'event';
            obj.name = capitaliseFirstLetter(evt);
            obj.place = '';
            obj.date = moment().add('d', 1).format('YYYY-MM-DD');
            obj.time = moment(time, 'h a').format('HH:mm');
            obj.frequency = 0;
            obj.notification = 0;
        },
        'schedule *evt at *time a week from now': function (evt, time) {
            console.log(evt, time);
            $scope.message = '"Schedule a ' + evt + ' at ' + time + ' a week from now". Do you confirm?';

            obj.type = 'event';
            obj.name = capitaliseFirstLetter(evt);
            obj.place = '';
            obj.date = moment().add('w', 1).format('YYYY-MM-DD');
            obj.time = moment(time, 'h a').format('HH:mm');
            obj.frequency = 0;
            obj.notification = 0;
        },
        'schedule *evt at *time': function (evt, time) {
            console.log(evt, time);
            $scope.message = '"Schedule a ' + evt + ' at ' + time + '". Do you confirm?';

            obj.type = 'event';
            obj.name = capitaliseFirstLetter(evt);
            obj.place = '';
            obj.date = moment().format('YYYY-MM-DD');
            obj.time = moment(time, 'h a').format('HH:mm');
            obj.frequency = 0;
            obj.notification = 0;
        },
        'remind me to *task tomorrow': function (task) {
            console.log(task);
            $scope.message = 'Remind me to ' + task + '. Do you confirm?';

            obj.type = 'task';
            obj.name = capitaliseFirstLetter(task);
            obj.dueDate = moment().add('d', 1).format('YYYY-MM-DD');
            obj.dueTime = moment('1 pm', 'h a').format('HH:mm');
            obj.category = 'none';
            obj.done = false;
            obj.notification = 0;
        },
        'remind me to *task': function (task) {
            console.log(task);
            $scope.message = 'Remind me to ' + task + '. Do you confirm?';

            obj.type = 'task';
            obj.name = capitaliseFirstLetter(task);
            obj.dueDate = '';
            obj.dueTime = '';
            obj.category = 'none';
            obj.done = false;
            obj.notification = 0;
        },
        'add *task to *list list': function (task, list) {
            console.log(task, list);
            $scope.message = 'Add ' + task + ' to ' + list + ' list. Do you confirm?';

            obj.type = 'task';
            obj.name = capitaliseFirstLetter(task);
            obj.dueDate = '';
            obj.dueTime = '';
            obj.category = list;
            obj.done = false;
            obj.notification = 0;
        },
        'add *task to *list': function (task, list) {
            console.log(task, list);
            $scope.message = 'Add ' + task + ' to ' + list + '. Do you confirm?';

            obj.type = 'task';
            obj.name = capitaliseFirstLetter(task);
            obj.dueDate = '';
            obj.dueTime = '';
            obj.category = list;
            obj.done = false;
            obj.notification = 0;
        },
        'remind me to *task at *time': function (task, time) {
            console.log(task);
            $scope.message = 'Remind me to ' + task + ' at ' + time + '. Do you confirm?';

            obj.type = 'task';
            obj.name = capitaliseFirstLetter(task);
            obj.dueDate = moment().format('YYYY-MM-DD');
            obj.dueTime = moment(time, 'h a').format('HH:mm');
            obj.category = 'none';
            obj.done = false;
            obj.notification = 0;
        }
    };

    function buildObj() {
        if (obj.type === 'event') {
            var evt = {
                name: obj.name,
                place: obj.place,
                time: obj.time,
                date: obj.date,
                frequency: 0,
                notification: 0
            };

            db.add('events', evt);
            $history.replace('/events');
        } else if (obj.type === 'task') {
            var task = {
                name: obj.name,
                dueDate: obj.dueDate,
                dueTime: obj.dueTime,
                category: obj.category,
                done: obj.done,
                notification: obj.notification
            };

            db.add('tasks', task);
            $history.replace('/tasks');
        }
    }

    function stringifyDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        return year + '-' + month + '-' + day;
    }

    function capitaliseFirstLetter(string)
    {
            return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $speech.init(commands);
    $speech.start();

    $scope.name = 'Meeting with John';
    $scope.time = '15:00';
    $scope.date = '2013-12-14';

    $scope.listen = function () {
        console.log('Listening...');
        $timeout(function () {
            $location.path('/listen/listened').replace();
        }, 5000);
    };

    $scope.confirm = function () {
        console.log('Listening...');
        $timeout(function () {
            $location.path('/listen/add-event').replace();
        }, 3000);
    };

    $scope.acceptEvent = function () {
        var s = document.getElementById('select-speech');
        var evt = {
            name: $scope.name,
            time: $scope.time,
            date: $scope.date,
            place: $scope.place,
            frequency: s.selectedIndex
        };

        $scope.days[1].events.push(evt);

        $location.path('/events').replace();

    };


});

module.controller('AppCtrl', function ($scope, $rootScope, $location, $timeout, $history) {
    var index = 0;

    $scope.menus = ["events", "tasks", "notes", "settings"]
    $scope.menu = $scope.menus[index];

    $scope.hourFormat = 'HH:mm';
    $scope.dateFormat = 'EEEE, MMMM dd';

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (!$history.init($location.path())) {
            $history.push($location.path());
        }

        $scope.currentPage = $history.current();

        $history.dump();
    });

    $scope.back = function () {
        var path = $history.current();
        if (path != '/home') {
            $history.pop();
        }
    };

    $scope.unlock = function () {
        $history.erase();

        $scope.menu = 'events';
        index = 0;
        $history.push('/home');
    };

    $scope.lock = function () {
        $history.erase();
        $history.push('/lockscreen');
    };

    $scope.speak = function () {
        var path = $history.current();
        if (path != '/lockscreen') {
            if (path === '/listen') {
                $history.pop();
            } else {
                $history.push('/listen');
            }
        }
    }

    $scope.clone = function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }


    $scope.nextMenu = function () {
        if ($scope.currentPage === '/home') {
            index = (index + 1) % $scope.menus.length;
            $scope.menu = $scope.menus[index];
        }
    };

    $scope.notification = function () {
        $history.push('/notification');
    }

    $scope.snooze = function () {
        $timeout(function () {
            console.log("snoozing");
            $history.push("/notification");
        }, 5000);

        $history.pop();
    }
});
