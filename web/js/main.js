/*
 *
 * mads - version 2
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function() {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function() {
    return new Date().getTime();
}

/* Link Opner */
mads.prototype.linkOpener = function(url) {

    if (typeof url != "undefined" && url != "") {
        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
}

/* tracker */
mads.prototype.tracker = function(type, name) {
    console.log(type);

    /*
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');
            img.src = this.custTracker[i] + type + '&' + this.id;
            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function(js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function(href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

/*
 *
 * Unit Testing for mads
 *
 */
var testunit = function() {
    var app = new mads();
    var url = 'https://www.pizzahut.co.id/menu/tea-time';

    app.loadCss(app.path + 'css/style.css');

    var contentHtml = function() {
        app.contentTag.innerHTML =
        '<div class="firstBg"></div> \
        <div class="secondBg"></div> \
        <div class="coupon"></div> \
        <div class="coupon-title"></div> \
        <div class="coupon-text"></div> \
        <div class="landing-page-bttn"></div> \
        <div class="share-wa"><a href="whatsapp://send?text=' + url + '" data-action="share/whatsapp/share"></a></div>   \
        <div class="share-fb"><a href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" target="_blank"></a></div>';
    };

    var renderTemplate = function() {

        var tweenMaxLoad = function() {

            function initializeContent() {

                contentHtml();

                TweenMax.to(".coupon", 1, {
                    delay: .5,
                    marginLeft: "100%",
                    ease: Power4.easeOut,
                    force3D:false
                });

                TweenMax.to(".coupon-title", 1, {
                    delay: 1.5,
                    marginLeft: "108%",
                    ease: Power4.easeOut,
                    force3D:false
                });

                TweenMax.to(".coupon-text", 1, {
                    delay: 2.5,
                    opacity: "1"
                });

                $("#rma-widget").on('click', function() {
                    $('.firstBg').hide();
                    $('.secondBg').show();

                    $('.share-wa').show();
                    $('.share-fb').show();
                    $('.landing-page-bttn').show();

                    $("#rma-widget").off('click');

                    app.tracker('E', 'start');
                });

                $('.share-wa').on('click', function(){
                    app.tracker('E', 'whatsapp');
                });

                $('.share-fb').on('click', function(){
                    app.tracker('E', 'facebook');
                });

                $('.landing-page-bttn').on('click', function(){
                    app.linkOpener(url);
                    app.tracker('CTR', 'landing');
                });
            }

            initializeContent();
        }

        app.loadJs(app.path + 'js/tweenmax.js', tweenMaxLoad);

    };

    app.loadJs(app.path + 'js/jquery.js', renderTemplate);
}

testunit();