(function () {
    'use strict';

    angular
        .module('ng-feature', [])
        .directive('ngFeature', ngFeature)
        .controller('NgFeatureController', NgFeatureController)
        .factory('$feature', $feature);

    /**
     * @ngdoc directive
     * @name ngFeature
     * @param {string} name - This feature name
     * @param {string[]} features - List of available features
     */
    // Directive
    function ngFeature() {
        return {
            restrict: 'E',
            scope: {
                name: '=',
                features: '='
            },
            transclude: true,
            template: '<div ng-show="featureAvailable"><ng-transclude></ng-transclude></div>',
            controller: 'NgFeatureController'
        };
    }

    // Controller
    function NgFeatureController($scope, $feature) {
        $scope.$watch('features', function (newValue) {
            if (angular.isDefined(newValue) && angular.isArray(newValue) && newValue.length > 0) {
                $scope.featureAvailable = $feature.check($scope.name, $scope.features);
            }
        });
    }


    // Services
    function $feature() {
        /**
         * @type {String[]} - Feature List array
         */
        //    TODO: dynamic feature loading does not work
        var _ngFeatureList = [];

        /**
         *
         * @param {string} value - Feature name
         * @param {string[]} lov - List of available feature names
         * @returns {boolean}
         */
        function check(value, lov) {
            if (angular.isArray(lov) && lov.length > 0) {
                return lov.some(function (feature) {
                    return value === feature;
                })
            } else {
                return false
            }
        }

        function getValues() {
            return _ngFeatureList;
        }

        function setValues(features) {
            _ngFeatureList = features;
        }

        return {
            check: check,
            getValues: getValues,
            setValues: setValues
        };
    }
}());
