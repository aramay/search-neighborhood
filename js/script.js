
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetViewUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=";

    // YOUR CODE GOES HERE!
    var street = $("#street").val();
    var city = $("#city").val();

    var address = street + city;

    var address_street_view = streetViewUrl + street + ", " + city;

    var img = '<img class="bgimg" src="'+address_street_view+'"/>';

    $body.append(img);
    // NY TIMES AJAX REQUEST
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    var nyt_article_link = "";
    var nyt_article_paragraph = "";
    var nyt_article_headline = "";

    var article_container = $("#nytimes-articles");

    $.getJSON(nyt_url, function(data){
        console.log("nyt_api call", data);

        for (var i = 0; i < data.response.docs.length; i++) {
            nyt_article_paragraph = data.response.docs[i].lead_paragraph;
            nyt_article_link = data.response.docs[i].web_url;
            nyt_article_headline = data.response.docs[i].headline.main;

            article_container.append('"<li class="article"><a href=" '+nyt_article_link+'">"'+nyt_article_headline+'"</a><p>"'+ nyt_article_paragraph+'"</p></li>"');
        }

        // console.log(nyt_article_link);
        // console.log(nyt_article_paragraph);

        $("#nytimes-header").replaceWith('"<h3 id="nytimes-header">"New York Times Articles"'+address+'"</h3>"');

    }).error(function(data){
        console.log(data, "error");

        $("#nytimes-header").replaceWith('"<h3 id="nytimes-header">"New York Times Articles Could Not be Loaded"</h3>"');
        // $("#nytimes-header").replaceWith('"<h3 id="nytimes-header">"New York Times Articles"'+address_street_view+'"</h3>"');
    });

    // WIKI AJAX REQUEST
    var wiki_url = 'http://en.wikipediaasdasdad.org/w/api.php?action=opensearch&search='+address+'&format=json&callback=wikiCallBack';

    // Error handling
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    });
    $.ajax({
      url: wiki_url,
    //   data: { action: 'query', list: 'search', srsearch: 'san francisco', format: 'json' },
      dataType: 'jsonp',
      success: function (response) {
        console.log(response);
        // console.log('title', x.query.search[0].title);
        cities = response["1"];

        for (var i = 0; i < cities.length; i++) {
            article_string = cities[i];
            var url = "https://en.wikipedia.org/wiki/" +  article_string;

            $("#wikipedia-header").append('<li><a href="'+url+'">' +article_string+'</a></li>"');
        }

        clearTimeout(wikiRequestTimeout);
    }
  });

    // var liTag = '"<li class="article"><a href=" '+articleLink+'"><p>"'+ paragraph+'"</p></li>"';

    return false;
};

$('#form-container').submit(loadData);
