angular.module("App", []).controller("defaultCtrl", function ($scope, $http) {
  $scope.hideNews = true;

  $scope.refresh = function () {
    $http
      .get("http://jsonplaceholder.typicode.com/posts")
      .success(function (response) {
        $scope.items = response;
        $scope.hideNews = false;
      });
  };

  $scope.reset = function () {
    $scope.hideNews = true;
  };

  $scope.searchText = "";

  $scope.selectArticle = function (item) {
    if ($scope.searchText !== "") {
      var rez = item.title == $scope.searchText ? true : false;
    } else rez = true;
    return rez;
  };
});
