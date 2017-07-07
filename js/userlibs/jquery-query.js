;define(function(require, exports, module){
    var $ = require('jquery');

    $.escapeRegExp = function(str) {
        return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(match) {
            return '\\' + match;
        })
    };

    $.query = {
        get: function(key) {
            return this.parse(window.location.search, key);
        },

        parse: function(str, key) {
            var value = str.match(new RegExp('(?:\\?|&)' + $.escapeRegExp(key) + '=(.*?)(?:$|&)', 'i'));
            return value ? decodeURIComponent(value[1]) : '';
        }
    };
});
