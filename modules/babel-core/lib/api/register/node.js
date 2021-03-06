/* @flow */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

exports.__esModule = true;

var _lodashLangCloneDeep = require("lodash/lang/cloneDeep");

var _lodashLangCloneDeep2 = _interopRequireDefault(_lodashLangCloneDeep);

var _sourceMapSupport = require("source-map-support");

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _cache = require("./cache");

var registerCache = _interopRequireWildcard(_cache);

var _transformationFileOptionsOptionManager = require("../../transformation/file/options/option-manager");

var _transformationFileOptionsOptionManager2 = _interopRequireDefault(_transformationFileOptionsOptionManager);

var _lodashObjectExtend = require("lodash/object/extend");

var _lodashObjectExtend2 = _interopRequireDefault(_lodashObjectExtend);

var _node = require("../node");

var babel = _interopRequireWildcard(_node);

var _lodashCollectionEach = require("lodash/collection/each");

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _util = require("../../util");

var util = _interopRequireWildcard(_util);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

_sourceMapSupport2["default"].install({
  handleUncaughtExceptions: false,
  retrieveSourceMap: function retrieveSourceMap(source) {
    var map = maps && maps[source];
    if (map) {
      return {
        url: null,
        map: map
      };
    } else {
      return null;
    }
  }
});

registerCache.load();
var cache = registerCache.get();

var transformOpts = {};

var ignore = undefined;
var only = undefined;

var oldHandlers = {};
var maps = {};

var cwd = process.cwd();

function getRelativePath(filename) {
  return _path2["default"].relative(cwd, filename);
}

function mtime(filename) {
  return +_fs2["default"].statSync(filename).mtime;
}

function compile(filename) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var result = undefined;

  opts.filename = filename;

  var optsManager = new _transformationFileOptionsOptionManager2["default"]();
  optsManager.mergeOptions(_lodashLangCloneDeep2["default"](transformOpts));
  opts = optsManager.init(opts);

  var cacheKey = JSON.stringify(opts) + ":" + babel.version;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) cacheKey += ":" + env;

  if (cache) {
    var cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached;
    }
  }

  if (!result) {
    result = babel.transformFileSync(filename, _lodashObjectExtend2["default"](opts, {
      sourceMap: "both",
      ast: false
    }));
  }

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  maps[filename] = result.map;

  return result.code;
}

function shouldIgnore(filename) {
  if (!ignore && !only) {
    return getRelativePath(filename).split(_path2["default"].sep).indexOf("node_modules") >= 0;
  } else {
    return util.shouldIgnore(filename, ignore || [], only);
  }
}

function loader(m, filename) {
  m._compile(compile(filename), filename);
}

function registerExtension(ext) {
  var old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = function (m, filename) {
    if (shouldIgnore(filename)) {
      old(m, filename);
    } else {
      loader(m, filename, old);
    }
  };
}

function hookExtensions(_exts) {
  _lodashCollectionEach2["default"](oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = {};

  _lodashCollectionEach2["default"](_exts, function (ext) {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

hookExtensions(util.canCompile.EXTENSIONS);

exports["default"] = function () {
  var opts /*:: ?: Object*/ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (opts.only != null) only = util.arrayify(opts.only, util.regexify);
  if (opts.ignore != null) ignore = util.arrayify(opts.ignore, util.regexify);

  if (opts.extensions) hookExtensions(util.arrayify(opts.extensions));

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.ignore;
  delete opts.cache;
  delete opts.only;

  _lodashObjectExtend2["default"](transformOpts, opts);
};

module.exports = exports["default"];