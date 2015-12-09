// Generated by CoffeeScript 1.10.0
(function() {
  var getLan, node_config, obj2String, tpl, underscore;
  obj2String = function(obj) {
    if (obj) {
      return JSON.stringify(obj);
    } else {
      return '';
    }
  };
  getLan = function(opt) {
    return "<span class='en'>" + opt.en + "</span><span class='zh'>" + opt.zh + "</span>";
  };
  tpl = '<div class="overlay" id="overlay"></div>\n<div class="hamburger" id="hamburger"><i></i></div>\n<div class="setting-container">\n  <div id="switch-lang" class="switch-lang">\n    {{=getLan(config.langswitch)}}\n  </div>\n  <div class="setting-icon" id="setting-icon">{{=getLan(config.configTitle)}}</div>\n  <div class="setting-panel" id="setting-panel">\n    <div id="setting-tip" class="setting-tip">\n      <a href="http://desk.zol.com.cn" target="_blank">\n        {{=getLan(config.setBgimg)}}\n      </a>\n    </div>\n    <input type="text" id="bgimg">\n    <input type="button" value="OK" id="set-bgimg">\n    <div id="imgerror-tip" class="imgerror-tip">\n      {{=getLan(config.imgloaderror)}}\n    </div>\n  </div>\n</div>\n<div class="search-container">\n  <div class="search-wrapper" id="search-wrapper">\n    <h1 class="app-name">{{=getLan(config.title)}}</h1>\n    <div class="search-engine-list clearfix" id="search-engine-list">\n      {{ var cur = true; _.each(config.searches, function(val, key){ }}\n        <ul data-engine-type="{{=key}}" class="{{=cur ? \'current\' : \'\'}}">\n          {{ _.each(val.engines, function(v, k){ }}\n            <li class="{{=cur ? \'current\' : \'\'}}" data-engine-name="{{=k}}" data-link="{{=v.link}}" data-key="{{=v.key}}" data-charset="{{=v.charset||\'utf-8\'}}" data-url="{{=v.url}}" data-hiddens=\'{{=obj2String(v.hiddens)}}\'>\n              {{ cur = false; }}\n              {{=getLan(v)}}\n            </li>\n          {{ }) }}\n        </ul>\n      {{ }) }}\n    </div>\n    <form class="search-form clearfix" id="search-form" target="_blank" accept-charset="utf-8">\n      <div class="hide" id="hiddens"></div>\n      <div class="input">\n        <span class="ico ico-search" id="ico"></span>\n        <input type="search" class="input-box" name="q" id="isa" autocomplete="off" autofocus speech>\n        <span class="submit" id="search-btn">\n          <button type="submit" >{{=getLan(config.submit)}}</button>\n        </span>\n        \n      </div>\n    </form>\n    <div class="hide">\n      <a href="https://www.google.com" id="link" rel="noreferrer" target="_blank"></a>\n    </div>\n    <ul class="search-cat clearfix" id="search-cat">\n      {{ cur = true; _.each(config.searches, function(val, key){ }}\n        <li data-type="{{=key}}"><label>\n          <input type="radio" name="type" {{=cur? \'checked\': \'\'}}>\n          {{ cur = false; }}\n          {{=getLan(val)}}\n        </label></li>\n      {{ }) }}\n    </ul>\n    <div class="search-with" id="search-with">\n      <span class="zh">由 <strong class="search-powered-by"></strong> 提供搜索结果</span>\n        <span class="en">Search with <strong class="search-powered-by"></strong></span>\n    </div>\n  </div>\n  <div class="sug" id="sug">\n    <ul id="suglist" class="suglist"></ul>\n    <div id="clear-history">{{=getLan(config.clearhistory)}}</div>\n  </div>\n</div>\n<div class="usage-content" id="usage-content">\n  <div class="usage-close" id="usage-close">&times;</div>\n  <h3><span class="en">Usage<small>(for desktop only)</small></span><span class="zh">使用帮助<small>(仅应用于桌面端)</small></span></h3>\n  <h4><span class="en">Shortcuts</span><span class="zh">快捷键</span></h4>\n  <ol>\n    <li>\n      <kbd>Tab</kbd>\n      <span class="en">Switch Search Engine</span>\n      <span class="zh">切换搜索引擎</span>\n    </li>\n    <li>\n      <kbd>Shift</kbd> +\n      <kbd>Tab</kbd>\n      <span class="en">Switch Search Category</span>\n      <span class="zh">切换搜索类别</span>\n    </li>\n    <li>\n      <kbd>Home</kbd> /\n      <kbd>F</kbd> /\n      <kbd>S</kbd>\n      <span class="en">Focus on Search Box</span>\n      <span class="zh">快速聚焦到搜索框</span>\n    </li>\n  </ol>\n  <h4><span class="en">Switch Language</span><span class="zh">切换语言</span></h4>\n  <p>\n    <span class="en">Click "English/中文" at the right top corner to switch language</span>\n    <span class="zh">点击右上角的“English/中文”来切换应用语言</span>\n  </p>\n  <h4><span class="en">Open Search Engine Offical Site</span><span class="zh">打开搜索引擎官网</span></h4>\n  <p>\n    <span class="en">Type *one* space and press enter key</span>\n    <span class="zh">输入一个空格, 按回车键即可</span>\n  </p>\n  <h4><span class="en">Set Backgrount Image</span><span class="zh">设置背景图片</span></h4>\n  <p>\n    <span class="en">Click "Settings" at the right top corner, then paste image\'s url into then input box and press enter key!</span>\n    <span class="zh">点击右上角的“设置”, 在显示出来的输入框中输入图片地址按回车键即可.</span>\n  </p>\n</div>\n<div class="footer" id="footer">\n  Copyright © <a href="http://www.evecalm.com" target="_blank" class="official-site">夏影 ❤ 2011-{{=new Date().getFullYear()}}</a> /\n  <a class="usage" id="usage">{{=getLan(config.usage)}}</a> /\n  <a href="http://www.evecalm.com/2013/04/union-search.html" target="_blank">{{=getLan(config.feedback)}}</a>\n</div>';
  if (typeof module === 'undefined') {
    document.getElementById('content').innerHTML = _.template(tpl, {
      config: config,
      obj2String: obj2String,
      getLan: getLan
    });
  } else {
    underscore = require('../libs/underscore.js');
    node_config = require('./config.js');
    module.exports = function() {
      return underscore.template(tpl, {
        config: node_config,
        obj2String: obj2String,
        getLan: getLan
      });
    };
  }
})();


//# sourceMappingURL=tpl.js.map
