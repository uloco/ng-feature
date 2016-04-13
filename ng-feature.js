(function () {
  'use strict';

  angular
    .module('ng-feature', [])
    .directive('ngFeature', ngFeature)
    .factory('$ngFeature', $ngFeature);

  /**
   * Define feature element.
   *
   * @ngdoc directive
   * @name ngFeature
   * @param {string} name - Feature name of element
   * @param {string[]} [features] - Optional list of available features.
   */
  function ngFeature($ngFeature, $log) {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        features: '=?'
      },
      transclude: true,
      template: '<div ng-show="featureAvailable"><ng-transclude></ng-transclude></div>',
      link: link
    };

    function link(scope) {
      // get initial features
      if (angular.isDefined(scope.features) && angular.isArray(scope.features) &&
        scope.features.length > 0) {
        scope.featureAvailable = $ngFeature.check(scope.name, scope.features);
      } else if (angular.isUndefined(scope.features)) {
        scope.featureAvailable = $ngFeature.check(scope.name);
      }

      // watch feature changes
      scope.$watch('features', function (newValue) {
        if (angular.isDefined(newValue) && angular.isArray(newValue) && newValue.length > 0) {
          scope.featureAvailable = $ngFeature.check(scope.name, scope.features);
        }
      });

      if (angular.isUndefined(scope.features)) {
        scope.$watch($ngFeature.get, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.featureAvailable = $ngFeature.check(scope.name);
            $log.warn(scope.featureAvailable);
          }
        }, true);
      }
    }
  }

  function $ngFeature($log) {
    /**
     * Enabled feature collection.
     */
    var list = new Set();

    /**
     * Check if feature is available.
     *
     * @param {string} value - Feature name.
     * @param {string[]} [lov] - List of available feature names. Will use global features list if
     *   undefined.
     * @returns {boolean}
     */
    function check(value, lov) {
      var features;

      if (angular.isDefined(lov) && angular.isArray(lov) && lov.length > 0) {
        features = new Set(lov);
      } else if (angular.isDefined(value) && angular.isUndefined(lov)) {
        features = list;
      } else {
        return false;
      }
      return features.has(value);
    }

    /**
     * Get available features.
     * @returns {String[]}
     */
    function get() {
      return Array.from(list);
    }

    /**
     * Set available features, overwrites existing ones.
     * @param {...string} features
     */
    function set(...features) {
      list = new Set(features);
      $log.debug(`enabled features [${features}], overwriting existing ones.`);
    }

    /**
     * Adds features to the list.
     * @param {...string} features
     */
    function add(...features) {
      features.forEach(feature => list.add(feature));
      $log.debug(`added features [${features}]`);
    }

    /**
     * Removes given features from the list.
     * @param {...string} features
     */
    function remove(...features) {
      features.forEach(feature => list.delete(feature));
      $log.debug(`removed features [${features}]`);
    }

    /**
     * Clears the feature list.
     */
    function clear() {
      list.clear();
      $log.debug('cleared features list');
    }

    return {
      check,
      get,
      set,
      add,
      remove,
      clear
    };
  }
})();
