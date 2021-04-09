angular
  .module("App", ["ngRoute", "ngStorage"])
  // .constant("baseUrl", "http://localhost:3000/allnews/")
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "./login.html",
        controller: "loginCtrl",
      })
      .when("/posts/:name", {
        templateUrl: "posts.html",
        controller: "postsCtrl",
      })
      .otherwise({
        template: "<h5>Не найдено</h5>",
      });
  })

  .controller("defaultCtrl", function ($scope, $http) {
    $scope.getCourseUsd = function () {
      $http
        .get("https://www.nbrb.by/api/exrates/rates/145")
        .success(function (response) {
          $scope.courseUsd = response.Cur_OfficialRate;
        });
    };
    $scope.getCourseUsd();
  })

  //  ******* контроллер postsCtrl ********

  .controller("postsCtrl", function ($scope, $http, $routeParams, $location) {
    $scope.currentView = "table";
    $scope.styleNav = {
      backgroundColor: "#bbcef0",
    };

    $scope.currentItemName = $routeParams.name;

    $scope.refresh = function () {
      $http
        .get("http://localhost:3000/allnews/?name=" + $routeParams.name)
        .success(function (response) {
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
      $scope.currentItem = { name: $scope.currentItemName };
      $scope.currentView = "edit";
    };

    $scope.editItem = function (item) {
      $scope.currentItem = angular.copy(item);
      $scope.currentView = "edit";
    };

    $scope.createOrEditItem = function (item, name) {
      if (angular.isDefined(item.id)) {
        $scope.update(item, name);
      } else {
        $scope.create(item, name);
      }
    };

    $scope.cancelEdit = function () {
      $scope.currentView = "table";
    };

    $scope.updateSelect = function (item) {
      if (item.selected == true) {
        $http
          .get(
            "http://localhost:3000/allnews/?selected=true&name=" +
              $scope.currentItemName
          )
          .success(function (response) {
            $scope.items = response.allnews;
          });
      } else $scope.refresh();
    };

    $scope.logout = function () {
      $location.path("/");
    };

    $scope.refresh();
  })

  //  ******* контроллер loginCtrl ********

  .controller("loginCtrl", function ($scope, $location, $localStorage) {
    $scope.addNewUser = function (userDetails, isvalid) {
      if (isvalid) {
        $scope.message = userDetails.name + " " + userDetails.email;
      } else {
        $scope.message = "Error";
        $scope.showError = true;
      }
    };

    $scope.getError = function (error) {
      if (angular.isDefined(error)) {
        if (error.required) {
          return "Поле не должно быть пустым";
        }
        if (error.email) {
          return "Введите правильный email";
        }
        if (error.maxlength) {
          return "Не больше 26 символов";
        }
      }
    };

    $scope.$storage = $localStorage.$default({
      users: [
        {
          name: "admin",
          email: "admin@admin",
        },
      ],
    });

    $scope.submit = function (user, isvalid) {
      $scope.addNewUser(user, isvalid);
      $scope.findUser = false;

      if (isvalid) {
        for (item in $localStorage.users) {
          if (
            JSON.stringify(user) === JSON.stringify($localStorage.users[item])
          ) {
            $scope.findUser = true;
            break;
          }
        }
        if ($scope.findUser) {
          $location.path("/posts/" + user.name);
        } else {
          alert("Пользователь не найден. Зарегистрируйтесь.");
        }
      }
    };

    $scope.auth = function (user, isvalid) {
      $scope.addNewUser(user, isvalid);
      $scope.findUser = false;

      if (isvalid) {
        for (item in $localStorage.users) {
          if (
            JSON.stringify(user) === JSON.stringify($localStorage.users[item])
          ) {
            $scope.findUser = true;
            break;
          }
        }

        if ($scope.findUser) {
          alert("Такой пользователь уже есть. Осуществите вход.");
        } else {
          $localStorage.users.push(user);
          $location.path("/posts/" + user.name);
        }
      }
    };
  });
