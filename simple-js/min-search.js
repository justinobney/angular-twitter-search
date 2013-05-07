jQuery('#searchForm').on('submit', function(e){
    e.preventDefault();
    var result_list = $('#resultList').empty();
    $.ajax({
        url: 'http://search.twitter.com/search.json?q=' + escape($('#searchTerm').val()),
        dataType: 'jsonp',
        success: function(search_results){
            $.each(search_results.results, function(idx, tweet){
                var li = '<li><strong>{{username}}</strong> - {{tweet}}</li>'.replace('{{username}}', tweet.from_user_name).replace('{{tweet}}', tweet.text);
                result_list.prepend(li);
            });
        }
    });
});
