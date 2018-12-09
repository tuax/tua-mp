function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/**
 * 取出并合并常用的 detail 和 dataset 上的值
 * 方便业务代码获取需要的数据
 * @param {Object} detail 自定义事件所携带的数据
 * @param {Object} currentTarget 当前组件的一些属性值集合
 */
var getValFromEvent = function getValFromEvent(_ref) {
  var detail = _ref.detail,
      _ref$currentTarget = _ref.currentTarget,
      currentTarget = _ref$currentTarget === void 0 ? {} : _ref$currentTarget;
  return _objectSpread({}, detail, currentTarget.dataset);
};
/**
 * 封装小程序原生的 triggerEvent 方法，
 * @param {String} eventName 自定义事件名称
 * @param {Event} event 小程序原生事件
 * @param {Object} options 小程序原生触发事件的选项
 */

var $emit = function $emit(eventName) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 ? arguments[2] : undefined;
  this.triggerEvent(eventName, getValFromEvent(event), options);
};

// 小程序内部属性的判断正则
var innerAttrRe = /^__.*__$/; // Vue 还多支持了 Function 和 Symbol 类型

var TYPES = [String, Number, Boolean, Object, Array, null];
var COMMON_PROP = {
  enumerable: true,
  configurable: true
};
var _toString = Object.prototype.toString; // 每个对象上挂载自己路径前缀的 key

var __TUA_PATH__ = '__TUA_PATH__'; // 每个对象上挂载自己的依赖对象

var __dep__ = '__dep__'; // 被框架占用的关键字，在 data 和 computed 中如果使用这些关键字，将会抛出错误

var reservedKeys = ['$data', '$emit', '$computed', __TUA_PATH__];

/**
 * 统一的日志输出函数，在测试环境时不输出
 * @param {String} type 输出类型 log|warn|error
 * @param {any} out 具体的输出内容
 */
var logByType = function logByType(type) {
  return function () {
    var _console;
    /* istanbul ignore next */

    for (var _len = arguments.length, out = new Array(_len), _key = 0; _key < _len; _key++) {
      out[_key] = arguments[_key];
    }

    (_console = console)[type].apply(_console, ["[TUA-API]:"].concat(out));
  };
};

var logger = {
  log: logByType('log'),
  warn: logByType('warn'),
  error: logByType('error')
};

var isFn = function isFn(fn) {
  return typeof fn === 'function';
};
var hasProtoInObj = function hasProtoInObj(obj) {
  return '__proto__' in obj;
};
var isNotInnerAttr = function isNotInnerAttr(key) {
  return !innerAttrRe.test(key);
};
var toRawType = function toRawType(value) {
  return _toString.call(value).slice(8, -1);
};
var isPlainObject = function isPlainObject(value) {
  return _toString.call(value) === '[object Object]';
}; // 根据路径前缀和 key 得到当前路径

var getPathByPrefix = function getPathByPrefix(prefix, key) {
  return prefix === '' ? key : "".concat(prefix, ".").concat(key);
};
var jsonParse = JSON.parse.bind(JSON);
var stringify = JSON.stringify.bind(JSON);
/**
 * 将 source 上的属性代理到 target 上
 * @param {Object} source 被代理对象
 * @param {Object} target 被代理目标
 */

var proxyData = function proxyData(source, target) {
  Object.keys(source).forEach(function (key) {
    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
  });
};
/**
 * 将对象属性路径字符串转换成路径数组
 * @param {String} str
 * @returns {Array}
 */

var pathStr2Arr = function pathStr2Arr(str) {
  return str.split('.').map(function (x) {
    return x.split(/\[(.*?)\]/).filter(function (x) {
      return x;
    });
  }).reduce(function (acc, cur) {
    return acc.concat(cur);
  }, []);
};
/**
 * 根据 path 获取目标对象 obj 上的值
 * @param {Object} obj 目标对象
 * @param {String} path 路径字符串
 * @returns {Any} obj
 */

var getValByPath = function getValByPath(obj) {
  return function (path) {
    return pathStr2Arr(path).reduce(function (acc, cur) {
      return acc[cur];
    }, obj);
  };
};
/**
 * 根据 path 将目标值 val 设置到目标对象 obj 上
 * @param {Object} obj 目标对象
 * @param {String} path 路径字符串
 * @param {any} val 目标值
 * @param {Boolean} isCheckDef 是否检查属性已定义
 */

var setObjByPath = function setObjByPath(_ref) {
  var obj = _ref.obj,
      path = _ref.path,
      val = _ref.val,
      _ref$isCheckDef = _ref.isCheckDef,
      isCheckDef = _ref$isCheckDef === void 0 ? false : _ref$isCheckDef;
  return pathStr2Arr(path).reduce(function (acc, cur, idx, arr) {
    // 在调用 setData 时，有的属性可能没定义
    if (isCheckDef && acc[cur] === undefined) {
      var parentStr = arr.slice(0, idx).reduce(function (acc, cur) {
        return /\d/.test(cur) ? "".concat(acc, "[").concat(cur, "]") : "".concat(acc, ".").concat(cur);
      }, 'this');
      logger.error("Property \"".concat(cur, "\" is not found in \"").concat(parentStr, "\": ") + "Make sure that this property has initialized in the data option.");
    }

    if (idx === arr.length - 1) {
      acc[cur] = val;
      return;
    } // 当前中间属性在目标对象上并不存在


    if (!acc[cur]) {
      acc[cur] = /\d/.test(cur) ? [] : {};
    }

    return acc[cur];
  }, obj);
};
/**
 * 使用函数的名称字符串来检查内置的类型
 * 因为简单的相等检查，在不同的 vms 或 iframes 中运行时会判断错误
 */

var getType = function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
};
/**
 * 断言值的类型是否匹配
 * @param {any} value 值
 * @param {Function} type 类型函数
 */

var assertType = function assertType(value, type) {
  var valid;
  var expectedType = getType(type);

  if (/(String|Number|Boolean)/.test(expectedType)) {
    var t = _typeof(value);

    valid = t === expectedType.toLowerCase(); // 例如 new Number(1)

    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }

  return {
    valid: valid,
    expectedType: expectedType
  };
}; // reserved keys

var isReservedKeys = function isReservedKeys(str) {
  return reservedKeys.indexOf(str) !== -1;
};

var getObjHasReservedKeys = function getObjHasReservedKeys(obj) {
  return Object.keys(obj).filter(isReservedKeys);
}; // 检查在 data、computed、methods 中是否使用了保留字


var checkReservedKeys = function checkReservedKeys(data, computed, methods) {
  var reservedKeysInVm = getObjHasReservedKeys(data).concat(getObjHasReservedKeys(computed)).concat(getObjHasReservedKeys(methods)).join(', ');

  if (reservedKeysInVm) {
    throw Error("\u8BF7\u52FF\u5728 data\u3001computed\u3001methods " + "\u4E2D\u4F7F\u7528\u4E0B\u5217\u4FDD\u7559\u5B57:\n ".concat(reservedKeysInVm));
  }
};
/**
 * 在对象上定义属性
 * @param {String} key 属性名
 * @param {any} value 值
 * @param {Object} target 对象
 */

var def = function def(key) {
  return function (_ref2) {
    var value = _ref2.value,
        _ref2$enumerable = _ref2.enumerable,
        enumerable = _ref2$enumerable === void 0 ? false : _ref2$enumerable,
        _ref2$configurable = _ref2.configurable,
        configurable = _ref2$configurable === void 0 ? true : _ref2$configurable,
        rest = _objectWithoutProperties(_ref2, ["value", "enumerable", "configurable"]);

    return function (target) {
      Object.defineProperty(target, key, _objectSpread({
        value: value,
        enumerable: enumerable,
        configurable: configurable
      }, rest));
    };
  };
};
var defDep = def(__dep__);
var defTuaPath = def(__TUA_PATH__);

/**
 * 断言 prop 的值是否有效
 * ps 小程序就没有 required 的概念
 * @param {Object} prop 定义
 * @param {Array|Function|null} prop.type 定义类型
 * @param {String} name 属性名称
 * @param {any} value 实际值
 * @return {Boolean} 是否有效
 */

var assertProp = function assertProp(_ref) {
  var prop = _ref.prop,
      name = _ref.name,
      value = _ref.value;
  if (value == null) return true;
  var expectedTypes = [];
  var type = prop.type;
  var valid = !type;

  if (type) {
    var typeList = !Array.isArray(type) ? [type] : type;
    typeList.forEach(function (type) {
      var _assertType = assertType(value, type),
          newValid = _assertType.valid,
          expectedType = _assertType.expectedType;

      expectedTypes.push(expectedType);
      valid = newValid;
    });
  }

  if (!valid) {
    logger.warn("Invalid prop: type check failed for prop \"".concat(name, "\".") + " Expected ".concat(expectedTypes.join(', ')) + ", got ".concat(toRawType(value), "."));
  }

  return valid;
};
/**
 * 生成组件的 observer 函数
 * @param {String} name 名称
 * @param {Object} prop 类型定义对象（透传给 assertProp）
 * @param {Array|Function|null} prop.type 定义类型
 */

var getObserver = function getObserver(name) {
  return function (prop) {
    return function observer(value) {
      // 触发 setter
      this[name] = value;
      var valid = assertProp({
        prop: prop,
        name: name,
        value: value
      });
      var validator = prop.validator;

      if (validator && !validator(value)) {
        logger.warn("Invalid prop: custom validator check failed for prop \"".concat(name, "\"."));
        return false;
      }

      return valid;
    };
  };
};
/**
 * 生成完整单个 prop 对象
 * @param {String} name 名称
 * @param {String|Number|Boolean|Object|Array|null} type 类型
 * @param {any} value 值
 * @param {Object} propObj 类型定义对象（透传给 assertProp）
 * @param {Array|Function|null} propObj.type 定义类型
 */

var getPropObj = function getPropObj(_ref2) {
  var name = _ref2.name,
      type = _ref2.type,
      value = _ref2.value,
      propObj = _ref2.propObj;
  return _defineProperty({}, name, {
    type: type,
    value: value,
    observer: getObserver(name)(propObj)
  });
};
/**
 * 将 Vue 风格的 props 改写成小程序原生的 properties
 * @param {Array|Object} props
 */

var getPropertiesFromProps = function getPropertiesFromProps(props) {
  // 输入数组则转译成接受任意数据类型的 null
  if (Array.isArray(props)) {
    return props.map(function (name) {
      return getPropObj({
        name: name,
        type: null,
        propObj: {
          type: null
        }
      });
    }).reduce(function (acc, cur) {
      return _objectSpread({}, acc, cur);
    }, {});
  }

  return Object.keys(props).map(function (name) {
    var prop = props[name]; // 基本类型的直接返回

    if (TYPES.indexOf(prop) !== -1) {
      return getPropObj({
        name: name,
        type: prop,
        propObj: {
          type: prop
        }
      });
    } // 数组形式的 prop
    // 测试了下不支持直接简写或 type 是数组，只能手动检查了


    if (Array.isArray(prop)) {
      return getPropObj({
        name: name,
        type: null,
        propObj: {
          type: prop
        }
      });
    } // 对象形式的 prop


    return getPropObj({
      name: name,
      type: prop.type || null,
      value: isFn(prop.default) ? prop.default() : prop.default,
      propObj: prop
    });
  }).reduce(function (acc, cur) {
    return _objectSpread({}, acc, cur);
  }, {});
};

var hackSetData = function hackSetData(vm) {
  var originalSetData = vm.setData;
  Object.defineProperties(vm, {
    'setData': {
      get: function get() {
        return function (newVal, cb) {
          Object.keys(newVal).forEach(function (path) {
            // 针对 vm 上的属性赋值
            setObjByPath({
              obj: vm,
              path: path,
              val: newVal[path],
              isCheckDef: true
            }); // 针对 vm.data 上的属性赋值

            setObjByPath({
              obj: vm.data,
              path: path,
              val: newVal[path]
            });
          });
          isFn(cb) && Promise.resolve().then(cb);
        };
      }
    },
    '__setData__': {
      get: function get() {
        return originalSetData;
      }
    }
  });
};

var version = "0.8.2";

/**
 * 根据 vm 生成 key
 * @param {String} __wxWebviewId__ webview 的 id
 * @param {String} __wxExparserNodeId__ 组件的 id
 */

var getKeyFromVM = function getKeyFromVM(_ref) {
  var wId = _ref.__wxWebviewId__,
      _ref$__wxExparserNode = _ref.__wxExparserNodeId__,
      nId = _ref$__wxExparserNode === void 0 ? 'wxExparserNodeId' : _ref$__wxExparserNode;
  return "".concat(wId, "_").concat(nId);
};
/**
 * 判断 deep watch 的 key 是否是当前变化值的 key 的前缀
 * @param {String} key 当前变化值的 key
 * @param {String} dKey deep watch 的 key
 * @return {Boolean} 是不是前缀
 */


var isDeepWatchMatched = function isDeepWatchMatched(key) {
  return function (dKey) {
    return new RegExp('^' + dKey + '(\\.|\\[)').test(key);
  };
};

var getWatchFnArrByVm = function getWatchFnArrByVm(vm) {
  return function (watchObj) {
    return isFn(watchObj) // 直接写的函数，或是数组
    ? watchObj : watchObj && watchObj.handler ? isFn(watchObj.handler) // 函数写在 handler 中
    ? watchObj.handler // handler 是字符串
    : vm[watchObj.handler] // 直接写的字符串
    : vm[watchObj];
  };
};
/**
 * 这个类负责管理 vm 的状态，在更新数据时保存状态，
 * 然后异步地进行更新，并且触发相关 watch 函数
 */


var VmStatus =
/*#__PURE__*/
function () {
  function VmStatus() {
    _classCallCheck(this, VmStatus);

    // 根据 key 保存 vm
    this.VM_MAP = Object.create(null); // 缓存各个 vm 下一个状态的数据

    this.newStateByVM = Object.create(null); // 缓存各个 vm 传给 asyncSetData 的 oldVal 值
    // 以便在触发 watch 时获取

    this.oldStateByVM = Object.create(null);
  }
  /**
   * 更新状态
   * @param {Page|Component} vm Page 或 Component 实例
   * @param {Object} watch 侦听器对象
   * @param {Object} deepWatch 深度侦听器对象
   * @param {String} path 属性的路径
   * @param {any} newVal 新值
   * @param {any} oldVal 旧值
   */


  _createClass(VmStatus, [{
    key: "updateState",
    value: function updateState(_ref2) {
      var vm = _ref2.vm,
          watch = _ref2.watch,
          deepWatch = _ref2.deepWatch,
          path = _ref2.path,
          newVal = _ref2.newVal,
          oldVal = _ref2.oldVal;
      var key = getKeyFromVM(vm);
      this.newStateByVM = _objectSpread({}, this.newStateByVM, _defineProperty({}, key, _objectSpread({}, this.newStateByVM[key], _defineProperty({}, path, newVal))));
      this.oldStateByVM = _objectSpread({}, this.oldStateByVM, _defineProperty({}, key, _objectSpread(_defineProperty({}, path, oldVal), this.oldStateByVM[key]))); // 缓存 vm 和 watch

      if (!this.VM_MAP[key]) {
        this.VM_MAP[key] = {
          vm: vm,
          watch: watch,
          deepWatch: deepWatch
        };
      }
    }
    /**
     * 刷新状态，调用 vm.setData 向小程序提交数据
     * 并触发相关 watch
     */

  }, {
    key: "flushState",
    value: function flushState() {
      var _this = this;

      var vmKeys = Object.keys(this.newStateByVM);
      var newStateByVM = this.newStateByVM;
      var oldStateByVM = this.oldStateByVM;
      this.newStateByVM = Object.create(null);
      this.oldStateByVM = Object.create(null);
      vmKeys.filter(function (vmKey) {
        return _this.VM_MAP[vmKey];
      }).forEach(function (vmKey) {
        var _this$VM_MAP$vmKey = _this.VM_MAP[vmKey],
            vm = _this$VM_MAP$vmKey.vm,
            watch = _this$VM_MAP$vmKey.watch,
            deepWatch = _this$VM_MAP$vmKey.deepWatch;
        var newState = newStateByVM[vmKey];
        var oldState = oldStateByVM[vmKey];
        var getWatchFnArr = getWatchFnArrByVm(vm);
        var setData = vm.__setData__ ? vm.__setData__ : vm.setData;
        vm.beforeUpdate && vm.beforeUpdate(); // 更新数据

        vm.updated ? setData.call(vm, newState, vm.updated) : setData.call(vm, newState); // 干掉原生 setData 触发的 setter，不然会死循环

        delete _this.newStateByVM[vmKey];
        delete _this.oldStateByVM[vmKey]; // 触发 watch

        Object.keys(newState).map(function (key) {
          var newVal = newState[key];
          var oldVal = oldState[key];
          var watchFnArr = watch[key] && watch[key].map(getWatchFnArr);
          return {
            key: key,
            newVal: newVal,
            oldVal: oldVal,
            watchFnArr: watchFnArr
          };
        }).forEach(function (_ref3) {
          var key = _ref3.key,
              newVal = _ref3.newVal,
              oldVal = _ref3.oldVal,
              watchFnArr = _ref3.watchFnArr;

          // 触发自身的 watch
          if (watchFnArr) {
            watchFnArr.forEach(function (fn) {
              return fn.call(vm, newVal, oldVal);
            });
          } // deep watch


          Object.keys(deepWatch).filter(isDeepWatchMatched(key)).forEach(function (dKey) {
            var deepVal = getValByPath(vm)(dKey);
            deepWatch[dKey].map(getWatchFnArr) // 新旧值相同
            .forEach(function (fn) {
              return fn.call(vm, deepVal, deepVal);
            });
          });
        });
      });
    }
  }, {
    key: "deleteVm",
    value: function deleteVm(vm) {
      var _this2 = this;

      var key = getKeyFromVM(vm); // 异步删除，不然可能造成 flushState 时没有该对象

      Promise.resolve().then(function () {
        delete _this2.VM_MAP[key];
      });
    }
  }]);

  return VmStatus;
}();

var vmStatus = new VmStatus();
/**
 * 异步 setData 提高性能
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watchObj 侦听器对象
 * @param {String} path 属性的路径
 * @param {any} newVal 新值
 * @param {any} oldVal 旧值
 * @param {Boolean} isArrDirty 数组下标发生变化
 */

var getAsyncSetData = function getAsyncSetData(vm, watchObj) {
  return function (_ref) {
    var path = _ref.path,
        newVal = _ref.newVal,
        oldVal = _ref.oldVal,
        _ref$isArrDirty = _ref.isArrDirty,
        isArrDirty = _ref$isArrDirty === void 0 ? false : _ref$isArrDirty;
    // 统一转成数组
    var watch = Object.keys(watchObj).map(function (key) {
      return Array.isArray(watchObj[key]) ? _defineProperty({}, key, watchObj[key]) : _defineProperty({}, key, [watchObj[key]]);
    }).reduce(function (acc, cur) {
      return _objectSpread({}, acc, cur);
    }, {});
    var deepWatch = Object.keys(watch).filter(function (key) {
      return watch[key].some(function (w) {
        return w.deep;
      });
    }).map(function (key) {
      return _defineProperty({}, key, watch[key].filter(function (w) {
        return w.deep;
      }));
    }).reduce(function (acc, cur) {
      return _objectSpread({}, acc, cur);
    }, {});
    vmStatus.updateState({
      vm: vm,
      watch: watch,
      deepWatch: deepWatch,
      path: path,
      newVal: newVal,
      oldVal: oldVal
    }); // 数组下标发生变化，同步修改数组

    if (isArrDirty) {
      setObjByPath({
        obj: vm,
        val: newVal,
        path: path
      });
    }

    Promise.resolve().then(vmStatus.flushState.bind(vmStatus));
  };
};
/**
 * 在页面 onUnload 或组件 detached 后，
 * 将 vm 从 VM_MAP 中删除
 */

var deleteVm = vmStatus.deleteVm.bind(vmStatus);

var arrayProto = Array.prototype;
var methodsToPatch = ['pop', 'push', 'sort', 'shift', 'splice', 'unshift', 'reverse'];
/**
 * 改写数组原始的可变方法
 * @param {function} observeDeep 递归观察函数
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 */

var getArrayMethods = function getArrayMethods(_ref) {
  var observeDeep = _ref.observeDeep,
      asyncSetData = _ref.asyncSetData;
  var arrayMethods = Object.create(arrayProto);
  methodsToPatch.forEach(function (method) {
    var original = arrayProto[method];

    arrayMethods[method] = function () {
      var oldVal = this;
      var path = this[__TUA_PATH__];

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = original.apply(this, args);

      if (method === 'pop') {
        asyncSetData({
          path: path,
          newVal: this,
          oldVal: oldVal
        });
      } else {
        var newVal = observeDeep(this, path);
        asyncSetData({
          path: path,
          newVal: newVal,
          oldVal: oldVal,
          isArrDirty: true
        });
        oldVal = newVal;
      }

      return result;
    };
  });
  return arrayMethods;
};
/**
 * 劫持数组的可变方法
 * @param {Array} arr 原始数组
 * @param {function} arrayMethods 改写后的可变方法
 * @return {Array} 被劫持方法后的数组
 */

var patchMethods2Array = function patchMethods2Array(_ref2) {
  var arr = _ref2.arr,
      arrayMethods = _ref2.arrayMethods;

  // 优先挂原型链上，否则劫持原方法
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(arr, arrayMethods);
  } else if (hasProtoInObj(arr)) {
    /* eslint-disable no-proto */
    arr.__proto__ = arrayMethods;
    /* eslint-enable no-proto */
  } else {
    proxyData(arrayMethods, arr);
  }

  return arr;
};

var Dep =
/*#__PURE__*/
function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.subs = [];
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      if (this.subs.indexOf(sub) > -1) return;
      this.subs.push(sub);
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subs.forEach(function (sub) {
        return sub();
      });
    }
  }]);

  return Dep;
}();
Dep.targetCb = null;

var addSubDeep = function addSubDeep(_ref) {
  var obj = _ref.obj,
      targetCb = _ref.targetCb;

  if (Array.isArray(obj)) {
    obj.map(function (item) {
      item[__dep__] && item[__dep__].addSub(targetCb);
      return item;
    }).map(function (obj) {
      return {
        obj: obj,
        targetCb: targetCb
      };
    }).forEach(addSubDeep);
    return;
  }

  if (_typeof(obj) === 'object') {
    Object.keys(obj).map(function (key) {
      var item = obj[key];
      item[__dep__] && item[__dep__].addSub(targetCb);
      return key;
    }).map(function (key) {
      return {
        obj: obj[key],
        targetCb: targetCb
      };
    }).forEach(addSubDeep);
  }
};
/**
 * 观察 obj[key]，当触发 setter 时调用 asyncSetData 更新数据
 * @param {Object} obj 被观察对象
 * @param {String} key 被观察对象的属性
 * @param {any} val 被观察对象的属性的值
 * @param {function} observeDeep 递归观察函数
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 */


var defineReactive = function defineReactive(_ref2) {
  var obj = _ref2.obj,
      key = _ref2.key,
      val = _ref2.val,
      observeDeep = _ref2.observeDeep,
      asyncSetData = _ref2.asyncSetData;
  var dep = obj[__dep__] || new Dep();
  defDep({
    value: dep
  })(obj);
  Object.defineProperty(obj, key, _objectSpread({}, COMMON_PROP, {
    get: function get() {
      // 正在依赖收集
      if (Dep.targetCb) {
        // 当前属性被依赖
        dep.addSub(Dep.targetCb); // 同时子属性也被依赖

        if (Array.isArray(val)) {
          val.map(function (obj) {
            return {
              obj: obj,
              targetCb: Dep.targetCb
            };
          }).forEach(addSubDeep);
          val[__dep__] = dep;
        }
      }

      return val;
    },
    set: function set(newVal) {
      var oldVal = val;
      var prefix = obj[__TUA_PATH__] || '';
      var path = getPathByPrefix(prefix, key);
      var isNeedInheritDep = newVal && oldVal && oldVal[__dep__] && _typeof(newVal) === 'object' && !newVal[__dep__]; // 继承依赖

      if (isNeedInheritDep) {
        defDep({
          value: oldVal[__dep__]
        })(newVal);
      } // 重新观察


      val = observeDeep(newVal, path);
      asyncSetData({
        path: path,
        newVal: newVal,
        oldVal: oldVal
      }); // 触发依赖回调

      dep.notify();
    }
  }));
};
/**
 * 得到递归观察对象
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 * @return {function} observeDeep 递归观察函数
 */

var getObserveDeep = function getObserveDeep(asyncSetData) {
  /**
   * 递归观察函数
   * @param {Object} obj 待观察对象
   * @param {String} prefix 路径前缀
   * @return {Object} 被观察后的对象
   */
  return function observeDeep(obj) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (Array.isArray(obj)) {
      var arr = obj.map(function (item, idx) {
        var isNeedInheritDep = item && _typeof(item) === 'object' && !item[__dep__] && obj[__dep__]; // 继承依赖


        if (isNeedInheritDep) {
          item[__dep__] = obj[__dep__];
        }

        return observeDeep(item, "".concat(prefix, "[").concat(idx, "]"));
      }); // 继承依赖

      arr[__dep__] = obj[__dep__]; // 每个数组挂载自己的路径

      arr[__TUA_PATH__] = prefix; // 不缓存数组可变方法，因为 vm 可能不同

      var arrayMethods = getArrayMethods({
        observeDeep: observeDeep,
        asyncSetData: asyncSetData
      });
      return patchMethods2Array({
        arr: arr,
        arrayMethods: arrayMethods
      });
    }

    if (obj !== null && _typeof(obj) === 'object') {
      // 将路径前缀挂在父节点上
      defTuaPath({
        value: prefix
      })(obj);
      Object.keys(obj) // 过滤 __wxWebviewId__ 等内部属性
      .filter(isNotInnerAttr).map(function (key) {
        var item = obj[key];

        var isNeedInheritDep = item && _typeof(item) === 'object' && !item[__dep__] && obj[__dep__]; // 继承依赖


        if (isNeedInheritDep) {
          defDep({
            value: obj[__dep__]
          })(item);
        }

        return key;
      }).map(function (key) {
        return {
          obj: obj,
          key: key,
          val: observeDeep(obj[key], getPathByPrefix(prefix, key)),
          observeDeep: observeDeep,
          asyncSetData: asyncSetData
        };
      }).forEach(defineReactive);
      return obj;
    } // 其他属性直接返回


    return obj;
  };
};

/**
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} data 传入的默认值对象
 * @param {function} observeDeep 递归观察函数
 */

var bindData = function bindData(vm, data, observeDeep) {
  var $data = observeDeep(data);
  vm.$data = $data; // 代理 $data 到 vm 上

  proxyData($data, vm);
};
/**
 * 遍历观察 computed，绑定 watch 回调并将定义的新属性挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} computed 计算属性对象
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 */

var bindComputed = function bindComputed(vm, computed, asyncSetData) {
  var $computed = Object.create(null);
  Object.keys(computed).forEach(function (key) {
    var dep = new Dep();
    var getVal = typeof computed[key] === 'function' ? computed[key].bind(vm) : computed[key].get.bind(vm);
    var oldVal;
    var oldValStr;
    var isInit = true;
    Object.defineProperty($computed, key, _objectSpread({}, COMMON_PROP, {
      get: function get() {
        // 正在依赖收集
        if (Dep.targetCb) {
          // 当前属性被依赖
          dep.addSub(Dep.targetCb);
        }

        if (!isInit) return oldVal; // 开始依赖收集

        Dep.targetCb = function () {
          var newVal = getVal(vm);
          var newValStr = JSON.stringify(newVal);
          if (newValStr === oldValStr) return;
          asyncSetData({
            path: key,
            newVal: newVal,
            oldVal: oldVal
          }); // 重置 oldVal

          oldVal = newVal;
          oldValStr = newValStr;
          dep.notify();
        };

        Dep.targetCb.key = key; // 重置 oldVal

        oldVal = getVal(vm);
        oldValStr = JSON.stringify(oldVal); // 依赖收集完毕

        Dep.targetCb = null;
        isInit = false;
        return oldVal;
      },
      set: function set() {
        if (typeof computed[key].set === 'undefined') {
          logger.warn("Computed property \"".concat(key, "\" was assigned to but it has no setter."));
        } else {
          var setVal = computed[key].set.bind(vm);
          setVal.apply(void 0, arguments);
        }
      }
    }));
  }); // 挂在 vm 上，在 data 变化时重新 setData

  vm.$computed = $computed; // 代理 $computed 到 vm 上

  proxyData($computed, vm); // 初始化 computed 的数据

  vm.setData($computed);
};
/**
 * 初始化时触发 immediate 的 watch
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watch 侦听器对象
 */

var triggerImmediateWatch = function triggerImmediateWatch(vm, watch) {
  return Object.keys(watch).forEach(function (key) {
    var initialVal = getValByPath(vm)(key);

    if (Array.isArray(watch[key])) {
      watch[key].filter(function (w) {
        return w.immediate;
      }).forEach(function (_ref) {
        var handler = _ref.handler;
        var watchFn = isFn(handler) ? handler : vm[handler];
        watchFn.call(vm, initialVal);
      });
      return;
    }

    if (!watch[key].immediate) return;
    var watchFn = isFn(watch[key].handler) ? watch[key].handler : vm[watch[key].handler];
    watchFn.call(vm, initialVal);
  });
};

/**
 * 适配 Vue 风格代码，生成小程序原生组件
 * @param {Object|Function} data 组件的内部数据
 * @param {Object|Function|Null} props 组件的对外属性
 * @param {Object} watch 侦听器对象
 * @param {Object} methods 组件的方法，包括事件响应函数和任意的自定义方法
 * @param {Object} computed 计算属性
 * @param {Object|Function|Null} properties 小程序原生的组件的对外属性
 */

var TuaComp = function TuaComp(_ref) {
  var _ref$data = _ref.data,
      rawData = _ref$data === void 0 ? {} : _ref$data,
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$methods = _ref.methods,
      methods = _ref$methods === void 0 ? {} : _ref$methods,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? {} : _ref$properties,
      rest = _objectWithoutProperties(_ref, ["data", "props", "watch", "methods", "computed", "properties"]);

  return Component(_objectSpread({}, rest, {
    methods: _objectSpread({}, methods, {
      $emit: $emit
    }),
    properties: _objectSpread({}, properties, getPropertiesFromProps(props)),
    created: function created() {
      for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      rest.beforeCreate && rest.beforeCreate.apply(this, options);
      rest.created && rest.created.apply(this, options);
    },
    attached: function attached() {
      for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
      }

      rest.beforeMount && rest.beforeMount.apply(this, options);
      var data = isFn(rawData) ? rawData() : rawData;
      var asyncSetData = getAsyncSetData(this, watch);
      var observeDeep = getObserveDeep(asyncSetData); // 检查是否使用了保留字

      checkReservedKeys(data, computed, methods); // 初始化数据

      this.setData(data); // 遍历递归观察 data

      bindData(this, _objectSpread({}, this.data, data), observeDeep); // 遍历观察 computed

      bindComputed(this, computed, asyncSetData); // 触发 immediate watch

      triggerImmediateWatch(this, watch); // hack 原生 setData

      hackSetData(this);
      rest.attached && rest.attached.apply(this, options);
    },
    ready: function ready() {
      for (var _len3 = arguments.length, options = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        options[_key3] = arguments[_key3];
      }

      rest.ready && rest.ready.apply(this, options);
      rest.mounted && rest.mounted.apply(this, options);
    },
    detached: function detached() {
      for (var _len4 = arguments.length, options = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        options[_key4] = arguments[_key4];
      }

      rest.beforeDestroy && rest.beforeDestroy.apply(this, options); // 从 VM_MAP 中删除自己

      deleteVm(this);
      rest.detached && rest.detached.apply(this, options);
      rest.destroyed && rest.destroyed.apply(this, options);
    }
  }));
};

/**
 * 适配 Vue 风格代码，生成小程序页面
 * @param {Object|Function} data 页面组件的内部数据
 * @param {Object} watch 侦听器对象
 * @param {Object} methods 页面组件的方法，包括事件响应函数和任意的自定义方法
 * @param {Object} computed 计算属性
 */

var TuaPage = function TuaPage(_ref) {
  var _ref$data = _ref.data,
      rawData = _ref$data === void 0 ? {} : _ref$data,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$methods = _ref.methods,
      methods = _ref$methods === void 0 ? {} : _ref$methods,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      rest = _objectWithoutProperties(_ref, ["data", "watch", "methods", "computed"]);

  return Page(_objectSpread({}, rest, methods, {
    onLoad: function onLoad() {
      for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      rest.beforeCreate && rest.beforeCreate.apply(this, options);
      var data = isFn(rawData) ? rawData() : rawData;
      var asyncSetData = getAsyncSetData(this, watch);
      var observeDeep = getObserveDeep(asyncSetData); // 检查是否使用了保留字

      checkReservedKeys(data, computed, methods); // 初始化数据

      this.setData(data); // 遍历递归观察 data

      bindData(this, data, observeDeep); // 遍历观察 computed

      bindComputed(this, computed, asyncSetData); // 触发 immediate watch

      triggerImmediateWatch(this, watch); // hack 原生 setData

      hackSetData(this);
      rest.onLoad && rest.onLoad.apply(this, options);
      rest.created && rest.created.apply(this, options);
    },
    onReady: function onReady() {
      for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
      }

      rest.beforeMount && rest.beforeMount.apply(this, options);
      rest.onReady && rest.onReady.apply(this, options);
      rest.mounted && rest.mounted.apply(this, options);
    },
    onUnload: function onUnload() {
      for (var _len3 = arguments.length, options = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        options[_key3] = arguments[_key3];
      }

      rest.beforeDestroy && rest.beforeDestroy.apply(this, options); // 从 VM_MAP 中删除自己

      deleteVm(this);
      rest.onUnload && rest.onUnload.apply(this, options);
      rest.destroyed && rest.destroyed.apply(this, options);
    }
  }));
};

logger.log("Version ".concat(version));

export { TuaComp, TuaPage };
