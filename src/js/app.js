var angular = require("angular");
var ngRoute = require("angular-route");
var ngStorage = require("ngstorage");

import "../styles/styles.css";
import "jquery/dist/jquery.js";
import "popper.js/dist/umd/popper.js";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/less.less";
import "../styles/scss.scss";
import "angular-material";
import "angular-material/angular-material.css";
import "angular-messages";
// import "angular-animate";
// import "angular-aria";

angular
  .module("App", [
    "ngRoute",
    "ngStorage",
    "ngMaterial",
    "ngMessages",
    // "ngAnimate",
    // "ngAria",
  ])
  // .constant("baseUrl", "http://localhost:3000/allnews/")
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "../src/login.html",
        controller: "loginCtrl",
      })
      .when("/posts/:name", {
        templateUrl: "../src/posts.html",
        controller: "postsCtrl",
      })
      .otherwise({
        template: "<h5>Не найдено</h5>",
      });
  })

  .controller("defaultCtrl", function ($scope) {})

  //  ******* контроллер postsCtrl ********

  .controller("postsCtrl", function ($scope, $http, $routeParams, $location) {
    $scope.currentView = "table";
    $scope.selectedAll = false;
    $scope.styleNav = {
      backgroundColor: "#bbcef0",
    };

    $scope.currentItemName = $routeParams.name;

    $scope.refresh = function () {
      $http
        .get("http://localhost:3000/allnews/?name=" + $routeParams.name)
        .then(function (response) {
          $scope.items = response.data.allnews;
          $scope.hideNews = false;
        });
    };

    $scope.create = function (item) {
      $scope.refresh();

      $http
        .post("http://localhost:3000/addnews", { item: item, unshift: true })
        .then(function (item) {
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
      }).then(function (modifiedItem) {
        for (var i = 0; i < $scope.items.length; i++) {
          if ($scope.items[i].id == modifiedItem.config.data.id) {
            $scope.items[i] = modifiedItem.config.data;
            break;
          }
        }
        $scope.currentView = "table";
        // $scope.refresh();
      });
    };

    $scope.delete = function (item) {
      $http({
        method: "DELETE",
        url: "http://localhost:3000/deletenews/" + item.id,
      }).then(function () {
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

    $scope.updateSelect = function (selAll) {
      if (selAll == true) {
        $http
          .get(
            "http://localhost:3000/allnews/?selected=true&name=" +
              $scope.currentItemName
          )
          .then(function (response) {
            $scope.items = response.data.allnews;
          });
      } else {
        $scope.refresh();
      }
    };

    $scope.logout = function () {
      $location.path("/");
    };

    // $scope.currentItem.dateCreation = new Date();
    $scope.isOpen = false;

    $scope.updateAutocomplete = function (searchText) {
      console.log(typeof searchText);
      console.log(searchText);
      if (searchText != "") {
        $http
          .get(
            "http://localhost:3000/allnews/?name=" +
              $scope.currentItemName +
              "&title=" +
              searchText
          )
          .then(
            function (response) {
              $scope.items = response.data.allnews;
            },
            function errorCallback(response) {
              console.log("title no");
            }
          );
      }
      if (!searchText) {
        $scope.refresh();
      }
    };

    $scope.querySearch = function (query) {
      return $scope.items.filter((item) => item.title.indexOf(query) != -1);
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

    $scope.searchUser = function (user, users) {
      for (let i = 0; i < users.length; i++) {
        console.log(user.name);
        console.log(users[i].name);
        if (user.name === users[i].name && user.email === users[i].email) {
          $scope.findUser = true;
          break;
        }
      }
      return $scope.findUser;
    };

    $scope.submit = function (user, isvalid) {
      $scope.addNewUser(user, isvalid);
      $scope.findUser = false;

      if (isvalid) {
        $scope.searchUser(user, $localStorage.users);

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
      console.log("user", user);

      if (isvalid) {
        $scope.searchUser(user, $localStorage.users);

        if ($scope.findUser) {
          alert("Такой пользователь уже есть. Осуществите вход.");
        } else {
          $localStorage.users.push(user);
          console.log("user.name", user.name);
          $location.path("/posts/" + user.name);
        }
      }
    };
  });
