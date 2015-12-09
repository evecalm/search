// Generated by CoffeeScript 1.10.0
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$(function() {
  var MOBILE_BREAK_POINT, adjustUrl, appLang, changeLang, changeSearchEngine, cookie, currentEngineName, currentEngineType, currentKwd, gHosts, getSuggestion, isMobile, loadImg, searchHistory, setBgImg, setSugPos, showSuggestion, toJSONString;
  currentEngineType = '';
  currentEngineName = '';
  currentKwd = '';

  /**
   * 修正触屏设备css的active伪类无效果的问题
   * ＊IE 9以下不支持 addEventListener 方法
   */
  document.addEventListener && document.addEventListener('touchstart', function() {}, true);
  appLang = '';
  MOBILE_BREAK_POINT = 680;
  isMobile = window.innerWidth < MOBILE_BREAK_POINT;
  isMobile && $('#search-form').attr('target', '_self');
  gHosts = [];
  $.toJSONString = (window.JSON && window.JSON.stringify) || (toJSONString = function(obj) {
    var arr, json, n, t, v;
    t = typeof obj;
    if (t !== "object" || obj === null) {
      if (t === "string") {
        obj = '"' + obj + '"';
      }
      return String(obj);
    } else {
      json = [];
      arr = obj && obj.constructor === Array;
      for (n in obj) {
        v = obj[n];
        t = typeof v;
        if (t === 'string') {
          v = '"' + v + '"';
        } else {
          if (t === 'object' && v !== null) {
            v = toJSONString(v);
          }
        }
        json.push((arr ? '' : '"' + n + '"') + String(v));
      }
      if (arr) {
        return '[' + String(json) + ']';
      } else {
        return '{' + String(json) + '}';
      }
    }
  });
  cookie = (function() {
    if (window.localStorage) {
      return {
        _loc: window.localStorage,
        attr: function(key, val) {
          if (val === void 0) {
            if (key === void 0) {
              return;
            }
            return this._loc.getItem("" + key);
          } else {
            return this._loc.setItem("" + key, "" + val);
          }
        },
        remove: function(key) {
          return this._loc.removeItem("" + key);
        }
      };
    } else {
      return {
        _cookie: (function() {
          var cookieArr, j, len1, obj, pair, v;
          obj = {};
          cookieArr = document.cookie.split('; ');
          for (j = 0, len1 = cookieArr.length; j < len1; j++) {
            v = cookieArr[j];
            pair = v.split('=');
            obj[pair[0]] = unescape(pair[1]);
          }
          return obj;
        })(),
        attr: function(key, val, expire, path) {
          var date;
          if (val === void 0) {
            return this._cookie[key];
          }
          if (expire === void 0) {
            expire = 'Sat, 19 Jan 2037 03:52:43 GMT';
          } else {
            date = new Date();
            date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000);
            date = date.toGMTString();
          }
          if (!path) {
            path = '/';
          }
          val = escape(val);
          document.cookie = key + "=" + val + ";expires=" + expire + ";path=" + path;
          this._cookie[key] = val;
          return this._cookie;
        },
        remove: function(key) {
          var date, val;
          val = this._cookie[key];
          if (val != null) {
            date = new Date();
            delete this._cookie[key];
            date.setTime(date.getTime - 1);
            document.cookie = key + "=" + val + ";expires=" + (date.toGMTString());
          }
          return this._cookie;
        }
      };
    }
  })();
  searchHistory = {
    _MAX: 10,
    _history: (function() {
      var hsty;
      hsty = cookie.attr('history');
      return hsty = hsty ? $.parseJSON(hsty) : [];
    })(),
    add: function(kwd) {
      if (indexOf.call(this._history, kwd) < 0) {
        this._history.unshift(kwd);
        if (this._history.length > this._MAX) {
          this._history.pop();
        }
        cookie.attr('history', $.toJSONString(this._history));
      }
      return this;
    },
    clear: function() {
      this._history.length = 0;
      cookie.attr('history', $.toJSONString(this._history));
      return this;
    },
    get: function() {
      return this._history;
    }
  };
  changeLang = function(lang) {
    var cls, langArr;
    langArr = ['en', 'zh'];
    if (indexOf.call(langArr, lang) >= 0) {
      appLang = lang;
      cls = document.documentElement.className.replace(/lang\-[a-z]+/, '');
      cls += " lang-" + lang;
      document.documentElement.className = cls.replace(/^\s+|\s+$/g, '');
      if (cookie != null) {
        cookie.attr('lang', lang);
      }
      if (lang === 'zh') {
        document.title = '综合搜索';
      } else {
        document.title = 'Union Search';
      }
    }
  };
  setSugPos = function() {
    $('#sug').css({
      'top': $('.search-form').offset().top + $('.search-form').height(),
      'left': $('.search-form').offset().left
    });
  };

  /**
   * show keyword suggestion list
   * @param  {String} kwd            关键字
   * @param  {Array}  data           百度建议的关键字列表
   * @param  {Boolean} showAllHistory 是否显示所有搜索历史
   * @return {undefined}                无返回值
   */
  showSuggestion = function(kwd, data, showAllHistory) {
    var $sug, $suglist, MAX, j, l, len, len1, len2, len3, listHtml, m, shistory, v;
    MAX = 10;
    $sug = $('#sug');
    $suglist = $('#suglist');
    $suglist.html('');
    len = 0;
    shistory = searchHistory.get();
    listHtml = '';
    if (showAllHistory) {
      for (j = 0, len1 = shistory.length; j < len1; j++) {
        v = shistory[j];
        if (len >= MAX) {
          break;
        }
        ++len;
        listHtml += "<li>" + v + "</li>";
      }
      $('#clear-history').show();
    } else {
      for (l = 0, len2 = shistory.length; l < len2; l++) {
        v = shistory[l];
        if (len >= MAX) {
          break;
        }
        if (v.indexOf(kwd) > -1) {
          ++len;
          listHtml += "<li class='s-h'>" + v + "</li>";
        }
      }
      $('#clear-history').hide();
    }
    if (data && len < MAX) {
      for (m = 0, len3 = data.length; m < len3; m++) {
        v = data[m];
        if (indexOf.call(shistory, v) >= 0) {
          continue;
        }
        ++len;
        listHtml += "<li>" + v + "</li>";
        if (len >= MAX) {
          break;
        }
      }
    }
    if (len) {
      $suglist.html(listHtml);
      $sug.show();
    } else {
      $sug.hide();
    }
  };
  getSuggestion = function(kwd, type, cb) {
    var e, error, url, urlTbl;
    urlTbl = {
      'search': 'http://suggestion.baidu.com/su?wd=@&p=3&cb=?',
      'music': 'http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?',
      'video': 'http://nssug.baidu.com/su?wd=@&prod=video&cb=?',
      'question': 'http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?',
      'image': 'http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?',
      'map': 'http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?',
      'doc': 'http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?',
      'shop': 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?'
    };
    url = urlTbl[type];
    if (!url) {
      if (typeof cb === "function") {
        cb(kwd);
      }
      return;
    }
    if (type === '' || (type == null)) {
      if (typeof cb === "function") {
        cb(kwd);
      }
      return;
    }
    url = url.replace('@', encodeURIComponent(kwd));
    try {
      $.getJSON(url, function(res) {
        var data, i, j, l, len1, len2, ref, ref1;
        data = [];
        switch (type) {
          case 'shop':
            ref = res.result;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              i = ref[j];
              data.push(i[0]);
            }
            break;
          case 'map':
            ref1 = res.s;
            for (l = 0, len2 = ref1.length; l < len2; l++) {
              i = ref1[l];
              data.push($.trim($.trim(i.replace(/(\$+)/g, ' ')).replace(/\d+$/, '')));
            }
            break;
          default:
            data = res.s;
        }
        if (typeof cb === "function") {
          cb(kwd, data);
        }
      });
    } catch (error) {
      e = error;
      if (typeof cb === "function") {
        cb(kwd);
      }
    }
  };
  adjustUrl = function(url) {
    if (url.indexOf('http://www.google.com') > -1 && gHosts.length) {
      return url.replace('http://www.google.com', gHosts[Math.floor(gHosts.length * Math.random())]);
    } else {
      return url;
    }
  };
  changeSearchEngine = function(engineName, typeName) {
    var $engineList, $engineType, $form, $newEngine, $newType, data, hiddens, html, k, v;
    $engineList = $('#search-engine-list');
    if (typeName != null) {
      $newType = $engineList.find(">ul[data-engine-type='" + typeName + "']");
    }
    if (!typeName || !$newType.length) {
      $newType = $engineList.find(">ul.current");
      if (!$newType.length) {
        $newType = $engineList.find('>ul:first');
      }
    }
    typeName = $newType.data('engine-type');
    $engineType = $("#search-cat>li[data-type='" + typeName + "']");
    $engineType.addClass('current');
    $('#ico').attr('class', 'ico ico-' + typeName);
    $engineType.find('input').prop('checked', true);
    $engineList.find('>ul.current').removeClass('current');
    $newType.addClass('current');
    if (engineName != null) {
      $newEngine = $newType.find(">li[data-engine-name='" + engineName + "']");
    }
    if (!engineName || !$newEngine.length) {
      $newEngine = $newType.find('>li.current');
      if (!$newEngine.length) {
        $newEngine = $newType.find('>li:first');
      }
    }
    engineName = $newEngine.data('engine-name');
    $newType.find('>li.current').removeClass('current');
    $newEngine.addClass('current');
    $('.search-powered-by').text($engineType.find('span.' + appLang).text() + ' / ' + $newEngine.find('span.' + appLang).text());
    $form = $('#search-form');
    data = $newEngine.data();
    $form.attr('accept-charset', data['charset'] || 'utf-8');
    $form.attr('action', data['url']);
    $form.attr('origin-action', data['url']);
    $('#isa').attr('name', data['key']);
    $('#link').attr('href', data['link']);
    $('#link').attr('origin-href', data['link']);
    hiddens = data.hiddens;
    html = '';
    if (hiddens) {
      for (k in hiddens) {
        v = hiddens[k];
        html += "<input type='hidden' name='" + k + "' value='" + v + "'>";
      }
    }
    $('#hiddens').html(html);
    cookie.attr('defaultType', typeName);
    cookie.attr('defaultEngine', engineName);
    currentEngineType = typeName;
    currentEngineName = engineName;
  };
  loadImg = function(imgUrl, done, fail) {
    var img;
    img = new Image;
    if (done) {
      img.onload = done;
    }
    if (fail) {
      img.onerror = fail;
    }
    img.src = imgUrl;
  };
  setBgImg = function(imgUrl) {
    if (imgUrl) {
      document.body.style.backgroundImage = "url(" + imgUrl + ")";
      $('#search-wrapper').addClass('trsprt-bg');
      $('#footer').addClass('trsprt-bg');
    } else {
      document.body.style.backgroundImage = '';
      $('#search-wrapper').removeClass('trsprt-bg');
      $('#footer').removeClass('trsprt-bg');
    }
  };
  $('#isa').on('focus', function(e) {
    e.stopPropagation();
    $('#isa,#search-btn').addClass('box-shadow');
  });
  $('#search-engine-list').on('click', 'li', function(e) {
    var $this;
    $this = $(this);
    if (!$this.hasClass('current')) {
      changeSearchEngine($this.data('engine-name'));
    }
    if (isMobile) {
      $('#overlay').hide();
      $('#search-engine-list').removeClass('show');
      $('#search-cat').removeClass('show');
    }
    $('#isa').focus();
    e.stopPropagation();
    return false;
  });
  $('#search-cat').on('click', 'input', function(e) {
    var $li, $this, engineType;
    $this = $(this);
    engineType = $this.closest('li').data('type');
    $li = $this.closest('li');
    changeSearchEngine(null, $li.data('type'));
    $li.siblings().removeClass('current');
    $li.addClass('current');
    !isMobile && $('#isa').focus();
    e.stopPropagation();
  });
  $('#search-form').on('submit', function(e) {
    var $link, $this, href, val;
    $this = $(this);
    $link = $('#link');
    $('#sug').hide();
    val = $('#isa').val();
    if (val === ' ') {
      href = adjustUrl($link.attr('origin-href'));
      $link.attr('href', href);
      $link[0].click();
      return false;
    } else if (val === '') {
      return false;
    } else {
      currentKwd = val;
      searchHistory.add(val);
      href = adjustUrl($this.attr('origin-action'));
      if (currentEngineName === 'qiyi' || (currentEngineType === 'map' && currentEngineName === 'baidu')) {
        if (currentEngineName === 'qiyi') {
          href += "q_" + (encodeURIComponent(val));
        } else {
          href += "?newmap=1&ie=utf-8&s=s%26wd%3D" + (encodeURIComponent(val)) + "%26c%3D1";
        }
        $link.attr('href', href);
        $link[0].click();
        return false;
      } else {
        $this.attr('action', href);
      }
    }
  });
  $('#isa').on('click', function(e) {
    e.stopPropagation();
    if (this.value === '') {
      showSuggestion('', false, true);
    } else if ($('#suglist li').length) {
      $('#sug').show();
    }
  });
  $('#isa').on('input propertychange', function(e) {
    var val;
    val = $(this).val();
    if (val === '') {
      $('#sug').hide();
      $('#suglist').html('');
      currentKwd = val;
    } else {
      if ($.trim(val) !== '') {
        currentKwd = val;
        getSuggestion(val, currentEngineType, showSuggestion);
      }
    }
  });
  $('#isa').on('keydown', function(e) {
    var $curt, $engineList, $next, $nextEngine, kwd;
    e.stopPropagation();
    switch (e.keyCode) {
      case 9:
        if (e.shiftKey) {
          $engineList = $('#search-cat');
          $nextEngine = $engineList.find('>li input:checked').closest('li').next();
          if (!$nextEngine.length) {
            $nextEngine = $engineList.find('>li:first');
          }
          $nextEngine.find('input').trigger('click');
        } else {
          $engineList = $('#search-engine-list ul.current');
          $nextEngine = $engineList.find('>li.current').next();
          if (!$nextEngine.length) {
            $nextEngine = $engineList.find('>li:first');
          }
          $nextEngine.trigger('click');
        }
        e.preventDefault();
        break;
      case 27:
        $('#sug').hide();
        break;
      case 38:
        if ($('#sug').is(':visible')) {
          e.preventDefault();
          $curt = $('#suglist li.current');
          if ($curt.length) {
            $next = $curt.prev();
            $curt.removeClass('current');
            if (!$next.length) {
              $next = false;
            }
          } else {
            $next = $('#suglist li:last');
          }
          if ($next) {
            $next.addClass('current');
            kwd = $next.text();
          } else {
            kwd = currentKwd;
          }
          kwd = $.trim(kwd);
          $('#isa').val(kwd);
        } else {
          if ($('#suglist li').length) {
            e.preventDefault();
            $('#sug').show();
          } else if (currentKwd === '') {
            showSuggestion('', false, true);
          }
        }
        break;
      case 40:
        if ($('#sug').is(':visible')) {
          e.preventDefault();
          $curt = $('#suglist li.current');
          if ($curt.length) {
            $next = $curt.next();
            $curt.removeClass('current');
            if (!$next.length) {
              $next = false;
            }
          } else {
            $next = $('#suglist li:first');
          }
          if ($next) {
            $next.addClass('current');
            kwd = $next.text();
          } else {
            kwd = currentKwd;
          }
          kwd = $.trim(kwd);
          $('#isa').val(kwd);
        } else {
          if ($('#suglist li').length) {
            e.preventDefault();
            $('#sug').show();
          } else if (currentKwd === '') {
            showSuggestion('', false, true);
          }
        }
    }
  });
  $('#suglist').on('click', 'li', function() {
    var $this;
    $this = $(this);
    $this.addClass('current');
    $('#isa').val($.trim($this.text()));
    $('#search-form').submit();
    return false;
  });
  $('#suglist').on('hover', 'li', function() {
    var $this;
    $this = $(this);
    $this.parent().find('li').removeClass('current');
    $this.addClass('current');
    return false;
  });
  $('#clear-history').on('click', function(e) {
    searchHistory.clear();
    $('#suglist').html('');
    $('#sug').hide();
    $('#isa').focus();
  });
  $('#clear-history').on('hover', function(e) {
    $('#suglist li').removeClass('current');
  });
  $(document).on('click', function(e) {
    $('#isa,#search-btn').removeClass('box-shadow');
    $('#sug').hide();
  });
  $(document).on('keydown', function(e) {
    if ($('#overlay').is(':hidden')) {
      if (e.keyCode === 36 || e.keyCode === 83 || e.keyCode === 70) {
        $('#isa').focus();
        return false;
      }
    } else {
      if (e.keyCode === 27) {
        $('#overlay').trigger('click');
      }
    }
  });
  $('#switch-lang').on('click', 'b', function() {
    changeLang($(this).attr('lang'));
  });
  $('#setting-icon').on('click', function() {
    $('#overlay').fadeIn('fast');
    $('#setting-panel').fadeIn('fast');
    $('#bgimg').focus();
  });
  $('#bgimg').on('keydown', function(e) {
    switch (e.keyCode) {
      case 13:
        $('#set-bgimg').trigger('click');
        break;
      case 27:
        e.stopPropagation();
    }
  });
  $('#set-bgimg').on('click', function() {
    var $imginput, imgUrl;
    $imginput = $('#bgimg');
    imgUrl = $.trim($imginput.val());
    if (imgUrl === '') {
      return;
    }
    return loadImg(imgUrl, function() {
      $imginput.val('');
      $('#overlay').trigger('click');
      cookie.attr('bgimg', imgUrl);
      setBgImg(imgUrl);
    }, function() {
      $('#imgerror-tip').show();
      setTimeout(function() {
        $('#imgerror-tip').hide();
      }, 2000);
      cookie.attr('bgimg', '');
      setBgImg('');
    });
  });
  $('#overlay').on('click', function() {
    $('#setting-panel').fadeOut('fast');
    $('#usage-content').fadeOut('fast');
    if (isMobile) {
      $('#search-engine-list').removeClass('show');
      $('#search-cat').removeClass('show');
    }
    $(this).fadeOut('fast');
    setTimeout(function() {
      $('#isa').focus();
    }, 0);
  });
  $('#usage').on('click', function() {
    $('#overlay').fadeIn('fast');
    $('#usage-content').fadeIn('fast');
  });
  $('#usage-close').on('click', function() {
    $('#overlay').trigger('click');
  });
  $('#hamburger').on('click', function() {
    $('#overlay').show();
    $('#search-engine-list').addClass('show');
    $('#search-cat').addClass('show');
    return false;
  });
  $('#search-with').on('click', function() {
    $('#hamburger').trigger('click');
  });
  $(window).on('resize', function() {
    isMobile = window.innerWidth < MOBILE_BREAK_POINT;
    isMobile && $('#search-form').attr('target', '_self');
    setSugPos();
  });
  $(window).on('focus', function() {
    if ($('#overlay').is(':hidden')) {
      $('#isa').focus();
    }
  });
  $(window).on('blur', function() {
    $('#sug').hide();
  });
  (function() {
    var lang;
    lang = cookie.attr('lang');
    gHosts = $.parseJSON(cookie.attr('ghosts') || '[]');
    if (!lang) {
      lang = window.navigator.language != null ? window.navigator.language : window.navigator.browserLanguage;
      lang = lang.toLowerCase() === 'zh-cn' ? 'zh' : 'en';
    }
    changeLang(lang);
    changeSearchEngine(cookie.attr('defaultEngine'), cookie.attr('defaultType'));
    setBgImg(cookie.attr('bgimg'));
    $.getJSON('assets/google.json', function(res) {
      if ($.isArray(res)) {
        gHosts = res;
        cookie.attr('ghosts', $.toJSONString(res));
      }
    });
    setTimeout(function() {
      var heartString;
      $('#isa').focus();
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        heartString = "l2v2l6v2e1l1v3l2v3e1v7e1v7e1v7e1l2v6e1l4v5e1l6v4e1l8v3e1l7l3v2e1l9l3v1".replace(/[lve]\d/g, function(a) {
          return Array(-(~a[1])).join({
            l: " ",
            v: "Love",
            e: "\n"
          }[a[0]]);
        });
        console.log('%c%s\n%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.', 'color: #ed5565;', heartString, 'font-size: 18px;color:#068;font-weight: 400;');
      }
    }, 0);
    setSugPos();
  })();
});


//# sourceMappingURL=app.js.map
