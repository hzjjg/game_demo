window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    var process = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) return;
      draining = false;
      currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
      queue.length && drainQueue();
    }
    function drainQueue() {
      if (draining) return;
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args));
      1 !== queue.length || draining || runTimeout(drainQueue);
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function(name) {
      return [];
    };
    process.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process.cwd = function() {
      return "/";
    };
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process.umask = function() {
      return 0;
    };
  }, {} ],
  2: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    var METADATA_KEY = require("../constants/metadata_keys");
    function tagParameter(annotationTarget, propertyName, parameterIndex, metadata) {
      var metadataKey = METADATA_KEY.TAGGED;
      _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex);
    }
    exports.tagParameter = tagParameter;
    function tagProperty(annotationTarget, propertyName, metadata) {
      var metadataKey = METADATA_KEY.TAGGED_PROP;
      _tagParameterOrProperty(metadataKey, annotationTarget.constructor, propertyName, metadata);
    }
    exports.tagProperty = tagProperty;
    function _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex) {
      var paramsOrPropertiesMetadata = {};
      var isParameterDecorator = "number" === typeof parameterIndex;
      var key = void 0 !== parameterIndex && isParameterDecorator ? parameterIndex.toString() : propertyName;
      if (isParameterDecorator && void 0 !== propertyName) throw new Error(ERROR_MSGS.INVALID_DECORATOR_OPERATION);
      Reflect.hasOwnMetadata(metadataKey, annotationTarget) && (paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget));
      var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
      if (Array.isArray(paramOrPropertyMetadata)) for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
        var m = paramOrPropertyMetadata_1[_i];
        if (m.key === metadata.key) throw new Error(ERROR_MSGS.DUPLICATED_METADATA + " " + m.key);
      } else paramOrPropertyMetadata = [];
      paramOrPropertyMetadata.push(metadata);
      paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
      Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
    }
    function _decorate(decorators, target) {
      Reflect.decorate(decorators, target);
    }
    function _param(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    }
    function decorate(decorator, target, parameterIndex) {
      "number" === typeof parameterIndex ? _decorate([ _param(parameterIndex, decorator) ], target) : "string" === typeof parameterIndex ? Reflect.decorate([ decorator ], target, parameterIndex) : _decorate([ decorator ], target);
    }
    exports.decorate = decorate;
  }, {
    "../constants/error_msgs": 14,
    "../constants/metadata_keys": 16
  } ],
  3: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var error_msgs_1 = require("../constants/error_msgs");
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    var LazyServiceIdentifer = function() {
      function LazyServiceIdentifer(cb) {
        this._cb = cb;
      }
      LazyServiceIdentifer.prototype.unwrap = function() {
        return this._cb();
      };
      return LazyServiceIdentifer;
    }();
    exports.LazyServiceIdentifer = LazyServiceIdentifer;
    function inject(serviceIdentifier) {
      return function(target, targetKey, index) {
        if (void 0 === serviceIdentifier) throw new Error(error_msgs_1.UNDEFINED_INJECT_ANNOTATION(target.name));
        var metadata = new metadata_1.Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);
        "number" === typeof index ? decorator_utils_1.tagParameter(target, targetKey, index, metadata) : decorator_utils_1.tagProperty(target, targetKey, metadata);
      };
    }
    exports.inject = inject;
  }, {
    "../constants/error_msgs": 14,
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  4: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERRORS_MSGS = require("../constants/error_msgs");
    var METADATA_KEY = require("../constants/metadata_keys");
    function injectable() {
      return function(target) {
        if (Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target)) throw new Error(ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR);
        var types = Reflect.getMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) || [];
        Reflect.defineMetadata(METADATA_KEY.PARAM_TYPES, types, target);
        return target;
      };
    }
    exports.injectable = injectable;
  }, {
    "../constants/error_msgs": 14,
    "../constants/metadata_keys": 16
  } ],
  5: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function multiInject(serviceIdentifier) {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.MULTI_INJECT_TAG, serviceIdentifier);
        "number" === typeof index ? decorator_utils_1.tagParameter(target, targetKey, index, metadata) : decorator_utils_1.tagProperty(target, targetKey, metadata);
      };
    }
    exports.multiInject = multiInject;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  6: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function named(name) {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.NAMED_TAG, name);
        "number" === typeof index ? decorator_utils_1.tagParameter(target, targetKey, index, metadata) : decorator_utils_1.tagProperty(target, targetKey, metadata);
      };
    }
    exports.named = named;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  7: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function optional() {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.OPTIONAL_TAG, true);
        "number" === typeof index ? decorator_utils_1.tagParameter(target, targetKey, index, metadata) : decorator_utils_1.tagProperty(target, targetKey, metadata);
      };
    }
    exports.optional = optional;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  8: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERRORS_MSGS = require("../constants/error_msgs");
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    function postConstruct() {
      return function(target, propertyKey, descriptor) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.POST_CONSTRUCT, propertyKey);
        if (Reflect.hasOwnMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor)) throw new Error(ERRORS_MSGS.MULTIPLE_POST_CONSTRUCT_METHODS);
        Reflect.defineMetadata(METADATA_KEY.POST_CONSTRUCT, metadata, target.constructor);
      };
    }
    exports.postConstruct = postConstruct;
  }, {
    "../constants/error_msgs": 14,
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23
  } ],
  9: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function tagged(metadataKey, metadataValue) {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(metadataKey, metadataValue);
        "number" === typeof index ? decorator_utils_1.tagParameter(target, targetKey, index, metadata) : decorator_utils_1.tagProperty(target, targetKey, metadata);
      };
    }
    exports.tagged = tagged;
  }, {
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  10: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function targetName(name) {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.NAME_TAG, name);
        decorator_utils_1.tagParameter(target, targetKey, index, metadata);
      };
    }
    exports.targetName = targetName;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  11: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var decorator_utils_1 = require("./decorator_utils");
    function unmanaged() {
      return function(target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.UNMANAGED_TAG, true);
        decorator_utils_1.tagParameter(target, targetKey, index, metadata);
      };
    }
    exports.unmanaged = unmanaged;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23,
    "./decorator_utils": 2
  } ],
  12: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var literal_types_1 = require("../constants/literal_types");
    var guid_1 = require("../utils/guid");
    var Binding = function() {
      function Binding(serviceIdentifier, scope) {
        this.guid = guid_1.guid();
        this.activated = false;
        this.serviceIdentifier = serviceIdentifier;
        this.scope = scope;
        this.type = literal_types_1.BindingTypeEnum.Invalid;
        this.constraint = function(request) {
          return true;
        };
        this.implementationType = null;
        this.cache = null;
        this.factory = null;
        this.provider = null;
        this.onActivation = null;
        this.dynamicValue = null;
      }
      Binding.prototype.clone = function() {
        var clone = new Binding(this.serviceIdentifier, this.scope);
        clone.activated = false;
        clone.implementationType = this.implementationType;
        clone.dynamicValue = this.dynamicValue;
        clone.scope = this.scope;
        clone.type = this.type;
        clone.factory = this.factory;
        clone.provider = this.provider;
        clone.constraint = this.constraint;
        clone.onActivation = this.onActivation;
        clone.cache = this.cache;
        return clone;
      };
      return Binding;
    }();
    exports.Binding = Binding;
  }, {
    "../constants/literal_types": 15,
    "../utils/guid": 42
  } ],
  13: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BindingCount = {
      MultipleBindingsAvailable: 2,
      NoBindingsAvailable: 0,
      OnlyOneBindingAvailable: 1
    };
    exports.BindingCount = BindingCount;
  }, {} ],
  14: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
    exports.DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
    exports.NULL_ARGUMENT = "NULL argument";
    exports.KEY_NOT_FOUND = "Key Not Found";
    exports.AMBIGUOUS_MATCH = "Ambiguous match found for serviceIdentifier:";
    exports.CANNOT_UNBIND = "Could not unbind serviceIdentifier:";
    exports.NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
    exports.MISSING_INJECTABLE_ANNOTATION = "Missing required @injectable annotation in:";
    exports.MISSING_INJECT_ANNOTATION = "Missing required @inject or @multiInject annotation in:";
    exports.UNDEFINED_INJECT_ANNOTATION = function(name) {
      return "@inject called with undefined this could mean that the class " + name + " has a circular dependency problem. You can use a LazyServiceIdentifer to  overcome this limitation.";
    };
    exports.CIRCULAR_DEPENDENCY = "Circular dependency found:";
    exports.NOT_IMPLEMENTED = "Sorry, this feature is not fully implemented yet.";
    exports.INVALID_BINDING_TYPE = "Invalid binding type:";
    exports.NO_MORE_SNAPSHOTS_AVAILABLE = "No snapshot available to restore.";
    exports.INVALID_MIDDLEWARE_RETURN = "Invalid return type in middleware. Middleware must return!";
    exports.INVALID_FUNCTION_BINDING = "Value provided to function binding must be a function!";
    exports.INVALID_TO_SELF_VALUE = "The toSelf function can only be applied when a constructor is used as service identifier";
    exports.INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.";
    exports.ARGUMENTS_LENGTH_MISMATCH = function() {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) values[_i] = arguments[_i];
      return "The number of constructor arguments in the derived class " + values[0] + " must be >= than the number of constructor arguments of its base class.";
    };
    exports.CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = "Invalid Container constructor argument. Container options must be an object.";
    exports.CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = "Invalid Container option. Default scope must be a string ('singleton' or 'transient').";
    exports.CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = "Invalid Container option. Auto bind injectable must be a boolean";
    exports.CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = "Invalid Container option. Skip base check must be a boolean";
    exports.MULTIPLE_POST_CONSTRUCT_METHODS = "Cannot apply @postConstruct decorator multiple times in the same class";
    exports.POST_CONSTRUCT_ERROR = function() {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) values[_i] = arguments[_i];
      return "@postConstruct error in class " + values[0] + ": " + values[1];
    };
    exports.CIRCULAR_DEPENDENCY_IN_FACTORY = function() {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) values[_i] = arguments[_i];
      return "It looks like there is a circular dependency in one of the '" + values[0] + "' bindings. Please investigate bindings withservice identifier '" + values[1] + "'.";
    };
    exports.STACK_OVERFLOW = "Maximum call stack size exceeded";
  }, {} ],
  15: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BindingScopeEnum = {
      Request: "Request",
      Singleton: "Singleton",
      Transient: "Transient"
    };
    exports.BindingScopeEnum = BindingScopeEnum;
    var BindingTypeEnum = {
      ConstantValue: "ConstantValue",
      Constructor: "Constructor",
      DynamicValue: "DynamicValue",
      Factory: "Factory",
      Function: "Function",
      Instance: "Instance",
      Invalid: "Invalid",
      Provider: "Provider"
    };
    exports.BindingTypeEnum = BindingTypeEnum;
    var TargetTypeEnum = {
      ClassProperty: "ClassProperty",
      ConstructorArgument: "ConstructorArgument",
      Variable: "Variable"
    };
    exports.TargetTypeEnum = TargetTypeEnum;
  }, {} ],
  16: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NAMED_TAG = "named";
    exports.NAME_TAG = "name";
    exports.UNMANAGED_TAG = "unmanaged";
    exports.OPTIONAL_TAG = "optional";
    exports.INJECT_TAG = "inject";
    exports.MULTI_INJECT_TAG = "multi_inject";
    exports.TAGGED = "inversify:tagged";
    exports.TAGGED_PROP = "inversify:tagged_props";
    exports.PARAM_TYPES = "inversify:paramtypes";
    exports.DESIGN_PARAM_TYPES = "design:paramtypes";
    exports.POST_CONSTRUCT = "post_construct";
  }, {} ],
  17: [ function(require, module, exports) {
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : new P(function(resolve) {
            resolve(result.value);
          }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 0, t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_1 = require("../bindings/binding");
    var ERROR_MSGS = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_reader_1 = require("../planning/metadata_reader");
    var planner_1 = require("../planning/planner");
    var resolver_1 = require("../resolution/resolver");
    var binding_to_syntax_1 = require("../syntax/binding_to_syntax");
    var guid_1 = require("../utils/guid");
    var serialization_1 = require("../utils/serialization");
    var container_snapshot_1 = require("./container_snapshot");
    var lookup_1 = require("./lookup");
    var Container = function() {
      function Container(containerOptions) {
        var options = containerOptions || {};
        if ("object" !== typeof options) throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);
        if (void 0 === options.defaultScope) options.defaultScope = literal_types_1.BindingScopeEnum.Transient; else if (options.defaultScope !== literal_types_1.BindingScopeEnum.Singleton && options.defaultScope !== literal_types_1.BindingScopeEnum.Transient && options.defaultScope !== literal_types_1.BindingScopeEnum.Request) throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
        if (void 0 === options.autoBindInjectable) options.autoBindInjectable = false; else if ("boolean" !== typeof options.autoBindInjectable) throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE);
        if (void 0 === options.skipBaseClassChecks) options.skipBaseClassChecks = false; else if ("boolean" !== typeof options.skipBaseClassChecks) throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
        this.options = {
          autoBindInjectable: options.autoBindInjectable,
          defaultScope: options.defaultScope,
          skipBaseClassChecks: options.skipBaseClassChecks
        };
        this.guid = guid_1.guid();
        this._bindingDictionary = new lookup_1.Lookup();
        this._snapshots = [];
        this._middleware = null;
        this.parent = null;
        this._metadataReader = new metadata_reader_1.MetadataReader();
      }
      Container.merge = function(container1, container2) {
        var container = new Container();
        var bindingDictionary = planner_1.getBindingDictionary(container);
        var bindingDictionary1 = planner_1.getBindingDictionary(container1);
        var bindingDictionary2 = planner_1.getBindingDictionary(container2);
        function copyDictionary(origin, destination) {
          origin.traverse(function(key, value) {
            value.forEach(function(binding) {
              destination.add(binding.serviceIdentifier, binding.clone());
            });
          });
        }
        copyDictionary(bindingDictionary1, bindingDictionary);
        copyDictionary(bindingDictionary2, bindingDictionary);
        return container;
      };
      Container.prototype.load = function() {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) modules[_i] = arguments[_i];
        var getHelpers = this._getContainerModuleHelpersFactory();
        for (var _a = 0, modules_1 = modules; _a < modules_1.length; _a++) {
          var currentModule = modules_1[_a];
          var containerModuleHelpers = getHelpers(currentModule.guid);
          currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction);
        }
      };
      Container.prototype.loadAsync = function() {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) modules[_i] = arguments[_i];
        return __awaiter(this, void 0, void 0, function() {
          var getHelpers, _a, modules_2, currentModule, containerModuleHelpers;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              getHelpers = this._getContainerModuleHelpersFactory();
              _a = 0, modules_2 = modules;
              _b.label = 1;

             case 1:
              if (!(_a < modules_2.length)) return [ 3, 4 ];
              currentModule = modules_2[_a];
              containerModuleHelpers = getHelpers(currentModule.guid);
              return [ 4, currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction) ];

             case 2:
              _b.sent();
              _b.label = 3;

             case 3:
              _a++;
              return [ 3, 1 ];

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      Container.prototype.unload = function() {
        var _this = this;
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) modules[_i] = arguments[_i];
        var conditionFactory = function(expected) {
          return function(item) {
            return item.moduleId === expected;
          };
        };
        modules.forEach(function(module) {
          var condition = conditionFactory(module.guid);
          _this._bindingDictionary.removeByCondition(condition);
        });
      };
      Container.prototype.bind = function(serviceIdentifier) {
        var scope = this.options.defaultScope || literal_types_1.BindingScopeEnum.Transient;
        var binding = new binding_1.Binding(serviceIdentifier, scope);
        this._bindingDictionary.add(serviceIdentifier, binding);
        return new binding_to_syntax_1.BindingToSyntax(binding);
      };
      Container.prototype.rebind = function(serviceIdentifier) {
        this.unbind(serviceIdentifier);
        return this.bind(serviceIdentifier);
      };
      Container.prototype.unbind = function(serviceIdentifier) {
        try {
          this._bindingDictionary.remove(serviceIdentifier);
        } catch (e) {
          throw new Error(ERROR_MSGS.CANNOT_UNBIND + " " + serialization_1.getServiceIdentifierAsString(serviceIdentifier));
        }
      };
      Container.prototype.unbindAll = function() {
        this._bindingDictionary = new lookup_1.Lookup();
      };
      Container.prototype.isBound = function(serviceIdentifier) {
        var bound = this._bindingDictionary.hasKey(serviceIdentifier);
        !bound && this.parent && (bound = this.parent.isBound(serviceIdentifier));
        return bound;
      };
      Container.prototype.isBoundNamed = function(serviceIdentifier, named) {
        return this.isBoundTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
      };
      Container.prototype.isBoundTagged = function(serviceIdentifier, key, value) {
        var bound = false;
        if (this._bindingDictionary.hasKey(serviceIdentifier)) {
          var bindings = this._bindingDictionary.get(serviceIdentifier);
          var request_1 = planner_1.createMockRequest(this, serviceIdentifier, key, value);
          bound = bindings.some(function(b) {
            return b.constraint(request_1);
          });
        }
        !bound && this.parent && (bound = this.parent.isBoundTagged(serviceIdentifier, key, value));
        return bound;
      };
      Container.prototype.snapshot = function() {
        this._snapshots.push(container_snapshot_1.ContainerSnapshot.of(this._bindingDictionary.clone(), this._middleware));
      };
      Container.prototype.restore = function() {
        var snapshot = this._snapshots.pop();
        if (void 0 === snapshot) throw new Error(ERROR_MSGS.NO_MORE_SNAPSHOTS_AVAILABLE);
        this._bindingDictionary = snapshot.bindings;
        this._middleware = snapshot.middleware;
      };
      Container.prototype.createChild = function(containerOptions) {
        var child = new Container(containerOptions);
        child.parent = this;
        return child;
      };
      Container.prototype.applyMiddleware = function() {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) middlewares[_i] = arguments[_i];
        var initial = this._middleware ? this._middleware : this._planAndResolve();
        this._middleware = middlewares.reduce(function(prev, curr) {
          return curr(prev);
        }, initial);
      };
      Container.prototype.applyCustomMetadataReader = function(metadataReader) {
        this._metadataReader = metadataReader;
      };
      Container.prototype.get = function(serviceIdentifier) {
        return this._get(false, false, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier);
      };
      Container.prototype.getTagged = function(serviceIdentifier, key, value) {
        return this._get(false, false, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier, key, value);
      };
      Container.prototype.getNamed = function(serviceIdentifier, named) {
        return this.getTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
      };
      Container.prototype.getAll = function(serviceIdentifier) {
        return this._get(true, true, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier);
      };
      Container.prototype.getAllTagged = function(serviceIdentifier, key, value) {
        return this._get(false, true, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier, key, value);
      };
      Container.prototype.getAllNamed = function(serviceIdentifier, named) {
        return this.getAllTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
      };
      Container.prototype.resolve = function(constructorFunction) {
        var tempContainer = new Container();
        tempContainer.bind(constructorFunction).toSelf();
        tempContainer.parent = this;
        return tempContainer.get(constructorFunction);
      };
      Container.prototype._getContainerModuleHelpersFactory = function() {
        var _this = this;
        var setModuleId = function(bindingToSyntax, moduleId) {
          bindingToSyntax._binding.moduleId = moduleId;
        };
        var getBindFunction = function(moduleId) {
          return function(serviceIdentifier) {
            var _bind = _this.bind.bind(_this);
            var bindingToSyntax = _bind(serviceIdentifier);
            setModuleId(bindingToSyntax, moduleId);
            return bindingToSyntax;
          };
        };
        var getUnbindFunction = function(moduleId) {
          return function(serviceIdentifier) {
            var _unbind = _this.unbind.bind(_this);
            _unbind(serviceIdentifier);
          };
        };
        var getIsboundFunction = function(moduleId) {
          return function(serviceIdentifier) {
            var _isBound = _this.isBound.bind(_this);
            return _isBound(serviceIdentifier);
          };
        };
        var getRebindFunction = function(moduleId) {
          return function(serviceIdentifier) {
            var _rebind = _this.rebind.bind(_this);
            var bindingToSyntax = _rebind(serviceIdentifier);
            setModuleId(bindingToSyntax, moduleId);
            return bindingToSyntax;
          };
        };
        return function(mId) {
          return {
            bindFunction: getBindFunction(mId),
            isboundFunction: getIsboundFunction(mId),
            rebindFunction: getRebindFunction(mId),
            unbindFunction: getUnbindFunction(mId)
          };
        };
      };
      Container.prototype._get = function(avoidConstraints, isMultiInject, targetType, serviceIdentifier, key, value) {
        var result = null;
        var defaultArgs = {
          avoidConstraints: avoidConstraints,
          contextInterceptor: function(context) {
            return context;
          },
          isMultiInject: isMultiInject,
          key: key,
          serviceIdentifier: serviceIdentifier,
          targetType: targetType,
          value: value
        };
        if (this._middleware) {
          result = this._middleware(defaultArgs);
          if (void 0 === result || null === result) throw new Error(ERROR_MSGS.INVALID_MIDDLEWARE_RETURN);
        } else result = this._planAndResolve()(defaultArgs);
        return result;
      };
      Container.prototype._planAndResolve = function() {
        var _this = this;
        return function(args) {
          var context = planner_1.plan(_this._metadataReader, _this, args.isMultiInject, args.targetType, args.serviceIdentifier, args.key, args.value, args.avoidConstraints);
          context = args.contextInterceptor(context);
          var result = resolver_1.resolve(context);
          return result;
        };
      };
      return Container;
    }();
    exports.Container = Container;
  }, {
    "../bindings/binding": 12,
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "../constants/metadata_keys": 16,
    "../planning/metadata_reader": 24,
    "../planning/planner": 26,
    "../resolution/resolver": 32,
    "../syntax/binding_to_syntax": 36,
    "../utils/guid": 42,
    "../utils/serialization": 43,
    "./container_snapshot": 19,
    "./lookup": 20
  } ],
  18: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var guid_1 = require("../utils/guid");
    var ContainerModule = function() {
      function ContainerModule(registry) {
        this.guid = guid_1.guid();
        this.registry = registry;
      }
      return ContainerModule;
    }();
    exports.ContainerModule = ContainerModule;
    var AsyncContainerModule = function() {
      function AsyncContainerModule(registry) {
        this.guid = guid_1.guid();
        this.registry = registry;
      }
      return AsyncContainerModule;
    }();
    exports.AsyncContainerModule = AsyncContainerModule;
  }, {
    "../utils/guid": 42
  } ],
  19: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ContainerSnapshot = function() {
      function ContainerSnapshot() {}
      ContainerSnapshot.of = function(bindings, middleware) {
        var snapshot = new ContainerSnapshot();
        snapshot.bindings = bindings;
        snapshot.middleware = middleware;
        return snapshot;
      };
      return ContainerSnapshot;
    }();
    exports.ContainerSnapshot = ContainerSnapshot;
  }, {} ],
  20: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    var Lookup = function() {
      function Lookup() {
        this._map = new Map();
      }
      Lookup.prototype.getMap = function() {
        return this._map;
      };
      Lookup.prototype.add = function(serviceIdentifier, value) {
        if (null === serviceIdentifier || void 0 === serviceIdentifier) throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        if (null === value || void 0 === value) throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        var entry = this._map.get(serviceIdentifier);
        if (void 0 !== entry) {
          entry.push(value);
          this._map.set(serviceIdentifier, entry);
        } else this._map.set(serviceIdentifier, [ value ]);
      };
      Lookup.prototype.get = function(serviceIdentifier) {
        if (null === serviceIdentifier || void 0 === serviceIdentifier) throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        var entry = this._map.get(serviceIdentifier);
        if (void 0 !== entry) return entry;
        throw new Error(ERROR_MSGS.KEY_NOT_FOUND);
      };
      Lookup.prototype.remove = function(serviceIdentifier) {
        if (null === serviceIdentifier || void 0 === serviceIdentifier) throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        if (!this._map.delete(serviceIdentifier)) throw new Error(ERROR_MSGS.KEY_NOT_FOUND);
      };
      Lookup.prototype.removeByCondition = function(condition) {
        var _this = this;
        this._map.forEach(function(entries, key) {
          var updatedEntries = entries.filter(function(entry) {
            return !condition(entry);
          });
          updatedEntries.length > 0 ? _this._map.set(key, updatedEntries) : _this._map.delete(key);
        });
      };
      Lookup.prototype.hasKey = function(serviceIdentifier) {
        if (null === serviceIdentifier || void 0 === serviceIdentifier) throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        return this._map.has(serviceIdentifier);
      };
      Lookup.prototype.clone = function() {
        var copy = new Lookup();
        this._map.forEach(function(value, key) {
          value.forEach(function(b) {
            return copy.add(key, b.clone());
          });
        });
        return copy;
      };
      Lookup.prototype.traverse = function(func) {
        this._map.forEach(function(value, key) {
          func(key, value);
        });
      };
      return Lookup;
    }();
    exports.Lookup = Lookup;
  }, {
    "../constants/error_msgs": 14
  } ],
  21: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var keys = require("./constants/metadata_keys");
    exports.METADATA_KEY = keys;
    var container_1 = require("./container/container");
    exports.Container = container_1.Container;
    var literal_types_1 = require("./constants/literal_types");
    exports.BindingScopeEnum = literal_types_1.BindingScopeEnum;
    exports.BindingTypeEnum = literal_types_1.BindingTypeEnum;
    exports.TargetTypeEnum = literal_types_1.TargetTypeEnum;
    var container_module_1 = require("./container/container_module");
    exports.AsyncContainerModule = container_module_1.AsyncContainerModule;
    exports.ContainerModule = container_module_1.ContainerModule;
    var injectable_1 = require("./annotation/injectable");
    exports.injectable = injectable_1.injectable;
    var tagged_1 = require("./annotation/tagged");
    exports.tagged = tagged_1.tagged;
    var named_1 = require("./annotation/named");
    exports.named = named_1.named;
    var inject_1 = require("./annotation/inject");
    exports.inject = inject_1.inject;
    exports.LazyServiceIdentifer = inject_1.LazyServiceIdentifer;
    var optional_1 = require("./annotation/optional");
    exports.optional = optional_1.optional;
    var unmanaged_1 = require("./annotation/unmanaged");
    exports.unmanaged = unmanaged_1.unmanaged;
    var multi_inject_1 = require("./annotation/multi_inject");
    exports.multiInject = multi_inject_1.multiInject;
    var target_name_1 = require("./annotation/target_name");
    exports.targetName = target_name_1.targetName;
    var post_construct_1 = require("./annotation/post_construct");
    exports.postConstruct = post_construct_1.postConstruct;
    var metadata_reader_1 = require("./planning/metadata_reader");
    exports.MetadataReader = metadata_reader_1.MetadataReader;
    var guid_1 = require("./utils/guid");
    exports.guid = guid_1.guid;
    var decorator_utils_1 = require("./annotation/decorator_utils");
    exports.decorate = decorator_utils_1.decorate;
    var constraint_helpers_1 = require("./syntax/constraint_helpers");
    exports.traverseAncerstors = constraint_helpers_1.traverseAncerstors;
    exports.taggedConstraint = constraint_helpers_1.taggedConstraint;
    exports.namedConstraint = constraint_helpers_1.namedConstraint;
    exports.typeConstraint = constraint_helpers_1.typeConstraint;
    var serialization_1 = require("./utils/serialization");
    exports.getServiceIdentifierAsString = serialization_1.getServiceIdentifierAsString;
    var binding_utils_1 = require("./utils/binding_utils");
    exports.multiBindToService = binding_utils_1.multiBindToService;
  }, {
    "./annotation/decorator_utils": 2,
    "./annotation/inject": 3,
    "./annotation/injectable": 4,
    "./annotation/multi_inject": 5,
    "./annotation/named": 6,
    "./annotation/optional": 7,
    "./annotation/post_construct": 8,
    "./annotation/tagged": 9,
    "./annotation/target_name": 10,
    "./annotation/unmanaged": 11,
    "./constants/literal_types": 15,
    "./constants/metadata_keys": 16,
    "./container/container": 17,
    "./container/container_module": 18,
    "./planning/metadata_reader": 24,
    "./syntax/constraint_helpers": 39,
    "./utils/binding_utils": 40,
    "./utils/guid": 42,
    "./utils/serialization": 43
  } ],
  22: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var guid_1 = require("../utils/guid");
    var Context = function() {
      function Context(container) {
        this.guid = guid_1.guid();
        this.container = container;
      }
      Context.prototype.addPlan = function(plan) {
        this.plan = plan;
      };
      Context.prototype.setCurrentRequest = function(currentRequest) {
        this.currentRequest = currentRequest;
      };
      return Context;
    }();
    exports.Context = Context;
  }, {
    "../utils/guid": 42
  } ],
  23: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var Metadata = function() {
      function Metadata(key, value) {
        this.key = key;
        this.value = value;
      }
      Metadata.prototype.toString = function() {
        return this.key === METADATA_KEY.NAMED_TAG ? "named: " + this.value.toString() + " " : "tagged: { key:" + this.key.toString() + ", value: " + this.value + " }";
      };
      return Metadata;
    }();
    exports.Metadata = Metadata;
  }, {
    "../constants/metadata_keys": 16
  } ],
  24: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var MetadataReader = function() {
      function MetadataReader() {}
      MetadataReader.prototype.getConstructorMetadata = function(constructorFunc) {
        var compilerGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.PARAM_TYPES, constructorFunc);
        var userGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.TAGGED, constructorFunc);
        return {
          compilerGeneratedMetadata: compilerGeneratedMetadata,
          userGeneratedMetadata: userGeneratedMetadata || {}
        };
      };
      MetadataReader.prototype.getPropertiesMetadata = function(constructorFunc) {
        var userGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, constructorFunc) || [];
        return userGeneratedMetadata;
      };
      return MetadataReader;
    }();
    exports.MetadataReader = MetadataReader;
  }, {
    "../constants/metadata_keys": 16
  } ],
  25: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Plan = function() {
      function Plan(parentContext, rootRequest) {
        this.parentContext = parentContext;
        this.rootRequest = rootRequest;
      }
      return Plan;
    }();
    exports.Plan = Plan;
  }, {} ],
  26: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_count_1 = require("../bindings/binding_count");
    var ERROR_MSGS = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var METADATA_KEY = require("../constants/metadata_keys");
    var exceptions_1 = require("../utils/exceptions");
    var serialization_1 = require("../utils/serialization");
    var context_1 = require("./context");
    var metadata_1 = require("./metadata");
    var plan_1 = require("./plan");
    var reflection_utils_1 = require("./reflection_utils");
    var request_1 = require("./request");
    var target_1 = require("./target");
    function getBindingDictionary(cntnr) {
      return cntnr._bindingDictionary;
    }
    exports.getBindingDictionary = getBindingDictionary;
    function _createTarget(isMultiInject, targetType, serviceIdentifier, name, key, value) {
      var metadataKey = isMultiInject ? METADATA_KEY.MULTI_INJECT_TAG : METADATA_KEY.INJECT_TAG;
      var injectMetadata = new metadata_1.Metadata(metadataKey, serviceIdentifier);
      var target = new target_1.Target(targetType, name, serviceIdentifier, injectMetadata);
      if (void 0 !== key) {
        var tagMetadata = new metadata_1.Metadata(key, value);
        target.metadata.push(tagMetadata);
      }
      return target;
    }
    function _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target) {
      var bindings = getBindings(context.container, target.serviceIdentifier);
      var activeBindings = [];
      if (bindings.length === binding_count_1.BindingCount.NoBindingsAvailable && context.container.options.autoBindInjectable && "function" === typeof target.serviceIdentifier && metadataReader.getConstructorMetadata(target.serviceIdentifier).compilerGeneratedMetadata) {
        context.container.bind(target.serviceIdentifier).toSelf();
        bindings = getBindings(context.container, target.serviceIdentifier);
      }
      activeBindings = avoidConstraints ? bindings : bindings.filter(function(binding) {
        var request = new request_1.Request(binding.serviceIdentifier, context, parentRequest, binding, target);
        return binding.constraint(request);
      });
      _validateActiveBindingCount(target.serviceIdentifier, activeBindings, target, context.container);
      return activeBindings;
    }
    function _validateActiveBindingCount(serviceIdentifier, bindings, target, container) {
      switch (bindings.length) {
       case binding_count_1.BindingCount.NoBindingsAvailable:
        if (target.isOptional()) return bindings;
        var serviceIdentifierString = serialization_1.getServiceIdentifierAsString(serviceIdentifier);
        var msg = ERROR_MSGS.NOT_REGISTERED;
        msg += serialization_1.listMetadataForTarget(serviceIdentifierString, target);
        msg += serialization_1.listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
        throw new Error(msg);

       case binding_count_1.BindingCount.OnlyOneBindingAvailable:
        if (!target.isArray()) return bindings;

       case binding_count_1.BindingCount.MultipleBindingsAvailable:
       default:
        if (target.isArray()) return bindings;
        var serviceIdentifierString = serialization_1.getServiceIdentifierAsString(serviceIdentifier);
        var msg = ERROR_MSGS.AMBIGUOUS_MATCH + " " + serviceIdentifierString;
        msg += serialization_1.listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
        throw new Error(msg);
      }
    }
    function _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, parentRequest, target) {
      var activeBindings;
      var childRequest;
      if (null === parentRequest) {
        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, null, target);
        childRequest = new request_1.Request(serviceIdentifier, context, null, activeBindings, target);
        var thePlan = new plan_1.Plan(context, childRequest);
        context.addPlan(thePlan);
      } else {
        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target);
        childRequest = parentRequest.addChildRequest(target.serviceIdentifier, activeBindings, target);
      }
      activeBindings.forEach(function(binding) {
        var subChildRequest = null;
        if (target.isArray()) subChildRequest = childRequest.addChildRequest(binding.serviceIdentifier, binding, target); else {
          if (binding.cache) return;
          subChildRequest = childRequest;
        }
        if (binding.type === literal_types_1.BindingTypeEnum.Instance && null !== binding.implementationType) {
          var dependencies = reflection_utils_1.getDependencies(metadataReader, binding.implementationType);
          if (!context.container.options.skipBaseClassChecks) {
            var baseClassDependencyCount = reflection_utils_1.getBaseClassDependencyCount(metadataReader, binding.implementationType);
            if (dependencies.length < baseClassDependencyCount) {
              var error = ERROR_MSGS.ARGUMENTS_LENGTH_MISMATCH(reflection_utils_1.getFunctionName(binding.implementationType));
              throw new Error(error);
            }
          }
          dependencies.forEach(function(dependency) {
            _createSubRequests(metadataReader, false, dependency.serviceIdentifier, context, subChildRequest, dependency);
          });
        }
      });
    }
    function getBindings(container, serviceIdentifier) {
      var bindings = [];
      var bindingDictionary = getBindingDictionary(container);
      bindingDictionary.hasKey(serviceIdentifier) ? bindings = bindingDictionary.get(serviceIdentifier) : null !== container.parent && (bindings = getBindings(container.parent, serviceIdentifier));
      return bindings;
    }
    function plan(metadataReader, container, isMultiInject, targetType, serviceIdentifier, key, value, avoidConstraints) {
      void 0 === avoidConstraints && (avoidConstraints = false);
      var context = new context_1.Context(container);
      var target = _createTarget(isMultiInject, targetType, serviceIdentifier, "", key, value);
      try {
        _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, null, target);
        return context;
      } catch (error) {
        exceptions_1.isStackOverflowExeption(error) && context.plan && serialization_1.circularDependencyToException(context.plan.rootRequest);
        throw error;
      }
    }
    exports.plan = plan;
    function createMockRequest(container, serviceIdentifier, key, value) {
      var target = new target_1.Target(literal_types_1.TargetTypeEnum.Variable, "", serviceIdentifier, new metadata_1.Metadata(key, value));
      var context = new context_1.Context(container);
      var request = new request_1.Request(serviceIdentifier, context, null, [], target);
      return request;
    }
    exports.createMockRequest = createMockRequest;
  }, {
    "../bindings/binding_count": 13,
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "../constants/metadata_keys": 16,
    "../utils/exceptions": 41,
    "../utils/serialization": 43,
    "./context": 22,
    "./metadata": 23,
    "./plan": 25,
    "./reflection_utils": 28,
    "./request": 29,
    "./target": 30
  } ],
  27: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var QueryableString = function() {
      function QueryableString(str) {
        this.str = str;
      }
      QueryableString.prototype.startsWith = function(searchString) {
        return 0 === this.str.indexOf(searchString);
      };
      QueryableString.prototype.endsWith = function(searchString) {
        var reverseString = "";
        var reverseSearchString = searchString.split("").reverse().join("");
        reverseString = this.str.split("").reverse().join("");
        return this.startsWith.call({
          str: reverseString
        }, reverseSearchString);
      };
      QueryableString.prototype.contains = function(searchString) {
        return -1 !== this.str.indexOf(searchString);
      };
      QueryableString.prototype.equals = function(compareString) {
        return this.str === compareString;
      };
      QueryableString.prototype.value = function() {
        return this.str;
      };
      return QueryableString;
    }();
    exports.QueryableString = QueryableString;
  }, {} ],
  28: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var inject_1 = require("../annotation/inject");
    var ERROR_MSGS = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var METADATA_KEY = require("../constants/metadata_keys");
    var serialization_1 = require("../utils/serialization");
    exports.getFunctionName = serialization_1.getFunctionName;
    var target_1 = require("./target");
    function getDependencies(metadataReader, func) {
      var constructorName = serialization_1.getFunctionName(func);
      var targets = getTargets(metadataReader, constructorName, func, false);
      return targets;
    }
    exports.getDependencies = getDependencies;
    function getTargets(metadataReader, constructorName, func, isBaseClass) {
      var metadata = metadataReader.getConstructorMetadata(func);
      var serviceIdentifiers = metadata.compilerGeneratedMetadata;
      if (void 0 === serviceIdentifiers) {
        var msg = ERROR_MSGS.MISSING_INJECTABLE_ANNOTATION + " " + constructorName + ".";
        throw new Error(msg);
      }
      var constructorArgsMetadata = metadata.userGeneratedMetadata;
      var keys = Object.keys(constructorArgsMetadata);
      var hasUserDeclaredUnknownInjections = 0 === func.length && keys.length > 0;
      var iterations = hasUserDeclaredUnknownInjections ? keys.length : func.length;
      var constructorTargets = getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations);
      var propertyTargets = getClassPropsAsTargets(metadataReader, func);
      var targets = constructorTargets.concat(propertyTargets);
      return targets;
    }
    function getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata) {
      var targetMetadata = constructorArgsMetadata[index.toString()] || [];
      var metadata = formatTargetMetadata(targetMetadata);
      var isManaged = true !== metadata.unmanaged;
      var serviceIdentifier = serviceIdentifiers[index];
      var injectIdentifier = metadata.inject || metadata.multiInject;
      serviceIdentifier = injectIdentifier || serviceIdentifier;
      serviceIdentifier instanceof inject_1.LazyServiceIdentifer && (serviceIdentifier = serviceIdentifier.unwrap());
      if (isManaged) {
        var isObject = serviceIdentifier === Object;
        var isFunction = serviceIdentifier === Function;
        var isUndefined = void 0 === serviceIdentifier;
        var isUnknownType = isObject || isFunction || isUndefined;
        if (!isBaseClass && isUnknownType) {
          var msg = ERROR_MSGS.MISSING_INJECT_ANNOTATION + " argument " + index + " in class " + constructorName + ".";
          throw new Error(msg);
        }
        var target = new target_1.Target(literal_types_1.TargetTypeEnum.ConstructorArgument, metadata.targetName, serviceIdentifier);
        target.metadata = targetMetadata;
        return target;
      }
      return null;
    }
    function getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations) {
      var targets = [];
      for (var i = 0; i < iterations; i++) {
        var index = i;
        var target = getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata);
        null !== target && targets.push(target);
      }
      return targets;
    }
    function getClassPropsAsTargets(metadataReader, constructorFunc) {
      var classPropsMetadata = metadataReader.getPropertiesMetadata(constructorFunc);
      var targets = [];
      var keys = Object.keys(classPropsMetadata);
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var targetMetadata = classPropsMetadata[key];
        var metadata = formatTargetMetadata(classPropsMetadata[key]);
        var targetName = metadata.targetName || key;
        var serviceIdentifier = metadata.inject || metadata.multiInject;
        var target = new target_1.Target(literal_types_1.TargetTypeEnum.ClassProperty, targetName, serviceIdentifier);
        target.metadata = targetMetadata;
        targets.push(target);
      }
      var baseConstructor = Object.getPrototypeOf(constructorFunc.prototype).constructor;
      if (baseConstructor !== Object) {
        var baseTargets = getClassPropsAsTargets(metadataReader, baseConstructor);
        targets = targets.concat(baseTargets);
      }
      return targets;
    }
    function getBaseClassDependencyCount(metadataReader, func) {
      var baseConstructor = Object.getPrototypeOf(func.prototype).constructor;
      if (baseConstructor !== Object) {
        var baseConstructorName = serialization_1.getFunctionName(baseConstructor);
        var targets = getTargets(metadataReader, baseConstructorName, baseConstructor, true);
        var metadata = targets.map(function(t) {
          return t.metadata.filter(function(m) {
            return m.key === METADATA_KEY.UNMANAGED_TAG;
          });
        });
        var unmanagedCount = [].concat.apply([], metadata).length;
        var dependencyCount = targets.length - unmanagedCount;
        return dependencyCount > 0 ? dependencyCount : getBaseClassDependencyCount(metadataReader, baseConstructor);
      }
      return 0;
    }
    exports.getBaseClassDependencyCount = getBaseClassDependencyCount;
    function formatTargetMetadata(targetMetadata) {
      var targetMetadataMap = {};
      targetMetadata.forEach(function(m) {
        targetMetadataMap[m.key.toString()] = m.value;
      });
      return {
        inject: targetMetadataMap[METADATA_KEY.INJECT_TAG],
        multiInject: targetMetadataMap[METADATA_KEY.MULTI_INJECT_TAG],
        targetName: targetMetadataMap[METADATA_KEY.NAME_TAG],
        unmanaged: targetMetadataMap[METADATA_KEY.UNMANAGED_TAG]
      };
    }
  }, {
    "../annotation/inject": 3,
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "../constants/metadata_keys": 16,
    "../utils/serialization": 43,
    "./target": 30
  } ],
  29: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var guid_1 = require("../utils/guid");
    var Request = function() {
      function Request(serviceIdentifier, parentContext, parentRequest, bindings, target) {
        this.guid = guid_1.guid();
        this.serviceIdentifier = serviceIdentifier;
        this.parentContext = parentContext;
        this.parentRequest = parentRequest;
        this.target = target;
        this.childRequests = [];
        this.bindings = Array.isArray(bindings) ? bindings : [ bindings ];
        this.requestScope = null === parentRequest ? new Map() : null;
      }
      Request.prototype.addChildRequest = function(serviceIdentifier, bindings, target) {
        var child = new Request(serviceIdentifier, this.parentContext, this, bindings, target);
        this.childRequests.push(child);
        return child;
      };
      return Request;
    }();
    exports.Request = Request;
  }, {
    "../utils/guid": 42
  } ],
  30: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var guid_1 = require("../utils/guid");
    var metadata_1 = require("./metadata");
    var queryable_string_1 = require("./queryable_string");
    var Target = function() {
      function Target(type, name, serviceIdentifier, namedOrTagged) {
        this.guid = guid_1.guid();
        this.type = type;
        this.serviceIdentifier = serviceIdentifier;
        this.name = new queryable_string_1.QueryableString(name || "");
        this.metadata = new Array();
        var metadataItem = null;
        "string" === typeof namedOrTagged ? metadataItem = new metadata_1.Metadata(METADATA_KEY.NAMED_TAG, namedOrTagged) : namedOrTagged instanceof metadata_1.Metadata && (metadataItem = namedOrTagged);
        null !== metadataItem && this.metadata.push(metadataItem);
      }
      Target.prototype.hasTag = function(key) {
        for (var _i = 0, _a = this.metadata; _i < _a.length; _i++) {
          var m = _a[_i];
          if (m.key === key) return true;
        }
        return false;
      };
      Target.prototype.isArray = function() {
        return this.hasTag(METADATA_KEY.MULTI_INJECT_TAG);
      };
      Target.prototype.matchesArray = function(name) {
        return this.matchesTag(METADATA_KEY.MULTI_INJECT_TAG)(name);
      };
      Target.prototype.isNamed = function() {
        return this.hasTag(METADATA_KEY.NAMED_TAG);
      };
      Target.prototype.isTagged = function() {
        return this.metadata.some(function(m) {
          return m.key !== METADATA_KEY.INJECT_TAG && m.key !== METADATA_KEY.MULTI_INJECT_TAG && m.key !== METADATA_KEY.NAME_TAG && m.key !== METADATA_KEY.UNMANAGED_TAG && m.key !== METADATA_KEY.NAMED_TAG;
        });
      };
      Target.prototype.isOptional = function() {
        return this.matchesTag(METADATA_KEY.OPTIONAL_TAG)(true);
      };
      Target.prototype.getNamedTag = function() {
        if (this.isNamed()) return this.metadata.filter(function(m) {
          return m.key === METADATA_KEY.NAMED_TAG;
        })[0];
        return null;
      };
      Target.prototype.getCustomTags = function() {
        if (this.isTagged()) return this.metadata.filter(function(m) {
          return m.key !== METADATA_KEY.INJECT_TAG && m.key !== METADATA_KEY.MULTI_INJECT_TAG && m.key !== METADATA_KEY.NAME_TAG && m.key !== METADATA_KEY.UNMANAGED_TAG && m.key !== METADATA_KEY.NAMED_TAG;
        });
        return null;
      };
      Target.prototype.matchesNamedTag = function(name) {
        return this.matchesTag(METADATA_KEY.NAMED_TAG)(name);
      };
      Target.prototype.matchesTag = function(key) {
        var _this = this;
        return function(value) {
          for (var _i = 0, _a = _this.metadata; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.key === key && m.value === value) return true;
          }
          return false;
        };
      };
      return Target;
    }();
    exports.Target = Target;
  }, {
    "../constants/metadata_keys": 16,
    "../utils/guid": 42,
    "./metadata": 23,
    "./queryable_string": 27
  } ],
  31: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var error_msgs_1 = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var METADATA_KEY = require("../constants/metadata_keys");
    function _injectProperties(instance, childRequests, resolveRequest) {
      var propertyInjectionsRequests = childRequests.filter(function(childRequest) {
        return null !== childRequest.target && childRequest.target.type === literal_types_1.TargetTypeEnum.ClassProperty;
      });
      var propertyInjections = propertyInjectionsRequests.map(resolveRequest);
      propertyInjectionsRequests.forEach(function(r, index) {
        var propertyName = "";
        propertyName = r.target.name.value();
        var injection = propertyInjections[index];
        instance[propertyName] = injection;
      });
      return instance;
    }
    function _createInstance(Func, injections) {
      return new (Func.bind.apply(Func, [ void 0 ].concat(injections)))();
    }
    function _postConstruct(constr, result) {
      if (Reflect.hasMetadata(METADATA_KEY.POST_CONSTRUCT, constr)) {
        var data = Reflect.getMetadata(METADATA_KEY.POST_CONSTRUCT, constr);
        try {
          result[data.value]();
        } catch (e) {
          throw new Error(error_msgs_1.POST_CONSTRUCT_ERROR(constr.name, e.message));
        }
      }
    }
    function resolveInstance(constr, childRequests, resolveRequest) {
      var result = null;
      if (childRequests.length > 0) {
        var constructorInjectionsRequests = childRequests.filter(function(childRequest) {
          return null !== childRequest.target && childRequest.target.type === literal_types_1.TargetTypeEnum.ConstructorArgument;
        });
        var constructorInjections = constructorInjectionsRequests.map(resolveRequest);
        result = _createInstance(constr, constructorInjections);
        result = _injectProperties(result, childRequests, resolveRequest);
      } else result = new constr();
      _postConstruct(constr, result);
      return result;
    }
    exports.resolveInstance = resolveInstance;
  }, {
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "../constants/metadata_keys": 16
  } ],
  32: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var exceptions_1 = require("../utils/exceptions");
    var serialization_1 = require("../utils/serialization");
    var instantiation_1 = require("./instantiation");
    var invokeFactory = function(factoryType, serviceIdentifier, fn) {
      try {
        return fn();
      } catch (error) {
        throw exceptions_1.isStackOverflowExeption(error) ? new Error(ERROR_MSGS.CIRCULAR_DEPENDENCY_IN_FACTORY(factoryType, serviceIdentifier.toString())) : error;
      }
    };
    var _resolveRequest = function(requestScope) {
      return function(request) {
        request.parentContext.setCurrentRequest(request);
        var bindings = request.bindings;
        var childRequests = request.childRequests;
        var targetIsAnArray = request.target && request.target.isArray();
        var targetParentIsNotAnArray = !request.parentRequest || !request.parentRequest.target || !request.target || !request.parentRequest.target.matchesArray(request.target.serviceIdentifier);
        if (targetIsAnArray && targetParentIsNotAnArray) return childRequests.map(function(childRequest) {
          var _f = _resolveRequest(requestScope);
          return _f(childRequest);
        });
        var result = null;
        if (request.target.isOptional() && 0 === bindings.length) return;
        var binding_1 = bindings[0];
        var isSingleton = binding_1.scope === literal_types_1.BindingScopeEnum.Singleton;
        var isRequestSingleton = binding_1.scope === literal_types_1.BindingScopeEnum.Request;
        if (isSingleton && binding_1.activated) return binding_1.cache;
        if (isRequestSingleton && null !== requestScope && requestScope.has(binding_1.guid)) return requestScope.get(binding_1.guid);
        if (binding_1.type === literal_types_1.BindingTypeEnum.ConstantValue) result = binding_1.cache; else if (binding_1.type === literal_types_1.BindingTypeEnum.Function) result = binding_1.cache; else if (binding_1.type === literal_types_1.BindingTypeEnum.Constructor) result = binding_1.implementationType; else if (binding_1.type === literal_types_1.BindingTypeEnum.DynamicValue && null !== binding_1.dynamicValue) result = invokeFactory("toDynamicValue", binding_1.serviceIdentifier, function() {
          return binding_1.dynamicValue(request.parentContext);
        }); else if (binding_1.type === literal_types_1.BindingTypeEnum.Factory && null !== binding_1.factory) result = invokeFactory("toFactory", binding_1.serviceIdentifier, function() {
          return binding_1.factory(request.parentContext);
        }); else if (binding_1.type === literal_types_1.BindingTypeEnum.Provider && null !== binding_1.provider) result = invokeFactory("toProvider", binding_1.serviceIdentifier, function() {
          return binding_1.provider(request.parentContext);
        }); else {
          if (binding_1.type !== literal_types_1.BindingTypeEnum.Instance || null === binding_1.implementationType) {
            var serviceIdentifier = serialization_1.getServiceIdentifierAsString(request.serviceIdentifier);
            throw new Error(ERROR_MSGS.INVALID_BINDING_TYPE + " " + serviceIdentifier);
          }
          result = instantiation_1.resolveInstance(binding_1.implementationType, childRequests, _resolveRequest(requestScope));
        }
        "function" === typeof binding_1.onActivation && (result = binding_1.onActivation(request.parentContext, result));
        if (isSingleton) {
          binding_1.cache = result;
          binding_1.activated = true;
        }
        isRequestSingleton && null !== requestScope && !requestScope.has(binding_1.guid) && requestScope.set(binding_1.guid, result);
        return result;
      };
    };
    function resolve(context) {
      var _f = _resolveRequest(context.plan.rootRequest.requestScope);
      return _f(context.plan.rootRequest);
    }
    exports.resolve = resolve;
  }, {
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "../utils/exceptions": 41,
    "../utils/serialization": 43,
    "./instantiation": 31
  } ],
  33: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var literal_types_1 = require("../constants/literal_types");
    var binding_when_on_syntax_1 = require("./binding_when_on_syntax");
    var BindingInSyntax = function() {
      function BindingInSyntax(binding) {
        this._binding = binding;
      }
      BindingInSyntax.prototype.inRequestScope = function() {
        this._binding.scope = literal_types_1.BindingScopeEnum.Request;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingInSyntax.prototype.inSingletonScope = function() {
        this._binding.scope = literal_types_1.BindingScopeEnum.Singleton;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingInSyntax.prototype.inTransientScope = function() {
        this._binding.scope = literal_types_1.BindingScopeEnum.Transient;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      return BindingInSyntax;
    }();
    exports.BindingInSyntax = BindingInSyntax;
  }, {
    "../constants/literal_types": 15,
    "./binding_when_on_syntax": 37
  } ],
  34: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_in_syntax_1 = require("./binding_in_syntax");
    var binding_on_syntax_1 = require("./binding_on_syntax");
    var binding_when_syntax_1 = require("./binding_when_syntax");
    var BindingInWhenOnSyntax = function() {
      function BindingInWhenOnSyntax(binding) {
        this._binding = binding;
        this._bindingWhenSyntax = new binding_when_syntax_1.BindingWhenSyntax(this._binding);
        this._bindingOnSyntax = new binding_on_syntax_1.BindingOnSyntax(this._binding);
        this._bindingInSyntax = new binding_in_syntax_1.BindingInSyntax(binding);
      }
      BindingInWhenOnSyntax.prototype.inRequestScope = function() {
        return this._bindingInSyntax.inRequestScope();
      };
      BindingInWhenOnSyntax.prototype.inSingletonScope = function() {
        return this._bindingInSyntax.inSingletonScope();
      };
      BindingInWhenOnSyntax.prototype.inTransientScope = function() {
        return this._bindingInSyntax.inTransientScope();
      };
      BindingInWhenOnSyntax.prototype.when = function(constraint) {
        return this._bindingWhenSyntax.when(constraint);
      };
      BindingInWhenOnSyntax.prototype.whenTargetNamed = function(name) {
        return this._bindingWhenSyntax.whenTargetNamed(name);
      };
      BindingInWhenOnSyntax.prototype.whenTargetIsDefault = function() {
        return this._bindingWhenSyntax.whenTargetIsDefault();
      };
      BindingInWhenOnSyntax.prototype.whenTargetTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
      };
      BindingInWhenOnSyntax.prototype.whenInjectedInto = function(parent) {
        return this._bindingWhenSyntax.whenInjectedInto(parent);
      };
      BindingInWhenOnSyntax.prototype.whenParentNamed = function(name) {
        return this._bindingWhenSyntax.whenParentNamed(name);
      };
      BindingInWhenOnSyntax.prototype.whenParentTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenParentTagged(tag, value);
      };
      BindingInWhenOnSyntax.prototype.whenAnyAncestorIs = function(ancestor) {
        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
      };
      BindingInWhenOnSyntax.prototype.whenNoAncestorIs = function(ancestor) {
        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
      };
      BindingInWhenOnSyntax.prototype.whenAnyAncestorNamed = function(name) {
        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
      };
      BindingInWhenOnSyntax.prototype.whenAnyAncestorTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
      };
      BindingInWhenOnSyntax.prototype.whenNoAncestorNamed = function(name) {
        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
      };
      BindingInWhenOnSyntax.prototype.whenNoAncestorTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
      };
      BindingInWhenOnSyntax.prototype.whenAnyAncestorMatches = function(constraint) {
        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
      };
      BindingInWhenOnSyntax.prototype.whenNoAncestorMatches = function(constraint) {
        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
      };
      BindingInWhenOnSyntax.prototype.onActivation = function(handler) {
        return this._bindingOnSyntax.onActivation(handler);
      };
      return BindingInWhenOnSyntax;
    }();
    exports.BindingInWhenOnSyntax = BindingInWhenOnSyntax;
  }, {
    "./binding_in_syntax": 33,
    "./binding_on_syntax": 35,
    "./binding_when_syntax": 38
  } ],
  35: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_when_syntax_1 = require("./binding_when_syntax");
    var BindingOnSyntax = function() {
      function BindingOnSyntax(binding) {
        this._binding = binding;
      }
      BindingOnSyntax.prototype.onActivation = function(handler) {
        this._binding.onActivation = handler;
        return new binding_when_syntax_1.BindingWhenSyntax(this._binding);
      };
      return BindingOnSyntax;
    }();
    exports.BindingOnSyntax = BindingOnSyntax;
  }, {
    "./binding_when_syntax": 38
  } ],
  36: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    var literal_types_1 = require("../constants/literal_types");
    var binding_in_when_on_syntax_1 = require("./binding_in_when_on_syntax");
    var binding_when_on_syntax_1 = require("./binding_when_on_syntax");
    var BindingToSyntax = function() {
      function BindingToSyntax(binding) {
        this._binding = binding;
      }
      BindingToSyntax.prototype.to = function(constructor) {
        this._binding.type = literal_types_1.BindingTypeEnum.Instance;
        this._binding.implementationType = constructor;
        return new binding_in_when_on_syntax_1.BindingInWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toSelf = function() {
        if ("function" !== typeof this._binding.serviceIdentifier) throw new Error("" + ERROR_MSGS.INVALID_TO_SELF_VALUE);
        var self = this._binding.serviceIdentifier;
        return this.to(self);
      };
      BindingToSyntax.prototype.toConstantValue = function(value) {
        this._binding.type = literal_types_1.BindingTypeEnum.ConstantValue;
        this._binding.cache = value;
        this._binding.dynamicValue = null;
        this._binding.implementationType = null;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toDynamicValue = function(func) {
        this._binding.type = literal_types_1.BindingTypeEnum.DynamicValue;
        this._binding.cache = null;
        this._binding.dynamicValue = func;
        this._binding.implementationType = null;
        return new binding_in_when_on_syntax_1.BindingInWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toConstructor = function(constructor) {
        this._binding.type = literal_types_1.BindingTypeEnum.Constructor;
        this._binding.implementationType = constructor;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toFactory = function(factory) {
        this._binding.type = literal_types_1.BindingTypeEnum.Factory;
        this._binding.factory = factory;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toFunction = function(func) {
        if ("function" !== typeof func) throw new Error(ERROR_MSGS.INVALID_FUNCTION_BINDING);
        var bindingWhenOnSyntax = this.toConstantValue(func);
        this._binding.type = literal_types_1.BindingTypeEnum.Function;
        return bindingWhenOnSyntax;
      };
      BindingToSyntax.prototype.toAutoFactory = function(serviceIdentifier) {
        this._binding.type = literal_types_1.BindingTypeEnum.Factory;
        this._binding.factory = function(context) {
          var autofactory = function() {
            return context.container.get(serviceIdentifier);
          };
          return autofactory;
        };
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toProvider = function(provider) {
        this._binding.type = literal_types_1.BindingTypeEnum.Provider;
        this._binding.provider = provider;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
      };
      BindingToSyntax.prototype.toService = function(service) {
        this.toDynamicValue(function(context) {
          return context.container.get(service);
        });
      };
      return BindingToSyntax;
    }();
    exports.BindingToSyntax = BindingToSyntax;
  }, {
    "../constants/error_msgs": 14,
    "../constants/literal_types": 15,
    "./binding_in_when_on_syntax": 34,
    "./binding_when_on_syntax": 37
  } ],
  37: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_on_syntax_1 = require("./binding_on_syntax");
    var binding_when_syntax_1 = require("./binding_when_syntax");
    var BindingWhenOnSyntax = function() {
      function BindingWhenOnSyntax(binding) {
        this._binding = binding;
        this._bindingWhenSyntax = new binding_when_syntax_1.BindingWhenSyntax(this._binding);
        this._bindingOnSyntax = new binding_on_syntax_1.BindingOnSyntax(this._binding);
      }
      BindingWhenOnSyntax.prototype.when = function(constraint) {
        return this._bindingWhenSyntax.when(constraint);
      };
      BindingWhenOnSyntax.prototype.whenTargetNamed = function(name) {
        return this._bindingWhenSyntax.whenTargetNamed(name);
      };
      BindingWhenOnSyntax.prototype.whenTargetIsDefault = function() {
        return this._bindingWhenSyntax.whenTargetIsDefault();
      };
      BindingWhenOnSyntax.prototype.whenTargetTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
      };
      BindingWhenOnSyntax.prototype.whenInjectedInto = function(parent) {
        return this._bindingWhenSyntax.whenInjectedInto(parent);
      };
      BindingWhenOnSyntax.prototype.whenParentNamed = function(name) {
        return this._bindingWhenSyntax.whenParentNamed(name);
      };
      BindingWhenOnSyntax.prototype.whenParentTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenParentTagged(tag, value);
      };
      BindingWhenOnSyntax.prototype.whenAnyAncestorIs = function(ancestor) {
        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
      };
      BindingWhenOnSyntax.prototype.whenNoAncestorIs = function(ancestor) {
        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
      };
      BindingWhenOnSyntax.prototype.whenAnyAncestorNamed = function(name) {
        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
      };
      BindingWhenOnSyntax.prototype.whenAnyAncestorTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
      };
      BindingWhenOnSyntax.prototype.whenNoAncestorNamed = function(name) {
        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
      };
      BindingWhenOnSyntax.prototype.whenNoAncestorTagged = function(tag, value) {
        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
      };
      BindingWhenOnSyntax.prototype.whenAnyAncestorMatches = function(constraint) {
        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
      };
      BindingWhenOnSyntax.prototype.whenNoAncestorMatches = function(constraint) {
        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
      };
      BindingWhenOnSyntax.prototype.onActivation = function(handler) {
        return this._bindingOnSyntax.onActivation(handler);
      };
      return BindingWhenOnSyntax;
    }();
    exports.BindingWhenOnSyntax = BindingWhenOnSyntax;
  }, {
    "./binding_on_syntax": 35,
    "./binding_when_syntax": 38
  } ],
  38: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binding_on_syntax_1 = require("./binding_on_syntax");
    var constraint_helpers_1 = require("./constraint_helpers");
    var BindingWhenSyntax = function() {
      function BindingWhenSyntax(binding) {
        this._binding = binding;
      }
      BindingWhenSyntax.prototype.when = function(constraint) {
        this._binding.constraint = constraint;
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenTargetNamed = function(name) {
        this._binding.constraint = constraint_helpers_1.namedConstraint(name);
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenTargetIsDefault = function() {
        this._binding.constraint = function(request) {
          var targetIsDefault = null !== request.target && !request.target.isNamed() && !request.target.isTagged();
          return targetIsDefault;
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenTargetTagged = function(tag, value) {
        this._binding.constraint = constraint_helpers_1.taggedConstraint(tag)(value);
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenInjectedInto = function(parent) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.typeConstraint(parent)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenParentNamed = function(name) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.namedConstraint(name)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenParentTagged = function(tag, value) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.taggedConstraint(tag)(value)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenAnyAncestorIs = function(ancestor) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.typeConstraint(ancestor));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenNoAncestorIs = function(ancestor) {
        this._binding.constraint = function(request) {
          return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.typeConstraint(ancestor));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenAnyAncestorNamed = function(name) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.namedConstraint(name));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenNoAncestorNamed = function(name) {
        this._binding.constraint = function(request) {
          return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.namedConstraint(name));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenAnyAncestorTagged = function(tag, value) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.taggedConstraint(tag)(value));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenNoAncestorTagged = function(tag, value) {
        this._binding.constraint = function(request) {
          return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.taggedConstraint(tag)(value));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenAnyAncestorMatches = function(constraint) {
        this._binding.constraint = function(request) {
          return constraint_helpers_1.traverseAncerstors(request, constraint);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      BindingWhenSyntax.prototype.whenNoAncestorMatches = function(constraint) {
        this._binding.constraint = function(request) {
          return !constraint_helpers_1.traverseAncerstors(request, constraint);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
      };
      return BindingWhenSyntax;
    }();
    exports.BindingWhenSyntax = BindingWhenSyntax;
  }, {
    "./binding_on_syntax": 35,
    "./constraint_helpers": 39
  } ],
  39: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var METADATA_KEY = require("../constants/metadata_keys");
    var metadata_1 = require("../planning/metadata");
    var traverseAncerstors = function(request, constraint) {
      var parent = request.parentRequest;
      return null !== parent && (!!constraint(parent) || traverseAncerstors(parent, constraint));
    };
    exports.traverseAncerstors = traverseAncerstors;
    var taggedConstraint = function(key) {
      return function(value) {
        var constraint = function(request) {
          return null !== request && null !== request.target && request.target.matchesTag(key)(value);
        };
        constraint.metaData = new metadata_1.Metadata(key, value);
        return constraint;
      };
    };
    exports.taggedConstraint = taggedConstraint;
    var namedConstraint = taggedConstraint(METADATA_KEY.NAMED_TAG);
    exports.namedConstraint = namedConstraint;
    var typeConstraint = function(type) {
      return function(request) {
        var binding = null;
        if (null !== request) {
          binding = request.bindings[0];
          if ("string" === typeof type) {
            var serviceIdentifier = binding.serviceIdentifier;
            return serviceIdentifier === type;
          }
          var constructor = request.bindings[0].implementationType;
          return type === constructor;
        }
        return false;
      };
    };
    exports.typeConstraint = typeConstraint;
  }, {
    "../constants/metadata_keys": 16,
    "../planning/metadata": 23
  } ],
  40: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.multiBindToService = function(container) {
      return function(service) {
        return function() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) types[_i] = arguments[_i];
          return types.forEach(function(t) {
            return container.bind(t).toService(service);
          });
        };
      };
    };
  }, {} ],
  41: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    function isStackOverflowExeption(error) {
      return error instanceof RangeError || error.message === ERROR_MSGS.STACK_OVERFLOW;
    }
    exports.isStackOverflowExeption = isStackOverflowExeption;
  }, {
    "../constants/error_msgs": 14
  } ],
  42: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function guid() {
      function s4() {
        return Math.floor(65536 * (Math.random() + 1)).toString(16).substring(1);
      }
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    exports.guid = guid;
  }, {} ],
  43: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ERROR_MSGS = require("../constants/error_msgs");
    function getServiceIdentifierAsString(serviceIdentifier) {
      if ("function" === typeof serviceIdentifier) {
        var _serviceIdentifier = serviceIdentifier;
        return _serviceIdentifier.name;
      }
      if ("symbol" === typeof serviceIdentifier) return serviceIdentifier.toString();
      var _serviceIdentifier = serviceIdentifier;
      return _serviceIdentifier;
    }
    exports.getServiceIdentifierAsString = getServiceIdentifierAsString;
    function listRegisteredBindingsForServiceIdentifier(container, serviceIdentifier, getBindings) {
      var registeredBindingsList = "";
      var registeredBindings = getBindings(container, serviceIdentifier);
      if (0 !== registeredBindings.length) {
        registeredBindingsList = "\nRegistered bindings:";
        registeredBindings.forEach(function(binding) {
          var name = "Object";
          null !== binding.implementationType && (name = getFunctionName(binding.implementationType));
          registeredBindingsList = registeredBindingsList + "\n " + name;
          binding.constraint.metaData && (registeredBindingsList = registeredBindingsList + " - " + binding.constraint.metaData);
        });
      }
      return registeredBindingsList;
    }
    exports.listRegisteredBindingsForServiceIdentifier = listRegisteredBindingsForServiceIdentifier;
    function alreadyDependencyChain(request, serviceIdentifier) {
      return null !== request.parentRequest && (request.parentRequest.serviceIdentifier === serviceIdentifier || alreadyDependencyChain(request.parentRequest, serviceIdentifier));
    }
    function dependencyChainToString(request) {
      function _createStringArr(req, result) {
        void 0 === result && (result = []);
        var serviceIdentifier = getServiceIdentifierAsString(req.serviceIdentifier);
        result.push(serviceIdentifier);
        if (null !== req.parentRequest) return _createStringArr(req.parentRequest, result);
        return result;
      }
      var stringArr = _createStringArr(request);
      return stringArr.reverse().join(" --\x3e ");
    }
    function circularDependencyToException(request) {
      request.childRequests.forEach(function(childRequest) {
        if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
          var services = dependencyChainToString(childRequest);
          throw new Error(ERROR_MSGS.CIRCULAR_DEPENDENCY + " " + services);
        }
        circularDependencyToException(childRequest);
      });
    }
    exports.circularDependencyToException = circularDependencyToException;
    function listMetadataForTarget(serviceIdentifierString, target) {
      if (target.isTagged() || target.isNamed()) {
        var m_1 = "";
        var namedTag = target.getNamedTag();
        var otherTags = target.getCustomTags();
        null !== namedTag && (m_1 += namedTag.toString() + "\n");
        null !== otherTags && otherTags.forEach(function(tag) {
          m_1 += tag.toString() + "\n";
        });
        return " " + serviceIdentifierString + "\n " + serviceIdentifierString + " - " + m_1;
      }
      return " " + serviceIdentifierString;
    }
    exports.listMetadataForTarget = listMetadataForTarget;
    function getFunctionName(v) {
      if (v.name) return v.name;
      var name_1 = v.toString();
      var match = name_1.match(/^function\s*([^\s(]+)/);
      return match ? match[1] : "Anonymous function: " + name_1;
    }
    exports.getFunctionName = getFunctionName;
  }, {
    "../constants/error_msgs": 14
  } ],
  44: [ function(require, module, exports) {
    (function(process, global) {
      var Reflect;
      (function(Reflect) {
        (function(factory) {
          var root = "object" === typeof global ? global : "object" === typeof self ? self : "object" === typeof this ? this : Function("return this;")();
          var exporter = makeExporter(Reflect);
          "undefined" === typeof root.Reflect ? root.Reflect = Reflect : exporter = makeExporter(root.Reflect, exporter);
          factory(exporter);
          function makeExporter(target, previous) {
            return function(key, value) {
              "function" !== typeof target[key] && Object.defineProperty(target, key, {
                configurable: true,
                writable: true,
                value: value
              });
              previous && previous(key, value);
            };
          }
        })(function(exporter) {
          var hasOwn = Object.prototype.hasOwnProperty;
          var supportsSymbol = "function" === typeof Symbol;
          var toPrimitiveSymbol = supportsSymbol && "undefined" !== typeof Symbol.toPrimitive ? Symbol.toPrimitive : "@@toPrimitive";
          var iteratorSymbol = supportsSymbol && "undefined" !== typeof Symbol.iterator ? Symbol.iterator : "@@iterator";
          var supportsCreate = "function" === typeof Object.create;
          var supportsProto = {
            __proto__: []
          } instanceof Array;
          var downLevel = !supportsCreate && !supportsProto;
          var HashMap = {
            create: supportsCreate ? function() {
              return MakeDictionary(Object.create(null));
            } : supportsProto ? function() {
              return MakeDictionary({
                __proto__: null
              });
            } : function() {
              return MakeDictionary({});
            },
            has: downLevel ? function(map, key) {
              return hasOwn.call(map, key);
            } : function(map, key) {
              return key in map;
            },
            get: downLevel ? function(map, key) {
              return hasOwn.call(map, key) ? map[key] : void 0;
            } : function(map, key) {
              return map[key];
            }
          };
          var functionPrototype = Object.getPrototypeOf(Function);
          var usePolyfill = "object" === typeof process && process.env && "true" === process.env["REFLECT_METADATA_USE_MAP_POLYFILL"];
          var _Map = usePolyfill || "function" !== typeof Map || "function" !== typeof Map.prototype.entries ? CreateMapPolyfill() : Map;
          var _Set = usePolyfill || "function" !== typeof Set || "function" !== typeof Set.prototype.entries ? CreateSetPolyfill() : Set;
          var _WeakMap = usePolyfill || "function" !== typeof WeakMap ? CreateWeakMapPolyfill() : WeakMap;
          var Metadata = new _WeakMap();
          function decorate(decorators, target, propertyKey, attributes) {
            if (IsUndefined(propertyKey)) {
              if (!IsArray(decorators)) throw new TypeError();
              if (!IsConstructor(target)) throw new TypeError();
              return DecorateConstructor(decorators, target);
            }
            if (!IsArray(decorators)) throw new TypeError();
            if (!IsObject(target)) throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
            IsNull(attributes) && (attributes = void 0);
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
          }
          exporter("decorate", decorate);
          function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
              if (!IsObject(target)) throw new TypeError();
              if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
              OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
          }
          exporter("metadata", metadata);
          function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          exporter("defineMetadata", defineMetadata);
          function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasMetadata", hasMetadata);
          function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasOwnMetadata", hasOwnMetadata);
          function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
          }
          exporter("getMetadata", getMetadata);
          function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("getOwnMetadata", getOwnMetadata);
          function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryMetadataKeys(target, propertyKey);
          }
          exporter("getMetadataKeys", getMetadataKeys);
          function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            return OrdinaryOwnMetadataKeys(target, propertyKey);
          }
          exporter("getOwnMetadataKeys", getOwnMetadataKeys);
          function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, false);
            if (IsUndefined(metadataMap)) return false;
            if (!metadataMap.delete(metadataKey)) return false;
            if (metadataMap.size > 0) return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0) return true;
            Metadata.delete(target);
            return true;
          }
          exporter("deleteMetadata", deleteMetadata);
          function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated)) throw new TypeError();
                target = decorated;
              }
            }
            return target;
          }
          function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target, propertyKey, descriptor);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated)) throw new TypeError();
                descriptor = decorated;
              }
            }
            return descriptor;
          }
          function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
              if (!Create) return;
              targetMetadata = new _Map();
              Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
              if (!Create) return;
              metadataMap = new _Map();
              targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
          }
          function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn) return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
          }
          function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return false;
            return ToBoolean(metadataMap.has(MetadataKey));
          }
          function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
            return;
          }
          function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return;
            return metadataMap.get(MetadataKey);
          }
          function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, true);
            metadataMap.set(MetadataKey, MetadataValue);
          }
          function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (null === parent) return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0) return ownKeys;
            if (ownKeys.length <= 0) return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
              var key = ownKeys_1[_i];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
              var key = parentKeys_1[_a];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            return keys;
          }
          function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
              var next = IteratorStep(iterator);
              if (!next) {
                keys.length = k;
                return keys;
              }
              var nextValue = IteratorValue(next);
              try {
                keys[k] = nextValue;
              } catch (e) {
                try {
                  IteratorClose(iterator);
                } finally {
                  throw e;
                }
              }
              k++;
            }
          }
          function Type(x) {
            if (null === x) return 1;
            switch (typeof x) {
             case "undefined":
              return 0;

             case "boolean":
              return 2;

             case "string":
              return 3;

             case "symbol":
              return 4;

             case "number":
              return 5;

             case "object":
              return null === x ? 1 : 6;

             default:
              return 6;
            }
          }
          function IsUndefined(x) {
            return void 0 === x;
          }
          function IsNull(x) {
            return null === x;
          }
          function IsSymbol(x) {
            return "symbol" === typeof x;
          }
          function IsObject(x) {
            return "object" === typeof x ? null !== x : "function" === typeof x;
          }
          function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
             case 0:
             case 1:
             case 2:
             case 3:
             case 4:
             case 5:
              return input;
            }
            var hint = 3 === PreferredType ? "string" : 5 === PreferredType ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (void 0 !== exoticToPrim) {
              var result = exoticToPrim.call(input, hint);
              if (IsObject(result)) throw new TypeError();
              return result;
            }
            return OrdinaryToPrimitive(input, "default" === hint ? "number" : hint);
          }
          function OrdinaryToPrimitive(O, hint) {
            if ("string" === hint) {
              var toString_1 = O.toString;
              if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result)) return result;
              }
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result)) return result;
              }
            } else {
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result)) return result;
              }
              var toString_2 = O.toString;
              if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result)) return result;
              }
            }
            throw new TypeError();
          }
          function ToBoolean(argument) {
            return !!argument;
          }
          function ToString(argument) {
            return "" + argument;
          }
          function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3);
            if (IsSymbol(key)) return key;
            return ToString(key);
          }
          function IsArray(argument) {
            return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : "[object Array]" === Object.prototype.toString.call(argument);
          }
          function IsCallable(argument) {
            return "function" === typeof argument;
          }
          function IsConstructor(argument) {
            return "function" === typeof argument;
          }
          function IsPropertyKey(argument) {
            switch (Type(argument)) {
             case 3:
             case 4:
              return true;

             default:
              return false;
            }
          }
          function GetMethod(V, P) {
            var func = V[P];
            if (void 0 === func || null === func) return;
            if (!IsCallable(func)) throw new TypeError();
            return func;
          }
          function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method)) throw new TypeError();
            var iterator = method.call(obj);
            if (!IsObject(iterator)) throw new TypeError();
            return iterator;
          }
          function IteratorValue(iterResult) {
            return iterResult.value;
          }
          function IteratorStep(iterator) {
            var result = iterator.next();
            return !result.done && result;
          }
          function IteratorClose(iterator) {
            var f = iterator["return"];
            f && f.call(iterator);
          }
          function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if ("function" !== typeof O || O === functionPrototype) return proto;
            if (proto !== functionPrototype) return proto;
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (null == prototypeProto || prototypeProto === Object.prototype) return proto;
            var constructor = prototypeProto.constructor;
            if ("function" !== typeof constructor) return proto;
            if (constructor === O) return proto;
            return constructor;
          }
          function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = function() {
              function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
              }
              MapIterator.prototype["@@iterator"] = function() {
                return this;
              };
              MapIterator.prototype[iteratorSymbol] = function() {
                return this;
              };
              MapIterator.prototype.next = function() {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                  var result = this._selector(this._keys[index], this._values[index]);
                  if (index + 1 >= this._keys.length) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  } else this._index++;
                  return {
                    value: result,
                    done: false
                  };
                }
                return {
                  value: void 0,
                  done: true
                };
              };
              MapIterator.prototype.throw = function(error) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                throw error;
              };
              MapIterator.prototype.return = function(value) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                return {
                  value: value,
                  done: true
                };
              };
              return MapIterator;
            }();
            return function() {
              function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              Object.defineProperty(Map.prototype, "size", {
                get: function() {
                  return this._keys.length;
                },
                enumerable: true,
                configurable: true
              });
              Map.prototype.has = function(key) {
                return this._find(key, false) >= 0;
              };
              Map.prototype.get = function(key) {
                var index = this._find(key, false);
                return index >= 0 ? this._values[index] : void 0;
              };
              Map.prototype.set = function(key, value) {
                var index = this._find(key, true);
                this._values[index] = value;
                return this;
              };
              Map.prototype.delete = function(key) {
                var index = this._find(key, false);
                if (index >= 0) {
                  var size = this._keys.length;
                  for (var i = index + 1; i < size; i++) {
                    this._keys[i - 1] = this._keys[i];
                    this._values[i - 1] = this._values[i];
                  }
                  this._keys.length--;
                  this._values.length--;
                  if (key === this._cacheKey) {
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                  }
                  return true;
                }
                return false;
              };
              Map.prototype.clear = function() {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              };
              Map.prototype.keys = function() {
                return new MapIterator(this._keys, this._values, getKey);
              };
              Map.prototype.values = function() {
                return new MapIterator(this._keys, this._values, getValue);
              };
              Map.prototype.entries = function() {
                return new MapIterator(this._keys, this._values, getEntry);
              };
              Map.prototype["@@iterator"] = function() {
                return this.entries();
              };
              Map.prototype[iteratorSymbol] = function() {
                return this.entries();
              };
              Map.prototype._find = function(key, insert) {
                this._cacheKey !== key && (this._cacheIndex = this._keys.indexOf(this._cacheKey = key));
                if (this._cacheIndex < 0 && insert) {
                  this._cacheIndex = this._keys.length;
                  this._keys.push(key);
                  this._values.push(void 0);
                }
                return this._cacheIndex;
              };
              return Map;
            }();
            function getKey(key, _) {
              return key;
            }
            function getValue(_, value) {
              return value;
            }
            function getEntry(key, value) {
              return [ key, value ];
            }
          }
          function CreateSetPolyfill() {
            return function() {
              function Set() {
                this._map = new _Map();
              }
              Object.defineProperty(Set.prototype, "size", {
                get: function() {
                  return this._map.size;
                },
                enumerable: true,
                configurable: true
              });
              Set.prototype.has = function(value) {
                return this._map.has(value);
              };
              Set.prototype.add = function(value) {
                return this._map.set(value, value), this;
              };
              Set.prototype.delete = function(value) {
                return this._map.delete(value);
              };
              Set.prototype.clear = function() {
                this._map.clear();
              };
              Set.prototype.keys = function() {
                return this._map.keys();
              };
              Set.prototype.values = function() {
                return this._map.values();
              };
              Set.prototype.entries = function() {
                return this._map.entries();
              };
              Set.prototype["@@iterator"] = function() {
                return this.keys();
              };
              Set.prototype[iteratorSymbol] = function() {
                return this.keys();
              };
              return Set;
            }();
          }
          function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return function() {
              function WeakMap() {
                this._key = CreateUniqueKey();
              }
              WeakMap.prototype.has = function(target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return void 0 !== table && HashMap.has(table, this._key);
              };
              WeakMap.prototype.get = function(target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return void 0 !== table ? HashMap.get(table, this._key) : void 0;
              };
              WeakMap.prototype.set = function(target, value) {
                var table = GetOrCreateWeakMapTable(target, true);
                table[this._key] = value;
                return this;
              };
              WeakMap.prototype.delete = function(target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return void 0 !== table && delete table[this._key];
              };
              WeakMap.prototype.clear = function() {
                this._key = CreateUniqueKey();
              };
              return WeakMap;
            }();
            function CreateUniqueKey() {
              var key;
              do {
                key = "@@WeakMap@@" + CreateUUID();
              } while (HashMap.has(keys, key));
              keys[key] = true;
              return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
              if (!hasOwn.call(target, rootKey)) {
                if (!create) return;
                Object.defineProperty(target, rootKey, {
                  value: HashMap.create()
                });
              }
              return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
              for (var i = 0; i < size; ++i) buffer[i] = 255 * Math.random() | 0;
              return buffer;
            }
            function GenRandomBytes(size) {
              if ("function" === typeof Uint8Array) {
                if ("undefined" !== typeof crypto) return crypto.getRandomValues(new Uint8Array(size));
                if ("undefined" !== typeof msCrypto) return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
              }
              return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
              var data = GenRandomBytes(UUID_SIZE);
              data[6] = 79 & data[6] | 64;
              data[8] = 191 & data[8] | 128;
              var result = "";
              for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                4 !== offset && 6 !== offset && 8 !== offset || (result += "-");
                byte < 16 && (result += "0");
                result += byte.toString(16).toLowerCase();
              }
              return result;
            }
          }
          function MakeDictionary(obj) {
            obj.__ = void 0;
            delete obj.__;
            return obj;
          }
        });
      })(Reflect || (Reflect = {}));
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    _process: 1
  } ],
  AStar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bedeefCE5BIULj5Hay/tYDx", "AStar");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Graph_1 = require("./Graph");
    var PathNode_1 = require("./PathNode");
    var Astar = function() {
      function Astar(heuristic) {
        this.graph = new Graph_1.Graph();
        this.heuristic = heuristic;
      }
      Object.defineProperty(Astar.prototype, "heuristic", {
        get: function() {
          return this._heuristic;
        },
        set: function(v) {
          this._heuristic = v;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Astar.prototype, "graph", {
        get: function() {
          return this._graph;
        },
        set: function(v) {
          this._graph = v;
        },
        enumerable: true,
        configurable: true
      });
      Astar.prototype.getNode = function(x, y) {
        return this.graph.getNode(x, y);
      };
      Astar.prototype.path = function(a, b) {
        var open = new Array(), closed = new Array();
        var next = new PathNode_1.PathNode(0, this.heuristic.getHeuristic(a.x, a.y, a.z, b.x, b.y, b.z), null, a);
        var path = new Array();
        while (next.data != b) {
          var lowest = null;
          var lowestIndex = -1;
          for (var i = 0; i < open.length; i++) if (null == lowest || lowest.f > open[i].f) {
            lowest = open[i];
            lowestIndex = i;
          }
          if (null != lowest) {
            open.splice(lowestIndex, 1);
            closed.push(lowest);
            next = lowest;
          }
          var connections = next.data.getConnections();
          for (var i = 0; i < connections.length; i++) {
            var add = true, openIndex = -1;
            for (var j = 0; j < open.length; j++) open[j].data.x == connections[i].x && open[j].data.y == connections[i].y && open[j].data.z == connections[i].z && (openIndex = j);
            for (var j = 0; j < closed.length; j++) closed[j].data.x == connections[i].x && closed[j].data.y == connections[i].y && closed[j].data.z == connections[i].z && (add = false);
            var node = connections[i];
            var g = next.g;
            g += Math.sqrt(Math.pow(next.data.x - node.x, 2) + Math.pow(next.data.y - node.y, 2) + Math.pow(next.data.z - node.z, 2)) * node.weight;
            var h = this.heuristic.getHeuristic(node.x, node.y, node.z, b.x, b.y, b.z);
            if (-1 == openIndex && add) open.push(new PathNode_1.PathNode(g, h, next, node)); else if (openIndex > -1 && g + h < open[openIndex].f && add) {
              open[openIndex].g = g;
              open[openIndex].h = h;
              open[openIndex].previous = next;
            }
          }
        }
        while (null != next) {
          path.push(next.data);
          next = next.previous;
        }
        path.reverse();
        return path;
      };
      Astar.prototype.load = function(data) {
        this.graph.fromArray(data);
      };
      return Astar;
    }();
    exports.Astar = Astar;
    cc._RF.pop();
  }, {
    "./Graph": "Graph",
    "./PathNode": "PathNode"
  } ],
  DijkstrasHeuristic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4e507rJ3jlMVKUke5XIka5H", "DijkstrasHeuristic");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Heuristic_1 = require("./Heuristic");
    var DijkstrasHeuristic = function(_super) {
      __extends(DijkstrasHeuristic, _super);
      function DijkstrasHeuristic() {
        return _super.call(this) || this;
      }
      DijkstrasHeuristic.prototype.getHeuristic = function(x1, y1, z1, x2, y2, z2) {
        return 0;
      };
      return DijkstrasHeuristic;
    }(Heuristic_1.Heuristic);
    exports.DijkstrasHeuristic = DijkstrasHeuristic;
    cc._RF.pop();
  }, {
    "./Heuristic": "Heuristic"
  } ],
  EuclideanHeuristic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b13e1neKR1EI7r0SDA3ikIy", "EuclideanHeuristic");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Heuristic_1 = require("./Heuristic");
    var EuclideanHeuristic = function(_super) {
      __extends(EuclideanHeuristic, _super);
      function EuclideanHeuristic() {
        return _super.call(this) || this;
      }
      EuclideanHeuristic.prototype.getHeuristic = function(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
      };
      return EuclideanHeuristic;
    }(Heuristic_1.Heuristic);
    exports.EuclideanHeuristic = EuclideanHeuristic;
    cc._RF.pop();
  }, {
    "./Heuristic": "Heuristic"
  } ],
  GraphNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8450d4cL19Ct6zPSJRpM6FR", "GraphNode");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GraphNode = function() {
      function GraphNode(x, y, z, weight) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.weight = weight;
        this.connections = [];
      }
      GraphNode.prototype.getConnections = function() {
        return this.connections;
      };
      GraphNode.prototype.connectTo = function(b) {
        this.connections.push(b);
      };
      return GraphNode;
    }();
    exports.GraphNode = GraphNode;
    cc._RF.pop();
  }, {} ],
  Graph: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd1cd/Qg8hHkoeuO5cyxsB+", "Graph");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GraphNode_1 = require("./GraphNode");
    var Graph = function() {
      function Graph() {
        this.nodes = [];
      }
      Graph.prototype.getNode = function(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
          var n = this.nodes[i];
          if (n.x == x && n.y == y) return n;
        }
      };
      Graph.prototype.fromArray = function(data) {
        this.nodes = [];
        var width = data[0].length;
        var height = data.length;
        for (var i = 0; i < height; i++) for (var j = 0; j < width; j++) {
          var weight = data[i][j];
          var node = new GraphNode_1.GraphNode(j, i, 0, weight);
          this.nodes.push(node);
        }
        for (var i = 0; i < this.nodes.length; i++) {
          var n = this.nodes[i];
          for (var x = -1; x <= 1; x++) for (var y = -1; y <= 1; y++) {
            if (0 == x && 0 == y) continue;
            if (n.x + x < 0 || n.x + x >= width || n.y + y < 0 || n.y + y >= height) continue;
            var node = this.nodes[i + width * y + x];
            this.nodes[i].connectTo(node);
          }
        }
      };
      return Graph;
    }();
    exports.Graph = Graph;
    cc._RF.pop();
  }, {
    "./GraphNode": "GraphNode"
  } ],
  Heuristic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d2ff6PtBWNM1LUavcimCNeH", "Heuristic");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Heuristic = function() {
      function Heuristic() {}
      return Heuristic;
    }();
    exports.Heuristic = Heuristic;
    cc._RF.pop();
  }, {} ],
  ManhattenHeuristic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15d13B/UuhFfIgI86YZDFEX", "ManhattenHeuristic");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Heuristic_1 = require("./Heuristic");
    var ManhattenHeuristic = function(_super) {
      __extends(ManhattenHeuristic, _super);
      function ManhattenHeuristic() {
        return _super.call(this) || this;
      }
      ManhattenHeuristic.prototype.getHeuristic = function(x1, y1, z1, x2, y2, z2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
      };
      return ManhattenHeuristic;
    }(Heuristic_1.Heuristic);
    exports.ManhattenHeuristic = ManhattenHeuristic;
    cc._RF.pop();
  }, {
    "./Heuristic": "Heuristic"
  } ],
  Mixin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11398WCkvdGzaMybxI6w+51", "Mixin");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function applyMixins(derivedCtor, baseCtors) {
      baseCtors.forEach(function(baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function(name) {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
      });
    }
    exports.default = applyMixins;
    cc._RF.pop();
  }, {} ],
  PathNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5171lL4htLQ7THeYab6tCj", "PathNode");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PathNode = function() {
      function PathNode(g, h, previous, data) {
        this.g = g;
        this.h = h;
        this.previous = previous;
        this.data = data;
      }
      Object.defineProperty(PathNode.prototype, "f", {
        get: function() {
          return this.g + this.h;
        },
        enumerable: true,
        configurable: true
      });
      return PathNode;
    }();
    exports.PathNode = PathNode;
    cc._RF.pop();
  }, {} ],
  "character.class": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9affNvJcJDjaqEIu76QYr2", "character.class");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var movable_class_1 = require("./movable.class");
    var Mixin_1 = require("../../Lib/Mixin");
    var property = cc._decorator.property;
    var Character = function(_super) {
      __extends(Character, _super);
      function Character() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 10;
        _this.maxHealth = 0;
        _this._health = 0;
        _this.damage = 0;
        _this.defense = 0;
        _this.tools = [];
        _this.weapons = [];
        _this.equipments = [];
        _this.skills = [];
        return _this;
      }
      Object.defineProperty(Character.prototype, "health", {
        get: function() {
          return this._health;
        },
        set: function(v) {
          this._health = v;
        },
        enumerable: true,
        configurable: true
      });
      Character.prototype.attack = function(enemy) {};
      Character.prototype.useSkill = function(skill) {
        skill.release();
      };
      Character.prototype.useTool = function(tool) {
        tool.use();
      };
      Character.prototype.changeDirection = function(dir) {
        var direction = null;
        this.isMoving = true;
      };
      Character.prototype.calcSpeed = function(dt) {
        var speed = this.speed;
        speed = this.allowAccel && speed < this.maxSpeed ? speed + this.accel * dt : this.maxSpeed;
        return speed;
      };
      Character.prototype.getXSpeed = function() {
        var range = this.direction % 360 * 2 * Math.PI / 360;
        return this.speed * Math.cos(range);
      };
      Character.prototype.getYspeed = function() {
        var range = this.direction % 360 * 2 * Math.PI / 360;
        return this.speed * -Math.sin(range);
      };
      Character.prototype.avoidOutOfScreen = function() {
        var x = this.node.x;
        var y = this.node.y;
        var minPosX = this.minPosX || -this.node.parent.width / 2;
        var maxPosX = this.maxPosX || this.node.parent.width / 2;
        var minPosY = this.minPosY || -this.node.parent.height / 2;
        var maxPosY = this.maxPosY || this.node.parent.height / 2;
        this.node.x > maxPosX ? this.node.x = maxPosX : this.node.x < minPosX && (this.node.x = minPosX);
        this.node.y > maxPosY ? this.node.y = maxPosY : this.node.y < minPosY && (this.node.y = minPosY);
      };
      Character.prototype.updatePostion = function(dt) {
        if (this.isMoving) {
          this.avoidOutOfScreen();
          this.speed = this.calcSpeed(dt);
          this.node.x += this.getXSpeed() * dt;
          this.node.y += this.getYspeed() * dt;
        }
      };
      Character.prototype.moveTo = function() {
        throw new Error("Method not implemented.");
      };
      __decorate([ property() ], Character.prototype, "speed", void 0);
      __decorate([ property() ], Character.prototype, "maxSpeed", void 0);
      __decorate([ property() ], Character.prototype, "accel", void 0);
      __decorate([ property() ], Character.prototype, "allowAccel", void 0);
      __decorate([ property() ], Character.prototype, "height", void 0);
      __decorate([ property() ], Character.prototype, "width", void 0);
      __decorate([ property() ], Character.prototype, "maxHealth", void 0);
      __decorate([ property() ], Character.prototype, "damage", void 0);
      __decorate([ property() ], Character.prototype, "defense", void 0);
      __decorate([ property() ], Character.prototype, "tools", void 0);
      __decorate([ property() ], Character.prototype, "weapons", void 0);
      __decorate([ property() ], Character.prototype, "equipments", void 0);
      __decorate([ property() ], Character.prototype, "skills", void 0);
      return Character;
    }(cc.Component);
    exports.Character = Character;
    Mixin_1.default(Character, [ movable_class_1.Movable ]);
    cc._RF.pop();
  }, {
    "../../Lib/Mixin": "Mixin",
    "./movable.class": "movable.class"
  } ],
  "combatUnit.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6741zro2dKz7crgc7+zxWI", "combatUnit.interface");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var property = cc._decorator.property;
    cc._RF.pop();
  }, {} ],
  config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12346wFAypNtYCsLc3gl+HT", "config");
    cc._RF.pop();
  }, {} ],
  consoleController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec0a8xF21JGIKy6r+L0aSVD", "consoleController");
    cc._RF.pop();
  }, {} ],
  const: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e8817JeaJNGwJ5MIL9zVF9M", "const");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var INPUT_TYPES;
    (function(INPUT_TYPES) {
      INPUT_TYPES[INPUT_TYPES["KEYBOARD"] = 0] = "KEYBOARD";
      INPUT_TYPES[INPUT_TYPES["TOUCH"] = 1] = "TOUCH";
      INPUT_TYPES[INPUT_TYPES["CONTROLLER"] = 2] = "CONTROLLER";
    })(INPUT_TYPES = exports.INPUT_TYPES || (exports.INPUT_TYPES = {}));
    cc._RF.pop();
  }, {} ],
  "controlAble.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b64bc5hlFBFJZ4xwuXkp/Jd", "controlAble.interface");
    cc._RF.pop();
  }, {} ],
  dpad: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5fa3wwwC1L+5a1OKnKRYZD", "dpad");
    cc._RF.pop();
  }, {} ],
  enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f4d13H7E/VE+pHdIv6e6Xwo", "enemy");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Enemy = function() {
      function Enemy() {}
      return Enemy;
    }();
    exports.Enemy = Enemy;
    cc._RF.pop();
  }, {} ],
  "entity.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c3ef47B7vlMB7l8OSsQ5ryZ", "entity.interface");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  environment: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c19anYK/5IxKWND/9rZEd5", "environment");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var const_1 = require("../const/const");
    var INPUT_TYPE = const_1.INPUT_TYPES.KEYBOARD;
    exports.ENV = {
      INPUT_TYPE: INPUT_TYPE
    };
    cc._RF.pop();
  }, {
    "../const/const": "const"
  } ],
  equipment: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3bc0dMqThNE+rDo+DJkCURG", "equipment");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Equipmnet = function() {
      function Equipmnet() {}
      return Equipmnet;
    }();
    exports.Equipmnet = Equipmnet;
    cc._RF.pop();
  }, {} ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "94153CJhu9O4bCJWGGB5X/d", "game");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var game = cc.game;
    var ccclass = cc._decorator.ccclass;
    var GameConfig = function(_super) {
      __extends(GameConfig, _super);
      function GameConfig() {
        var _this = _super.call(this) || this;
        game.config.debugMode = 0;
        var demon = _this.getComponent("dragonBones.demon");
        demon.playAnimation("run");
        return _this;
      }
      GameConfig = __decorate([ ccclass ], GameConfig);
      return GameConfig;
    }(cc.Component);
    exports.GameConfig = GameConfig;
    cc._RF.pop();
  }, {} ],
  keyboard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7ba9bBZ/dZD05CUAfTDl44t", "keyboard");
    cc._RF.pop();
  }, {} ],
  "level-1": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8bb6e3rFBGdpPhDBsMc8Sh", "level-1");
    cc._RF.pop();
  }, {} ],
  level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb088jFNRREv7Xqr7xC5i6b", "level");
    cc._RF.pop();
  }, {} ],
  "movable.class": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2916eSrqsxFUai8jScNe5LZ", "movable.class");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var property = cc._decorator.property;
    var Movable = function(_super) {
      __extends(Movable, _super);
      function Movable() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.speed = 0;
        _this.maxSpeed = 200;
        _this.accel = 1e3;
        _this.allowAccel = true;
        _this.direction = 0;
        _this._isMoving = false;
        return _this;
      }
      Object.defineProperty(Movable.prototype, "isMoving", {
        get: function() {
          return this._isMoving;
        },
        set: function(v) {
          this._isMoving || (this.speed = 0);
          this._isMoving = v;
        },
        enumerable: true,
        configurable: true
      });
      Movable.prototype.moveTo = function() {};
      __decorate([ property() ], Movable.prototype, "speed", void 0);
      __decorate([ property() ], Movable.prototype, "maxSpeed", void 0);
      __decorate([ property() ], Movable.prototype, "accel", void 0);
      __decorate([ property() ], Movable.prototype, "allowAccel", void 0);
      __decorate([ property() ], Movable.prototype, "direction", void 0);
      return Movable;
    }(cc.Component);
    exports.Movable = Movable;
    cc._RF.pop();
  }, {} ],
  "mr-1": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29cf1WD+T5FtKlPUUcfwDdA", "mr-1");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var inversify_1 = require("inversify");
    require("reflect-metadata");
    var player_1 = require("./player");
    var AStar_1 = require("../../utils/AStar/AStar");
    var EuclideanHeuristic_1 = require("../../utils/AStar/Heuristics/EuclideanHeuristic");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
    var Mr1 = function(_super) {
      __extends(Mr1, _super);
      function Mr1() {
        return _super.call(this) || this;
      }
      Mr1.prototype.onLoad = function() {
        var aStar = new AStar_1.Astar(new EuclideanHeuristic_1.EuclideanHeuristic());
        var data = [ [ 0, 3, 0, 0, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 0, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 0, 0, 3, 0, 3, 0, 0 ] ];
        aStar.load(data);
        var path = aStar.path(aStar.getNode(0, 0), aStar.getNode(7, 7));
        console.log(path);
        this.bindMoveEvent();
      };
      Mr1.prototype.update = function(dt) {
        this.updatePostion(dt);
      };
      Mr1 = __decorate([ inversify_1.injectable(), ccclass ], Mr1);
      return Mr1;
    }(player_1.Player);
    exports.Mr1 = Mr1;
    cc._RF.pop();
  }, {
    "../../utils/AStar/AStar": "AStar",
    "../../utils/AStar/Heuristics/EuclideanHeuristic": "EuclideanHeuristic",
    "./player": "player",
    inversify: 21,
    "reflect-metadata": 44
  } ],
  npc: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf1cepnRCJD+oQTRp/eWMR0", "npc");
    cc._RF.pop();
  }, {} ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe9e855t4lO7aK0vSUa5AUO", "player");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var environment_1 = require("../../config/environment");
    var const_1 = require("../../const/const");
    var character_class_1 = require("../common/character.class");
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.pressingDirectionKeys = new Set();
        return _this;
      }
      Player.prototype.addDirectionKey = function(key) {
        this.pressingDirectionKeys.add(key);
        this.changeDirection();
      };
      Player.prototype.removeDirectionKey = function(key) {
        this.pressingDirectionKeys.delete(key);
        this.changeDirection();
      };
      Player.prototype.changeDirection = function() {
        var direction = null;
        var keys = this.pressingDirectionKeys;
        var hasLeft = keys.has(cc.macro.KEY.a);
        var hasRight = keys.has(cc.macro.KEY.d);
        var hasTop = keys.has(cc.macro.KEY.w);
        var hasBottom = keys.has(cc.macro.KEY.s);
        var hasX = hasLeft || hasRight;
        var hasY = hasTop || hasBottom;
        this.isMoving = true;
        if (environment_1.ENV.INPUT_TYPE === const_1.INPUT_TYPES.KEYBOARD) {
          if (keys.size >= 3) {
            this.isMoving = false;
            return;
          }
          if (0 === keys.size) {
            this.isMoving = false;
            return;
          }
          if (hasTop && hasBottom || hasLeft && hasRight) {
            this.isMoving = false;
            return;
          }
          if (hasX) if (hasY) {
            hasLeft && hasTop && (direction = 225);
            hasLeft && hasBottom && (direction = 135);
            hasRight && hasTop && (direction = 315);
            hasRight && hasBottom && (direction = 45);
          } else direction = hasLeft ? 180 : 0; else direction = hasTop ? 270 : 90;
          null !== direction && (this.direction = direction);
        }
      };
      Player.prototype.bindMoveEvent = function() {
        var _this = this;
        var directionKeys = [ cc.macro.KEY.a, cc.macro.KEY.s, cc.macro.KEY.d, cc.macro.KEY.w ];
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(e) {
          directionKeys.includes(e.keyCode) && _this.addDirectionKey(e.keyCode);
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(e) {
          directionKeys.includes(e.keyCode) && _this.removeDirectionKey(e.keyCode);
        });
      };
      return Player;
    }(character_class_1.Character);
    exports.Player = Player;
    cc._RF.pop();
  }, {
    "../../config/environment": "environment",
    "../../const/const": "const",
    "../common/character.class": "character.class"
  } ],
  skill: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34fb8MyZJVOZJCuoLZF8Pgq", "skill");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Skill = function() {
      function Skill() {}
      return Skill;
    }();
    exports.Skill = Skill;
    cc._RF.pop();
  }, {} ],
  tool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c907EiDqhKLK4RyvvgncJ3", "tool");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Tool = function() {
      function Tool() {}
      return Tool;
    }();
    exports.Tool = Tool;
    cc._RF.pop();
  }, {} ],
  weapon: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a33c1/5HUlCLK+eUX9lATWX", "weapon");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Weapon = function() {
      function Weapon() {}
      return Weapon;
    }();
    exports.Weapon = Weapon;
    cc._RF.pop();
  }, {} ]
}, {}, [ "character.class", "combatUnit.interface", "controlAble.interface", "entity.interface", "movable.class", "enemy", "equipment", "consoleController", "dpad", "keyboard", "npc", "mr-1", "player", "skill", "tool", "weapon", "config", "environment", "const", "game", "level-1", "level", "Mixin", "AStar", "Graph", "GraphNode", "DijkstrasHeuristic", "EuclideanHeuristic", "Heuristic", "ManhattenHeuristic", "PathNode" ]);