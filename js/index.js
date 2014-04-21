const NODE_SERVER_URL = "http://bc-app-store-data.herokuapp.com/";
const ROOT_PATH = "http://localhost/BachelorThesis/app/www/";

var storage = null;
var dbUsers = null;
var dbUserRequests = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(/*id*/) {
        //console.log(id);
    }
};

$(document).on("mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.phonegapNavigationEnabled = true;
    $.mobile.defaultPageTransition = "none";            // default fade
    $.mobile.page.prototype.options.domCache = true;    // cache pages

    // init local storage
    storage = new CasLocalStorage("cas");

    // init database for users    
    dbUsers = new WebSQL("users", "1.0.0", "Registrered users", 2 * 1024 * 1024);
    
    // init database for user requests    
    dbUserRequests = new WebSQL("user_requests", "1.0.0", "All requests sent to server", 3 * 1024 * 1024);

    // create table users
    var dbUsersSQL = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR)";
    dbUsers.runTransaction(function(tx) {
            tx.executeSql(dbUsersSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
        });
    
    // create table user_requests
    var dbUserRequestsSQL = "CREATE TABLE IF NOT EXISTS user_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, fk_user_id INTEGER, name_request VARCHAR, request VARCHAR, response VARCHAR, created DATETIME)";
    dbUserRequests.runTransaction(function(tx) {
            tx.executeSql(dbUserRequestsSQL, [], dbUserRequests.successCallback, dbUserRequests.errorCallback);
        });

});

/**
 * Main index
 */
$(document).on("pageinit", "#index", function(event, data) {
    // check if application is first time opened
    if (storage.getFirstOpen() === null) {
        $.mobile.changePage(ROOT_PATH + "templates/dialogs/login-notification.html", {role: "dialog"});
        storage.setFirstOpen(1);
    }
    
    // submit form
    $("form#codeForm").on("submit", function(event, data) {
        event.preventDefault();
        boxLoading("show", "Sending...", "b", "");
        
        var casCodeForm = new CasCodeForm($(this).serializeArray());
        var casCreateRequest = new CasCreateRquest(casCodeForm.parseObject());
        
        $.post(casCodeForm.CAS_SERVER_URL, casCreateRequest.getRequest('json'), function(response) {
            var casParseResponse = new CasParseResponse(response);

            switch (casParseResponse.getType()) {
                // graphs
                case 'graphs':
                    var graphs = casParseResponse.getGraphs();
                    var chartBox = $('#charts');

                    chartBox.append('<div class="chart" style="height: 300px;"></div>')
                    chartBox.show();
                    chartBox.children('div.chart').eq(0).highcharts(graphs['2d'][0]);
                    break;

                // formulas
                case 'formulas':
                    break;
            }

            boxLoading("hide");
            console.log("SUCCESS: Server sent response");
        }, "json")
        .done(function() {
            //alert( "second success" );
        })
        .fail(function() {
            console.log("ERROR: Server doesn't respond");
        })
        .always(function() {
            //alert( "finished" );
        });
        
        /*
        var userRquests = {
            1:{"fk_user_id": 9, "name_request": "2d chart 1", "request": "request 1", "response": "response 1"},
            2:{"fk_user_id": 9, "name_request": "2d chart 2", "request": "request 2", "response": "response 2"},
            3:{"fk_user_id": 1, "name_request": "2d chart 3", "request": "request 3", "response": "response 3"},
        };

        var users = {
            0: {"name": "Jan Brnak", "email": "j.brnak@gmail.com", "password": "jano"}
        };

        var r_user = {"name": "Jan Brnak", "email": "j.brnakk@gmail.com", "password": "jano"};
        var l_user = {"email": "j.brnak@gmail.com", "password": "jano"};

        //$.post('http://localhost:3000/save_user_requests', userRquests, function(response) {
        //$.post('http://localhost:3000/save_users', users, function(response) {
        //$.post('http://localhost:3000/registration_user', r_user, function(response) {
        */
    });
});

/**
 * Login dialog page
 */
$(document).on("pageinit", "#loginBox", function(event, data) {
    $("form#loginForm").on("submit", function(event, data) {
        event.preventDefault();
        boxLoading("show", "Sending...", "b", "");

        var login_name = $("input#login-name").val();
        var login_password = $("input#login-password").val();

        $.post(NODE_SERVER_URL + 'login_user', {"email": login_name, "password": login_password}, function(response) {
            switch (response.error) {
                case 0:
                    if (response.attributes.length > 0 && response.attributes[0]) {
                        with (response.attributes[0]) {
                            storage.setUserId(id);

                            var dbSQL = "INSERT INTO users (id, name, email) VALUES ('" + id + "', '" + name + "', '" + email + "')";
                            dbUsers.runTransaction(function(tx) {
                                    tx.executeSql(dbSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
                                });
                        }
                        
                        $.mobile.changePage( ROOT_PATH + "index.html", {});
                        console.log("SUCCESS: User was successful login"); 
                    }
                    break;
                case 2:
                    console.log("ERROR: All fields are mandatory");
                    break;
            }

            boxLoading("hide");
        }, "json")
        .fail(function() {
            console.log("ERROR: Server doesn't respond");
        });
    });
});

/**
 * Registration dialog page
 */
$(document).on("pageinit", "#registrationBox", function(event, data) {
    $("form#registrationForm").on("submit", function(event, data) {
        event.preventDefault();
        boxLoading("show", "Sending...", "b", "");

        var registration_name = $("input#registration-name").val();
        var registration_email = $("input#registration-email").val();
        var registration_password = $("input#registration-password").val();

        $.post(NODE_SERVER_URL + 'registration_user', {"name": registration_name, "email": registration_email, "password": registration_password}, function(response) {
            switch (response.error) {
                case 0:
                    console.log(response);
                    
                    if (response.attributes) {
                        with (response.attributes) {
                            /*
                            storage.setUserId(id);

                            var dbSQL = "INSERT INTO users (id, name, email) VALUES ('" + id + "', '" + name + "', '" + email + "')";
                            dbUsers.runTransaction(function(tx) {
                                    tx.executeSql(dbSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
                                });
                            */
                        }
                        
                        $.mobile.changePage( ROOT_PATH + "index.html", {});
                        console.log("SUCCESS: User was successful login"); 
                    }
                    
                    break;
                case 2:
                    console.log("ERROR: All fields are mandatory");
                    break;
                case 3:
                    console.log("WARRNING: Email address is registered");
                    break;
            }

            boxLoading("hide");
        }, "json")
        .fail(function() {
            console.log("ERROR: Server doesn't respond");
        });
    });
});

/**
 * Page before show
 */
$(document).on("pagebeforeshow", function(event, data) {
    var link_registration = $(".link-registration");
    var link_login = $(".link-login");
    var link_logout = $(".link-logout");
    
    // is user logged
    if (storage.isUserLogged()) {
        link_registration.hide();
        link_login.hide();
        link_logout.show();
    }
    // isn't user logged
    else {
        link_registration.show();
        link_login.show();
        link_logout.hide();
    }

    // logoff user
    $(".link-logout a").on("click", function() {
        boxLoading("show", "Logout...", "b", "");

        var dbUsersSQL = "DELETE FROM users WHERE id = " + storage.getUserId();
        dbUsers.runTransaction(function(tx) {
                tx.executeSql(dbUsersSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
            });

        var dbUserRequestsSQL = "DELETE FROM user_requests WHERE fk_user_id = " + storage.getUserId();
        dbUserRequests.runTransaction(function(tx) {
                tx.executeSql(dbUserRequestsSQL, [], dbUserRequests.successCallback, dbUserRequests.errorCallback);
            });

        storage.setUserId(null);
        storage.setFirstOpen(null);

        link_registration.show();
        link_login.show();
        link_logout.hide();

        $.mobile.changePage( ROOT_PATH + "index.html", {});
        $("#nav-panel").panel("close");
        setTimeout('boxLoading("hide")', 2000);
    });
});

function boxLoading(action, text, theme, html) {
    if (action === "show") {
        $.mobile.loading("show", {
            text: text,
            textVisible: true,
            theme: theme,
            html: html
        });
    }
    else
        $.mobile.loading("hide");
}