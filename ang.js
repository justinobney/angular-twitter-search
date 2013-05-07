// Create an application
var app = angular.module('twittersearch', []);

// This is the single controller in my application
app.controller( 'AppCtrl', function AppCtrl($scope, $http, twitterSearchService) {

    $scope.tweets = [];
    $scope.recentSearches = [];
    $scope.term = "";

    // used when selecting a previous search from the list
    $scope.setSearch = function(term){
        $scope.term = term;
        $scope.searchTwitter();
    };

    $scope.searchTwitter = function() {
        updateRecentSearches();

        twitterSearchService.search($scope.term).success(function(search_results){
            // we want to create a proxy object to be used in our template
            $scope.tweets = _.map(search_results.results, function(item){
                return {
                    from_user_name: item.from_user_name,
                    text: replaceURLWithHTMLLinks(item.text)
                };
            });
        });
    };

    // Check to see if the current search already exists
    // If so update it's timestamp, otherwise add it to the lsit
    function updateRecentSearches(){
        var found = false;

        angular.forEach($scope.recentSearches, function(value, key){
            if (value.term === $scope.term) {
                value.timestamp = new Date();
                found = true;
                return;
            }
        });

        if ( !found ) {
            $scope.recentSearches.push({
                term: $scope.term,
                timestamp: new Date()
            });
        }

        $scope.recentSearches = _.sortBy($scope.recentSearches, function(obj){ return obj.timestamp; }).reverse();
    }

    function replaceURLWithHTMLLinks(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
    }
});

// simple query against the twitter JSON API
app.factory('twitterSearchService', function($http) {
    var twitter_search_url_base = 'http://search.twitter.com/search.json?q=';

    return {
        search : function(search_term) {
            var dfd = $http.jsonp(twitter_search_url_base + escape(search_term) + '&callback=JSON_CALLBACK');
            return dfd;
        }
    };
});
