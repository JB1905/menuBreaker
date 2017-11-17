/*!
* menuBreaker v1.0 beta 1
* Copyright 2017 Jakub Biesiada
* MIT License
*/

(function (root, factory) {

  let pluginName = 'MenuBreaker';

  if (typeof define === 'function' && define.amd) {
    define([], factory(pluginName));
  } else if (typeof exports === 'object') {
    module.exports = factory(pluginName);
  } else {
    root[pluginName] = factory(pluginName);
  }

}(this, function(pluginName) {
  'use strict';

  class Plugin {
    constructor(elem, options) {

      const defaults = {};

      if (options !== undefined) {
        if (options.mobileMenu !== undefined && typeof options.mobileMenu == 'string') {
          defaults[mobileMenu] = options.mobileMenu;
        }
      } else {
        defaults.mobileMenu = '.mobile';
      }

      if (options !== undefined) {
        if (options.openCloseButton !== undefined && typeof options.openCloseButton == 'string') {
          defaults.openCloseButton = options.openCloseButton;
        }
      } else {
        defaults.openCloseButton = '#openMenu';
      }

      if (options !== undefined) {
        if (options.overlay !== undefined && typeof options.overlay == 'string') {
          defaults.overlay = options.overlay;
        }
      } else {
        defaults.overlay = '.overlay';
      }

      if (options !== undefined) {
        if (options.navbarHeight !== undefined && typeof options.navbarHeight == 'string') {
          defaults.navbarHeight = options.navbarHeight;
        }
      } else {
        defaults.navbarHeight = 70;
      }

      let el = elem;

      let _this = this;

      _this.breakMenu(el, defaults);

      window.addEventListener('resize', function () {
        _this.breakMenu(el, defaults);
      });

    }

    breakMenu(elem, options) {

      for (var i = 0; i < elem.length; i++) {

        let windowWidth = window.innerWidth;

        let checkSize = elem[i].offsetHeight;

        if (checkSize > options.navbarHeight) {

          var firstClick = false;

          document.querySelector(options.openCloseButton).style.display = 'block';
          elem[i].style.opacity = 0;
          elem[i].style.visibility = 'hidden';

          if (document.querySelector(options.mobileMenu).classList.contains('open')) {
            document.querySelector(options.mobileMenu).style.display = 'block';
            document.querySelector(options.overlay).style.display = 'block';
          }

          document.querySelector(options.openCloseButton).addEventListener('click', function(index) {
            if (firstClick == false) {
              document.querySelector(options.mobileMenu).classList.add('open');
              document.querySelector(options.overlay).style.opacity = 1;
              document.querySelector(options.overlay).style.display = 'block';
              firstClick = true;
            } else {
              document.querySelector(options.mobileMenu).classList.remove('open');
              document.querySelector(options.overlay).style.opacity = 0;
              firstClick = false;
            }
          });

          document.querySelector(options.overlay).addEventListener('click', function() {
            document.querySelector(options.mobileMenu).classList.remove('open');
            document.querySelector(options.overlay).style.opacity = 0;
            firstClick = false;
          });

        } else {

          if (document.querySelector(options.mobileMenu).classList.contains('open')) {
            document.querySelector(options.mobileMenu).style.display = 'none';
            document.querySelector(options.overlay).style.display = 'none';
          }

          document.querySelector(options.openCloseButton).style.display = 'none';
          elem[i].style.opacity = 1;
          elem[i].style.visibility = 'visible';

        }

        let listEl = elem[i].querySelectorAll(':not(li) > ul > li > ul');

        // FIRST LEVEL SUBMENU DETECT SIDE
        for (var s = 0; s < listEl.length; s++) {
          let parentWidth = listEl[s].parentNode.clientWidth;
          let subMenuWidth = listEl[s].clientWidth;
          if (listEl[s].parentNode.offsetLeft + subMenuWidth > windowWidth) {
            listEl[s].style.marginLeft = -subMenuWidth + parentWidth + 'px';
          } else {
            listEl[s].style.marginLeft = 0 + 'px';
          }

          // NEXT LEVEL SUBMENU DETECT SIDE
          let subListEl = listEl[s].querySelectorAll('li > ul');

          for (var m = 0; m < subListEl.length; m++) {
            let subSubMenuWidth = subListEl[m].offsetWidth;
            if (subListEl[m].parentNode.parentNode.parentNode.offsetLeft + subSubMenuWidth + subMenuWidth > windowWidth) {
              subListEl[m].style.marginLeft = -subSubMenuWidth + 'px';
            } else {
              subListEl[m].style.marginLeft = subSubMenuWidth + 'px';
            }
          }
        }
      }
    }
  }

  // JQUERY PLUGIN CALL IF JQUERY LOADED
  if (window.jQuery) {

    let $ = window.jQuery;

    $.fn[pluginName] = function (options) {

      new Plugin(this, options);

    };

  }

  return Plugin;

}));
