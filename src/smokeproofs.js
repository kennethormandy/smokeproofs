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

      _categorise: function(initiator) {
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

      _parseName: function(name) {
        if(name.indexOf('themes.googleusercontent.com') !== -1 || name.indexOf('fonts.googleapis.com') !== -1) {
          return 'Google Fonts';
        } else if(name.indexOf('use.typekit.net') !== -1) {
          return 'Typekit';
        } else if(name.indexOf('fast.fonts.net') !== -1) {
          return 'Monotype Fonts.com';
        } else if(name.indexOf('fonts.typotheque.com') !== -1) {
          return 'Typotheque';
        } else if(name.indexOf('easy.myfonts.net') !== -1) {
          return 'MyFonts';
        } else if(name.indexOf('cloud.typography.com') !== -1) {
          return 'H&Co. cloud.Typography';
        } else {
          return name;
        }
      },

      _init: function() {
        var resources = ''
          , i;

        if(typeof analytics === 'undefined' && typeof ga === 'undefined') {
          return console.warn('Analytics.js or Google Analytics are ' +
                               'missing or not working properly. ' +
                               'Need help? Open an issue on GitHub: ' +
                               'https://github.com/kennethormandy/smokeproofs/issues');
        } else {
          if(typeof window == 'object' && typeof window.performance == 'object') {
            if(typeof window.performance.getEntriesByName == 'function') {
              resources = window.performance.getEntriesByType('resource');
              for (i in resources) {
                this._record(this._categorise(resources[i].initiatorType), this._parseName(resources[i].name), resources[i]);
              }
            }
          }
        }
      },

      _record: function(category, label, resource) {
        var dnsTime = Math.round(resource.domainLookupEnd - resource.domainLookupStart)
          , tcpTime = Math.round(resource.connectEnd - resource.connectStart)
          , totalTime = Math.round(resource.responseEnd - resource.startTime);

        if(typeof analytics !== 'undefined') {
          analytics.track('Loaded webfont ' + category, {
            service: label,
            dns: dnsTime,
            tcp: tcpTime,
            total: totalTime
          });
        } else if(typeof ga !== 'undefined') {
          ga('send', 'timing', 'Loaded webfont ' + category, label, dnsTime, 'dns');
          ga('send', 'timing', 'Loaded webfont ' + category, label, tcpTime, 'tcp');
          ga('send', 'timing', 'Loaded webfont ' + category, label, totalTime, 'total');
        }
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
