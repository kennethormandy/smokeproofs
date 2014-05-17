/*!
 * smokeproofs.js 0.0.1
 * http://smokeproofs.kennethormandy.com
 * https://github.com/kennethormandy/smokeproofs
 *
 * Based on work by Ilya Grigorik
 * https://igvita.com/2014/01/31/optimizing-web-font-rendering-performance
 *
 * Copyright © 2014 Kenneth Ormandy & Chloi Inc.
 * Available under the MIT license
 */


(function() {

  'use strict';

  var smokeproofs = function() {

    var SmokeProofs = function() {
      this._init(this);
    }

    SmokeProofs.prototype = {

      categorise: function(initiator) {
        if(initiator === 'css') {
          return 'woff';
        } else if (initiator === 'link') {
          return 'css';
        } else if (initiator === 'script') {
          return 'js';
        } else {
          return initiator || 'unknown';
        }
      },

      parseName: function(name) {
        if(name.indexOf('themes.googleusercontent.com') !== -1 || name.indexOf('fonts.googleapis.com') !== -1) {
          return 'Google';
        } else if(name.indexOf('use.typekit.net') !== -1) {
          return 'Typekit';
        } else if(name.indexOf('fast.fonts.net') !== -1) {
          return 'Monotype';
        } else if(name.indexOf('fonts.typotheque.com') !== -1) {
          return 'Typotheque';
        } else if(name.indexOf('easy.myfonts.net') !== -1) {
          return 'MyFonts';
        } else {
          return name;
        }
      },

      _init: function() {
        var resources = ''
          , i;

        if (typeof window == 'object' && typeof window.performance == 'object') {
          if (typeof window.performance.getEntriesByName == 'function') {
            resources = window.performance.getEntriesByType('resource');
            console.log(resources[0]);
            for (i in resources) {
              this._record(this.categorise(resources[i].initiatorType), this.parseName(resources[i].name), resources[i]);
            }
          }
        }
      },

      _record: function(category, label, resource) {
        var dns = Math.round(resource.domainLookupEnd - resource.domainLookupStart)
          , tcp = Math.round(resource.connectEnd - resource.connectStart)
          , total = Math.round(resource.responseEnd - resource.startTime);

        ga('send', 'timing', 'webfont-' + category, label, dns, 'dns');
        ga('send', 'timing', 'webfont-' + category, label, tcp, 'tcp');
        ga('send', 'timing', 'webfont-' + category, label, total, 'total');
      }

    }

    return new SmokeProofs();
    // return {
    //   showConfig: function(){
    //     return console.log("your config", config)
    //   }
    // }
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = smokeproofs;
  } else {
    window.smokeproofs = smokeproofs;
  }
})();
