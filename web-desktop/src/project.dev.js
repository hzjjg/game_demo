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
  3: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("./internal/Observable");
    exports.Observable = Observable_1.Observable;
    var ConnectableObservable_1 = require("./internal/observable/ConnectableObservable");
    exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
    var groupBy_1 = require("./internal/operators/groupBy");
    exports.GroupedObservable = groupBy_1.GroupedObservable;
    var observable_1 = require("./internal/symbol/observable");
    exports.observable = observable_1.observable;
    var Subject_1 = require("./internal/Subject");
    exports.Subject = Subject_1.Subject;
    var BehaviorSubject_1 = require("./internal/BehaviorSubject");
    exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
    var ReplaySubject_1 = require("./internal/ReplaySubject");
    exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
    var AsyncSubject_1 = require("./internal/AsyncSubject");
    exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
    var asap_1 = require("./internal/scheduler/asap");
    exports.asapScheduler = asap_1.asap;
    var async_1 = require("./internal/scheduler/async");
    exports.asyncScheduler = async_1.async;
    var queue_1 = require("./internal/scheduler/queue");
    exports.queueScheduler = queue_1.queue;
    var animationFrame_1 = require("./internal/scheduler/animationFrame");
    exports.animationFrameScheduler = animationFrame_1.animationFrame;
    var VirtualTimeScheduler_1 = require("./internal/scheduler/VirtualTimeScheduler");
    exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
    exports.VirtualAction = VirtualTimeScheduler_1.VirtualAction;
    var Scheduler_1 = require("./internal/Scheduler");
    exports.Scheduler = Scheduler_1.Scheduler;
    var Subscription_1 = require("./internal/Subscription");
    exports.Subscription = Subscription_1.Subscription;
    var Subscriber_1 = require("./internal/Subscriber");
    exports.Subscriber = Subscriber_1.Subscriber;
    var Notification_1 = require("./internal/Notification");
    exports.Notification = Notification_1.Notification;
    var pipe_1 = require("./internal/util/pipe");
    exports.pipe = pipe_1.pipe;
    var noop_1 = require("./internal/util/noop");
    exports.noop = noop_1.noop;
    var identity_1 = require("./internal/util/identity");
    exports.identity = identity_1.identity;
    var isObservable_1 = require("./internal/util/isObservable");
    exports.isObservable = isObservable_1.isObservable;
    var ArgumentOutOfRangeError_1 = require("./internal/util/ArgumentOutOfRangeError");
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
    var EmptyError_1 = require("./internal/util/EmptyError");
    exports.EmptyError = EmptyError_1.EmptyError;
    var ObjectUnsubscribedError_1 = require("./internal/util/ObjectUnsubscribedError");
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
    var UnsubscriptionError_1 = require("./internal/util/UnsubscriptionError");
    exports.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
    var TimeoutError_1 = require("./internal/util/TimeoutError");
    exports.TimeoutError = TimeoutError_1.TimeoutError;
    var bindCallback_1 = require("./internal/observable/bindCallback");
    exports.bindCallback = bindCallback_1.bindCallback;
    var bindNodeCallback_1 = require("./internal/observable/bindNodeCallback");
    exports.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;
    var combineLatest_1 = require("./internal/observable/combineLatest");
    exports.combineLatest = combineLatest_1.combineLatest;
    var concat_1 = require("./internal/observable/concat");
    exports.concat = concat_1.concat;
    var defer_1 = require("./internal/observable/defer");
    exports.defer = defer_1.defer;
    var empty_1 = require("./internal/observable/empty");
    exports.empty = empty_1.empty;
    var forkJoin_1 = require("./internal/observable/forkJoin");
    exports.forkJoin = forkJoin_1.forkJoin;
    var from_1 = require("./internal/observable/from");
    exports.from = from_1.from;
    var fromEvent_1 = require("./internal/observable/fromEvent");
    exports.fromEvent = fromEvent_1.fromEvent;
    var fromEventPattern_1 = require("./internal/observable/fromEventPattern");
    exports.fromEventPattern = fromEventPattern_1.fromEventPattern;
    var generate_1 = require("./internal/observable/generate");
    exports.generate = generate_1.generate;
    var iif_1 = require("./internal/observable/iif");
    exports.iif = iif_1.iif;
    var interval_1 = require("./internal/observable/interval");
    exports.interval = interval_1.interval;
    var merge_1 = require("./internal/observable/merge");
    exports.merge = merge_1.merge;
    var never_1 = require("./internal/observable/never");
    exports.never = never_1.never;
    var of_1 = require("./internal/observable/of");
    exports.of = of_1.of;
    var onErrorResumeNext_1 = require("./internal/observable/onErrorResumeNext");
    exports.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
    var pairs_1 = require("./internal/observable/pairs");
    exports.pairs = pairs_1.pairs;
    var race_1 = require("./internal/observable/race");
    exports.race = race_1.race;
    var range_1 = require("./internal/observable/range");
    exports.range = range_1.range;
    var throwError_1 = require("./internal/observable/throwError");
    exports.throwError = throwError_1.throwError;
    var timer_1 = require("./internal/observable/timer");
    exports.timer = timer_1.timer;
    var using_1 = require("./internal/observable/using");
    exports.using = using_1.using;
    var zip_1 = require("./internal/observable/zip");
    exports.zip = zip_1.zip;
    var empty_2 = require("./internal/observable/empty");
    exports.EMPTY = empty_2.EMPTY;
    var never_2 = require("./internal/observable/never");
    exports.NEVER = never_2.NEVER;
    var config_1 = require("./internal/config");
    exports.config = config_1.config;
  }, {
    "./internal/AsyncSubject": 4,
    "./internal/BehaviorSubject": 5,
    "./internal/Notification": 7,
    "./internal/Observable": 8,
    "./internal/ReplaySubject": 11,
    "./internal/Scheduler": 12,
    "./internal/Subject": 13,
    "./internal/Subscriber": 15,
    "./internal/Subscription": 16,
    "./internal/config": 17,
    "./internal/observable/ConnectableObservable": 18,
    "./internal/observable/bindCallback": 19,
    "./internal/observable/bindNodeCallback": 20,
    "./internal/observable/combineLatest": 21,
    "./internal/observable/concat": 22,
    "./internal/observable/defer": 23,
    "./internal/observable/empty": 24,
    "./internal/observable/forkJoin": 25,
    "./internal/observable/from": 26,
    "./internal/observable/fromEvent": 28,
    "./internal/observable/fromEventPattern": 29,
    "./internal/observable/generate": 33,
    "./internal/observable/iif": 34,
    "./internal/observable/interval": 35,
    "./internal/observable/merge": 36,
    "./internal/observable/never": 37,
    "./internal/observable/of": 38,
    "./internal/observable/onErrorResumeNext": 39,
    "./internal/observable/pairs": 40,
    "./internal/observable/race": 41,
    "./internal/observable/range": 42,
    "./internal/observable/throwError": 44,
    "./internal/observable/timer": 45,
    "./internal/observable/using": 46,
    "./internal/observable/zip": 47,
    "./internal/operators/groupBy": 49,
    "./internal/scheduler/VirtualTimeScheduler": 64,
    "./internal/scheduler/animationFrame": 65,
    "./internal/scheduler/asap": 66,
    "./internal/scheduler/async": 67,
    "./internal/scheduler/queue": 68,
    "./internal/symbol/observable": 70,
    "./internal/util/ArgumentOutOfRangeError": 72,
    "./internal/util/EmptyError": 73,
    "./internal/util/ObjectUnsubscribedError": 75,
    "./internal/util/TimeoutError": 76,
    "./internal/util/UnsubscriptionError": 77,
    "./internal/util/identity": 81,
    "./internal/util/isObservable": 89,
    "./internal/util/noop": 92,
    "./internal/util/pipe": 93
  } ],
  4: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subject_1 = require("./Subject");
    var Subscription_1 = require("./Subscription");
    var AsyncSubject = function(_super) {
      __extends(AsyncSubject, _super);
      function AsyncSubject() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.hasNext = false;
        _this.hasCompleted = false;
        return _this;
      }
      AsyncSubject.prototype._subscribe = function(subscriber) {
        if (this.hasError) {
          subscriber.error(this.thrownError);
          return Subscription_1.Subscription.EMPTY;
        }
        if (this.hasCompleted && this.hasNext) {
          subscriber.next(this.value);
          subscriber.complete();
          return Subscription_1.Subscription.EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
      };
      AsyncSubject.prototype.next = function(value) {
        if (!this.hasCompleted) {
          this.value = value;
          this.hasNext = true;
        }
      };
      AsyncSubject.prototype.error = function(error) {
        this.hasCompleted || _super.prototype.error.call(this, error);
      };
      AsyncSubject.prototype.complete = function() {
        this.hasCompleted = true;
        this.hasNext && _super.prototype.next.call(this, this.value);
        _super.prototype.complete.call(this);
      };
      return AsyncSubject;
    }(Subject_1.Subject);
    exports.AsyncSubject = AsyncSubject;
  }, {
    "./Subject": 13,
    "./Subscription": 16
  } ],
  5: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subject_1 = require("./Subject");
    var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
    var BehaviorSubject = function(_super) {
      __extends(BehaviorSubject, _super);
      function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
      }
      Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function() {
          return this.getValue();
        },
        enumerable: true,
        configurable: true
      });
      BehaviorSubject.prototype._subscribe = function(subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        subscription && !subscription.closed && subscriber.next(this._value);
        return subscription;
      };
      BehaviorSubject.prototype.getValue = function() {
        if (this.hasError) throw this.thrownError;
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        return this._value;
      };
      BehaviorSubject.prototype.next = function(value) {
        _super.prototype.next.call(this, this._value = value);
      };
      return BehaviorSubject;
    }(Subject_1.Subject);
    exports.BehaviorSubject = BehaviorSubject;
  }, {
    "./Subject": 13,
    "./util/ObjectUnsubscribedError": 75
  } ],
  6: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("./Subscriber");
    var InnerSubscriber = function(_super) {
      __extends(InnerSubscriber, _super);
      function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
      }
      InnerSubscriber.prototype._next = function(value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
      };
      InnerSubscriber.prototype._error = function(error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
      };
      InnerSubscriber.prototype._complete = function() {
        this.parent.notifyComplete(this);
        this.unsubscribe();
      };
      return InnerSubscriber;
    }(Subscriber_1.Subscriber);
    exports.InnerSubscriber = InnerSubscriber;
  }, {
    "./Subscriber": 15
  } ],
  7: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var empty_1 = require("./observable/empty");
    var of_1 = require("./observable/of");
    var throwError_1 = require("./observable/throwError");
    var Notification = function() {
      function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = "N" === kind;
      }
      Notification.prototype.observe = function(observer) {
        switch (this.kind) {
         case "N":
          return observer.next && observer.next(this.value);

         case "E":
          return observer.error && observer.error(this.error);

         case "C":
          return observer.complete && observer.complete();
        }
      };
      Notification.prototype.do = function(next, error, complete) {
        var kind = this.kind;
        switch (kind) {
         case "N":
          return next && next(this.value);

         case "E":
          return error && error(this.error);

         case "C":
          return complete && complete();
        }
      };
      Notification.prototype.accept = function(nextOrObserver, error, complete) {
        return nextOrObserver && "function" === typeof nextOrObserver.next ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
      };
      Notification.prototype.toObservable = function() {
        var kind = this.kind;
        switch (kind) {
         case "N":
          return of_1.of(this.value);

         case "E":
          return throwError_1.throwError(this.error);

         case "C":
          return empty_1.empty();
        }
        throw new Error("unexpected notification kind value");
      };
      Notification.createNext = function(value) {
        if ("undefined" !== typeof value) return new Notification("N", value);
        return Notification.undefinedValueNotification;
      };
      Notification.createError = function(err) {
        return new Notification("E", void 0, err);
      };
      Notification.createComplete = function() {
        return Notification.completeNotification;
      };
      Notification.completeNotification = new Notification("C");
      Notification.undefinedValueNotification = new Notification("N", void 0);
      return Notification;
    }();
    exports.Notification = Notification;
  }, {
    "./observable/empty": 24,
    "./observable/of": 38,
    "./observable/throwError": 44
  } ],
  8: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var canReportError_1 = require("./util/canReportError");
    var toSubscriber_1 = require("./util/toSubscriber");
    var observable_1 = require("../internal/symbol/observable");
    var pipe_1 = require("./util/pipe");
    var config_1 = require("./config");
    var Observable = function() {
      function Observable(subscribe) {
        this._isScalar = false;
        subscribe && (this._subscribe = subscribe);
      }
      Observable.prototype.lift = function(operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
      };
      Observable.prototype.subscribe = function(observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        operator ? operator.call(sink, this.source) : sink.add(this.source || config_1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        if (config_1.config.useDeprecatedSynchronousErrorHandling && sink.syncErrorThrowable) {
          sink.syncErrorThrowable = false;
          if (sink.syncErrorThrown) throw sink.syncErrorValue;
        }
        return sink;
      };
      Observable.prototype._trySubscribe = function(sink) {
        try {
          return this._subscribe(sink);
        } catch (err) {
          if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
          }
          canReportError_1.canReportError(sink) ? sink.error(err) : console.warn(err);
        }
      };
      Observable.prototype.forEach = function(next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function(resolve, reject) {
          var subscription;
          subscription = _this.subscribe(function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscription && subscription.unsubscribe();
            }
          }, reject, resolve);
        });
      };
      Observable.prototype._subscribe = function(subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
      };
      Observable.prototype[observable_1.observable] = function() {
        return this;
      };
      Observable.prototype.pipe = function() {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) operations[_i] = arguments[_i];
        if (0 === operations.length) return this;
        return pipe_1.pipeFromArray(operations)(this);
      };
      Observable.prototype.toPromise = function(promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function(resolve, reject) {
          var value;
          _this.subscribe(function(x) {
            return value = x;
          }, function(err) {
            return reject(err);
          }, function() {
            return resolve(value);
          });
        });
      };
      Observable.create = function(subscribe) {
        return new Observable(subscribe);
      };
      return Observable;
    }();
    exports.Observable = Observable;
    function getPromiseCtor(promiseCtor) {
      promiseCtor || (promiseCtor = config_1.config.Promise || Promise);
      if (!promiseCtor) throw new Error("no Promise impl found");
      return promiseCtor;
    }
  }, {
    "../internal/symbol/observable": 70,
    "./config": 17,
    "./util/canReportError": 78,
    "./util/pipe": 93,
    "./util/toSubscriber": 100
  } ],
  9: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var config_1 = require("./config");
    var hostReportError_1 = require("./util/hostReportError");
    exports.empty = {
      closed: true,
      next: function(value) {},
      error: function(err) {
        if (config_1.config.useDeprecatedSynchronousErrorHandling) throw err;
        hostReportError_1.hostReportError(err);
      },
      complete: function() {}
    };
  }, {
    "./config": 17,
    "./util/hostReportError": 80
  } ],
  10: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("./Subscriber");
    var OuterSubscriber = function(_super) {
      __extends(OuterSubscriber, _super);
      function OuterSubscriber() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      OuterSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
      };
      OuterSubscriber.prototype.notifyError = function(error, innerSub) {
        this.destination.error(error);
      };
      OuterSubscriber.prototype.notifyComplete = function(innerSub) {
        this.destination.complete();
      };
      return OuterSubscriber;
    }(Subscriber_1.Subscriber);
    exports.OuterSubscriber = OuterSubscriber;
  }, {
    "./Subscriber": 15
  } ],
  11: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subject_1 = require("./Subject");
    var queue_1 = require("./scheduler/queue");
    var Subscription_1 = require("./Subscription");
    var observeOn_1 = require("./operators/observeOn");
    var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
    var SubjectSubscription_1 = require("./SubjectSubscription");
    var ReplaySubject = function(_super) {
      __extends(ReplaySubject, _super);
      function ReplaySubject(bufferSize, windowTime, scheduler) {
        void 0 === bufferSize && (bufferSize = Number.POSITIVE_INFINITY);
        void 0 === windowTime && (windowTime = Number.POSITIVE_INFINITY);
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
          _this._infiniteTimeWindow = true;
          _this.next = _this.nextInfiniteTimeWindow;
        } else _this.next = _this.nextTimeWindow;
        return _this;
      }
      ReplaySubject.prototype.nextInfiniteTimeWindow = function(value) {
        var _events = this._events;
        _events.push(value);
        _events.length > this._bufferSize && _events.shift();
        _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype.nextTimeWindow = function(value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype._subscribe = function(subscriber) {
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        if (this.isStopped || this.hasError) subscription = Subscription_1.Subscription.EMPTY; else {
          this.observers.push(subscriber);
          subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
        scheduler && subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
        if (_infiniteTimeWindow) for (var i = 0; i < len && !subscriber.closed; i++) subscriber.next(_events[i]); else for (var i = 0; i < len && !subscriber.closed; i++) subscriber.next(_events[i].value);
        this.hasError ? subscriber.error(this.thrownError) : this.isStopped && subscriber.complete();
        return subscription;
      };
      ReplaySubject.prototype._getNow = function() {
        return (this.scheduler || queue_1.queue).now();
      };
      ReplaySubject.prototype._trimBufferThenGetEvents = function() {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        while (spliceCount < eventsCount) {
          if (now - _events[spliceCount].time < _windowTime) break;
          spliceCount++;
        }
        eventsCount > _bufferSize && (spliceCount = Math.max(spliceCount, eventsCount - _bufferSize));
        spliceCount > 0 && _events.splice(0, spliceCount);
        return _events;
      };
      return ReplaySubject;
    }(Subject_1.Subject);
    exports.ReplaySubject = ReplaySubject;
    var ReplayEvent = function() {
      function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
      }
      return ReplayEvent;
    }();
  }, {
    "./Subject": 13,
    "./SubjectSubscription": 14,
    "./Subscription": 16,
    "./operators/observeOn": 53,
    "./scheduler/queue": 68,
    "./util/ObjectUnsubscribedError": 75
  } ],
  12: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Scheduler = function() {
      function Scheduler(SchedulerAction, now) {
        void 0 === now && (now = Scheduler.now);
        this.SchedulerAction = SchedulerAction;
        this.now = now;
      }
      Scheduler.prototype.schedule = function(work, delay, state) {
        void 0 === delay && (delay = 0);
        return new this.SchedulerAction(this, work).schedule(state, delay);
      };
      Scheduler.now = function() {
        return Date.now();
      };
      return Scheduler;
    }();
    exports.Scheduler = Scheduler;
  }, {} ],
  13: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("./Observable");
    var Subscriber_1 = require("./Subscriber");
    var Subscription_1 = require("./Subscription");
    var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
    var SubjectSubscription_1 = require("./SubjectSubscription");
    var rxSubscriber_1 = require("../internal/symbol/rxSubscriber");
    var SubjectSubscriber = function(_super) {
      __extends(SubjectSubscriber, _super);
      function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
      }
      return SubjectSubscriber;
    }(Subscriber_1.Subscriber);
    exports.SubjectSubscriber = SubjectSubscriber;
    var Subject = function(_super) {
      __extends(Subject, _super);
      function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
      }
      Subject.prototype[rxSubscriber_1.rxSubscriber] = function() {
        return new SubjectSubscriber(this);
      };
      Subject.prototype.lift = function(operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
      };
      Subject.prototype.next = function(value) {
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        if (!this.isStopped) {
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) copy[i].next(value);
        }
      };
      Subject.prototype.error = function(err) {
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) copy[i].error(err);
        this.observers.length = 0;
      };
      Subject.prototype.complete = function() {
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) copy[i].complete();
        this.observers.length = 0;
      };
      Subject.prototype.unsubscribe = function() {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
      };
      Subject.prototype._trySubscribe = function(subscriber) {
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        return _super.prototype._trySubscribe.call(this, subscriber);
      };
      Subject.prototype._subscribe = function(subscriber) {
        if (this.closed) throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        if (this.hasError) {
          subscriber.error(this.thrownError);
          return Subscription_1.Subscription.EMPTY;
        }
        if (this.isStopped) {
          subscriber.complete();
          return Subscription_1.Subscription.EMPTY;
        }
        this.observers.push(subscriber);
        return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
      };
      Subject.prototype.asObservable = function() {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
      };
      Subject.create = function(destination, source) {
        return new AnonymousSubject(destination, source);
      };
      return Subject;
    }(Observable_1.Observable);
    exports.Subject = Subject;
    var AnonymousSubject = function(_super) {
      __extends(AnonymousSubject, _super);
      function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
      }
      AnonymousSubject.prototype.next = function(value) {
        var destination = this.destination;
        destination && destination.next && destination.next(value);
      };
      AnonymousSubject.prototype.error = function(err) {
        var destination = this.destination;
        destination && destination.error && this.destination.error(err);
      };
      AnonymousSubject.prototype.complete = function() {
        var destination = this.destination;
        destination && destination.complete && this.destination.complete();
      };
      AnonymousSubject.prototype._subscribe = function(subscriber) {
        var source = this.source;
        return source ? this.source.subscribe(subscriber) : Subscription_1.Subscription.EMPTY;
      };
      return AnonymousSubject;
    }(Subject);
    exports.AnonymousSubject = AnonymousSubject;
  }, {
    "../internal/symbol/rxSubscriber": 71,
    "./Observable": 8,
    "./SubjectSubscription": 14,
    "./Subscriber": 15,
    "./Subscription": 16,
    "./util/ObjectUnsubscribedError": 75
  } ],
  14: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscription_1 = require("./Subscription");
    var SubjectSubscription = function(_super) {
      __extends(SubjectSubscription, _super);
      function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
      }
      SubjectSubscription.prototype.unsubscribe = function() {
        if (this.closed) return;
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || 0 === observers.length || subject.isStopped || subject.closed) return;
        var subscriberIndex = observers.indexOf(this.subscriber);
        -1 !== subscriberIndex && observers.splice(subscriberIndex, 1);
      };
      return SubjectSubscription;
    }(Subscription_1.Subscription);
    exports.SubjectSubscription = SubjectSubscription;
  }, {
    "./Subscription": 16
  } ],
  15: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isFunction_1 = require("./util/isFunction");
    var Observer_1 = require("./Observer");
    var Subscription_1 = require("./Subscription");
    var rxSubscriber_1 = require("../internal/symbol/rxSubscriber");
    var config_1 = require("./config");
    var hostReportError_1 = require("./util/hostReportError");
    var Subscriber = function(_super) {
      __extends(Subscriber, _super);
      function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        _this._parentSubscription = null;
        switch (arguments.length) {
         case 0:
          _this.destination = Observer_1.empty;
          break;

         case 1:
          if (!destinationOrNext) {
            _this.destination = Observer_1.empty;
            break;
          }
          if ("object" === typeof destinationOrNext) {
            if (destinationOrNext instanceof Subscriber) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber(_this, destinationOrNext);
            }
            break;
          }

         default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
        }
        return _this;
      }
      Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function() {
        return this;
      };
      Subscriber.create = function(next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
      };
      Subscriber.prototype.next = function(value) {
        this.isStopped || this._next(value);
      };
      Subscriber.prototype.error = function(err) {
        if (!this.isStopped) {
          this.isStopped = true;
          this._error(err);
        }
      };
      Subscriber.prototype.complete = function() {
        if (!this.isStopped) {
          this.isStopped = true;
          this._complete();
        }
      };
      Subscriber.prototype.unsubscribe = function() {
        if (this.closed) return;
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function(value) {
        this.destination.next(value);
      };
      Subscriber.prototype._error = function(err) {
        this.destination.error(err);
        this.unsubscribe();
      };
      Subscriber.prototype._complete = function() {
        this.destination.complete();
        this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function() {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        this._parentSubscription = null;
        return this;
      };
      return Subscriber;
    }(Subscription_1.Subscription);
    exports.Subscriber = Subscriber;
    var SafeSubscriber = function(_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction_1.isFunction(observerOrNext)) next = observerOrNext; else if (observerOrNext) {
          next = observerOrNext.next;
          error = observerOrNext.error;
          complete = observerOrNext.complete;
          if (observerOrNext !== Observer_1.empty) {
            context = Object.create(observerOrNext);
            isFunction_1.isFunction(context.unsubscribe) && _this.add(context.unsubscribe.bind(context));
            context.unsubscribe = _this.unsubscribe.bind(_this);
          }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
      }
      SafeSubscriber.prototype.next = function(value) {
        if (!this.isStopped && this._next) {
          var _parentSubscriber = this._parentSubscriber;
          config_1.config.useDeprecatedSynchronousErrorHandling && _parentSubscriber.syncErrorThrowable ? this.__tryOrSetError(_parentSubscriber, this._next, value) && this.unsubscribe() : this.__tryOrUnsub(this._next, value);
        }
      };
      SafeSubscriber.prototype.error = function(err) {
        if (!this.isStopped) {
          var _parentSubscriber = this._parentSubscriber;
          var useDeprecatedSynchronousErrorHandling = config_1.config.useDeprecatedSynchronousErrorHandling;
          if (this._error) if (useDeprecatedSynchronousErrorHandling && _parentSubscriber.syncErrorThrowable) {
            this.__tryOrSetError(_parentSubscriber, this._error, err);
            this.unsubscribe();
          } else {
            this.__tryOrUnsub(this._error, err);
            this.unsubscribe();
          } else if (_parentSubscriber.syncErrorThrowable) {
            if (useDeprecatedSynchronousErrorHandling) {
              _parentSubscriber.syncErrorValue = err;
              _parentSubscriber.syncErrorThrown = true;
            } else hostReportError_1.hostReportError(err);
            this.unsubscribe();
          } else {
            this.unsubscribe();
            if (useDeprecatedSynchronousErrorHandling) throw err;
            hostReportError_1.hostReportError(err);
          }
        }
      };
      SafeSubscriber.prototype.complete = function() {
        var _this = this;
        if (!this.isStopped) {
          var _parentSubscriber = this._parentSubscriber;
          if (this._complete) {
            var wrappedComplete = function() {
              return _this._complete.call(_this._context);
            };
            if (config_1.config.useDeprecatedSynchronousErrorHandling && _parentSubscriber.syncErrorThrowable) {
              this.__tryOrSetError(_parentSubscriber, wrappedComplete);
              this.unsubscribe();
            } else {
              this.__tryOrUnsub(wrappedComplete);
              this.unsubscribe();
            }
          } else this.unsubscribe();
        }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function(fn, value) {
        try {
          fn.call(this._context, value);
        } catch (err) {
          this.unsubscribe();
          if (config_1.config.useDeprecatedSynchronousErrorHandling) throw err;
          hostReportError_1.hostReportError(err);
        }
      };
      SafeSubscriber.prototype.__tryOrSetError = function(parent, fn, value) {
        if (!config_1.config.useDeprecatedSynchronousErrorHandling) throw new Error("bad call");
        try {
          fn.call(this._context, value);
        } catch (err) {
          if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
          }
          hostReportError_1.hostReportError(err);
          return true;
        }
        return false;
      };
      SafeSubscriber.prototype._unsubscribe = function() {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
      };
      return SafeSubscriber;
    }(Subscriber);
    exports.SafeSubscriber = SafeSubscriber;
  }, {
    "../internal/symbol/rxSubscriber": 71,
    "./Observer": 9,
    "./Subscription": 16,
    "./config": 17,
    "./util/hostReportError": 80,
    "./util/isFunction": 84
  } ],
  16: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isArray_1 = require("./util/isArray");
    var isObject_1 = require("./util/isObject");
    var isFunction_1 = require("./util/isFunction");
    var tryCatch_1 = require("./util/tryCatch");
    var errorObject_1 = require("./util/errorObject");
    var UnsubscriptionError_1 = require("./util/UnsubscriptionError");
    var Subscription = function() {
      function Subscription(unsubscribe) {
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        unsubscribe && (this._unsubscribe = unsubscribe);
      }
      Subscription.prototype.unsubscribe = function() {
        var hasErrors = false;
        var errors;
        if (this.closed) return;
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        while (_parent) {
          _parent.remove(this);
          _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
          var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
          if (trial === errorObject_1.errorObject) {
            hasErrors = true;
            errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [ errorObject_1.errorObject.e ]);
          }
        }
        if (isArray_1.isArray(_subscriptions)) {
          index = -1;
          len = _subscriptions.length;
          while (++index < len) {
            var sub = _subscriptions[index];
            if (isObject_1.isObject(sub)) {
              var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
              if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || [];
                var err = errorObject_1.errorObject.e;
                err instanceof UnsubscriptionError_1.UnsubscriptionError ? errors = errors.concat(flattenUnsubscriptionErrors(err.errors)) : errors.push(err);
              }
            }
          }
        }
        if (hasErrors) throw new UnsubscriptionError_1.UnsubscriptionError(errors);
      };
      Subscription.prototype.add = function(teardown) {
        if (!teardown || teardown === Subscription.EMPTY) return Subscription.EMPTY;
        if (teardown === this) return this;
        var subscription = teardown;
        switch (typeof teardown) {
         case "function":
          subscription = new Subscription(teardown);

         case "object":
          if (subscription.closed || "function" !== typeof subscription.unsubscribe) return subscription;
          if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          }
          if ("function" !== typeof subscription._addParent) {
            var tmp = subscription;
            subscription = new Subscription();
            subscription._subscriptions = [ tmp ];
          }
          break;

         default:
          throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
      };
      Subscription.prototype.remove = function(subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
          var subscriptionIndex = subscriptions.indexOf(subscription);
          -1 !== subscriptionIndex && subscriptions.splice(subscriptionIndex, 1);
        }
      };
      Subscription.prototype._addParent = function(parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        _parent && _parent !== parent ? _parents ? -1 === _parents.indexOf(parent) && _parents.push(parent) : this._parents = [ parent ] : this._parent = parent;
      };
      Subscription.EMPTY = function(empty) {
        empty.closed = true;
        return empty;
      }(new Subscription());
      return Subscription;
    }();
    exports.Subscription = Subscription;
    function flattenUnsubscriptionErrors(errors) {
      return errors.reduce(function(errs, err) {
        return errs.concat(err instanceof UnsubscriptionError_1.UnsubscriptionError ? err.errors : err);
      }, []);
    }
  }, {
    "./util/UnsubscriptionError": 77,
    "./util/errorObject": 79,
    "./util/isArray": 82,
    "./util/isFunction": 84,
    "./util/isObject": 88,
    "./util/tryCatch": 101
  } ],
  17: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    exports.config = {
      Promise: void 0,
      set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
          var error = new Error();
          console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + error.stack);
        } else _enable_super_gross_mode_that_will_cause_bad_things && console.log("RxJS: Back to a better error behavior. Thank you. <3");
        _enable_super_gross_mode_that_will_cause_bad_things = value;
      },
      get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
      }
    };
  }, {} ],
  18: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subject_1 = require("../Subject");
    var Observable_1 = require("../Observable");
    var Subscriber_1 = require("../Subscriber");
    var Subscription_1 = require("../Subscription");
    var refCount_1 = require("../operators/refCount");
    var ConnectableObservable = function(_super) {
      __extends(ConnectableObservable, _super);
      function ConnectableObservable(source, subjectFactory) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subjectFactory = subjectFactory;
        _this._refCount = 0;
        _this._isComplete = false;
        return _this;
      }
      ConnectableObservable.prototype._subscribe = function(subscriber) {
        return this.getSubject().subscribe(subscriber);
      };
      ConnectableObservable.prototype.getSubject = function() {
        var subject = this._subject;
        subject && !subject.isStopped || (this._subject = this.subjectFactory());
        return this._subject;
      };
      ConnectableObservable.prototype.connect = function() {
        var connection = this._connection;
        if (!connection) {
          this._isComplete = false;
          connection = this._connection = new Subscription_1.Subscription();
          connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
          if (connection.closed) {
            this._connection = null;
            connection = Subscription_1.Subscription.EMPTY;
          } else this._connection = connection;
        }
        return connection;
      };
      ConnectableObservable.prototype.refCount = function() {
        return refCount_1.refCount()(this);
      };
      return ConnectableObservable;
    }(Observable_1.Observable);
    exports.ConnectableObservable = ConnectableObservable;
    var connectableProto = ConnectableObservable.prototype;
    exports.connectableObservableDescriptor = {
      operator: {
        value: null
      },
      _refCount: {
        value: 0,
        writable: true
      },
      _subject: {
        value: null,
        writable: true
      },
      _connection: {
        value: null,
        writable: true
      },
      _subscribe: {
        value: connectableProto._subscribe
      },
      _isComplete: {
        value: connectableProto._isComplete,
        writable: true
      },
      getSubject: {
        value: connectableProto.getSubject
      },
      connect: {
        value: connectableProto.connect
      },
      refCount: {
        value: connectableProto.refCount
      }
    };
    var ConnectableSubscriber = function(_super) {
      __extends(ConnectableSubscriber, _super);
      function ConnectableSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
      }
      ConnectableSubscriber.prototype._error = function(err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
      };
      ConnectableSubscriber.prototype._complete = function() {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
      };
      ConnectableSubscriber.prototype._unsubscribe = function() {
        var connectable = this.connectable;
        if (connectable) {
          this.connectable = null;
          var connection = connectable._connection;
          connectable._refCount = 0;
          connectable._subject = null;
          connectable._connection = null;
          connection && connection.unsubscribe();
        }
      };
      return ConnectableSubscriber;
    }(Subject_1.SubjectSubscriber);
    var RefCountOperator = function() {
      function RefCountOperator(connectable) {
        this.connectable = connectable;
      }
      RefCountOperator.prototype.call = function(subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        refCounter.closed || (refCounter.connection = connectable.connect());
        return subscription;
      };
      return RefCountOperator;
    }();
    var RefCountSubscriber = function(_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function() {
        var connectable = this.connectable;
        if (!connectable) {
          this.connection = null;
          return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
          this.connection = null;
          return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
          this.connection = null;
          return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        !sharedConnection || connection && sharedConnection !== connection || sharedConnection.unsubscribe();
      };
      return RefCountSubscriber;
    }(Subscriber_1.Subscriber);
  }, {
    "../Observable": 8,
    "../Subject": 13,
    "../Subscriber": 15,
    "../Subscription": 16,
    "../operators/refCount": 54
  } ],
  19: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var AsyncSubject_1 = require("../AsyncSubject");
    var map_1 = require("../operators/map");
    var canReportError_1 = require("../util/canReportError");
    var isArray_1 = require("../util/isArray");
    var isScheduler_1 = require("../util/isScheduler");
    function bindCallback(callbackFunc, resultSelector, scheduler) {
      if (resultSelector) {
        if (!isScheduler_1.isScheduler(resultSelector)) return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
          return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function(args) {
            return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
          }));
        };
        scheduler = resultSelector;
      }
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var context = this;
        var subject;
        var params = {
          context: context,
          subject: subject,
          callbackFunc: callbackFunc,
          scheduler: scheduler
        };
        return new Observable_1.Observable(function(subscriber) {
          if (scheduler) {
            var state = {
              args: args,
              subscriber: subscriber,
              params: params
            };
            return scheduler.schedule(dispatch, 0, state);
          }
          if (!subject) {
            subject = new AsyncSubject_1.AsyncSubject();
            var handler = function() {
              var innerArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) innerArgs[_i] = arguments[_i];
              subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
              subject.complete();
            };
            try {
              callbackFunc.apply(context, args.concat([ handler ]));
            } catch (err) {
              canReportError_1.canReportError(subject) ? subject.error(err) : console.warn(err);
            }
          }
          return subject.subscribe(subscriber);
        });
      };
    }
    exports.bindCallback = bindCallback;
    function dispatch(state) {
      var _this = this;
      var self = this;
      var args = state.args, subscriber = state.subscriber, params = state.params;
      var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
      var subject = params.subject;
      if (!subject) {
        subject = params.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function() {
          var innerArgs = [];
          for (var _i = 0; _i < arguments.length; _i++) innerArgs[_i] = arguments[_i];
          var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
          _this.add(scheduler.schedule(dispatchNext, 0, {
            value: value,
            subject: subject
          }));
        };
        try {
          callbackFunc.apply(context, args.concat([ handler ]));
        } catch (err) {
          subject.error(err);
        }
      }
      this.add(subject.subscribe(subscriber));
    }
    function dispatchNext(state) {
      var value = state.value, subject = state.subject;
      subject.next(value);
      subject.complete();
    }
    function dispatchError(state) {
      var err = state.err, subject = state.subject;
      subject.error(err);
    }
  }, {
    "../AsyncSubject": 4,
    "../Observable": 8,
    "../operators/map": 50,
    "../util/canReportError": 78,
    "../util/isArray": 82,
    "../util/isScheduler": 91
  } ],
  20: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var AsyncSubject_1 = require("../AsyncSubject");
    var map_1 = require("../operators/map");
    var canReportError_1 = require("../util/canReportError");
    var isScheduler_1 = require("../util/isScheduler");
    var isArray_1 = require("../util/isArray");
    function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
      if (resultSelector) {
        if (!isScheduler_1.isScheduler(resultSelector)) return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
          return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function(args) {
            return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
          }));
        };
        scheduler = resultSelector;
      }
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var params = {
          subject: void 0,
          args: args,
          callbackFunc: callbackFunc,
          scheduler: scheduler,
          context: this
        };
        return new Observable_1.Observable(function(subscriber) {
          var context = params.context;
          var subject = params.subject;
          if (scheduler) return scheduler.schedule(dispatch, 0, {
            params: params,
            subscriber: subscriber,
            context: context
          });
          if (!subject) {
            subject = params.subject = new AsyncSubject_1.AsyncSubject();
            var handler = function() {
              var innerArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) innerArgs[_i] = arguments[_i];
              var err = innerArgs.shift();
              if (err) {
                subject.error(err);
                return;
              }
              subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
              subject.complete();
            };
            try {
              callbackFunc.apply(context, args.concat([ handler ]));
            } catch (err) {
              canReportError_1.canReportError(subject) ? subject.error(err) : console.warn(err);
            }
          }
          return subject.subscribe(subscriber);
        });
      };
    }
    exports.bindNodeCallback = bindNodeCallback;
    function dispatch(state) {
      var _this = this;
      var params = state.params, subscriber = state.subscriber, context = state.context;
      var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
      var subject = params.subject;
      if (!subject) {
        subject = params.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function() {
          var innerArgs = [];
          for (var _i = 0; _i < arguments.length; _i++) innerArgs[_i] = arguments[_i];
          var err = innerArgs.shift();
          if (err) _this.add(scheduler.schedule(dispatchError, 0, {
            err: err,
            subject: subject
          })); else {
            var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
            _this.add(scheduler.schedule(dispatchNext, 0, {
              value: value,
              subject: subject
            }));
          }
        };
        try {
          callbackFunc.apply(context, args.concat([ handler ]));
        } catch (err) {
          this.add(scheduler.schedule(dispatchError, 0, {
            err: err,
            subject: subject
          }));
        }
      }
      this.add(subject.subscribe(subscriber));
    }
    function dispatchNext(arg) {
      var value = arg.value, subject = arg.subject;
      subject.next(value);
      subject.complete();
    }
    function dispatchError(arg) {
      var err = arg.err, subject = arg.subject;
      subject.error(err);
    }
  }, {
    "../AsyncSubject": 4,
    "../Observable": 8,
    "../operators/map": 50,
    "../util/canReportError": 78,
    "../util/isArray": 82,
    "../util/isScheduler": 91
  } ],
  21: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isScheduler_1 = require("../util/isScheduler");
    var isArray_1 = require("../util/isArray");
    var OuterSubscriber_1 = require("../OuterSubscriber");
    var subscribeToResult_1 = require("../util/subscribeToResult");
    var fromArray_1 = require("./fromArray");
    var NONE = {};
    function combineLatest() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) observables[_i] = arguments[_i];
      var resultSelector = null;
      var scheduler = null;
      isScheduler_1.isScheduler(observables[observables.length - 1]) && (scheduler = observables.pop());
      "function" === typeof observables[observables.length - 1] && (resultSelector = observables.pop());
      1 === observables.length && isArray_1.isArray(observables[0]) && (observables = observables[0]);
      return fromArray_1.fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
    }
    exports.combineLatest = combineLatest;
    var CombineLatestOperator = function() {
      function CombineLatestOperator(resultSelector) {
        this.resultSelector = resultSelector;
      }
      CombineLatestOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
      };
      return CombineLatestOperator;
    }();
    exports.CombineLatestOperator = CombineLatestOperator;
    var CombineLatestSubscriber = function(_super) {
      __extends(CombineLatestSubscriber, _super);
      function CombineLatestSubscriber(destination, resultSelector) {
        var _this = _super.call(this, destination) || this;
        _this.resultSelector = resultSelector;
        _this.active = 0;
        _this.values = [];
        _this.observables = [];
        return _this;
      }
      CombineLatestSubscriber.prototype._next = function(observable) {
        this.values.push(NONE);
        this.observables.push(observable);
      };
      CombineLatestSubscriber.prototype._complete = function() {
        var observables = this.observables;
        var len = observables.length;
        if (0 === len) this.destination.complete(); else {
          this.active = len;
          this.toRespond = len;
          for (var i = 0; i < len; i++) {
            var observable = observables[i];
            this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
          }
        }
      };
      CombineLatestSubscriber.prototype.notifyComplete = function(unused) {
        0 === (this.active -= 1) && this.destination.complete();
      };
      CombineLatestSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = this.toRespond ? oldVal === NONE ? --this.toRespond : this.toRespond : 0;
        values[outerIndex] = innerValue;
        0 === toRespond && (this.resultSelector ? this._tryResultSelector(values) : this.destination.next(values.slice()));
      };
      CombineLatestSubscriber.prototype._tryResultSelector = function(values) {
        var result;
        try {
          result = this.resultSelector.apply(this, values);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.destination.next(result);
      };
      return CombineLatestSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    exports.CombineLatestSubscriber = CombineLatestSubscriber;
  }, {
    "../OuterSubscriber": 10,
    "../util/isArray": 82,
    "../util/isScheduler": 91,
    "../util/subscribeToResult": 99,
    "./fromArray": 27
  } ],
  22: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isScheduler_1 = require("../util/isScheduler");
    var of_1 = require("./of");
    var from_1 = require("./from");
    var concatAll_1 = require("../operators/concatAll");
    function concat() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) observables[_i] = arguments[_i];
      if (1 === observables.length || 2 === observables.length && isScheduler_1.isScheduler(observables[1])) return from_1.from(observables[0]);
      return concatAll_1.concatAll()(of_1.of.apply(void 0, observables));
    }
    exports.concat = concat;
  }, {
    "../operators/concatAll": 48,
    "../util/isScheduler": 91,
    "./from": 26,
    "./of": 38
  } ],
  23: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var from_1 = require("./from");
    var empty_1 = require("./empty");
    function defer(observableFactory) {
      return new Observable_1.Observable(function(subscriber) {
        var input;
        try {
          input = observableFactory();
        } catch (err) {
          subscriber.error(err);
          return;
        }
        var source = input ? from_1.from(input) : empty_1.empty();
        return source.subscribe(subscriber);
      });
    }
    exports.defer = defer;
  }, {
    "../Observable": 8,
    "./empty": 24,
    "./from": 26
  } ],
  24: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    exports.EMPTY = new Observable_1.Observable(function(subscriber) {
      return subscriber.complete();
    });
    function empty(scheduler) {
      return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
    }
    exports.empty = empty;
    function emptyScheduled(scheduler) {
      return new Observable_1.Observable(function(subscriber) {
        return scheduler.schedule(function() {
          return subscriber.complete();
        });
      });
    }
    exports.emptyScheduled = emptyScheduled;
  }, {
    "../Observable": 8
  } ],
  25: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var isArray_1 = require("../util/isArray");
    var empty_1 = require("./empty");
    var subscribeToResult_1 = require("../util/subscribeToResult");
    var OuterSubscriber_1 = require("../OuterSubscriber");
    var map_1 = require("../operators/map");
    function forkJoin() {
      var sources = [];
      for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
      var resultSelector;
      "function" === typeof sources[sources.length - 1] && (resultSelector = sources.pop());
      1 === sources.length && isArray_1.isArray(sources[0]) && (sources = sources[0]);
      if (0 === sources.length) return empty_1.EMPTY;
      if (resultSelector) return forkJoin(sources).pipe(map_1.map(function(args) {
        return resultSelector.apply(void 0, args);
      }));
      return new Observable_1.Observable(function(subscriber) {
        return new ForkJoinSubscriber(subscriber, sources);
      });
    }
    exports.forkJoin = forkJoin;
    var ForkJoinSubscriber = function(_super) {
      __extends(ForkJoinSubscriber, _super);
      function ForkJoinSubscriber(destination, sources) {
        var _this = _super.call(this, destination) || this;
        _this.sources = sources;
        _this.completed = 0;
        _this.haveValues = 0;
        var len = sources.length;
        _this.values = new Array(len);
        for (var i = 0; i < len; i++) {
          var source = sources[i];
          var innerSubscription = subscribeToResult_1.subscribeToResult(_this, source, null, i);
          innerSubscription && _this.add(innerSubscription);
        }
        return _this;
      }
      ForkJoinSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
          innerSub._hasValue = true;
          this.haveValues++;
        }
      };
      ForkJoinSubscriber.prototype.notifyComplete = function(innerSub) {
        var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
        var len = values.length;
        if (!innerSub._hasValue) {
          destination.complete();
          return;
        }
        this.completed++;
        if (this.completed !== len) return;
        haveValues === len && destination.next(values);
        destination.complete();
      };
      return ForkJoinSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  }, {
    "../Observable": 8,
    "../OuterSubscriber": 10,
    "../operators/map": 50,
    "../util/isArray": 82,
    "../util/subscribeToResult": 99,
    "./empty": 24
  } ],
  26: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var isPromise_1 = require("../util/isPromise");
    var isArrayLike_1 = require("../util/isArrayLike");
    var isInteropObservable_1 = require("../util/isInteropObservable");
    var isIterable_1 = require("../util/isIterable");
    var fromArray_1 = require("./fromArray");
    var fromPromise_1 = require("./fromPromise");
    var fromIterable_1 = require("./fromIterable");
    var fromObservable_1 = require("./fromObservable");
    var subscribeTo_1 = require("../util/subscribeTo");
    function from(input, scheduler) {
      if (!scheduler) {
        if (input instanceof Observable_1.Observable) return input;
        return new Observable_1.Observable(subscribeTo_1.subscribeTo(input));
      }
      if (null != input) {
        if (isInteropObservable_1.isInteropObservable(input)) return fromObservable_1.fromObservable(input, scheduler);
        if (isPromise_1.isPromise(input)) return fromPromise_1.fromPromise(input, scheduler);
        if (isArrayLike_1.isArrayLike(input)) return fromArray_1.fromArray(input, scheduler);
        if (isIterable_1.isIterable(input) || "string" === typeof input) return fromIterable_1.fromIterable(input, scheduler);
      }
      throw new TypeError((null !== input && typeof input || input) + " is not observable");
    }
    exports.from = from;
  }, {
    "../Observable": 8,
    "../util/isArrayLike": 83,
    "../util/isInteropObservable": 85,
    "../util/isIterable": 86,
    "../util/isPromise": 90,
    "../util/subscribeTo": 94,
    "./fromArray": 27,
    "./fromIterable": 30,
    "./fromObservable": 31,
    "./fromPromise": 32
  } ],
  27: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var Subscription_1 = require("../Subscription");
    var subscribeToArray_1 = require("../util/subscribeToArray");
    function fromArray(input, scheduler) {
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        var sub = new Subscription_1.Subscription();
        var i = 0;
        sub.add(scheduler.schedule(function() {
          if (i === input.length) {
            subscriber.complete();
            return;
          }
          subscriber.next(input[i++]);
          subscriber.closed || sub.add(this.schedule());
        }));
        return sub;
      }) : new Observable_1.Observable(subscribeToArray_1.subscribeToArray(input));
    }
    exports.fromArray = fromArray;
  }, {
    "../Observable": 8,
    "../Subscription": 16,
    "../util/subscribeToArray": 95
  } ],
  28: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var isArray_1 = require("../util/isArray");
    var isFunction_1 = require("../util/isFunction");
    var map_1 = require("../operators/map");
    var toString = Object.prototype.toString;
    function fromEvent(target, eventName, options, resultSelector) {
      if (isFunction_1.isFunction(options)) {
        resultSelector = options;
        options = void 0;
      }
      if (resultSelector) return fromEvent(target, eventName, options).pipe(map_1.map(function(args) {
        return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
      }));
      return new Observable_1.Observable(function(subscriber) {
        function handler(e) {
          arguments.length > 1 ? subscriber.next(Array.prototype.slice.call(arguments)) : subscriber.next(e);
        }
        setupSubscription(target, eventName, handler, subscriber, options);
      });
    }
    exports.fromEvent = fromEvent;
    function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
      var unsubscribe;
      if (isEventTarget(sourceObj)) {
        var source_1 = sourceObj;
        sourceObj.addEventListener(eventName, handler, options);
        unsubscribe = function() {
          return source_1.removeEventListener(eventName, handler, options);
        };
      } else if (isJQueryStyleEventEmitter(sourceObj)) {
        var source_2 = sourceObj;
        sourceObj.on(eventName, handler);
        unsubscribe = function() {
          return source_2.off(eventName, handler);
        };
      } else if (isNodeStyleEventEmitter(sourceObj)) {
        var source_3 = sourceObj;
        sourceObj.addListener(eventName, handler);
        unsubscribe = function() {
          return source_3.removeListener(eventName, handler);
        };
      } else {
        if (!sourceObj || !sourceObj.length) throw new TypeError("Invalid event target");
        for (var i = 0, len = sourceObj.length; i < len; i++) setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
      }
      subscriber.add(unsubscribe);
    }
    function isNodeStyleEventEmitter(sourceObj) {
      return sourceObj && "function" === typeof sourceObj.addListener && "function" === typeof sourceObj.removeListener;
    }
    function isJQueryStyleEventEmitter(sourceObj) {
      return sourceObj && "function" === typeof sourceObj.on && "function" === typeof sourceObj.off;
    }
    function isEventTarget(sourceObj) {
      return sourceObj && "function" === typeof sourceObj.addEventListener && "function" === typeof sourceObj.removeEventListener;
    }
  }, {
    "../Observable": 8,
    "../operators/map": 50,
    "../util/isArray": 82,
    "../util/isFunction": 84
  } ],
  29: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var isArray_1 = require("../util/isArray");
    var isFunction_1 = require("../util/isFunction");
    var map_1 = require("../operators/map");
    function fromEventPattern(addHandler, removeHandler, resultSelector) {
      if (resultSelector) return fromEventPattern(addHandler, removeHandler).pipe(map_1.map(function(args) {
        return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
      }));
      return new Observable_1.Observable(function(subscriber) {
        var handler = function() {
          var e = [];
          for (var _i = 0; _i < arguments.length; _i++) e[_i] = arguments[_i];
          return subscriber.next(1 === e.length ? e[0] : e);
        };
        var retValue;
        try {
          retValue = addHandler(handler);
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (!isFunction_1.isFunction(removeHandler)) return;
        return function() {
          return removeHandler(handler, retValue);
        };
      });
    }
    exports.fromEventPattern = fromEventPattern;
  }, {
    "../Observable": 8,
    "../operators/map": 50,
    "../util/isArray": 82,
    "../util/isFunction": 84
  } ],
  30: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var Subscription_1 = require("../Subscription");
    var iterator_1 = require("../symbol/iterator");
    var subscribeToIterable_1 = require("../util/subscribeToIterable");
    function fromIterable(input, scheduler) {
      if (!input) throw new Error("Iterable cannot be null");
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        var sub = new Subscription_1.Subscription();
        var iterator;
        sub.add(function() {
          iterator && "function" === typeof iterator.return && iterator.return();
        });
        sub.add(scheduler.schedule(function() {
          iterator = input[iterator_1.iterator]();
          sub.add(scheduler.schedule(function() {
            if (subscriber.closed) return;
            var value;
            var done;
            try {
              var result = iterator.next();
              value = result.value;
              done = result.done;
            } catch (err) {
              subscriber.error(err);
              return;
            }
            if (done) subscriber.complete(); else {
              subscriber.next(value);
              this.schedule();
            }
          }));
        }));
        return sub;
      }) : new Observable_1.Observable(subscribeToIterable_1.subscribeToIterable(input));
    }
    exports.fromIterable = fromIterable;
  }, {
    "../Observable": 8,
    "../Subscription": 16,
    "../symbol/iterator": 69,
    "../util/subscribeToIterable": 96
  } ],
  31: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var Subscription_1 = require("../Subscription");
    var observable_1 = require("../symbol/observable");
    var subscribeToObservable_1 = require("../util/subscribeToObservable");
    function fromObservable(input, scheduler) {
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        var sub = new Subscription_1.Subscription();
        sub.add(scheduler.schedule(function() {
          var observable = input[observable_1.observable]();
          sub.add(observable.subscribe({
            next: function(value) {
              sub.add(scheduler.schedule(function() {
                return subscriber.next(value);
              }));
            },
            error: function(err) {
              sub.add(scheduler.schedule(function() {
                return subscriber.error(err);
              }));
            },
            complete: function() {
              sub.add(scheduler.schedule(function() {
                return subscriber.complete();
              }));
            }
          }));
        }));
        return sub;
      }) : new Observable_1.Observable(subscribeToObservable_1.subscribeToObservable(input));
    }
    exports.fromObservable = fromObservable;
  }, {
    "../Observable": 8,
    "../Subscription": 16,
    "../symbol/observable": 70,
    "../util/subscribeToObservable": 97
  } ],
  32: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var Subscription_1 = require("../Subscription");
    var subscribeToPromise_1 = require("../util/subscribeToPromise");
    function fromPromise(input, scheduler) {
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        var sub = new Subscription_1.Subscription();
        sub.add(scheduler.schedule(function() {
          return input.then(function(value) {
            sub.add(scheduler.schedule(function() {
              subscriber.next(value);
              sub.add(scheduler.schedule(function() {
                return subscriber.complete();
              }));
            }));
          }, function(err) {
            sub.add(scheduler.schedule(function() {
              return subscriber.error(err);
            }));
          });
        }));
        return sub;
      }) : new Observable_1.Observable(subscribeToPromise_1.subscribeToPromise(input));
    }
    exports.fromPromise = fromPromise;
  }, {
    "../Observable": 8,
    "../Subscription": 16,
    "../util/subscribeToPromise": 98
  } ],
  33: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var identity_1 = require("../util/identity");
    var isScheduler_1 = require("../util/isScheduler");
    function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
      var resultSelector;
      var initialState;
      if (1 == arguments.length) {
        var options = initialStateOrOptions;
        initialState = options.initialState;
        condition = options.condition;
        iterate = options.iterate;
        resultSelector = options.resultSelector || identity_1.identity;
        scheduler = options.scheduler;
      } else if (void 0 === resultSelectorOrObservable || isScheduler_1.isScheduler(resultSelectorOrObservable)) {
        initialState = initialStateOrOptions;
        resultSelector = identity_1.identity;
        scheduler = resultSelectorOrObservable;
      } else {
        initialState = initialStateOrOptions;
        resultSelector = resultSelectorOrObservable;
      }
      return new Observable_1.Observable(function(subscriber) {
        var state = initialState;
        if (scheduler) return scheduler.schedule(dispatch, 0, {
          subscriber: subscriber,
          iterate: iterate,
          condition: condition,
          resultSelector: resultSelector,
          state: state
        });
        do {
          if (condition) {
            var conditionResult = void 0;
            try {
              conditionResult = condition(state);
            } catch (err) {
              subscriber.error(err);
              return;
            }
            if (!conditionResult) {
              subscriber.complete();
              break;
            }
          }
          var value = void 0;
          try {
            value = resultSelector(state);
          } catch (err) {
            subscriber.error(err);
            return;
          }
          subscriber.next(value);
          if (subscriber.closed) break;
          try {
            state = iterate(state);
          } catch (err) {
            subscriber.error(err);
            return;
          }
        } while (true);
        return;
      });
    }
    exports.generate = generate;
    function dispatch(state) {
      var subscriber = state.subscriber, condition = state.condition;
      if (subscriber.closed) return;
      if (state.needIterate) try {
        state.state = state.iterate(state.state);
      } catch (err) {
        subscriber.error(err);
        return;
      } else state.needIterate = true;
      if (condition) {
        var conditionResult = void 0;
        try {
          conditionResult = condition(state.state);
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (!conditionResult) {
          subscriber.complete();
          return;
        }
        if (subscriber.closed) return;
      }
      var value;
      try {
        value = state.resultSelector(state.state);
      } catch (err) {
        subscriber.error(err);
        return;
      }
      if (subscriber.closed) return;
      subscriber.next(value);
      if (subscriber.closed) return;
      return this.schedule(state);
    }
  }, {
    "../Observable": 8,
    "../util/identity": 81,
    "../util/isScheduler": 91
  } ],
  34: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var defer_1 = require("./defer");
    var empty_1 = require("./empty");
    function iif(condition, trueResult, falseResult) {
      void 0 === trueResult && (trueResult = empty_1.EMPTY);
      void 0 === falseResult && (falseResult = empty_1.EMPTY);
      return defer_1.defer(function() {
        return condition() ? trueResult : falseResult;
      });
    }
    exports.iif = iif;
  }, {
    "./defer": 23,
    "./empty": 24
  } ],
  35: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var async_1 = require("../scheduler/async");
    var isNumeric_1 = require("../util/isNumeric");
    function interval(period, scheduler) {
      void 0 === period && (period = 0);
      void 0 === scheduler && (scheduler = async_1.async);
      (!isNumeric_1.isNumeric(period) || period < 0) && (period = 0);
      scheduler && "function" === typeof scheduler.schedule || (scheduler = async_1.async);
      return new Observable_1.Observable(function(subscriber) {
        subscriber.add(scheduler.schedule(dispatch, period, {
          subscriber: subscriber,
          counter: 0,
          period: period
        }));
        return subscriber;
      });
    }
    exports.interval = interval;
    function dispatch(state) {
      var subscriber = state.subscriber, counter = state.counter, period = state.period;
      subscriber.next(counter);
      this.schedule({
        subscriber: subscriber,
        counter: counter + 1,
        period: period
      }, period);
    }
  }, {
    "../Observable": 8,
    "../scheduler/async": 67,
    "../util/isNumeric": 87
  } ],
  36: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var isScheduler_1 = require("../util/isScheduler");
    var mergeAll_1 = require("../operators/mergeAll");
    var fromArray_1 = require("./fromArray");
    function merge() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) observables[_i] = arguments[_i];
      var concurrent = Number.POSITIVE_INFINITY;
      var scheduler = null;
      var last = observables[observables.length - 1];
      if (isScheduler_1.isScheduler(last)) {
        scheduler = observables.pop();
        observables.length > 1 && "number" === typeof observables[observables.length - 1] && (concurrent = observables.pop());
      } else "number" === typeof last && (concurrent = observables.pop());
      if (null === scheduler && 1 === observables.length && observables[0] instanceof Observable_1.Observable) return observables[0];
      return mergeAll_1.mergeAll(concurrent)(fromArray_1.fromArray(observables, scheduler));
    }
    exports.merge = merge;
  }, {
    "../Observable": 8,
    "../operators/mergeAll": 51,
    "../util/isScheduler": 91,
    "./fromArray": 27
  } ],
  37: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var noop_1 = require("../util/noop");
    exports.NEVER = new Observable_1.Observable(noop_1.noop);
    function never() {
      return exports.NEVER;
    }
    exports.never = never;
  }, {
    "../Observable": 8,
    "../util/noop": 92
  } ],
  38: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isScheduler_1 = require("../util/isScheduler");
    var fromArray_1 = require("./fromArray");
    var empty_1 = require("./empty");
    var scalar_1 = require("./scalar");
    function of() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
      var scheduler = args[args.length - 1];
      isScheduler_1.isScheduler(scheduler) ? args.pop() : scheduler = void 0;
      switch (args.length) {
       case 0:
        return empty_1.empty(scheduler);

       case 1:
        return scheduler ? fromArray_1.fromArray(args, scheduler) : scalar_1.scalar(args[0]);

       default:
        return fromArray_1.fromArray(args, scheduler);
      }
    }
    exports.of = of;
  }, {
    "../util/isScheduler": 91,
    "./empty": 24,
    "./fromArray": 27,
    "./scalar": 43
  } ],
  39: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var from_1 = require("./from");
    var isArray_1 = require("../util/isArray");
    var empty_1 = require("./empty");
    function onErrorResumeNext() {
      var sources = [];
      for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
      if (0 === sources.length) return empty_1.EMPTY;
      var first = sources[0], remainder = sources.slice(1);
      if (1 === sources.length && isArray_1.isArray(first)) return onErrorResumeNext.apply(void 0, first);
      return new Observable_1.Observable(function(subscriber) {
        var subNext = function() {
          return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber));
        };
        return from_1.from(first).subscribe({
          next: function(value) {
            subscriber.next(value);
          },
          error: subNext,
          complete: subNext
        });
      });
    }
    exports.onErrorResumeNext = onErrorResumeNext;
  }, {
    "../Observable": 8,
    "../util/isArray": 82,
    "./empty": 24,
    "./from": 26
  } ],
  40: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var Subscription_1 = require("../Subscription");
    function pairs(obj, scheduler) {
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        var keys = Object.keys(obj);
        var subscription = new Subscription_1.Subscription();
        subscription.add(scheduler.schedule(dispatch, 0, {
          keys: keys,
          index: 0,
          subscriber: subscriber,
          subscription: subscription,
          obj: obj
        }));
        return subscription;
      }) : new Observable_1.Observable(function(subscriber) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length && !subscriber.closed; i++) {
          var key = keys[i];
          obj.hasOwnProperty(key) && subscriber.next([ key, obj[key] ]);
        }
        subscriber.complete();
      });
    }
    exports.pairs = pairs;
    function dispatch(state) {
      var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
      if (!subscriber.closed) if (index < keys.length) {
        var key = keys[index];
        subscriber.next([ key, obj[key] ]);
        subscription.add(this.schedule({
          keys: keys,
          index: index + 1,
          subscriber: subscriber,
          subscription: subscription,
          obj: obj
        }));
      } else subscriber.complete();
    }
    exports.dispatch = dispatch;
  }, {
    "../Observable": 8,
    "../Subscription": 16
  } ],
  41: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isArray_1 = require("../util/isArray");
    var fromArray_1 = require("./fromArray");
    var OuterSubscriber_1 = require("../OuterSubscriber");
    var subscribeToResult_1 = require("../util/subscribeToResult");
    function race() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) observables[_i] = arguments[_i];
      if (1 === observables.length) {
        if (!isArray_1.isArray(observables[0])) return observables[0];
        observables = observables[0];
      }
      return fromArray_1.fromArray(observables, void 0).lift(new RaceOperator());
    }
    exports.race = race;
    var RaceOperator = function() {
      function RaceOperator() {}
      RaceOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
      };
      return RaceOperator;
    }();
    exports.RaceOperator = RaceOperator;
    var RaceSubscriber = function(_super) {
      __extends(RaceSubscriber, _super);
      function RaceSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasFirst = false;
        _this.observables = [];
        _this.subscriptions = [];
        return _this;
      }
      RaceSubscriber.prototype._next = function(observable) {
        this.observables.push(observable);
      };
      RaceSubscriber.prototype._complete = function() {
        var observables = this.observables;
        var len = observables.length;
        if (0 === len) this.destination.complete(); else {
          for (var i = 0; i < len && !this.hasFirst; i++) {
            var observable = observables[i];
            var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
            this.subscriptions && this.subscriptions.push(subscription);
            this.add(subscription);
          }
          this.observables = null;
        }
      };
      RaceSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
          this.hasFirst = true;
          for (var i = 0; i < this.subscriptions.length; i++) if (i !== outerIndex) {
            var subscription = this.subscriptions[i];
            subscription.unsubscribe();
            this.remove(subscription);
          }
          this.subscriptions = null;
        }
        this.destination.next(innerValue);
      };
      return RaceSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    exports.RaceSubscriber = RaceSubscriber;
  }, {
    "../OuterSubscriber": 10,
    "../util/isArray": 82,
    "../util/subscribeToResult": 99,
    "./fromArray": 27
  } ],
  42: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    function range(start, count, scheduler) {
      void 0 === start && (start = 0);
      void 0 === count && (count = 0);
      return new Observable_1.Observable(function(subscriber) {
        var index = 0;
        var current = start;
        if (scheduler) return scheduler.schedule(dispatch, 0, {
          index: index,
          count: count,
          start: start,
          subscriber: subscriber
        });
        do {
          if (index++ >= count) {
            subscriber.complete();
            break;
          }
          subscriber.next(current++);
          if (subscriber.closed) break;
        } while (true);
        return;
      });
    }
    exports.range = range;
    function dispatch(state) {
      var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
      if (index >= count) {
        subscriber.complete();
        return;
      }
      subscriber.next(start);
      if (subscriber.closed) return;
      state.index = index + 1;
      state.start = start + 1;
      this.schedule(state);
    }
    exports.dispatch = dispatch;
  }, {
    "../Observable": 8
  } ],
  43: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    function scalar(value) {
      var result = new Observable_1.Observable(function(subscriber) {
        subscriber.next(value);
        subscriber.complete();
      });
      result._isScalar = true;
      result.value = value;
      return result;
    }
    exports.scalar = scalar;
  }, {
    "../Observable": 8
  } ],
  44: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    function throwError(error, scheduler) {
      return scheduler ? new Observable_1.Observable(function(subscriber) {
        return scheduler.schedule(dispatch, 0, {
          error: error,
          subscriber: subscriber
        });
      }) : new Observable_1.Observable(function(subscriber) {
        return subscriber.error(error);
      });
    }
    exports.throwError = throwError;
    function dispatch(_a) {
      var error = _a.error, subscriber = _a.subscriber;
      subscriber.error(error);
    }
  }, {
    "../Observable": 8
  } ],
  45: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var async_1 = require("../scheduler/async");
    var isNumeric_1 = require("../util/isNumeric");
    var isScheduler_1 = require("../util/isScheduler");
    function timer(dueTime, periodOrScheduler, scheduler) {
      void 0 === dueTime && (dueTime = 0);
      var period = -1;
      isNumeric_1.isNumeric(periodOrScheduler) ? period = Number(periodOrScheduler) < 1 ? 1 : Number(periodOrScheduler) : isScheduler_1.isScheduler(periodOrScheduler) && (scheduler = periodOrScheduler);
      isScheduler_1.isScheduler(scheduler) || (scheduler = async_1.async);
      return new Observable_1.Observable(function(subscriber) {
        var due = isNumeric_1.isNumeric(dueTime) ? dueTime : +dueTime - scheduler.now();
        return scheduler.schedule(dispatch, due, {
          index: 0,
          period: period,
          subscriber: subscriber
        });
      });
    }
    exports.timer = timer;
    function dispatch(state) {
      var index = state.index, period = state.period, subscriber = state.subscriber;
      subscriber.next(index);
      if (subscriber.closed) return;
      if (-1 === period) return subscriber.complete();
      state.index = index + 1;
      this.schedule(state, period);
    }
  }, {
    "../Observable": 8,
    "../scheduler/async": 67,
    "../util/isNumeric": 87,
    "../util/isScheduler": 91
  } ],
  46: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var from_1 = require("./from");
    var empty_1 = require("./empty");
    function using(resourceFactory, observableFactory) {
      return new Observable_1.Observable(function(subscriber) {
        var resource;
        try {
          resource = resourceFactory();
        } catch (err) {
          subscriber.error(err);
          return;
        }
        var result;
        try {
          result = observableFactory(resource);
        } catch (err) {
          subscriber.error(err);
          return;
        }
        var source = result ? from_1.from(result) : empty_1.EMPTY;
        var subscription = source.subscribe(subscriber);
        return function() {
          subscription.unsubscribe();
          resource && resource.unsubscribe();
        };
      });
    }
    exports.using = using;
  }, {
    "../Observable": 8,
    "./empty": 24,
    "./from": 26
  } ],
  47: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var fromArray_1 = require("./fromArray");
    var isArray_1 = require("../util/isArray");
    var Subscriber_1 = require("../Subscriber");
    var OuterSubscriber_1 = require("../OuterSubscriber");
    var subscribeToResult_1 = require("../util/subscribeToResult");
    var iterator_1 = require("../../internal/symbol/iterator");
    function zip() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) observables[_i] = arguments[_i];
      var resultSelector = observables[observables.length - 1];
      "function" === typeof resultSelector && observables.pop();
      return fromArray_1.fromArray(observables, void 0).lift(new ZipOperator(resultSelector));
    }
    exports.zip = zip;
    var ZipOperator = function() {
      function ZipOperator(resultSelector) {
        this.resultSelector = resultSelector;
      }
      ZipOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
      };
      return ZipOperator;
    }();
    exports.ZipOperator = ZipOperator;
    var ZipSubscriber = function(_super) {
      __extends(ZipSubscriber, _super);
      function ZipSubscriber(destination, resultSelector, values) {
        void 0 === values && (values = Object.create(null));
        var _this = _super.call(this, destination) || this;
        _this.iterators = [];
        _this.active = 0;
        _this.resultSelector = "function" === typeof resultSelector ? resultSelector : null;
        _this.values = values;
        return _this;
      }
      ZipSubscriber.prototype._next = function(value) {
        var iterators = this.iterators;
        isArray_1.isArray(value) ? iterators.push(new StaticArrayIterator(value)) : "function" === typeof value[iterator_1.iterator] ? iterators.push(new StaticIterator(value[iterator_1.iterator]())) : iterators.push(new ZipBufferIterator(this.destination, this, value));
      };
      ZipSubscriber.prototype._complete = function() {
        var iterators = this.iterators;
        var len = iterators.length;
        this.unsubscribe();
        if (0 === len) {
          this.destination.complete();
          return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
          var iterator = iterators[i];
          if (iterator.stillUnsubscribed) {
            var destination = this.destination;
            destination.add(iterator.subscribe(iterator, i));
          } else this.active--;
        }
      };
      ZipSubscriber.prototype.notifyInactive = function() {
        this.active--;
        0 === this.active && this.destination.complete();
      };
      ZipSubscriber.prototype.checkIterators = function() {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        for (var i = 0; i < len; i++) {
          var iterator = iterators[i];
          if ("function" === typeof iterator.hasValue && !iterator.hasValue()) return;
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
          var iterator = iterators[i];
          var result = iterator.next();
          iterator.hasCompleted() && (shouldComplete = true);
          if (result.done) {
            destination.complete();
            return;
          }
          args.push(result.value);
        }
        this.resultSelector ? this._tryresultSelector(args) : destination.next(args);
        shouldComplete && destination.complete();
      };
      ZipSubscriber.prototype._tryresultSelector = function(args) {
        var result;
        try {
          result = this.resultSelector.apply(this, args);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.destination.next(result);
      };
      return ZipSubscriber;
    }(Subscriber_1.Subscriber);
    exports.ZipSubscriber = ZipSubscriber;
    var StaticIterator = function() {
      function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
      }
      StaticIterator.prototype.hasValue = function() {
        return true;
      };
      StaticIterator.prototype.next = function() {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
      };
      StaticIterator.prototype.hasCompleted = function() {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
      };
      return StaticIterator;
    }();
    var StaticArrayIterator = function() {
      function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
      }
      StaticArrayIterator.prototype[iterator_1.iterator] = function() {
        return this;
      };
      StaticArrayIterator.prototype.next = function(value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? {
          value: array[i],
          done: false
        } : {
          value: null,
          done: true
        };
      };
      StaticArrayIterator.prototype.hasValue = function() {
        return this.array.length > this.index;
      };
      StaticArrayIterator.prototype.hasCompleted = function() {
        return this.array.length === this.index;
      };
      return StaticArrayIterator;
    }();
    var ZipBufferIterator = function(_super) {
      __extends(ZipBufferIterator, _super);
      function ZipBufferIterator(destination, parent, observable) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        _this.observable = observable;
        _this.stillUnsubscribed = true;
        _this.buffer = [];
        _this.isComplete = false;
        return _this;
      }
      ZipBufferIterator.prototype[iterator_1.iterator] = function() {
        return this;
      };
      ZipBufferIterator.prototype.next = function() {
        var buffer = this.buffer;
        return 0 === buffer.length && this.isComplete ? {
          value: null,
          done: true
        } : {
          value: buffer.shift(),
          done: false
        };
      };
      ZipBufferIterator.prototype.hasValue = function() {
        return this.buffer.length > 0;
      };
      ZipBufferIterator.prototype.hasCompleted = function() {
        return 0 === this.buffer.length && this.isComplete;
      };
      ZipBufferIterator.prototype.notifyComplete = function() {
        if (this.buffer.length > 0) {
          this.isComplete = true;
          this.parent.notifyInactive();
        } else this.destination.complete();
      };
      ZipBufferIterator.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
      };
      ZipBufferIterator.prototype.subscribe = function(value, index) {
        return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
      };
      return ZipBufferIterator;
    }(OuterSubscriber_1.OuterSubscriber);
  }, {
    "../../internal/symbol/iterator": 69,
    "../OuterSubscriber": 10,
    "../Subscriber": 15,
    "../util/isArray": 82,
    "../util/subscribeToResult": 99,
    "./fromArray": 27
  } ],
  48: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var mergeAll_1 = require("./mergeAll");
    function concatAll() {
      return mergeAll_1.mergeAll(1);
    }
    exports.concatAll = concatAll;
  }, {
    "./mergeAll": 51
  } ],
  49: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    var Subscription_1 = require("../Subscription");
    var Observable_1 = require("../Observable");
    var Subject_1 = require("../Subject");
    function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
      return function(source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
      };
    }
    exports.groupBy = groupBy;
    var GroupByOperator = function() {
      function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
      }
      GroupByOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
      };
      return GroupByOperator;
    }();
    var GroupBySubscriber = function(_super) {
      __extends(GroupBySubscriber, _super);
      function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
      }
      GroupBySubscriber.prototype._next = function(value) {
        var key;
        try {
          key = this.keySelector(value);
        } catch (err) {
          this.error(err);
          return;
        }
        this._group(value, key);
      };
      GroupBySubscriber.prototype._group = function(value, key) {
        var groups = this.groups;
        groups || (groups = this.groups = new Map());
        var group = groups.get(key);
        var element;
        if (this.elementSelector) try {
          element = this.elementSelector(value);
        } catch (err) {
          this.error(err);
        } else element = value;
        if (!group) {
          group = this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject();
          groups.set(key, group);
          var groupedObservable = new GroupedObservable(key, group, this);
          this.destination.next(groupedObservable);
          if (this.durationSelector) {
            var duration = void 0;
            try {
              duration = this.durationSelector(new GroupedObservable(key, group));
            } catch (err) {
              this.error(err);
              return;
            }
            this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
          }
        }
        group.closed || group.next(element);
      };
      GroupBySubscriber.prototype._error = function(err) {
        var groups = this.groups;
        if (groups) {
          groups.forEach(function(group, key) {
            group.error(err);
          });
          groups.clear();
        }
        this.destination.error(err);
      };
      GroupBySubscriber.prototype._complete = function() {
        var groups = this.groups;
        if (groups) {
          groups.forEach(function(group, key) {
            group.complete();
          });
          groups.clear();
        }
        this.destination.complete();
      };
      GroupBySubscriber.prototype.removeGroup = function(key) {
        this.groups.delete(key);
      };
      GroupBySubscriber.prototype.unsubscribe = function() {
        if (!this.closed) {
          this.attemptedToUnsubscribe = true;
          0 === this.count && _super.prototype.unsubscribe.call(this);
        }
      };
      return GroupBySubscriber;
    }(Subscriber_1.Subscriber);
    var GroupDurationSubscriber = function(_super) {
      __extends(GroupDurationSubscriber, _super);
      function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
      }
      GroupDurationSubscriber.prototype._next = function(value) {
        this.complete();
      };
      GroupDurationSubscriber.prototype._unsubscribe = function() {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        parent && parent.removeGroup(key);
      };
      return GroupDurationSubscriber;
    }(Subscriber_1.Subscriber);
    var GroupedObservable = function(_super) {
      __extends(GroupedObservable, _super);
      function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
      }
      GroupedObservable.prototype._subscribe = function(subscriber) {
        var subscription = new Subscription_1.Subscription();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        refCountSubscription && !refCountSubscription.closed && subscription.add(new InnerRefCountSubscription(refCountSubscription));
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
      };
      return GroupedObservable;
    }(Observable_1.Observable);
    exports.GroupedObservable = GroupedObservable;
    var InnerRefCountSubscription = function(_super) {
      __extends(InnerRefCountSubscription, _super);
      function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
      }
      InnerRefCountSubscription.prototype.unsubscribe = function() {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
          _super.prototype.unsubscribe.call(this);
          parent.count -= 1;
          0 === parent.count && parent.attemptedToUnsubscribe && parent.unsubscribe();
        }
      };
      return InnerRefCountSubscription;
    }(Subscription_1.Subscription);
  }, {
    "../Observable": 8,
    "../Subject": 13,
    "../Subscriber": 15,
    "../Subscription": 16
  } ],
  50: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    function map(project, thisArg) {
      return function mapOperation(source) {
        if ("function" !== typeof project) throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
        return source.lift(new MapOperator(project, thisArg));
      };
    }
    exports.map = map;
    var MapOperator = function() {
      function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
      }
      MapOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
      };
      return MapOperator;
    }();
    exports.MapOperator = MapOperator;
    var MapSubscriber = function(_super) {
      __extends(MapSubscriber, _super);
      function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
      }
      MapSubscriber.prototype._next = function(value) {
        var result;
        try {
          result = this.project.call(this.thisArg, value, this.count++);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.destination.next(result);
      };
      return MapSubscriber;
    }(Subscriber_1.Subscriber);
  }, {
    "../Subscriber": 15
  } ],
  51: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var mergeMap_1 = require("./mergeMap");
    var identity_1 = require("../util/identity");
    function mergeAll(concurrent) {
      void 0 === concurrent && (concurrent = Number.POSITIVE_INFINITY);
      return mergeMap_1.mergeMap(identity_1.identity, concurrent);
    }
    exports.mergeAll = mergeAll;
  }, {
    "../util/identity": 81,
    "./mergeMap": 52
  } ],
  52: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var subscribeToResult_1 = require("../util/subscribeToResult");
    var OuterSubscriber_1 = require("../OuterSubscriber");
    var InnerSubscriber_1 = require("../InnerSubscriber");
    var map_1 = require("./map");
    var from_1 = require("../observable/from");
    function mergeMap(project, resultSelector, concurrent) {
      void 0 === concurrent && (concurrent = Number.POSITIVE_INFINITY);
      if ("function" === typeof resultSelector) return function(source) {
        return source.pipe(mergeMap(function(a, i) {
          return from_1.from(project(a, i)).pipe(map_1.map(function(b, ii) {
            return resultSelector(a, b, i, ii);
          }));
        }, concurrent));
      };
      "number" === typeof resultSelector && (concurrent = resultSelector);
      return function(source) {
        return source.lift(new MergeMapOperator(project, concurrent));
      };
    }
    exports.mergeMap = mergeMap;
    var MergeMapOperator = function() {
      function MergeMapOperator(project, concurrent) {
        void 0 === concurrent && (concurrent = Number.POSITIVE_INFINITY);
        this.project = project;
        this.concurrent = concurrent;
      }
      MergeMapOperator.prototype.call = function(observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
      };
      return MergeMapOperator;
    }();
    exports.MergeMapOperator = MergeMapOperator;
    var MergeMapSubscriber = function(_super) {
      __extends(MergeMapSubscriber, _super);
      function MergeMapSubscriber(destination, project, concurrent) {
        void 0 === concurrent && (concurrent = Number.POSITIVE_INFINITY);
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
      }
      MergeMapSubscriber.prototype._next = function(value) {
        this.active < this.concurrent ? this._tryNext(value) : this.buffer.push(value);
      };
      MergeMapSubscriber.prototype._tryNext = function(value) {
        var result;
        var index = this.index++;
        try {
          result = this.project(value, index);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.active++;
        this._innerSub(result, value, index);
      };
      MergeMapSubscriber.prototype._innerSub = function(ish, value, index) {
        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, void 0, void 0);
        var destination = this.destination;
        destination.add(innerSubscriber);
        subscribeToResult_1.subscribeToResult(this, ish, value, index, innerSubscriber);
      };
      MergeMapSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        0 === this.active && 0 === this.buffer.length && this.destination.complete();
        this.unsubscribe();
      };
      MergeMapSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
      };
      MergeMapSubscriber.prototype.notifyComplete = function(innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        buffer.length > 0 ? this._next(buffer.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete();
      };
      return MergeMapSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    exports.MergeMapSubscriber = MergeMapSubscriber;
  }, {
    "../InnerSubscriber": 6,
    "../OuterSubscriber": 10,
    "../observable/from": 26,
    "../util/subscribeToResult": 99,
    "./map": 50
  } ],
  53: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    var Notification_1 = require("../Notification");
    function observeOn(scheduler, delay) {
      void 0 === delay && (delay = 0);
      return function observeOnOperatorFunction(source) {
        return source.lift(new ObserveOnOperator(scheduler, delay));
      };
    }
    exports.observeOn = observeOn;
    var ObserveOnOperator = function() {
      function ObserveOnOperator(scheduler, delay) {
        void 0 === delay && (delay = 0);
        this.scheduler = scheduler;
        this.delay = delay;
      }
      ObserveOnOperator.prototype.call = function(subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
      };
      return ObserveOnOperator;
    }();
    exports.ObserveOnOperator = ObserveOnOperator;
    var ObserveOnSubscriber = function(_super) {
      __extends(ObserveOnSubscriber, _super);
      function ObserveOnSubscriber(destination, scheduler, delay) {
        void 0 === delay && (delay = 0);
        var _this = _super.call(this, destination) || this;
        _this.scheduler = scheduler;
        _this.delay = delay;
        return _this;
      }
      ObserveOnSubscriber.dispatch = function(arg) {
        var notification = arg.notification, destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
      };
      ObserveOnSubscriber.prototype.scheduleMessage = function(notification) {
        var destination = this.destination;
        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
      };
      ObserveOnSubscriber.prototype._next = function(value) {
        this.scheduleMessage(Notification_1.Notification.createNext(value));
      };
      ObserveOnSubscriber.prototype._error = function(err) {
        this.scheduleMessage(Notification_1.Notification.createError(err));
        this.unsubscribe();
      };
      ObserveOnSubscriber.prototype._complete = function() {
        this.scheduleMessage(Notification_1.Notification.createComplete());
        this.unsubscribe();
      };
      return ObserveOnSubscriber;
    }(Subscriber_1.Subscriber);
    exports.ObserveOnSubscriber = ObserveOnSubscriber;
    var ObserveOnMessage = function() {
      function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
      }
      return ObserveOnMessage;
    }();
    exports.ObserveOnMessage = ObserveOnMessage;
  }, {
    "../Notification": 7,
    "../Subscriber": 15
  } ],
  54: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    function refCount() {
      return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
      };
    }
    exports.refCount = refCount;
    var RefCountOperator = function() {
      function RefCountOperator(connectable) {
        this.connectable = connectable;
      }
      RefCountOperator.prototype.call = function(subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        refCounter.closed || (refCounter.connection = connectable.connect());
        return subscription;
      };
      return RefCountOperator;
    }();
    var RefCountSubscriber = function(_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function() {
        var connectable = this.connectable;
        if (!connectable) {
          this.connection = null;
          return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
          this.connection = null;
          return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
          this.connection = null;
          return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        !sharedConnection || connection && sharedConnection !== connection || sharedConnection.unsubscribe();
      };
      return RefCountSubscriber;
    }(Subscriber_1.Subscriber);
  }, {
    "../Subscriber": 15
  } ],
  55: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscription_1 = require("../Subscription");
    var Action = function(_super) {
      __extends(Action, _super);
      function Action(scheduler, work) {
        return _super.call(this) || this;
      }
      Action.prototype.schedule = function(state, delay) {
        void 0 === delay && (delay = 0);
        return this;
      };
      return Action;
    }(Subscription_1.Subscription);
    exports.Action = Action;
  }, {
    "../Subscription": 16
  } ],
  56: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncAction_1 = require("./AsyncAction");
    var AnimationFrameAction = function(_super) {
      __extends(AnimationFrameAction, _super);
      function AnimationFrameAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
      }
      AnimationFrameAction.prototype.requestAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function() {
          return scheduler.flush(null);
        }));
      };
      AnimationFrameAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && delay > 0 || null === delay && this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        if (0 === scheduler.actions.length) {
          cancelAnimationFrame(id);
          scheduler.scheduled = void 0;
        }
        return;
      };
      return AnimationFrameAction;
    }(AsyncAction_1.AsyncAction);
    exports.AnimationFrameAction = AnimationFrameAction;
  }, {
    "./AsyncAction": 60
  } ],
  57: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncScheduler_1 = require("./AsyncScheduler");
    var AnimationFrameScheduler = function(_super) {
      __extends(AnimationFrameScheduler, _super);
      function AnimationFrameScheduler() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AnimationFrameScheduler.prototype.flush = function(action) {
        this.active = true;
        this.scheduled = void 0;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
          if (error = action.execute(action.state, action.delay)) break;
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
          while (++index < count && (action = actions.shift())) action.unsubscribe();
          throw error;
        }
      };
      return AnimationFrameScheduler;
    }(AsyncScheduler_1.AsyncScheduler);
    exports.AnimationFrameScheduler = AnimationFrameScheduler;
  }, {
    "./AsyncScheduler": 61
  } ],
  58: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Immediate_1 = require("../util/Immediate");
    var AsyncAction_1 = require("./AsyncAction");
    var AsapAction = function(_super) {
      __extends(AsapAction, _super);
      function AsapAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
      }
      AsapAction.prototype.requestAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
      };
      AsapAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && delay > 0 || null === delay && this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        if (0 === scheduler.actions.length) {
          Immediate_1.Immediate.clearImmediate(id);
          scheduler.scheduled = void 0;
        }
        return;
      };
      return AsapAction;
    }(AsyncAction_1.AsyncAction);
    exports.AsapAction = AsapAction;
  }, {
    "../util/Immediate": 74,
    "./AsyncAction": 60
  } ],
  59: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncScheduler_1 = require("./AsyncScheduler");
    var AsapScheduler = function(_super) {
      __extends(AsapScheduler, _super);
      function AsapScheduler() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AsapScheduler.prototype.flush = function(action) {
        this.active = true;
        this.scheduled = void 0;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
          if (error = action.execute(action.state, action.delay)) break;
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
          while (++index < count && (action = actions.shift())) action.unsubscribe();
          throw error;
        }
      };
      return AsapScheduler;
    }(AsyncScheduler_1.AsyncScheduler);
    exports.AsapScheduler = AsapScheduler;
  }, {
    "./AsyncScheduler": 61
  } ],
  60: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Action_1 = require("./Action");
    var AsyncAction = function(_super) {
      __extends(AsyncAction, _super);
      function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
      }
      AsyncAction.prototype.schedule = function(state, delay) {
        void 0 === delay && (delay = 0);
        if (this.closed) return this;
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        null != id && (this.id = this.recycleAsyncId(scheduler, id, delay));
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
      };
      AsyncAction.prototype.requestAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
      };
      AsyncAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && this.delay === delay && false === this.pending) return id;
        clearInterval(id);
      };
      AsyncAction.prototype.execute = function(state, delay) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) return error;
        false === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
      };
      AsyncAction.prototype._execute = function(state, delay) {
        var errored = false;
        var errorValue = void 0;
        try {
          this.work(state);
        } catch (e) {
          errored = true;
          errorValue = !!e && e || new Error(e);
        }
        if (errored) {
          this.unsubscribe();
          return errorValue;
        }
      };
      AsyncAction.prototype._unsubscribe = function() {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        -1 !== index && actions.splice(index, 1);
        null != id && (this.id = this.recycleAsyncId(scheduler, id, null));
        this.delay = null;
      };
      return AsyncAction;
    }(Action_1.Action);
    exports.AsyncAction = AsyncAction;
  }, {
    "./Action": 55
  } ],
  61: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Scheduler_1 = require("../Scheduler");
    var AsyncScheduler = function(_super) {
      __extends(AsyncScheduler, _super);
      function AsyncScheduler(SchedulerAction, now) {
        void 0 === now && (now = Scheduler_1.Scheduler.now);
        var _this = _super.call(this, SchedulerAction, function() {
          return AsyncScheduler.delegate && AsyncScheduler.delegate !== _this ? AsyncScheduler.delegate.now() : now();
        }) || this;
        _this.actions = [];
        _this.active = false;
        _this.scheduled = void 0;
        return _this;
      }
      AsyncScheduler.prototype.schedule = function(work, delay, state) {
        void 0 === delay && (delay = 0);
        return AsyncScheduler.delegate && AsyncScheduler.delegate !== this ? AsyncScheduler.delegate.schedule(work, delay, state) : _super.prototype.schedule.call(this, work, delay, state);
      };
      AsyncScheduler.prototype.flush = function(action) {
        var actions = this.actions;
        if (this.active) {
          actions.push(action);
          return;
        }
        var error;
        this.active = true;
        do {
          if (error = action.execute(action.state, action.delay)) break;
        } while (action = actions.shift());
        this.active = false;
        if (error) {
          while (action = actions.shift()) action.unsubscribe();
          throw error;
        }
      };
      return AsyncScheduler;
    }(Scheduler_1.Scheduler);
    exports.AsyncScheduler = AsyncScheduler;
  }, {
    "../Scheduler": 12
  } ],
  62: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncAction_1 = require("./AsyncAction");
    var QueueAction = function(_super) {
      __extends(QueueAction, _super);
      function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
      }
      QueueAction.prototype.schedule = function(state, delay) {
        void 0 === delay && (delay = 0);
        if (delay > 0) return _super.prototype.schedule.call(this, state, delay);
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
      };
      QueueAction.prototype.execute = function(state, delay) {
        return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
      };
      QueueAction.prototype.requestAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        if (null !== delay && delay > 0 || null === delay && this.delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        return scheduler.flush(this);
      };
      return QueueAction;
    }(AsyncAction_1.AsyncAction);
    exports.QueueAction = QueueAction;
  }, {
    "./AsyncAction": 60
  } ],
  63: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncScheduler_1 = require("./AsyncScheduler");
    var QueueScheduler = function(_super) {
      __extends(QueueScheduler, _super);
      function QueueScheduler() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return QueueScheduler;
    }(AsyncScheduler_1.AsyncScheduler);
    exports.QueueScheduler = QueueScheduler;
  }, {
    "./AsyncScheduler": 61
  } ],
  64: [ function(require, module, exports) {
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncAction_1 = require("./AsyncAction");
    var AsyncScheduler_1 = require("./AsyncScheduler");
    var VirtualTimeScheduler = function(_super) {
      __extends(VirtualTimeScheduler, _super);
      function VirtualTimeScheduler(SchedulerAction, maxFrames) {
        void 0 === SchedulerAction && (SchedulerAction = VirtualAction);
        void 0 === maxFrames && (maxFrames = Number.POSITIVE_INFINITY);
        var _this = _super.call(this, SchedulerAction, function() {
          return _this.frame;
        }) || this;
        _this.maxFrames = maxFrames;
        _this.frame = 0;
        _this.index = -1;
        return _this;
      }
      VirtualTimeScheduler.prototype.flush = function() {
        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
        var error, action;
        while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) if (error = action.execute(action.state, action.delay)) break;
        if (error) {
          while (action = actions.shift()) action.unsubscribe();
          throw error;
        }
      };
      VirtualTimeScheduler.frameTimeFactor = 10;
      return VirtualTimeScheduler;
    }(AsyncScheduler_1.AsyncScheduler);
    exports.VirtualTimeScheduler = VirtualTimeScheduler;
    var VirtualAction = function(_super) {
      __extends(VirtualAction, _super);
      function VirtualAction(scheduler, work, index) {
        void 0 === index && (index = scheduler.index += 1);
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.index = index;
        _this.active = true;
        _this.index = scheduler.index = index;
        return _this;
      }
      VirtualAction.prototype.schedule = function(state, delay) {
        void 0 === delay && (delay = 0);
        if (!this.id) return _super.prototype.schedule.call(this, state, delay);
        this.active = false;
        var action = new VirtualAction(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
      };
      VirtualAction.prototype.requestAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        this.delay = scheduler.frame + delay;
        var actions = scheduler.actions;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
      };
      VirtualAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
        void 0 === delay && (delay = 0);
        return;
      };
      VirtualAction.prototype._execute = function(state, delay) {
        if (true === this.active) return _super.prototype._execute.call(this, state, delay);
      };
      VirtualAction.sortActions = function(a, b) {
        return a.delay === b.delay ? a.index === b.index ? 0 : a.index > b.index ? 1 : -1 : a.delay > b.delay ? 1 : -1;
      };
      return VirtualAction;
    }(AsyncAction_1.AsyncAction);
    exports.VirtualAction = VirtualAction;
  }, {
    "./AsyncAction": 60,
    "./AsyncScheduler": 61
  } ],
  65: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AnimationFrameAction_1 = require("./AnimationFrameAction");
    var AnimationFrameScheduler_1 = require("./AnimationFrameScheduler");
    exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
  }, {
    "./AnimationFrameAction": 56,
    "./AnimationFrameScheduler": 57
  } ],
  66: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsapAction_1 = require("./AsapAction");
    var AsapScheduler_1 = require("./AsapScheduler");
    exports.asap = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
  }, {
    "./AsapAction": 58,
    "./AsapScheduler": 59
  } ],
  67: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AsyncAction_1 = require("./AsyncAction");
    var AsyncScheduler_1 = require("./AsyncScheduler");
    exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
  }, {
    "./AsyncAction": 60,
    "./AsyncScheduler": 61
  } ],
  68: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var QueueAction_1 = require("./QueueAction");
    var QueueScheduler_1 = require("./QueueScheduler");
    exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
  }, {
    "./QueueAction": 62,
    "./QueueScheduler": 63
  } ],
  69: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function getSymbolIterator() {
      if ("function" !== typeof Symbol || !Symbol.iterator) return "@@iterator";
      return Symbol.iterator;
    }
    exports.getSymbolIterator = getSymbolIterator;
    exports.iterator = getSymbolIterator();
    exports.$$iterator = exports.iterator;
  }, {} ],
  70: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.observable = "function" === typeof Symbol && Symbol.observable || "@@observable";
  }, {} ],
  71: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.rxSubscriber = "function" === typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();
    exports.$$rxSubscriber = exports.rxSubscriber;
  }, {} ],
  72: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function ArgumentOutOfRangeErrorImpl() {
      Error.call(this);
      this.message = "argument out of range";
      this.name = "ArgumentOutOfRangeError";
      return this;
    }
    ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
  }, {} ],
  73: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function EmptyErrorImpl() {
      Error.call(this);
      this.message = "no elements in sequence";
      this.name = "EmptyError";
      return this;
    }
    EmptyErrorImpl.prototype = Object.create(Error.prototype);
    exports.EmptyError = EmptyErrorImpl;
  }, {} ],
  74: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var nextHandle = 1;
    var tasksByHandle = {};
    function runIfPresent(handle) {
      var cb = tasksByHandle[handle];
      cb && cb();
    }
    exports.Immediate = {
      setImmediate: function(cb) {
        var handle = nextHandle++;
        tasksByHandle[handle] = cb;
        Promise.resolve().then(function() {
          return runIfPresent(handle);
        });
        return handle;
      },
      clearImmediate: function(handle) {
        delete tasksByHandle[handle];
      }
    };
  }, {} ],
  75: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function ObjectUnsubscribedErrorImpl() {
      Error.call(this);
      this.message = "object unsubscribed";
      this.name = "ObjectUnsubscribedError";
      return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
    exports.ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
  }, {} ],
  76: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function TimeoutErrorImpl() {
      Error.call(this);
      this.message = "Timeout has occurred";
      this.name = "TimeoutError";
      return this;
    }
    TimeoutErrorImpl.prototype = Object.create(Error.prototype);
    exports.TimeoutError = TimeoutErrorImpl;
  }, {} ],
  77: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
      return this;
    }
    UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
    exports.UnsubscriptionError = UnsubscriptionErrorImpl;
  }, {} ],
  78: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    function canReportError(observer) {
      while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) return false;
        observer = destination && destination instanceof Subscriber_1.Subscriber ? destination : null;
      }
      return true;
    }
    exports.canReportError = canReportError;
  }, {
    "../Subscriber": 15
  } ],
  79: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.errorObject = {
      e: {}
    };
  }, {} ],
  80: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function hostReportError(err) {
      setTimeout(function() {
        throw err;
      });
    }
    exports.hostReportError = hostReportError;
  }, {} ],
  81: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function identity(x) {
      return x;
    }
    exports.identity = identity;
  }, {} ],
  82: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isArray = Array.isArray || function(x) {
      return x && "number" === typeof x.length;
    };
  }, {} ],
  83: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isArrayLike = function(x) {
      return x && "number" === typeof x.length && "function" !== typeof x;
    };
  }, {} ],
  84: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function isFunction(x) {
      return "function" === typeof x;
    }
    exports.isFunction = isFunction;
  }, {} ],
  85: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var observable_1 = require("../symbol/observable");
    function isInteropObservable(input) {
      return input && "function" === typeof input[observable_1.observable];
    }
    exports.isInteropObservable = isInteropObservable;
  }, {
    "../symbol/observable": 70
  } ],
  86: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var iterator_1 = require("../symbol/iterator");
    function isIterable(input) {
      return input && "function" === typeof input[iterator_1.iterator];
    }
    exports.isIterable = isIterable;
  }, {
    "../symbol/iterator": 69
  } ],
  87: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isArray_1 = require("./isArray");
    function isNumeric(val) {
      return !isArray_1.isArray(val) && val - parseFloat(val) + 1 >= 0;
    }
    exports.isNumeric = isNumeric;
  }, {
    "./isArray": 82
  } ],
  88: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function isObject(x) {
      return null != x && "object" === typeof x;
    }
    exports.isObject = isObject;
  }, {} ],
  89: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    function isObservable(obj) {
      return !!obj && (obj instanceof Observable_1.Observable || "function" === typeof obj.lift && "function" === typeof obj.subscribe);
    }
    exports.isObservable = isObservable;
  }, {
    "../Observable": 8
  } ],
  90: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function isPromise(value) {
      return value && "function" !== typeof value.subscribe && "function" === typeof value.then;
    }
    exports.isPromise = isPromise;
  }, {} ],
  91: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function isScheduler(value) {
      return value && "function" === typeof value.schedule;
    }
    exports.isScheduler = isScheduler;
  }, {} ],
  92: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function noop() {}
    exports.noop = noop;
  }, {} ],
  93: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var noop_1 = require("./noop");
    function pipe() {
      var fns = [];
      for (var _i = 0; _i < arguments.length; _i++) fns[_i] = arguments[_i];
      return pipeFromArray(fns);
    }
    exports.pipe = pipe;
    function pipeFromArray(fns) {
      if (!fns) return noop_1.noop;
      if (1 === fns.length) return fns[0];
      return function piped(input) {
        return fns.reduce(function(prev, fn) {
          return fn(prev);
        }, input);
      };
    }
    exports.pipeFromArray = pipeFromArray;
  }, {
    "./noop": 92
  } ],
  94: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Observable_1 = require("../Observable");
    var subscribeToArray_1 = require("./subscribeToArray");
    var subscribeToPromise_1 = require("./subscribeToPromise");
    var subscribeToIterable_1 = require("./subscribeToIterable");
    var subscribeToObservable_1 = require("./subscribeToObservable");
    var isArrayLike_1 = require("./isArrayLike");
    var isPromise_1 = require("./isPromise");
    var isObject_1 = require("./isObject");
    var iterator_1 = require("../symbol/iterator");
    var observable_1 = require("../symbol/observable");
    exports.subscribeTo = function(result) {
      if (result instanceof Observable_1.Observable) return function(subscriber) {
        if (result._isScalar) {
          subscriber.next(result.value);
          subscriber.complete();
          return;
        }
        return result.subscribe(subscriber);
      };
      if (result && "function" === typeof result[observable_1.observable]) return subscribeToObservable_1.subscribeToObservable(result);
      if (isArrayLike_1.isArrayLike(result)) return subscribeToArray_1.subscribeToArray(result);
      if (isPromise_1.isPromise(result)) return subscribeToPromise_1.subscribeToPromise(result);
      if (result && "function" === typeof result[iterator_1.iterator]) return subscribeToIterable_1.subscribeToIterable(result);
      var value = isObject_1.isObject(result) ? "an invalid object" : "'" + result + "'";
      var msg = "You provided " + value + " where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.";
      throw new TypeError(msg);
    };
  }, {
    "../Observable": 8,
    "../symbol/iterator": 69,
    "../symbol/observable": 70,
    "./isArrayLike": 83,
    "./isObject": 88,
    "./isPromise": 90,
    "./subscribeToArray": 95,
    "./subscribeToIterable": 96,
    "./subscribeToObservable": 97,
    "./subscribeToPromise": 98
  } ],
  95: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.subscribeToArray = function(array) {
      return function(subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) subscriber.next(array[i]);
        subscriber.closed || subscriber.complete();
      };
    };
  }, {} ],
  96: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var iterator_1 = require("../symbol/iterator");
    exports.subscribeToIterable = function(iterable) {
      return function(subscriber) {
        var iterator = iterable[iterator_1.iterator]();
        do {
          var item = iterator.next();
          if (item.done) {
            subscriber.complete();
            break;
          }
          subscriber.next(item.value);
          if (subscriber.closed) break;
        } while (true);
        "function" === typeof iterator.return && subscriber.add(function() {
          iterator.return && iterator.return();
        });
        return subscriber;
      };
    };
  }, {
    "../symbol/iterator": 69
  } ],
  97: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var observable_1 = require("../symbol/observable");
    exports.subscribeToObservable = function(obj) {
      return function(subscriber) {
        var obs = obj[observable_1.observable]();
        if ("function" !== typeof obs.subscribe) throw new TypeError("Provided object does not correctly implement Symbol.observable");
        return obs.subscribe(subscriber);
      };
    };
  }, {
    "../symbol/observable": 70
  } ],
  98: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var hostReportError_1 = require("./hostReportError");
    exports.subscribeToPromise = function(promise) {
      return function(subscriber) {
        promise.then(function(value) {
          if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
          }
        }, function(err) {
          return subscriber.error(err);
        }).then(null, hostReportError_1.hostReportError);
        return subscriber;
      };
    };
  }, {
    "./hostReportError": 80
  } ],
  99: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var InnerSubscriber_1 = require("../InnerSubscriber");
    var subscribeTo_1 = require("./subscribeTo");
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
      void 0 === destination && (destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
      if (destination.closed) return;
      return subscribeTo_1.subscribeTo(result)(destination);
    }
    exports.subscribeToResult = subscribeToResult;
  }, {
    "../InnerSubscriber": 6,
    "./subscribeTo": 94
  } ],
  100: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Subscriber_1 = require("../Subscriber");
    var rxSubscriber_1 = require("../symbol/rxSubscriber");
    var Observer_1 = require("../Observer");
    function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) return nextOrObserver;
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) return nextOrObserver[rxSubscriber_1.rxSubscriber]();
      }
      if (!nextOrObserver && !error && !complete) return new Subscriber_1.Subscriber(Observer_1.empty);
      return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
    }
    exports.toSubscriber = toSubscriber;
  }, {
    "../Observer": 9,
    "../Subscriber": 15,
    "../symbol/rxSubscriber": 71
  } ],
  101: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var errorObject_1 = require("./errorObject");
    var tryCatchTarget;
    function tryCatcher() {
      try {
        return tryCatchTarget.apply(this, arguments);
      } catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
      }
    }
    function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
    }
    exports.tryCatch = tryCatch;
  }, {
    "./errorObject": 79
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
        while (next.data !== b) {
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
          for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
            var item = connections_1[_i];
            var add = true, openIndex = -1;
            for (var j = 0; j < open.length; j++) {
              var openItem = open[j];
              openItem.data.x === item.x && openItem.data.y === item.y && openItem.data.z === item.z && (openIndex = j);
            }
            for (var _a = 0, closed_1 = closed; _a < closed_1.length; _a++) {
              var closedItem = closed_1[_a];
              closedItem.data.x === item.x && closedItem.data.y === item.y && closedItem.data.z === item.z && (add = false);
            }
            var node = item;
            var g = next.g;
            g += Math.sqrt(Math.pow(next.data.x - node.x, 2) + Math.pow(next.data.y - node.y, 2) + Math.pow(next.data.z - node.z, 2)) * node.weight;
            var h = this.heuristic.getHeuristic(node.x, node.y, node.z, b.x, b.y, b.z);
            if (-1 === openIndex && add) open.push(new PathNode_1.PathNode(g, h, next, node)); else if (openIndex > -1 && g + h < open[openIndex].f && add) {
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
          if (n.x === x && n.y === y) return n;
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
            if (0 === x && 0 === y) continue;
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
  character_motion: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a8f03zqSNFGRYtDOtqqOGC4", "character_motion");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var role_motions_enum_1 = require("../../const/role_motions.enum");
    var CharacterMotion = function() {
      function CharacterMotion(bone) {
        this.bone = bone;
        this.armature = this.bone.armature();
      }
      Object.defineProperty(CharacterMotion.prototype, "isPlayingAnimation", {
        get: function() {
          if (!this.currnetAnimation) return false;
          return this.currnetAnimation.isPlaying;
        },
        enumerable: true,
        configurable: true
      });
      CharacterMotion.prototype.playAnimation = function(motion) {
        this.bone.animationName === motion && this.isPlayingAnimation || (this.currnetAnimation = this.bone.playAnimation(motion, -1));
      };
      CharacterMotion.prototype.stay = function() {
        this.isPlayingAnimation && 0 === this.currnetAnimation.playTimes ? this.playAnimation(role_motions_enum_1.RoleMotions.STAY) : this.isPlayingAnimation || this.playAnimation(role_motions_enum_1.RoleMotions.STAY);
      };
      CharacterMotion.prototype.walk = function(direction) {
        this.playAnimation(role_motions_enum_1.RoleMotions.WALK_LEFT);
      };
      CharacterMotion.prototype.run = function(direction) {
        this.playAnimation(role_motions_enum_1.RoleMotions.RUN_LEFT);
      };
      CharacterMotion.prototype.die = function() {
        this.playAnimation(role_motions_enum_1.RoleMotions.DEAD);
      };
      CharacterMotion.prototype.noramlAttack = function() {
        this.playAnimation(role_motions_enum_1.RoleMotions.NORMAL_ATTACK);
      };
      CharacterMotion.prototype.hit = function() {
        this.playAnimation(role_motions_enum_1.RoleMotions.HIT);
      };
      return CharacterMotion;
    }();
    exports.CharacterMotion = CharacterMotion;
    cc._RF.pop();
  }, {
    "../../const/role_motions.enum": "role_motions.enum"
  } ],
  character: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df83f4khXBJTI20RrtKqfrH", "character");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var movable_1 = require("./movable");
    var Mixin_1 = require("../../Lib/Mixin");
    var character_motion_1 = require("./character_motion");
    var property = cc._decorator.property;
    var Character = function(_super) {
      __extends(Character, _super);
      function Character() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._isMoving = false;
        _this.speed = 0;
        _this.maxSpeed = 200;
        _this.accel = 1e3;
        _this.allowAccel = true;
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
      Object.defineProperty(Character.prototype, "motions", {
        get: function() {
          this._motions || (this._motions = new character_motion_1.CharacterMotion(this.node.getComponent("dragonBones.ArmatureDisplay")));
          return this._motions;
        },
        enumerable: true,
        configurable: true
      });
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
      Character.prototype.attack = function() {
        this.motions.noramlAttack();
      };
      Character.prototype.useSkill = function(skill) {
        skill.release();
      };
      Character.prototype.useTool = function(tool) {
        tool.use();
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
        var minPosX = this.minPosX || -this.node.parent.width / 2;
        var maxPosX = this.maxPosX || this.node.parent.width / 2;
        var minPosY = this.minPosY || -this.node.parent.height / 2;
        var maxPosY = this.maxPosY || this.node.parent.height / 2;
        this.node.x > maxPosX ? this.node.x = maxPosX : this.node.x < minPosX && (this.node.x = minPosX);
        this.node.y > maxPosY ? this.node.y = maxPosY : this.node.y < minPosY && (this.node.y = minPosY);
      };
      Character.prototype.updatePostion = function(dt) {
        if (this.isMoving()) {
          this.avoidOutOfScreen();
          this.speed = this.calcSpeed(dt);
          this.node.x += this.getXSpeed() * dt;
          this.node.y += this.getYspeed() * dt;
          this.motions.walk(this.direction);
        } else this.motions.stay();
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
    Mixin_1.default(Character, [ movable_1.Movable ]);
    cc._RF.pop();
  }, {
    "../../Lib/Mixin": "Mixin",
    "./character_motion": "character_motion",
    "./movable": "movable"
  } ],
  "combat_unit.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "478c4YzbBxGj5vjzhExKF5G", "combat_unit.interface");
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
  "control.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "001c7bPNa1KLYCYlZXkDe/D", "control.interface");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  "control_able.interface": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3f459wD2HpJxLrUTzeydfSB", "control_able.interface");
    cc._RF.pop();
  }, {} ],
  control_adapter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01951hdQc1F0YrO/E6zmVNo", "control_adapter");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var environment_1 = require("../../config/environment");
    var input_devices_enum_1 = require("../../const/input_devices.enum");
    var rxjs_1 = require("rxjs");
    var keyboard_control_1 = require("./keyboard_control");
    var controller_control_1 = require("./controller_control");
    var touch_control_1 = require("./touch_control");
    exports.$controlEvent = new rxjs_1.Subject();
    var ControlAdapter = function() {
      function ControlAdapter() {}
      ControlAdapter.prototype.bindEvent = function() {
        this.controlSubject = this.control.subject;
        this.subscribe();
      };
      ControlAdapter.prototype.subscribe = function() {
        this.controlSubject.subscribe({
          next: function(v) {
            exports.$controlEvent.next(v);
          }
        });
      };
      ControlAdapter.prototype.getControl = function(inputDevice) {
        switch (inputDevice) {
         case input_devices_enum_1.InputDevices.KEYBOARD:
          return new keyboard_control_1.KeyBoardControl();

         case input_devices_enum_1.InputDevices.CONTROLLER:
          return new controller_control_1.ControllerControl();

         case input_devices_enum_1.InputDevices.TOUCH:
          return new touch_control_1.TouchControl();

         default:
          return new keyboard_control_1.KeyBoardControl();
        }
      };
      ControlAdapter.getInstance = function() {
        ControlAdapter.instance || (ControlAdapter.instance = new ControlAdapter());
        return ControlAdapter.instance;
      };
      ControlAdapter.prototype.disable = function() {
        this.controlSubject.unsubscribe();
      };
      ControlAdapter.prototype.enable = function() {
        this.subscribe();
      };
      ControlAdapter.prototype.init = function() {
        this.control = this.getControl(environment_1.Env.INPUT_DEVICE);
        this.bindEvent();
      };
      return ControlAdapter;
    }();
    exports.ControlAdapter = ControlAdapter;
    cc._RF.pop();
  }, {
    "../../config/environment": "environment",
    "../../const/input_devices.enum": "input_devices.enum",
    "./controller_control": "controller_control",
    "./keyboard_control": "keyboard_control",
    "./touch_control": "touch_control",
    rxjs: 3
  } ],
  "control_events.enum": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54ceds7r8BEKrBY5w3RoPyO", "control_events.enum");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ControlEvents;
    (function(ControlEvents) {
      ControlEvents[ControlEvents["DIRECITON_NONE"] = 0] = "DIRECITON_NONE";
      ControlEvents[ControlEvents["DIRECITON_LEFT"] = 1] = "DIRECITON_LEFT";
      ControlEvents[ControlEvents["DIRECITON_RIGHT"] = 2] = "DIRECITON_RIGHT";
      ControlEvents[ControlEvents["DIRECITON_UP"] = 3] = "DIRECITON_UP";
      ControlEvents[ControlEvents["DIRECITON_DOWN"] = 4] = "DIRECITON_DOWN";
      ControlEvents[ControlEvents["DIRECITON_LEFT_UP"] = 5] = "DIRECITON_LEFT_UP";
      ControlEvents[ControlEvents["DIRECITON_LEFT_DOWN"] = 6] = "DIRECITON_LEFT_DOWN";
      ControlEvents[ControlEvents["DIRECITON_RIGHT_UP"] = 7] = "DIRECITON_RIGHT_UP";
      ControlEvents[ControlEvents["DIRECITON_RIGHT_DOWN"] = 8] = "DIRECITON_RIGHT_DOWN";
      ControlEvents[ControlEvents["BUTTON_A"] = 9] = "BUTTON_A";
      ControlEvents[ControlEvents["BUTTON_B"] = 10] = "BUTTON_B";
      ControlEvents[ControlEvents["BUTTON_C"] = 11] = "BUTTON_C";
      ControlEvents[ControlEvents["BUTTON_D"] = 12] = "BUTTON_D";
      ControlEvents[ControlEvents["BUTTON_E"] = 13] = "BUTTON_E";
      ControlEvents[ControlEvents["BUTTON_F"] = 14] = "BUTTON_F";
    })(ControlEvents = exports.ControlEvents || (exports.ControlEvents = {}));
    cc._RF.pop();
  }, {} ],
  controller_control: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e42e3E8RShOmZSWXwZ2LUad", "controller_control");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ControllerControl = function() {
      function ControllerControl() {}
      return ControllerControl;
    }();
    exports.ControllerControl = ControllerControl;
    cc._RF.pop();
  }, {} ],
  "directions.enum": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa8a2kSo+xJap6+7vld/1e2", "directions.enum");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Directions;
    (function(Directions) {
      Directions[Directions["NONE"] = null] = "NONE";
      Directions[Directions["LEFT"] = 180] = "LEFT";
      Directions[Directions["RIGHT"] = 0] = "RIGHT";
      Directions[Directions["UP"] = 270] = "UP";
      Directions[Directions["DOWN"] = 90] = "DOWN";
      Directions[Directions["LEFT_UP"] = 225] = "LEFT_UP";
      Directions[Directions["LEFT_DOWN"] = 135] = "LEFT_DOWN";
      Directions[Directions["RIGHT_UP"] = 315] = "RIGHT_UP";
      Directions[Directions["RIGHT_DOWN"] = 45] = "RIGHT_DOWN";
    })(Directions = exports.Directions || (exports.Directions = {}));
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
    var input_devices_enum_1 = require("../const/input_devices.enum");
    exports.Env = {
      INPUT_DEVICE: input_devices_enum_1.InputDevices.KEYBOARD
    };
    cc._RF.pop();
  }, {
    "../const/input_devices.enum": "input_devices.enum"
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
    var control_adapter_1 = require("./components/control/control_adapter");
    var environment_1 = require("./config/environment");
    var input_devices_enum_1 = require("./const/input_devices.enum");
    require("reflect-metadata");
    var game = cc.game;
    var ccclass = cc._decorator.ccclass;
    environment_1.Env.INPUT_DEVICE = input_devices_enum_1.InputDevices.KEYBOARD;
    var controlAdapter = control_adapter_1.ControlAdapter.getInstance();
    controlAdapter.init();
    var GameConfig = function(_super) {
      __extends(GameConfig, _super);
      function GameConfig() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameConfig.applyConfig = function() {
        game.config.debugMode = 0;
      };
      GameConfig = __decorate([ ccclass ], GameConfig);
      return GameConfig;
    }(cc.Component);
    exports.GameConfig = GameConfig;
    GameConfig.applyConfig();
    cc._RF.pop();
  }, {
    "./components/control/control_adapter": "control_adapter",
    "./config/environment": "environment",
    "./const/input_devices.enum": "input_devices.enum",
    "reflect-metadata": 2
  } ],
  index: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f0553jo2VNJ2r9TjG+pNoq/", "index");
    cc._RF.pop();
  }, {} ],
  "input_devices.enum": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "240f6rmlGxOdKLXsFEWPPbK", "input_devices.enum");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var InputDevices;
    (function(InputDevices) {
      InputDevices[InputDevices["KEYBOARD"] = 0] = "KEYBOARD";
      InputDevices[InputDevices["TOUCH"] = 1] = "TOUCH";
      InputDevices[InputDevices["CONTROLLER"] = 2] = "CONTROLLER";
    })(InputDevices = exports.InputDevices || (exports.InputDevices = {}));
    cc._RF.pop();
  }, {} ],
  keyboard_control: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67202DKhP1PyqX+9RNXsLXw", "keyboard_control");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var rxjs_1 = require("rxjs");
    var control_events_enum_1 = require("../../const/control_events.enum");
    var ccclass = cc._decorator.ccclass;
    var KeyBoardControl = function() {
      function KeyBoardControl() {
        this.subject = new rxjs_1.Subject();
        this.pressingDirectionKeys = new Set();
        this.init();
      }
      KeyBoardControl.prototype.addDirectionKey = function(key) {
        if (this.pressingDirectionKeys.has(key)) return;
        this.pressingDirectionKeys.add(key);
        this.changeDirection();
      };
      KeyBoardControl.prototype.removeDirectionKey = function(key) {
        this.pressingDirectionKeys.delete(key);
        this.changeDirection();
      };
      KeyBoardControl.prototype.bindKeys = function() {
        var _this = this;
        var directionKeys = [ cc.macro.KEY.a, cc.macro.KEY.s, cc.macro.KEY.d, cc.macro.KEY.w ];
        var actionKeyMap = new Map([ [ cc.macro.KEY.j, control_events_enum_1.ControlEvents.BUTTON_A ], [ cc.macro.KEY.k, control_events_enum_1.ControlEvents.BUTTON_B ], [ cc.macro.KEY.l, control_events_enum_1.ControlEvents.BUTTON_C ], [ cc.macro.KEY.u, control_events_enum_1.ControlEvents.BUTTON_D ], [ cc.macro.KEY.i, control_events_enum_1.ControlEvents.BUTTON_E ], [ cc.macro.KEY.o, control_events_enum_1.ControlEvents.BUTTON_F ] ]);
        if (!cc.systemEvent) return;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(e) {
          var keyCode = e.keyCode;
          directionKeys.includes(keyCode) ? _this.addDirectionKey(keyCode) : actionKeyMap.has(keyCode) && _this.subject.next(actionKeyMap.get(keyCode));
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(e) {
          var keyCode = e.keyCode;
          directionKeys.includes(keyCode) ? _this.removeDirectionKey(keyCode) : actionKeyMap.has(keyCode);
        });
      };
      KeyBoardControl.prototype.bindEvent = function() {
        this.bindKeys();
      };
      KeyBoardControl.prototype.changeDirection = function() {
        var keys = this.pressingDirectionKeys;
        var hasLeft = keys.has(cc.macro.KEY.a);
        var hasRight = keys.has(cc.macro.KEY.d);
        var hasUp = keys.has(cc.macro.KEY.w);
        var hasDown = keys.has(cc.macro.KEY.s);
        var hasX = hasLeft || hasRight;
        var hasY = hasUp || hasDown;
        if (keys.size >= 3) {
          this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_NONE);
          return;
        }
        if (0 === keys.size) {
          this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_NONE);
          return;
        }
        if (hasUp && hasDown || hasLeft && hasRight) {
          this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_NONE);
          return;
        }
        if (hasX) if (hasY) {
          hasLeft && hasUp && this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_LEFT_UP);
          hasLeft && hasDown && this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_LEFT_DOWN);
          hasRight && hasUp && this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_RIGHT_UP);
          hasRight && hasDown && this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_RIGHT_DOWN);
        } else hasLeft ? this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_LEFT) : this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_RIGHT); else hasUp ? this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_UP) : this.subject.next(control_events_enum_1.ControlEvents.DIRECITON_DOWN);
      };
      KeyBoardControl.prototype.init = function() {
        this.bindEvent();
      };
      KeyBoardControl = __decorate([ ccclass ], KeyBoardControl);
      return KeyBoardControl;
    }();
    exports.KeyBoardControl = KeyBoardControl;
    cc._RF.pop();
  }, {
    "../../const/control_events.enum": "control_events.enum",
    rxjs: 3
  } ],
  level_1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "746eee0rdhPiI3ghuToS++h", "level_1");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ccclass = cc._decorator.ccclass;
    var Level1 = function(_super) {
      __extends(Level1, _super);
      function Level1() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Level1.prototype.onLoad = function() {
        this.init();
      };
      Level1.prototype.init = function() {};
      Level1 = __decorate([ ccclass ], Level1);
      return Level1;
    }(cc.Component);
    exports.Level1 = Level1;
    cc._RF.pop();
  }, {} ],
  level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cee83tRhXJIeI2X1k9kzLCT", "level");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Level = function(_super) {
      __extends(Level, _super);
      function Level() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return Level;
    }(cc.Component);
    exports.Level = Level;
    cc._RF.pop();
  }, {} ],
  movable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54023rRy1BLO5zcU/1PAoaQ", "movable");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
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
      Movable.prototype.isMoving = function() {
        return this._isMoving;
      };
      Movable.prototype.setIsMoving = function(v) {
        v || (this.speed = 0);
        this._isMoving = v;
      };
      Movable.prototype.moveTo = function() {};
      return Movable;
    }(cc.Component);
    exports.Movable = Movable;
    cc._RF.pop();
  }, {} ],
  mr_1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2690K7Lx1Mp4awoeNLqtei", "mr_1");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var player_1 = require("./player");
    var AStar_1 = require("../../utils/AStar/AStar");
    var EuclideanHeuristic_1 = require("../../utils/AStar/Heuristics/EuclideanHeuristic");
    var ccclass = cc._decorator.ccclass;
    var Mr1 = function(_super) {
      __extends(Mr1, _super);
      function Mr1() {
        var _this = _super.call(this) || this;
        _this.maxSpeed = 500;
        _this.accel = 1e3;
        return _this;
      }
      Mr1.prototype.onLoad = function() {
        var aStar = new AStar_1.Astar(new EuclideanHeuristic_1.EuclideanHeuristic());
        var data = [ [ 0, 3, 0, 0, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 3, 0, 3, 0, 0, 0, 3 ], [ 0, 3, 0, 3, 0, 3, 0, 3 ], [ 0, 0, 0, 3, 0, 3, 0, 0 ] ];
        aStar.load(data);
        var path = aStar.path(aStar.getNode(0, 0), aStar.getNode(7, 7));
        console.log(path);
      };
      Mr1.prototype.update = function(dt) {
        this.updatePostion(dt);
      };
      Mr1 = __decorate([ ccclass ], Mr1);
      return Mr1;
    }(player_1.Player);
    exports.Mr1 = Mr1;
    cc._RF.pop();
  }, {
    "../../utils/AStar/AStar": "AStar",
    "../../utils/AStar/Heuristics/EuclideanHeuristic": "EuclideanHeuristic",
    "./player": "player"
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
    var character_1 = require("../common/character");
    var directions_enum_1 = require("../../const/directions.enum");
    var control_adapter_1 = require("../control/control_adapter");
    var control_events_enum_1 = require("../../const/control_events.enum");
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        var _this = _super.call(this) || this;
        _this.bindControlEvent();
        return _this;
      }
      Player.prototype.controlMove = function(direction) {
        if (direction === directions_enum_1.Directions.NONE) this.setIsMoving(false); else {
          this.setIsMoving(true);
          this.direction = direction;
        }
      };
      Player.prototype.respondBtn = function(btn) {
        switch (btn) {
         case control_events_enum_1.ControlEvents.BUTTON_A:
          this.attack();
          break;

         case control_events_enum_1.ControlEvents.BUTTON_B:
          this.motions.hit();
          break;

         case control_events_enum_1.ControlEvents.BUTTON_C:
          this.motions.die();
          break;

         case control_events_enum_1.ControlEvents.BUTTON_D:
          this.attack();
          break;

         case control_events_enum_1.ControlEvents.BUTTON_E:
          this.motions.hit();
          break;

         case control_events_enum_1.ControlEvents.BUTTON_F:
          this.motions.die();
        }
      };
      Player.prototype.bindControlEvent = function() {
        var _this = this;
        var directionKeyMap = new Map([ [ control_events_enum_1.ControlEvents.DIRECITON_NONE, directions_enum_1.Directions.NONE ], [ control_events_enum_1.ControlEvents.DIRECITON_UP, directions_enum_1.Directions.UP ], [ control_events_enum_1.ControlEvents.DIRECITON_DOWN, directions_enum_1.Directions.DOWN ], [ control_events_enum_1.ControlEvents.DIRECITON_LEFT, directions_enum_1.Directions.LEFT ], [ control_events_enum_1.ControlEvents.DIRECITON_RIGHT, directions_enum_1.Directions.RIGHT ], [ control_events_enum_1.ControlEvents.DIRECITON_LEFT_UP, directions_enum_1.Directions.LEFT_UP ], [ control_events_enum_1.ControlEvents.DIRECITON_LEFT_DOWN, directions_enum_1.Directions.LEFT_DOWN ], [ control_events_enum_1.ControlEvents.DIRECITON_RIGHT_UP, directions_enum_1.Directions.RIGHT_UP ], [ control_events_enum_1.ControlEvents.DIRECITON_RIGHT_DOWN, directions_enum_1.Directions.RIGHT_DOWN ] ]);
        control_adapter_1.$controlEvent.subscribe({
          next: function(controlEvent) {
            if (directionKeyMap.has(controlEvent)) {
              _this.controlMove(directionKeyMap.get(controlEvent));
              return;
            }
            _this.respondBtn(controlEvent);
          }
        });
      };
      return Player;
    }(character_1.Character);
    exports.Player = Player;
    cc._RF.pop();
  }, {
    "../../const/control_events.enum": "control_events.enum",
    "../../const/directions.enum": "directions.enum",
    "../common/character": "character",
    "../control/control_adapter": "control_adapter"
  } ],
  "role_motions.enum": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30822/HTYhF8Kr3LgOtH7Kg", "role_motions.enum");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var RoleMotions;
    (function(RoleMotions) {
      RoleMotions["WALK_LEFT"] = "run";
      RoleMotions["WALK_RIGHT"] = "run";
      RoleMotions["WALK_UP"] = "run";
      RoleMotions["WALK_DOWN"] = "run";
      RoleMotions["RUN_LEFT"] = "run";
      RoleMotions["RUN_RIGHT"] = "run";
      RoleMotions["RUN_UP"] = "run";
      RoleMotions["RUN_DOWN"] = "run";
      RoleMotions["DEAD"] = "dead";
      RoleMotions["HIT"] = "hit";
      RoleMotions["NORMAL_ATTACK"] = "normalAttack";
      RoleMotions["STAY"] = "steady";
    })(RoleMotions = exports.RoleMotions || (exports.RoleMotions = {}));
    cc._RF.pop();
  }, {} ],
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
  touch_control: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f7c1KMicpLu6hxe0/YGPxp", "touch_control");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TouchControl = function() {
      function TouchControl() {}
      return TouchControl;
    }();
    exports.TouchControl = TouchControl;
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
}, {}, [ "character", "character_motion", "combat_unit.interface", "control_able.interface", "entity.interface", "movable", "control.interface", "control_adapter", "controller_control", "keyboard_control", "touch_control", "enemy", "equipment", "npc", "mr_1", "player", "skill", "tool", "weapon", "config", "environment", "control_events.enum", "directions.enum", "index", "input_devices.enum", "role_motions.enum", "game", "level", "level_1", "Mixin", "AStar", "Graph", "GraphNode", "DijkstrasHeuristic", "EuclideanHeuristic", "Heuristic", "ManhattenHeuristic", "PathNode" ]);