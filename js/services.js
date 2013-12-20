var module = angular.module('services', []);

module.service('$history', function ($location, _) {
	var stack = [];

	return {
		push: function (s) {
			stack.push(s);
			$location.path(s);
		},

		pop: function (n) {
			if (n === undefined) {
				stack.pop();
				$location.path(_.last(stack));
			} else {
				stack = _.initial(stack, n);
				$location.path(_.last(stack));
			}
		}
	}
});

module.factory('_', function () {
	return window._;
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
				frequency: 2
			},
			{
				id: 1,
				name: 'Christmas party',
				time: '09:00',
				date: '2013-12-19',
				place: 'Hot Club',
				frequency: 3
			}
		],

		tasks: [

		],

		notes: [

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