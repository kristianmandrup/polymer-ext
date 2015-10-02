polymer-ext
===========

This is a set of extensions to Polymer core. The element `polymer-ext` adds a `registered` callback handler.

```html
// callback handler
Polymer.registered = function(proto) {
}
```

The element `polymer-extend` builds on this to map registrations and provide convenience methods to more easily build elements from the internals of previously registered elements, to achieve something similar to inheritance, but using a more fine-grained and flexible mixin approach.

You can define a map of registration handlers in `Polymer.registrationHandlers` which will all be called (or you can change this to an ordered Array of handlers if you like)

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
  props: propsMap,
  methods: methodsMap,
};
```

A method `Polymer.extend` is provided to help extend a previously registered element:

### Example usage

Here is a full example for how to use these extensions!

```html
<link rel="import" href="../polymer/polymer.html">
<link rel="import" href="polymer-extend.html">
<link rel="import" href="template-ext.html">
<script type="text/javascript">
  Polymer({
    is: 'my-element',
    properties: {
      x: 2,
      a: 'hello'
    },
    beta: 3,
    _someHandler: function(a) {
    },
    callMeSoon: function(a) {
    }
  });

  var myElement = Polymer.findRegistered('my-element');

  // Each key: properties, props, methods act as a mixin.
  // properties - properties object
  // props - all attributes (non-functions)
  // methods: - all own functions
  // behaviors: - all own functions and attributes
  var myExtension = Polymer.extend({
    parent: myElement,
    // properties: myElement.properties,
    // props: myElement.props,
    // methods: myElement.methods,
    // behaviors: myElement.behaviors
  }, {
    is: 'ext-element',
  });

  Polymer(myExtension);
</script>
```

If only `parent` is specified, it will extend with all: (properties, props and methods).

Template mixins and more...
---------------------------

The element `template-ext` extends the built-in Polymer template element: `polymer/mini/template.js` with a callback to the prototype of the element so that the developer can inspect or modify the template before it is stamped.

```js
_prepTemplate: function() {
  // locate template using dom-module
  this._template =
    this._template || Polymer.DomModule.import(this.is, 'template');

  // ...  
  // allow hosting element to use or modify template before being used
  if (typeof this.templator == 'function') {
    this.templator(this._template);
  }
},
```

This trick can be leveraged to achieve template inheritance in any form you like.

```html
<dom-module id="ext-element">
  <template extends="parent-element">
    <h1>Hello World</h1>
  </template>
```

Here we defined a custom `extends` attribute on a template that identifies the parent element to be used as a base for this template. Our `templator` function for this element can then use this identifier to import the "base" template or use it to build its own as it likes.

```js
{
  is: 'ext-element',
  templator: function(template) {
    if (template) {
      template = template.cloneNode();
      templify(template);
    }
    this._template = parentTemplate;
  }
}
```

Templating your templates
-------------------------

You can even run a Templating engine on your template to produce your template! This can f.ex be used to elegantly weave your host template into your inherited template ;) Customized inheritance "on steroids"!

```html
<dom-module id="parent-element">
  <template engine="swig">
    <h1>[: pagename :]</h1>
    <h2>:{{ title }}:</h2>
    <ul>
    {% for author in authors %}
      <li>
        [: author :]
      </li>
    {% endfor %}
    </ul>
  </template>
```

Note that `:{{ title }}:` is used to indicate a Polymer value two-way binding form `{{ title }}`. Use `:[[ title ]]` for the one-way binding form `[[ title ]]`. You can customize this as you like, we have just used this convention in our example using Swig templating.

```js
var locals = {
    pagename: 'awesome people',
    authors: ['Paul', 'Jim', 'Jane']
};

// ...

templator: function(template) {
  if (template) {
    template = template.cloneNode();
    // ...
    var engine = parentTemplate.getAttribute('engine');
    if (engine == 'swig') {
      var templateContent = parentTemplate.innerHTML;
      template.innerHTML = swigTemplate(templateContent, locals)
    }
    this._template = template;
  }
}
```

Which makes this the final template.

```html
<h1 class="style-scope parent-element">awesome people</h1>
<ul class="style-scope parent-element">
  <li class="style-scope parent-element">
    Paul
  </li>
  <li class="style-scope parent-element">
    Jim
  </li>
  <li class="style-scope parent-element">
    Jane
  </li>
</ul>
```

Your imagination and persistence is your limit ;)

On a further note, you may combine this extension library with [polymer-reflect](https://github.com/niflostancu/polymer-reflection) to gain even more power!

*Awesome!!!*

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
