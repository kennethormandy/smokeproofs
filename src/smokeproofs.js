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

    var Smokeproofs = function() {
      this._init(this);
    }

    Smokeproofs.prototype = {

      _label: function(initiator) {
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
        } else if(name.indexOf('cloud.typography.com') !== -1) {
          return 'H&FJ / H&Co. Cloud.typography';
        } else if(name.indexOf('fast.fonts.net') !== -1) {
          return 'Monotype Fonts.com';
        } else if(name.indexOf('easy.myfonts.net') !== -1) {
          return 'MyFonts';
        } else if(name.indexOf('use.typekit.net') !== -1) {
          return 'Typekit';
        } else if(name.indexOf('fonts.typotheque.com') !== -1) {
          return 'Typotheque';
        } else {
          return false;
        }
      },

      _init: function() {
        var resources = ''
          , resourceService = false
          , resourceFiletype = 'unknown'
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
                resourceService = this._parseName(resources[i].name);
                resourceFiletype = this._label(resources[i].initiatorType);
                if(resourceService) {
                  this._record(resourceService, resourceFiletype, resources[i]);
                }
              }
            }
          }
        }
      },

      _record: function(service, filetype, resource) {

        var dnsTime = Math.round(resource.domainLookupEnd - resource.domainLookupStart)
          , tcpTime = Math.round(resource.connectEnd - resource.connectStart)
          , totalTime = Math.round(resource.responseEnd - resource.startTime);

        if(typeof window.analytics !== 'undefined') {

          window.analytics.track(service, {
            service: service,
            label: 'Load ' + filetype,
            dns: dnsTime,
            tcp: tcpTime,
            total: totalTime
          });

        } else if(typeof ga !== 'undefined') {

          // GA Timing Example
          // ga('send', 'timing', 'timingCategory', 'timingVar',    timingValue, 'timingLabel');
          // ga('send', 'timing', 'jQuery',         'Load Library', 20,          'Google CDN');

          ga('send', 'timing', service, 'Load ' + filetype, dnsTime, 'DNS');
          ga('send', 'timing', service, 'Load ' + filetype, tcpTime, 'TCP');
          ga('send', 'timing', service, 'Load ' + filetype, totalTime, 'total');

        }
      }

    }

    return new Smokeproofs();
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = smokeproofs;
  } else {
    window.smokeproofs = smokeproofs;
  }
})();
