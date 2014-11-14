if (Meteor.isClient) {
	var apiKey = "myKey";
	var srcTxt = "Hi";
	var srcLang = "en";
	var tarLang = "en";

	Template.translationTemplate.events({
		"click button": function (e, t) {

			tarLang = document.getElementById("tarLangOpts").value;
			srcTxt = encodeURIComponent(document.getElementById("source").value);
			var url = "https://www.googleapis.com/language/translate/v2?key=" + apiKey + "&q=" + srcTxt + "&source=" + srcLang + "&target=" + tarLang;

			HTTP.call("GET", url, function(err, res) {
				if (err) console.log(err);
				if (res && res.statusCode === 200) {
					var tarTxt = res.data.data.translations[0].translatedText;
					document.getElementById("tarTxt").innerText = tarTxt;
				}
			});

			/* Meteor.call("getTranslation", encodeURIComponent(srcTxt), srcLang, tarLang, function(err, res){
			    if(err) console.log(err);
			    else console.log(res);
			    var tarTxt = res.data.translations[0].translatedText;
			    document.getElementById("tarTxt").innerText = tarTxt;
			});*/
		}
	});

	//Fill dropdown with available languages (well, the language code)
	HTTP.get("https://www.googleapis.com/language/translate/v2/languages?key=" + apiKey, function(err, res) {
		if (err) console.log(err);
		if (res && res.statusCode === 200) {
			var i, list = res.data.data.languages,
			length = list.length,
			dropdown = document.getElementById("tarLangOpts");

			if (length > 0){
				dropdown.innerHTML = "";
				for(i=0; i < list.length; i++){
					dropdown.innerHTML += "<option value='" + list[i].language + "'>" + list[i].language + "</option>";
				}
			}
		}
	});
}

if (Meteor.isServer) {
	//currently unused
	Meteor.methods({
		getTranslation: function(srcTxt, srcLang, tarLang){
			var apiKey = "myKey";
			var url = "https://www.googleapis.com/language/translate/v2?key=" + apiKey + "&q=" + srcTxt + "&source=" + srcLang + "&target=" + tarLang;
			var result = HTTP.call("GET", url);
			if (result.statusCode === 200) {
				return result.data;
			} else {
				return result;
			}
		}
	});
}
