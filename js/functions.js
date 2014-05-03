/**
 * [boxLoading description]
 * @param  {String} action [description]
 * @param  {String} text   [description]
 * @param  {String} theme  [description]
 * @param  {String} html   [description]
 */
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

/**
 * [loginCallback description]
 * @param  {[type]} transaction [description]
 * @param  {[type]} result      [description]
 */
function loginCallback(transaction, result) {
    if (button_login_user !== null && result.rows.length > 0) {
        button_login_user.html(result.rows.item(0).name + "&nbsp;&nbsp;");
        button_login_user.show();

        link_registration.hide();
        link_login.hide();
        link_logout.show();
    }
    else {
        button_login_user.hide();
        button_login_user.hide("");

        storage.setUserId(null);
        storage.setFirstOpen(null);

        link_registration.show();
        link_login.show();
        link_logout.hide();
        link_save_program.hide();
    }
}

/**
 * [loadSavedRequestsCallback description]
 * @param  {Object} transaction [description]
 * @param  {Object} result      [description]
 */
function loadSavedRequestsCallback(transaction, result) {
    var i = 0;
    var html = '';
    var content = $("div.load-requests-data");

    if (result.rows.length !== 0) {
        // head
        html += '<table style="width:100%;" data-role="table" id="table-custom-2" data-mode="columntoggle" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-btn-theme="b" data-column-btn-text="Columns to display..." data-column-popup-theme="a">';
        html += '<thead>';
        html += '   <tr class="ui-bar-d">';
        html += '       <th>Id</th>';
        html += '       <th>Názov</th>';
        html += '       <th data-priority="1">Zobraziť</th>';
        html += '       <th data-priority="1">Zmazať</th>';
        html += '   </tr>';
        html += '</thead>';

        // body
        html += '<tbody>';
        for (i = 0; i < result.rows.length; i++) {
            with(result.rows.item(i)) { 
                html += '<tr>';
                html += '   <th data-priority="2">' + id + '</th>';
                html += '   <td style="padding-left:10px;padding-right:10px;"><strong>' + name_request + '</strong></td>';
                html += '   <td data-priority="1"><a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext ui-corner-all" onclick="showSavedRequest(' + id + ')" style="margin: 0 auto;">&nbsp;</a></td>';
                html += '   <td data-priority="1"><a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" style="margin: 0 auto;">&nbsp;</a></td>';
                html += '</tr>';
            }
        }

        html += '</tbody>';
        html += '</table>';

        generateAlertMessage('hide', 'alertLoadRequests', ALERT_WARRNING);
        content.html(html);
    }
    else
        generateAlertMessage('show', 'alertLoadRequests', ALERT_WARRNING, ALERT_MESSAGES[4]);
}

/**
 * [loadSavedRequestsCallback description]
 * @param  {Object} transaction [description]
 * @param  {Object} result      [description]
 */
function showSavedRequest(id) {
    var user_id = storage.getUserId();
    var dbSQL = "SELECT name_request, form, request, response FROM user_requests WHERE id = " + id + " AND fk_user_id = " + user_id;
    
    dbUserRequests.runTransaction(function(tx) {
            tx.executeSql(dbSQL, [], showSavedRequestCallback, dbUserRequests.errorCallback);
        });
}

/**
 * [loadSavedRequestsCallback description]
 * @param  {Object} transaction [description]
 * @param  {Object} result      [description]
 */
function showSavedRequestCallback(transaction, result) {
    if (result.rows.length > 0) {
        with (result.rows.item(0)) {
            casChart.name = name_request;
            casChart.form = new CasCodeForm(JSON.parse(form));
            casChart.request = new CasCreateRquest(casChart.form.parseObject());
            casChart.response = new CasParseResponse(JSON.parse(response));
            console.log(casChart.request.getCode());
            $("#" + FORM_INDEX_ID_CODE).val(casChart.request.getCode());
        }

        $.mobile.changePage( ROOT_PATH + "index.html", {});
    }
}


/**
 * [generateAlert description]
 * @param  {[type]} action [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} type   [description]
 * @param  {[type]} code   [description]
 */
function generateAlertMessage(action, id, type, message) {
    $("div[id*='alert']").removeClass(ALERT_INFO);
    $("div[id*='alert']").removeClass(ALERT_WARRNING);
    $("div[id*='alert']").removeClass(ALERT_SUCCESS);
    $("div[id*='alert']").removeClass(ALERT_ERROR);

    if (action === "show") {
        $("#" + id).addClass(type);
        $("#" + id).html(message);

        if ($("#" + id).is(":visible") === false)
            $("#" + id).slideDown();
    } 
    else if (action === "hide") {
        if ($("#" + id).is(":visible") === true) {
            $("#" + id).removeClass(type);
            $("#" + id).html("");
            $("#" + id).slideUp();
        }
    };
}

function showCharts(charts) {
    var chartBox = $('#charts');

    chartBox.html('<div class="chart" style="height: 300px;"></div>')
    chartBox.show();
    chartBox.children('div.chart').eq(0).highcharts(charts['2d'][0]);
}