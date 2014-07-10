// Generated by CoffeeScript 1.7.1
$(function() {
  var changeLang, changeSearchEngine, cookie, getSuggestion, init, langArr, setSugPos, showSuggestion;
  langArr = ['en', 'zh'];
  changeLang = function(lang) {
    if (langArr.indexOf(lang) > -1) {
      document.documentElement.className = "lang-" + lang;
      return typeof cookie !== "undefined" && cookie !== null ? cookie.attr('lang', lang) : void 0;
    }
  };
  cookie = {
    _cookie: (function() {
      var cookieArr, obj, pair, v, _i, _len;
      obj = {};
      cookieArr = document.cookie.split('; ');
      for (_i = 0, _len = cookieArr.length; _i < _len; _i++) {
        v = cookieArr[_i];
        pair = v.split('=');
        obj[pair[0]] = unescape(pair[1]);
      }
      return obj;
    })(),
    attr: function(key, val, expire, path) {
      var date;
      if (val === void 0) {
        if (this._cookie[key] === void 0) {
          return void 0;
        } else {
          return this._cookie[key];
        }
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
      document.cookie = "" + key + "=" + val + ";expires=" + expire + ";path=" + path;
      this._cookie[key] = val;
      return this._cookie;
    },
    remove: function(key) {
      var date, val;
      val = this._cookie[key];
      if (val != null) {
        date = new Date();
        date.setTime(date.getTime - 1);
        document.cookie = "" + key + "=" + val + ";expires=" + (date.toGMTString());
      }
      return this._cookie;
    }
  };
  init = function() {
    var lang;
    lang = cookie.attr('lang');
    if (lang === void 0) {
      lang = window.navigator.language != null ? window.navigator.language : window.navigator.browserLanguage;
      lang = lang.toLowerCase() === 'zh-cn' ? 'zh' : 'en';
    }
    changeLang(lang);
    if (cookie.attr('defaultType') === void 0) {
      return cookie.attr('defaultType', 'search');
    }
  };
  setSugPos = function() {
    $('#sug').css({
      'top': $('.search-form').offset().top + $('.search-form').height(),
      'left': $('.search-form').offset().left
    });
  };
  changeSearchEngine = function(engineName, typeName) {
    var $engineList, $form, $newEngine, $newType, data, hiddens, html, k, v;
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
    $("#search-cat>li[data-type='" + typeName + "'] input").prop('checked', true);
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
    $form = $('#search-form');
    data = $newEngine.data();
    $form.attr('accept-charset', data['charset'] || 'utf-8');
    $form.attr('action', data['url']);
    $('#isa').attr('name', data['key']);
    $('#link').attr('href', data['link']);
    if (data.hiddens) {
      hiddens = $.parseJSON(data.hiddens);
    }
    html = '';
    if (hiddens) {
      for (k in hiddens) {
        v = hiddens[k];
        html += "<input type='hidden' name='" + k + "' value='" + v + "'>";
      }
    }
    $('#hiddens').html(str);
  };
  showSuggestion = function(data, searchHistory) {
    var $sug;
    $sug = $('#sug');
    if (data === void 0) {
      $sug.hide();
    }
  };
  getSuggestion = function(kwd, type) {
    var e, url, urlTbl;
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
      showSuggestion();
      return;
    }
    if (type === '' || (type == null)) {
      showSuggestion();
      return;
    }
    url = url.replace('@', encodeURIComponent(kwd));
    try {
      $.getJSON(url, function(res) {
        var data, i, _i, _j, _len, _len1, _ref, _ref1;
        data = [];
        switch (type) {
          case 'shop':
            _ref = res.result;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              data.push(i[0]);
            }
            break;
          case 'map':
            _ref1 = res.s;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              i = _ref1[_j];
              data.push(i.replace(/(\$)|(\d*$)/g, ' '));
            }
            break;
          default:
            data = res.s;
        }
        showSuggestion(data);
      });
    } catch (_error) {
      e = _error;
      showSuggestion();
    }
  };
  $('#isa').on('click focus', function(e) {
    e.stopPropagation();
    $('#isa,#search-btn').addClass('box-shadow');
  });
  $('#isa').on('input propertychange', function(e) {
    console.log('hahah');
    if ($(this).val() === '') {
      $('#ph').show();
    } else {
      $('#ph').hide();
    }
  });
  $('#ph').on('click', function(e) {
    console.log('click');
    e.stopPropagation();
    $('#isa').focus();
  });
  $(document).on('keydown', function(e) {
    if (e.keyCode === 36 || e.keyCode === 83) {
      $('#isa').focus();
      return false;
    }
  });
});