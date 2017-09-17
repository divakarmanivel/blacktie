/////////////////////////////////////
//BLACKTIE.JS FUNCTIONS START HERE//
///////////////////////////////////

var blacktie = {
	init: function () {
		return blacktie;
	},
	hammenu: function () {
		hamburger.initialize();
	},

	////////////
	//CONSOLE//
	//////////

	//logs a message to console
	log: function (msg) {
		console.log(msg);
		return false;
	},

	////////////
	//STORAGE//
	//////////

	//stores a <key,vaue> pair to localStorage
	setItem: function (key, value) {
		window.localStorage.setItem(key, value);
		return false;
	},

	//gets the value for a specified key in localStorage
	getItem: function (key) {
		return window.localStorage.getItem(key);
	},

	//stores a <key,vaue> pair to sessionStorage
	setVal: function setVal(key, value) {
		window.sessionStorage.setItem(key, value);
		return false;
	},

	//gets the value for a specified key in sessionStorage
	getVal: function (key) {
		return window.sessionStorage.getItem(key);
	},

	//////////////////
	//NOTIFICATIONS//
	////////////////

	//shows a notification message
	notify: function (msg, type) {
		var color = "#0274e9";
		if (type == "alert") color = "#888888";
		else if (type == "error") color = "#f10909";
		else if (type == "success") color = "#00d723";
		$("#status-msg").css("background-color", color);
		document.getElementById("status-msg").innerHTML = msg;
		$("#status-msg").fadeIn('slow', function () {
			setTimeout(function () {
				$("#status-msg").fadeOut('slow');
			}, 3000);
		});
		return false;
	},

	///////
	//UI//
	/////

	//sets the content of the containing body element
	setContent: function (content) {
		$("#container").empty();
		document.getElementById("container").innerHTML = content;
		return false;
	},

	//sets the style of the target element
	setStyle: function (style, targetId) {
		var currDOM;
		if (/.|#/.test(targetId)) {
			currDOM = $(targetId);
		} else {
			console.log("Invalid class/id");
			notify("Something went wrong!", "alert");
			return false;
		}
		var params = JSON.parse(style);
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				currDOM.css(key, params[key]);
				blacktie.log(targetId + "{ " + key + ":" + params[key] + " }");
			}
		}
		return false;
	},

	//opens a page in the containing body
	openPage: function (pageurl) {
		if (!pageurl) return false;
		var container = $("#container");
		container.empty();
		container.load(pageurl);
		log("new page: " + pageurl);
		return false;
	},

	createCard: function (title) {
		var card = {
			title: title
		};
		return card;
	},

	createButton: function (text, callback) {
		var button = {
			text: text,
			callback: callback
		};
		return button;
	},

	//creates a card element
	createCards: function (cards) {
		Object.keys(cards).forEach(function (card) {
			var cardDiv = document.createElement("div"),
				titleDiv = document.createElement("div"),
				btnsDiv = document.createElement("div");
			cardDiv.className = "card";
			titleDiv.className = "title";
			btnsDiv.className = "btns";
	
			var c = cards[card];
			var name;
			Object.keys(c).forEach(function (button) {
				var b = c[button];
				if (button == "title") {
					name = b;
				} else {
					var btncardDiv = document.createElement("div");
					btncardDiv.className = "btn-card";
					btncardDiv.onclick = b.callback;
					btncardDiv.innerHTML = b.text;
					btnsDiv.appendChild(btncardDiv);
				}
			});
			
			titleDiv.innerHTML = name;
			cardDiv.appendChild(titleDiv);
			cardDiv.appendChild(btnsDiv);
		});
		/*
				buttons = buttons.split(",");
				callbacks = callbacks.split(",");
				for (var i = 0; i < buttons.length; i++) {
					var btncardDiv = document.createElement("div");
					btncardDiv.className = "btn-card";
					btncardDiv.onclick = callbacks[i];
					btncardDiv.innerHTML = buttons[i];
					btnsDiv.appendChild(btncardDiv);
				}

				titleDiv.innerHTML = title;
				cardDiv.appendChild(titleDiv);
				cardDiv.appendChild(btnsDiv);
				return cardDiv;
			*/
	},

	//shows a loading element
	showLoading: function () {
		if (!document.getElementById("loading")) {
			mObj = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
			mObj.className = "modalContainers";
			mObj.id = "loading";
			mObj.style.height = document.documentElement.scrollHeight + "px";
			spinner = mObj.appendChild(document.createElement("div"));
			spinner.id = "spinner";
			spinner1 = mObj.appendChild(document.createElement("div"));
			spinner1.id = "spinner1";
			spinner2 = mObj.appendChild(document.createElement("div"));
			spinner2.id = "spinner2";
			spinner3 = mObj.appendChild(document.createElement("div"));
			spinner3.id = "spinner3";
			spinner4 = mObj.appendChild(document.createElement("div"));
			spinner4.id = "spinner4";
			spinner5 = mObj.appendChild(document.createElement("div"));
			spinner5.id = "spinner5";
		}
		return false;
	},

	//hides the loading element
	hideLoading: function () {
		if (document.getElementById("loading")) {
			document.getElementsByTagName("body")[0].removeChild(document.getElementById("loading"));
		}
		return false;
	},

	////////////
	//NETWORK//
	//////////

	//opens an oauth connection to a service
	openOauth: function (baseurl, tokenurl, clientid, apikey, scope, responsetype, other, callback) {
		showLoading();
		var connectionstatus = window.navigator.onLine;
		if (!connectionstatus) {
			log("no internet connection");
			notify("Unable to connect to the Internet.\nPlease check your network connection and try again.", "error");
			hideLoading();
			return false;
		}

		if (/\?$/.test(baseurl) && (baseurl.indexOf("?") == (baseurl.length - 1))) {
			baseurl = baseurl.slice(0, -1);
		}
		if (!tokenurl) {
			tokenurl = "";
		}
		if (/\?$/.test(tokenurl) && (tokenurl.indexOf("?") == (tokenurl.length - 1))) {
			tokenurl = tokenurl.slice(0, -1);
		}
		if (!clientid) {
			clientid = "";
		}
		if (!apikey) {
			apikey = "";
		}
		if (responsetype == "token" || responsetype == "" || !responsetype) {
			responsetype = "token";
		} else {
			responsetype = "code";
		}
		if (!other) {
			other = "";
		}

		if ((!baseurl || !scope) || (!clientid && !apikey) || (responsetype == "code" && tokenurl == "")) {
			notify("Invalid request.", "alert");
			return false;
		}
		oauth.authorize({
			base_url: baseurl,
			token_url: tokenurl,
			client_id: clientid,
			api_key: apikey,
			redirect_uri: "http://localhost",
			response_type: responsetype,
			scope: scope,
			other: other
		}).done(function (response) {
			log("logged in");
			setItem("oauth_token", response.access_token);
		}).fail(function (response) {
			log("error: " + response.error);
			setItem("oauth_token", response.access_token);
			notify("Error signing in. :( ", "error");
		});
		return false;
	},

	//sends a get or post request
	sendRequest: function (url, method, data, headers, callback) {
		showLoading();
		var connectionstatus = window.navigator.onLine;
		if (!connectionstatus) {
			log("no internet connection");
			notify("Unable to connect to the Internet.\nPlease check your network connection and try again.", "error");
			hideLoading();
			return false;
		}
		method = method.toUpperCase();
		if ((method != "GET") || (method != "POST")) {
			method = "GET";
		}
		data = JSON.stringify(data);
		headers = JSON.stringify(headers);
		$.ajax({
			url: url,
			type: method,
			data: data,
			headers: headers,
			dataType: 'json',
			success: function (data) {
				callback();
			}
		});
		return false;
	}
};

//creates a database with specified name
function createDb(name, columns) {
	name = name.split(".db")[0];
	name = name + ".db";
	var heading = " (id integer primary key autoincrement, ";
	columns = columns.split(",");
	columns.forEach(function (entry) {
		heading = heading + entry + ", ";
	});
	heading = heading.slice(0, -2);
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE IF EXISTS ' + name);
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + name + heading + ')');
	});
	log("created table " + name);
	return false;
}

//adds a row to the database
function addRow(name, columns, values) {
	values = values.split(",");
	values = JSON.stringify(values);
	values = values.replace("[", "(");
	values = values.replace("]", ")");
	var insertStatement = "INSERT INTO " + name + "(" + columns + ") " + "VALUES(" + values + ")";
	db.transaction(function (tx) {
		tx.executeSql(insertStatement);
		log("added row to " + name + " table");
	});
	return false;
}

//adds a column to the database
function addColumn(name, column) {
	db.transaction(function (tx) {
		tx.executeSql("ALTER TABLE " + name + "ADD " + column + " NOT NULL DEFAULT '' ");
	});
	log("added column to " + name + " table");
	return false;
}

//initializes the hamburger menu
var hamburger = {
	title: document.title,
	initialize: function () {
		var mywindow = $(window),
			mypos = mywindow.scrollTop(),
			up = false,
			newscroll,
			hamheight = $(".ham-header").outerHeight(true),
			hammenu = document.getElementById("ham-menu"),
			haminput = document.createElement("input"),
			hamlabel = document.createElement("Label"),
			hamheader = document.createElement("div"),
			emptydiv = document.createElement("div");

		haminput.type = "checkbox";
		haminput.id = "ham-trigger";
		$("#ham-menu").after(haminput);

		hamlabel.setAttribute("for", "ham-trigger");
		$("#ham-trigger").after(hamlabel);

		hamheader.id = "ham-header";
		$("label[for=ham-trigger]").after(hamheader);

		var title = hamburger.title;
		$("#ham-header").append(title);

		emptydiv.id = "emptyHeaderElement";
		$("#ham-header").after(emptydiv);

		if ($("#ham-trigger").is(":checked")) {
			$(".ham-item").css("display", "block");
		} else {
			$(".ham-item").css("display", "none");
		}
		$("#ham-trigger").change(function () {
			if ($(this).is(":checked")) {
				$(".ham-item").css("display", "block");
			} else {
				$(".ham-item").css("display", "none");
			}
		});

		mywindow.scroll(function () {
			newscroll = mywindow.scrollTop();

			if (newscroll == ($(document).height())) {
				return;
			}

			if (!up && newscroll <= hamheight) {
				window.scrollTo(hamheight, mywindow.scrollLeft());
			} else if (newscroll > mypos && !up) {
				$("#ham-header").stop().slideToggle();
				$("label[for=ham-trigger]").stop().slideToggle();
				$("#emptyHeaderElement").stop().slideToggle();
				up = !up;
			} else if (newscroll < mypos && up) {
				$("#ham-header").stop().slideToggle();
				$("label[for=ham-trigger]").stop().slideToggle();
				$("#emptyHeaderElement").stop().slideToggle();
				up = !up;
			}
			mypos = newscroll;
		});
	}
};

//////////
//OAUTH//
////////

var oauth = {
	authorize: function (options) {
		//Create the Deferred object
		var deferred = $.Deferred(),
			//Build the OAuth consent page URL
			options = stripNullObject(options),
			baseurl = options.base_url,
			tokenurl = options.token_url,
			other = options.other;

		delete options.base_url;
		delete options.token_url;
		delete options.other;

		var authUrl = baseurl + "?" + $.param(options);
		if (other) {
			authUrl = authUrl + "&" + other;
		}

		//Open the OAuth consent page in the InAppBrowser
		var oauthWindow = window.open(authUrl, "_blank", "location=no,toolbar=no");
		$(oauthWindow).on('loadstart', function (event) {
			var url = event.originalEvent.url;
			//If response is type code
			if (options.response_type == "code") {
				var code = /\?code=(.+)$/.exec(url);
				var error = /\?error=(.+)$/.exec(url);

				if (code || error) {
					//Always close the browser when match is found
					oauthWindow.close();
					log("oauth response received");
					if (code) {
						log("sending access token request");
						//Exchange the authorization code for an access token
						$.ajax({
							url: options.tokenurl + '?grantType=authorizationCode',
							data: {
								code: code[1],
								client_id: options.client_id,
								redirect_uri: options.redirect_uri,
								grant_type: 'authorization_code'
							},
							type: 'POST',
							success: function (data) {
								log("oauth success");
								deferred.resolve(data);
							},
							error: function (data) {
								log("oauth error: " + data.responseJSON.error);
								deferred.reject(data.responseJSON);
							}
						});
					} else if (error) {
						//The user denied access to the app
						log("oauth error: " + error[1]);
						deferred.reject({
							error: error[1]
						});
					}

				}

			} //If response is type token
			else if (options.response_type == "token") {
				var one = url.split("access_token=")[1];
				var two = one.split("&token_type=")[1];
				var access_token = one.split("&token_type=")[0];
				var token_type = two.split("&expires_in=")[0];
				var expires_in = two.split("&expires_in=")[1];
				var error = url.split("error=")[1];

				if (access_token || error) {
					//Always close the browser when match is found
					oauthWindow.close();
					log("oauth response received");
					if (access_token) {
						log("oauth success");
						deferred.resolve({
							access_token: access_token,
							token_type: token_type,
							expires_in: expires_in
						});
					} else if (error) {
						log("oauth error: " + error);
						deferred.reject({
							error: error
						});
					}
				}

			}
		});
		return deferred.promise();
	}
};

////////////
//HELPERS//
//////////

//strips away null objects in a parent object
function stripNullObject(obj) {
	for (var i in obj) {
		if (!obj[i]) delete obj[i];
	}
	return obj;
}

//pre-loads images for smoother performance
var imager = function () {
	var i = 0;
	var tags = document.getElementsByTagName("img");
	imageObj = new Image();

	for (i = 0; i < tags.length; i++) {
		imageObj = tags[i].getAttribute("src");
		tags[i].setAttribute("src", imageObj);
		log(imageObj);
	}
};
imager();

//initializes the notifier
var notifier = function () {
	mObj = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
	mObj.id = "status-msg";
};
notifier();