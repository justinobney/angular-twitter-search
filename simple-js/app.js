var twitter_search_url_base = 'http://search.twitter.com/search.json?q=';

jQuery(document).on('submit', '#searchForm', function(e){
    e.preventDefault();
    var form = $(e.target);
    var search_term = form.find('#searchTerm').val();
    var safe_string = escape(search_term);
    var result_list = $('#resultList');

    result_list.empty().text('Searching...');

    var dfd = $.ajax({
        url: twitter_search_url_base + safe_string,
        dataType: 'jsonp'
    });

    dfd.done(function(search_results){
        var tweets = search_results.results;
        var template = '<li>{{username}} - {{tweet}}</li>';
        result_list.empty();

        $.each(tweets, function(idx, tweet){
            var tweetText = replaceURLWithHTMLLinks(tweet.text);
            var li = template.replace('{{username}}', tweet.from_user_name).replace('{{tweet}}', tweetText);
            result_list.prepend(li);
        });
    });
});


function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}
