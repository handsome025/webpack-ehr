﻿;(function (factory) {

    // CommonJS/NodeJS
    /*if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require, exports, module);
    }*/
    // CMD/SeaJS
    if (typeof define === 'function') {
        define(factory);
    }
    // No module loader
    else {
        window['Loading'] = factory(function() {});
    }

}(function (require, exports, module) {

    var gifBase64 = 'url(data:image/gif;base64,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) no-repeat center center';

    var defaults = {
        zIndex: 100000,
        parentOpacity: 0,
        childOpacity: 0.8
    };

    var parent;
    var child;



    function create(options) {
        // options = extend(defaults, options || {});
        parent = document.createElement('div');
        // if($.support.leadingWhitespace){
            css(parent, getParentStyle(options));
        // }

        child = document.createElement('div');
        // if($.support.leadingWhitespace){
            css(child, getChildStyle(options));
        // }

        parent.appendChild(child);
        document.body.appendChild(parent);
    }

    function css(obj, styles) {
        for(var key in styles) {
            obj.style[key] = styles[key];
        }
    }


    function getParentStyle(options) {
        options = options || {};
        return {
            'position': 'fixed',
            'left': 0,
            'top': 0,
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,' + (defaults.parentOpacity || options.parentOpacity)  + ')',
            'z-index': defaults.zIndex || options.zIndex
        };
    }

    function getChildStyle(options) {
        options = options || {};
        return {
            'position': 'fixed',
            'left': '50%',
            'top': '50%',
            'margin': '-30px 0 0 -30px',
            'width': '60px',
            'height': '60px',
            'border-radius': '5px',
            'background': 'rgba(0,0,0,' + (defaults.childOpacity || options.childOpacity) + ') ' + gifBase64,
            'z-index': (defaults.zIndex || options.zIndex) + 1
        };
    }

    // function extend(a, b) {
    //     var o = {};
    //     for(var key in a) {
    //         o[key] = a[key];
    //     }
    //     for(var key in b) {
    //         o[key] = b[key];
    //     }
    //     return o;
    // }

    function show(options) {
        if(document.body) {
            hide();
            create(options);
        }
    }

    function hide() {
        if(parent) {
            document.body.removeChild(parent);
            parent = null;
        }
    }

    return {
        show: show,
        hide: hide
    };

}));