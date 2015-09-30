polymer-ext
===========

This is a set of extensions to Polymer core. The element `polymer-ext` adds a `registered` callback handler.

```html
// callback handler
Polymer.registered = function(proto) {
}
```

The element `polymer-extend` builds on this to map registrations and provide convenience methods to more easily build elements from the internals of previously registered elements, to achieve something similar to inheritance, but using a more fine-grained and flexible mixin approach. You can define a map of registration handlers in `Polymer.registrationHandlers` which will all be called (or you can change this to an ordered Array of handlers if you like)

```html
Polymer.registrationHandlers = { mapRegistration: mapRegistration };

Polymer.registered = function(proto) {
  for (var name of Object.keys(Polymer.registrationHandlers)) {
    var handler = Polymer.registrationHandlers[name];
    handler(proto);
  }
}
```

Each element is stored in a map by name as follows:

```
Polymer.registrationsMap[proto.is] = {
  prototype: proto,
  properties: proto.properties,
  methods: methodsMap,
};
```

Note that a more fine graind extend method is also available directly on the stored entry.

Futhermore, a method `Polymer.extend` is provided to help extend a previously registered element:

### Example usage

Here is a full example for how to use these extensions!

```html
<link rel="import" href="../polymer/polymer.html">
<link rel="import" href="polymer-extend.html">
<script type="text/javascript">
  Polymer({
    is: 'my-element',
    properties: {
      x: 2,
      a: 'hello'
    },
    _someHandler: function(a) {
    },
    callMeSoon: function(a) {
    }
  });

  var myElement = Polymer.findRegistered('my-element');

  var myExtension = Polymer.extend({
    properties: myElement.properties,
    behaviors: myElement.methods
  }, {
    is: 'ext-element',
  });

  console.log('extension', myExtension);
  Polymer(myExtension);
  var myExt = Polymer.findRegistered('ext-element');

  console.log('my-ext', myExt);
</script>
```

Dependencies
------------

Element dependencies are managed via [Bower](http://bower.io/). You can install that via:

```
npm install -g bower
```

Then, go ahead and download the element's dependencies:

```
bower install
```

Playing With the Element
------------------------

If you wish to work on your this in isolation, use [Polyserve](https://github.com/PolymerLabs/polyserve). You can install it via:

```
npm install -g polyserve
```

And you can run it via:

```
polyserve
```

Once running, you can preview your element at`http://localhost:8080/components/polymer-ext/`, where `polymer-ext` is the name of the directory containing it.

Testing Your Element
--------------------

Simply navigate to the `/test` directory of your element to run its tests. If you are using Polyserve: `http://localhost:8080/components/polymer-ext/test/`

### web-component-tester

*Currently NO tests*

The tests are compatible with [web-component-tester](https://github.com/Polymer/web-component-tester). Install it via:

```
npm install -g web-component-tester
```

Then, you can run your tests on *all* of your local browsers via:

```
wct
```

#### WCT Tips

`wct -l chrome` will only run tests in chrome.

`wct -p` will keep the browsers alive after test runs (refresh to re-run).

`wct test/some-file.html` will test only the files you specify.
