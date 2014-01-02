var module = angular.module('services', []);

module.service('$history', function ($location, _) {
    var stack = [];

    return {
        push: function (s) {
            var last = _.last(stack);
            if (last != s) {
                stack.push(s);
            }

            $location.path(s);
        },

        pop: function (n) {
            var tmp;
            if (n === undefined) {
                tmp = _.initial(stack, 1);
                if (tmp.length != 0) {
                    stack.pop();
                    $location.path(_.last(stack));
                }
            } else {
                tmp = _.initial(stack, n);
                if (tmp.length != 0) {
                    stack = tmp;
                    $location.path(_.last(stack));
                }
            }
        },

        replace: function (s) {
            stack.pop();
            stack.push(s);
            $location.path(s);
        },

        init: function (s) {
            if (stack.length === 0) {
                stack.push(s);
                console.log('Init done');

                return true;
            }

            return false;
        },

        erase: function () {
            stack = [];
        },

        dump: function () {
            console.log(stack);
        }
    }
});

module.factory('_', function () {
    return window._;
});

module.factory('$speech', function () {
    return window.annyang;
});

module.service('settings', function (_) {
    var settings = {
        profile:  'default',
        category: 'all'
    };

    return {
        get: function (c) {
            if (c in settings) {
                return settings[c];
            }

            return null;
        },

        update: function (c, o) {
            if (c in settings) {
                settings[c] = o;
            }
        }
    }
});

module.service('db', function (_) {
    var db = {
        events: [
            {
                id: 0,
                name: 'Dinner with Jennifer',
                time: '20:00',
                date: '2013-12-19',
                place: 'Sesame Street',
                frequency: 2,
                notification: 0
            },
            {
                id: 1,
                name: 'Christmas party',
                time: '09:00',
                date: '2013-12-19',
                place: 'Hot Club',
                frequency: 3,
                notification: 5
            }
        ],

        tasks: [
            {
                id: 1,
                name: 'Buy milk',
                dueDate: '2014-01-01',
                dueTime: '15:00',
                category: 'shopping',
                done: false,
                notification: 0
            },
            {
                id: 2,
                name: 'Buy soda',
                dueDate: '',
                dueTime: '',
                category: 'shopping',
                done: true,
                notification: 0
            },
            {
                id: 3,
                name: 'Pick up the kids',
                dueDate: '2014-01-01',
                dueTime: '15:00',
                category: 'none',
                done: false,
                notification: 30
            }
        ],

        notes: [
            {
                id: 1,
                title: 'First note',
                content: 'Some random text'
            }
        ]
    }
    return {
        getAll: function (c) {
            if (c in db) {
                return db[c];
            }

            return null;
        },

        getOne: function (c, k) {
            if (c in db) {
                return _.find(db[c], function (o) {
                    return o.id == k;
                });
            }

            return null;
        },

        add: function (c, o) {
            if (c in db) {
                var ids = _.pluck(db[c], 'id');
                var id = _.max(ids);
                o.id = ++id;

                db[c].push(o);
            }
        },

        update: function (c, o) {
            if (c in db) {
                var match = _.find(db[c], function(i) { return i.id == o.id })
                if (match) {
                    _.extend(match, o);
                }
            }
        },

        delete: function (c, id) {
            if (c in db) {
                db[c] = _.without(db[c], _.findWhere(db[c], {id: id}));
            }
        }
    };
});
