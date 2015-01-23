if (typeof Object.create != "function") {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    }
}

var john_lennon = {
    "first_name" : "John",
    "last_name" : "Lennon"
}

var john_lennon2 = Object.create(john_lennon);

john_lennon.first_name = "Jon";

console.log(john_lennon2.first_name);

console.log(john_lennon.hasOwnProperty("first_name"));
console.log(john_lennon2.hasOwnProperty("first_name"));