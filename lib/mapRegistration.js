// TODO: refactor! Avoid extending Object.prototype, make it a private method ;)
Object.defineProperty(Object.prototype, 'extendObj', {
  enumerable: false,
  value: function(from) {
    if (!from)
      return this;

    var props = Object.getOwnPropertyNames(from);
    var dest = this;

    props.forEach(function(name) {
      if (!dest[name]) {
        var destination = Object.getOwnPropertyDescriptor(from, name);
        Object.defineProperty(dest, name, destination);
      }
    });
    return this;
  }
});

Polymer.mapRegistration = function(proto) {
  var ignoreMethods = [
    'constructor',
    '_notifyChange',
    '_propertySetter',
    '__setProperty',
    '_effectEffects',
    '_clearPath'
  ];

  var ignoreProps = [
    'is',
    'properties',
    '_aggregatedAttributes',
    '_factoryArgs',
    '_template',
    '_encapsulateStyle',
    '_styles',
    '_ownStylePropertyNames',
    '_notes',
    '_propertyEffects',
    '_bindListeners',
    '_nodes',
    '_useContent'
  ];

  function keep(name, ignoreList) {
    return ignoreList.indexOf(name) === -1;
  }

  var myMethods = [];
  var props = [];
  for (var name of Object.keys(proto)) {
    if (proto.hasOwnProperty(name)) {
      if (typeof proto[name] === 'function') {
        if (keep(name, ignoreMethods)) {
          myMethods.push(name);
        }
      } else {
        if (keep(name, ignoreProps)) {
          props.push(name);
        }
      }
    }
  }

  var methodsMap = {};
  for (name of myMethods) {
    methodsMap[name] = proto[name];
  }

  var propsMap = {};
  for (name of props) {
    propsMap[name] = proto[name];
  }

  var behaviorMap = {};
  behaviorMap.extendObj(methodsMap);
  behaviorMap.extendObj(propsMap);

  Polymer.registrationsMap[proto.is] = {
    prototype: proto,
    props: propsMap,
    methods: methodsMap,
    behaviors: behaviorMap,
    properties: proto.properties
  };
};
