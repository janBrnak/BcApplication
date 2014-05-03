// constants URLs
const NODE_SERVER_URL = "http://bc-app-store-data.herokuapp.com/";
const ROOT_PATH = "http://localhost/BachelorThesis/app/www/";
// constants tables
const TABLE_USERS = "users";
const TABLE_USER_REQUESTS = "user_requests";
// form index element id
const FORM_INDEX_ID_CODE = "casCode";
const FORM_INDEX_ID_GRAPH_OUTPUT_ARRAY = "casGraphOutputArray";
const FORM_INDEX_ID_FORMULA_OUTPUT_TEX = "casFormulaOutputTex";
const FORM_INDEX_ID_SYSTEM_MAXIMA = "casSystemMaxima";
const FORM_INDEX_ID_SYSTEM_OCTAVE = "casSystemOctave";
// constants alert messages
const ALERT_MESSAGES = {
    0: "Chyba servera",
    1: "",
    2: "Všetky polia sú povinné",
    3: "Zvolená e-mailová adresa už bola zaregistrovana",
    4: "Nebol najdený žiadný záznam",
    5: "Nie ste priháseny"
};
// constants alert messages
const ALERT = "alert";
const ALERT_INFO = "alert-info";
const ALERT_WARRNING = "alert-warrning";
const ALERT_SUCCESS = "alert-success";
const ALERT_ERROR = "alert-error";

// storages
var storage = null;
var dbUsers = null;
var dbUserRequests = null;

// links & buttons
var button_login_user = null;
var link_registration = null;
var link_login = null;
var link_logout = null;
var link_save_program = null;

// chart data
var casChart = {name: null, form: null, request: null, response: null};

// phonegap app init
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
    $.mobile.page.prototype.options.domCache = false;    // cache pages

    // init local storage
    storage = new CasLocalStorage("cas");

    // init database for users    
    dbUsers = new WebSQL(TABLE_USERS, "1.0.0", "Registrered users", 2 * 1024 * 1024);
    
    // init database for user requests    
    dbUserRequests = new WebSQL("user_requests", "1.0.0", "All requests sent to server", 3 * 1024 * 1024);

    // create table users
    var dbUsersSQL = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR)";
    dbUsers.runTransaction(function(tx) {
            tx.executeSql(dbUsersSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
        });
    
    // create table user_requests
    var dbUserRequestsSQL = "CREATE TABLE IF NOT EXISTS " + TABLE_USER_REQUESTS + " (id INTEGER PRIMARY KEY AUTOINCREMENT, fk_user_id INTEGER, name_request VARCHAR, form VARCHAR, request VARCHAR, response VARCHAR, created DATETIME)";
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
        
        casChart.form = new CasCodeForm($(this).serializeArray());
        casChart.request = new CasCreateRquest(casChart.form.parseObject());
        
        if ($("#" + FORM_INDEX_ID_CODE).val().length > 0) {
            $.post(casChart.form.CAS_SERVER_URL, casChart.request.getRequest('json'), function(response) {
                casChart.response = new CasParseResponse(response);

                if (casChart.response.getType() !== null) {
                    switch (casChart.response.getType()) {
                        // graphs
                        case 'graphs':
                            showCharts(casChart.response.getGraphs());
                            break;

                        // formulas
                        case 'formulas':
                            break;
                    }

                    generateAlertMessage('hide', 'alertIndex', ALERT_ERROR);
                }
                else {
                    generateAlertMessage('show', 'alertIndex', ALERT_ERROR, casChart.response.getResponseResult().replace(/\n/g, "<br />"));
                }

                if (storage.isUserLogged())
                    link_save_program.show();

                boxLoading("hide");
                console.log("SUCCESS: Server sent response");
            }, "json")
            .fail(function() {
                generateAlertMessage('show', 'alertIndex', ALERT_ERROR, ALERT_MESSAGES[0]);
                boxLoading("hide");
                console.log("ERROR: Server doesn't respond");
            })
        }
        else {
            generateAlertMessage('show', 'alertIndex', ALERT_ERROR, ALERT_MESSAGES[2]);
            boxLoading("hide");
            console.log("ERROR: All fields are mandatory.");
        }
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

$(document).on("pageshow", "#index", function(event, data) {
    // load chart
    if (casChart.response !== null)
        showCharts(casChart.response.getGraphs());
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
                            storage.setFirstOpen(1);

                            var dbSQL = "INSERT INTO " + TABLE_USERS + " (id, name, email) VALUES ('" + id + "', '" + name + "', '" + email + "')";
                            dbUsers.runTransaction(function(tx) {
                                    tx.executeSql(dbSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
                                });
                        }
                        
                        generateAlertMessage('hide', 'alertLogin', ALERT_ERROR);
                        $.mobile.changePage( ROOT_PATH + "index.html", {});
                        console.log("SUCCESS: User was successful login"); 
                    }
                    break;
                case 2:
                    generateAlertMessage('show', 'alertLogin', ALERT_ERROR, ALERT_MESSAGES[2]);
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
                    if (response.attributes) {
                        with (response.attributes) {
                            storage.setUserId(id);
                            storage.setFirstOpen(1);

                            var dbSQL = "INSERT INTO " + TABLE_USERS + " (id, name, email) VALUES ('" + id + "', '" + name + "', '" + email + "')";
                            dbUsers.runTransaction(function(tx) {
                                    tx.executeSql(dbSQL, [], dbUsers.successCallback, dbUsers.errorCallback);
                                });
                        }

                        generateAlertMessage('hide', 'alertŔegistration', ALERT_ERROR);
                        $.mobile.changePage( ROOT_PATH + "index.html", {});
                        console.log("SUCCESS: User was successful login"); 
                    }
                    
                    break;
                case 2:
                    generateAlertMessage('show', 'alertŔegistration', ALERT_ERROR, ALERT_MESSAGES[2]);
                    console.log("ERROR: All fields are mandatory");
                    break;
                case 3:
                    generateAlertMessage('show', 'alertŔegistration', ALERT_ERROR, ALERT_MESSAGES[3]);
                    console.log("WARRNING: Email address is registered");
                    break;
            }

            boxLoading("hide");
        }, "json")
        .fail(function() {
            generateAlertMessage('show', 'alertIndex', ALERT_ERROR, ALERT_MESSAGES[0]);
            console.log("ERROR: Server doesn't respond");
        });
    });
});

/**
 * Save program dialog page
 */
$(document).on("pageinit", "#saveProgramBox", function(event, data) {
    $("form#saveProgramForm").on("submit", function(event, data) {
        var program_name = $("input#save-program-name").val();
        event.preventDefault();
        boxLoading("show", "Sending...", "b", "");

        if (program_name !== "") {
            casChart.name = program_name;

            var dbUserRequestsSQL = "INSERT INTO " + TABLE_USER_REQUESTS + " (fk_user_id, name_request, form, request, response, created) VALUES ('" + storage.getUserId() + "', '" + casChart.name + "', '" + JSON.stringify(casChart.form.getData()) + "', '" + JSON.stringify(casChart.request.getRequest('json')) + "', '" + JSON.stringify(casChart.response.getResponse()) + "', '00:00:00')";
            dbUserRequests.runTransaction(function(tx) {
                    tx.executeSql(dbUserRequestsSQL, [], dbUserRequests.successCallback, dbUserRequests.errorCallback);
                });

            generateAlertMessage('hide', 'alertSaveProgram', ALERT_ERROR);
            $.mobile.changePage( ROOT_PATH + "index.html", {});
        }
        else
            generateAlertMessage('show', 'alertSaveProgram', ALERT_ERROR, ALERT_MESSAGES[2]);

        setTimeout('boxLoading("hide")', 500);
    });
});

/**
 * Load saved requests dialog page
 */
$(document).on("pagebeforeshow", "#loadRequestsBox", function(event, data) {
    if (!storage.isUserLogged()) {
        generateAlertMessage('show', 'alertLoadRequests', ALERT_ERROR, ALERT_MESSAGES[5]);
    }
    else {
        var dbUserRequestsSQL = "SELECT * FROM " + TABLE_USER_REQUESTS + " WHERE fk_user_id = " + storage.getUserId();
        dbUserRequests.runTransaction(function(tx) {
                tx.executeSql(dbUserRequestsSQL, [], loadSavedRequestsCallback, dbUserRequests.errorCallback);
            });
    }
});

/**
 * Load example requests dialog page
 */
/*
$(document).on("pageinit", "#loadExampleRequestsBox", function(event, data) {
    if (storage.getUserId() === null) {

    }
    else {
        var dbUserRequestsSQL = "SELECT * FROM " + TABLE_USER_REQUESTS + " WHERE fk_user_id = 0";
        dbUserRequests.runTransaction(function(tx) {
                tx.executeSql(dbUserRequestsSQL, [], loadSavedRequestsCallback, dbUserRequests.errorCallback);
            });
    }
});
*/
/**
 * Page before show
 */
$(document).on("pagebeforeshow", function(event, data) {
    button_login_user = $(".button-login-name");
    link_registration = $(".link-registration");
    link_login = $(".link-login");
    link_logout = $(".link-logout");
    link_save_program = $(".link-save-program");
    
    // is user logged
    if (storage.isUserLogged()) {
        var dbUsersSQL = "SELECT name FROM " + TABLE_USERS + " WHERE id = " + storage.getUserId();
        dbUsers.runTransaction(function(tx) {
                tx.executeSql(dbUsersSQL, [], loginCallback, dbUsers.errorCallback);
            });
    }
    // isn't user logged
    else {
        button_login_user.hide();
        link_registration.show();
        link_login.show();
        link_logout.hide();
        link_save_program.hide();
    }

    // logoff user
    $(".link-logout a").on("click", function() {
        boxLoading("show", "Logout...", "b", "");

        var dbUsersSQL = "DELETE FROM " + TABLE_USERS + " WHERE id = " + storage.getUserId();
        dbUsers.runTransaction(function(tx) {
                tx.executeSql(dbUsersSQL, [], loginCallback, dbUsers.errorCallback);
            });

        var dbUserRequestsSQL = "DELETE FROM " + TABLE_USER_REQUESTS + " WHERE fk_user_id = " + storage.getUserId();
        dbUserRequests.runTransaction(function(tx) {
                tx.executeSql(dbUserRequestsSQL, [], dbUserRequests.successCallback, dbUserRequests.errorCallback);
            });

        $.mobile.changePage( ROOT_PATH + "index.html", {});
        $("#nav-panel").panel("close");
        setTimeout('boxLoading("hide")', 1000);
    });
});

