(function () {
    'use strict';

    angular
        .module('ng-feature', [])
        .directive('ngFeature', ngFeature)
        .controller('NgFeatureController', NgFeatureController)
        .factory('$ngFeature', $ngFeature);

    /**
     * Define feature element.
     *
     * @ngdoc directive
     * @name ngFeature
     * @param {string} name - Feature name of element
     * @param {string[]} [features] - Optional list of available features.
     */
    // Directive
    function ngFeature() {
        return {
            restrict: 'E',
            scope: {
                name: '=',
                features: '=?'
            },
            transclude: true,
            template: '<div ng-show="featureAvailable"><ng-transclude></ng-transclude></div>',
            controller: 'NgFeatureController'
        };
    }

    // Controller
    function NgFeatureController($scope, $ngFeature) {
        $scope.$watch('features', function (newValue) {
            if (angular.isDefined(newValue) && angular.isArray(newValue) && newValue.length > 0) {
                $scope.featureAvailable = $ngFeature._check($scope.name, $scope.features);
            }
        });

        if (angular.isUndefined($scope.features)) {
            $scope.$watch($ngFeature.getValues, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.featureAvailable = $ngFeature._check($scope.name, $ngFeature.getValues());
                }
            });
        }
    }

    // Services
    function $ngFeature() {
        /**
         * @type {String[]} - Available global feature list.
         */
        var availableFeatures = [];

        /**
         * Check if feature is available.
         *
         * @param {string} value - Feature name.
         * @param {string[]} [lov] - List of available feature names. Will use global features list if undefined.
         * @returns {boolean}
         */
        function _check(value, lov) {
            var features;

            if (angular.isDefined(lov) && angular.isArray(lov) && lov.length > 0) {
                features = lov;
            } else if (angular.isDefined(value) && angular.isUndefined(lov)) {
                features = availableFeatures;
            } else {
                return false;
            }
            return features.some(function (feature) {
                return value === feature;
            });
        }

        /**
         * Get available features.
         * @returns {String[]}
         */
        function getValues() {
            return availableFeatures;
        }

        /**
         * Set available features.
         * @param {String[]} features
         */
        function setValues(features) {
            availableFeatures = features;
        }

        return {
            list: availableFeatures,
            _check: _check,
            getValues: getValues,
            setValues: setValues
        };
    }
}());
