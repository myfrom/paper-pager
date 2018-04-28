[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/myfrom/paper-pager)
[![Build Status](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](https://travis-ci.org/myfrom/paper-pager)

# paper-pager

`paper-pager` is a Material Design page indicator that is easy to customise and allows controlling the selected page by clicking on the pager.

## Installation

Make sure you have installed Bower, then simply run  
`$ bower install --save myfrom/paper-pager`

This element is made in Hybrid mode so it will work with both Polymer 2.0 and 1.0
Port for Polymer 3 is coming soon, stay tuned.

## Usage

Import the element and then just use it as normal element.
<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="paper-pager.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<paper-pager dark></paper-pager>
<!-- `dark` attribute is only for visibility on white background -->
```

**If you want it to work on older browsers you must compile it from ES6 to ES5.**

The default item count is 3, you can set it either by specyfing `itemsCount` property (takes a number) or binding an Array of items to `items` property (this will basically set `itemsCount` to length of provided array).
Property `selected` is the index of currently selected page, can be updated by clicking on dots representing each page.

**Check out [documentation](https://www.webcomponents.org/element/myfrom/paper-pager/elements/paper-pager) for more info**

## Contributing

If you found a bug or have an idea for a new feature, be sure to open an issue **but first check if there isn't one open already**. I'm also very happy to see any Pull Requests, but to save you and me some work, comment on issues if you are planning to work on them - that way you make sure two people won't do the same thing :wink:

### Local development and testing

For local development use **[Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli)**. It's a very easy tool for working on Polymer apps and elements. Serve your element with `$ polymer serve` and **before you submit a PR** run
```bash
$ polymer install --variants # This will run tests on both Polymer 1 and 2
$ polymer lint --rules polymer-2-hybrid
$ polymer test
```

## Credits

Made by me, inspired by Google's Material Design page indicator that can be seen in different places across Android N.
Other resources:
- http://stackoverflow.com/questions/26423335

## License

Shared on MIT license, check [LICENSE](LICENSE)
