var module = angular.module('directives', []);

module.directive('currentTime', function($timeout, dateFilter) {
    return function(scope, element, attrs) {
        var format,
        timeoutId;
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        scope.$watch(attrs.currentTime, function(value) {
            format = value;
            updateTime();
        });

        function updateLater() {
            timeoutId = $timeout(function() {
                updateTime();
                updateLater();
            }, 1000);
        }

        element.bind('$destroy', function() {
            $timeout.cancel(timeoutId);
        });

        updateLater();
    }
});

module.directive('keyboard', function () {
    return {
        scope: {
            message: '=',
            type: '@',
            return: '='
        },
        controller: function ($scope) {
            $scope.keys = [];

            this.addKey = function (k) {
                $scope.keys.push(k);
            }
            this.addLetter = function (l) {
                $scope.message = $scope.message + l;
            };

            this.removeLetter = function () {
                if ($scope.message.length > 0) {
                    $scope.message = $scope.message.substring(0, $scope.message.length - 1);
                }
            };

            this.uppercase = function () {
                for (var key in $scope.keys) {
                    $scope.keys[key].tag = $scope.keys[key].tag.toUpperCase();
                }
            };

            this.lowercase = function () {
                for (var key in $scope.keys) {
                    $scope.keys[key].tag = $scope.keys[key].tag.toLowerCase();
                }
            };

            this.return = function () {
                $scope.return = !$scope.return;
            }

            $scope.getTemplate = function () {
                if ($scope.type === 'time') {
                    return 'partials/keyboard_time_template.html';
                } else if ($scope.type === 'text') {
                    return 'partials/keyboard_text_template.html';
                }
            };
        },
        template: '<div ng-include="getTemplate()"></div>',
        // templateUrl: function () {
        //     console.log($scope.type);
        //     if (type === 'time') {
        //         return 'partials/keyboard_time_template.html';
        //     } else if (type === 'text') {
        //         return 'partials/keyboard_text_template.html';
        //     }
        // },
        link: function (scope, element, attr) {

        }
    }
});

module.directive('key', function ($timeout) {
    return {
        require: '^keyboard',
        replace: true,
        scope: {
            tag: '@'
        },
        template: '<button class="col span_1_3">{{ tag }}</button>',
        link: function (scope, element, attr, keyboardCtrl) {
            var isSingleKey = false;
            var letters = [];
            var index = 0;
            var character = '';
            var wasClicked = false;
            var isUpper = false;

            if (scope.tag === 'up' || scope.tag === 'del' || scope.tag === 'ret' || scope.tag === '_') {
                isSingleKey = true;
            } else {
                keyboardCtrl.addKey(scope);
            }

            scope.$watch('tag', function () {
                letters = scope.tag.replace(/\s/g, '').split('');
            })

            element.on('click', function (e) {
                if (!wasClicked && !isSingleKey) {
                    $timeout(function () {
                        console.log(character);
                        keyboardCtrl.addLetter(character);
                        index = 0;
                        wasClicked = false;
                    }, 1000);
                    wasClicked = true;
                }
                if (isSingleKey) {
                    character = scope.tag;
                    switch (character) {
                        case '_':
                            console.log('space');
                            keyboardCtrl.addLetter(" ");
                            break;
                        case 'del':
                            console.log('delete');
                            keyboardCtrl.removeLetter();
                            break;
                        case 'up':
                            console.log('uppercase');
                            if (isUpper) {
                                keyboardCtrl.lowercase();
                                isUpper = false;
                            } else {
                                keyboardCtrl.uppercase();
                                isUpper = true;
                            }
                            break;
                        case 'ret':
                            console.log('return');
                            keyboardCtrl.return();
                            break;
                    }
                } else {
                    character = letters[index];
                    index = (index + 1) % letters.length;
                }
            });
        }
    }
});