angular
  .module("App", [])
  .constant("baseUrl", "http://localhost:3000/allnews/")
  .controller("defaultCtrl", function ($scope, $http, baseUrl) {
    $scope.currentView = "table";
    $scope.styleNav = {
      backgroundColor: "#bbcef0",
    };

    $scope.refresh = function () {
      $http.get(baseUrl).success(function (response) {
        $scope.items = response.allnews;
        $scope.hideNews = false;
      });
    };

    $scope.create = function (item) {
      $scope.refresh();
      $http
        .post("http://localhost:3000/addnews", { item: item, unshift: true })
        .success(function (item) {
          $scope.items.unshift(item);
          $scope.currentView = "table";
          $scope.refresh();
        });
    };

    $scope.update = function (item) {
      $http({
        url: "http://localhost:3000/editnews",
        method: "PUT",
        data: item,
      }).success(function (modifiedItem) {
        for (var i = 0; i < $scope.items.length; i++) {
          if ($scope.items[i].id == modifiedItem.id) {
            $scope.items[i] = modifiedItem;
            break;
          }
        }
        $scope.currentView = "table";
        $scope.refresh();
      });
    };

    $scope.delete = function (item) {
      $http({
        method: "DELETE",
        url: "http://localhost:3000/deletenews/" + item.id,
      }).success(function () {
        $scope.items.splice($scope.items.indexOf(item), 1);
      });
    };

    $scope.createItem = function () {
      $scope.currentItem = {};
      $scope.currentView = "edit";
    };

    $scope.editItem = function (item) {
      $scope.currentItem = angular.copy(item);
      $scope.currentView = "edit";
    };

    $scope.createOrEditItem = function (item) {
      if (angular.isDefined(item.id)) {
        $scope.update(item);
      } else {
        $scope.create(item);
      }
    };

    $scope.cancelEdit = function () {
      $scope.currentView = "table";
    };

    $scope.updateSelect = function (item) {
      if (item.selected == true) {
        $http
          .get("http://localhost:3000/allnews/?selected=true")
          .success(function (response) {
            $scope.items = response.allnews;
          });
      } else $scope.refresh();
    };

    $scope.refresh();
  });
