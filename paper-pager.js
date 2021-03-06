import { Polymer } from '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

import '@polymer/iron-selector/iron-selector.js';

import { IronA11yKeysBehavior } from "@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";

const template = html`
  <style>
    :host {
      margin: 5px;
      position: relative;
      display: inline-block;
    }

    :host([dark]) {
      --paper-pager-color: black;
    }

    iron-selector {
      display: -ms-inline-flexbox;
      display: -webkit-inline-flex;
      display: inline-flex;
    }

    iron-selector > div {
      width: calc(var(--paper-pager-dots-margin, 5px) * 2 + 10px);
      height: calc(var(--paper-pager-dots-margin, 5px) * 2 + 10px);
      position: relative;
    }

    iron-selector .dot {
      margin: var(--paper-pager-dots-margin, 5px);
      border-radius: 5px;
      width: 10px;
      height: 10px;
      display: inline-block;
      background-color: var(--paper-pager-color, white);
      opacity: var(--paper-pager-opacity, 0.7);
    }

    iron-selector .iron-selected.ready .dot {
      opacity: 1;
    }

    :host([accessible]) iron-selector > div:focus::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 50%;
      opacity: 0.2;
      background-color: var(--paper-pager-color, white);
    }

    iron-selector > div:focus {
      outline: none;
    }

    #canvas {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      pointer-events: none;
    }
  </style>
  <iron-selector selected="[[selected]]">
  <template is="dom-repeat" items="[[items]]">
    <div index="[[index]]" on-tap="_onTap">
      <div class="dot"></div>
    </div>
  </template>
  </iron-selector>
  <canvas id="canvas"></canvas>
`;

/**
 * `paper-pager` is a Material Design page indicator. It shows currently selected page, provides a lightweight animation when switching pages and allows to pick specific page by clicking on the corresponding dot.
 * 
 * Example:
 *     <paper-pager items-count="4"></paper-pager>
 * 
 * ### Notice
 * 
 * **If you want it to work on older browsers you must compile it from ES6 to ES5.**
 * 
 * ### Styling
 * 
 * The following custom properties and mixins are available for styling:
 * 
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--paper-pager-color` | Color of dots | `white`
 * `--paper-pager-opacity` | Opacity of not selected dots | `0.7`
 * `--paper-pager-dots-margin` | Margin of dots | `5px`
 * 
 * If you quickly need to switch to dark theme you can use `dark` attribute.
 * 
 * @customElement
 * @polymer
 * @demo https://www.webcomponents.org/element/myfrom/paper-pager/demo/demo/index.html 
 */


Polymer({
  _template: template,

  is: 'paper-pager',
  
  behaviors: [
    IronA11yKeysBehavior
  ],
  
  properties: {
    /**
     * Number of items.
     */
    itemsCount: {
      type: Number,
      value: 3,
      observer: '_computeItems'
    },
    
    /**
     * Takes an array which length will be set as `itemsCount`. If `itemsCount` is set this will overwrite it.
     */
    items: {
      type: Array,
      observer: '_changeSize'
    },
    
    /**
     * Currently selected item's index.
     */
    selected: {
      type: Number,
      notify: true,
      reflectToAttribute: true,
      value: 0,
      observer: '_selectedChanged'
    },
    
    /**
     * If you set this to true, the element will use dark theme.
     */
    dark: {
      type: Boolean,
      value: false,
      observer: '_updateStyles'
    },
    
    /**
     * Time (in ms) of the animation between two dots.
     */
    transitionDuration: {
      type: Number,
      value: 200
    },
    
    /**
     * Time (in ms) of the pause in animation (when two dots are connected).
     */
    pauseDuration: {
      type: Number,
      value: 200
    },
    
    /**
     * This will turn on accessibility features (keyboard navigation, focus ring);
     */
    accessible: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: '_setupAccessibility'
    }
    
  },
  
  /*keyBindings: {
    'down' : '_previous',
    'up'  : '_next',
    'left' : '_previous',
    'right'  : '_next',
    'space' : '_enterSelected',
    'enter' : '_enterSelected',
  },*/
  
  attached: function() {
    this._draw = this.$.canvas.getContext('2d');
    afterNextRender(this, function addClass() {
      if (this.$$('.iron-selected'))
        this.$$('.iron-selected').classList.add('ready');
      else
        afterNextRender(this, addClass);
    });
  },
  
  _onTap: function(e) {
    this.selected = e.currentTarget.index;
  },
  
  _computeItems: function(count) {
    if (this._itemsCount !== count) {
      this._itemsCount = count;
      this.items = new Array(count);
    }
  },
  
  _changeSize: function(items) {
    this._itemsCount = items.length;
    this.itemsCount = this._itemsCount;
    const marginPx = this.getComputedStyleValue('--paper-pager-dots-margin');
    const margin = marginPx ? marginPx.match(/\d+/)[0] : 5;
    this.$.canvas.height = (10 + 2 * margin);
    this.$.canvas.width = this._itemsCount * (10 + 2 * margin);
  },
  
  _selectedChanged: async function(selected, lastSelected) {
    if (!this._draw) return;
    if (this.accessible) {
      this._tabindex = this._tabindex.bind(this);
      setTimeout(this._tabindex);
    }
    if (this.$$('.ready')) this.$$('.ready').classList.remove('ready');
    this.$.canvas.style.pointerEvents = 'auto';
    const ctx = this._draw,
          color = this.getComputedStyleValue('--paper-pager-color') || 'white',
          marginPx = this.getComputedStyleValue('--paper-pager-dots-margin'),
          margin = marginPx ? marginPx.match(/\d+/)[0] : 5,
          y = margin + 5,
          width = this.$.canvas.width,
          height = this.$.canvas.height,
          start = (margin * 2 + 10) * (lastSelected + 1) - 10,
          end = (margin * 2 + 10) * (selected + 1) - 10,
          duration = this.transitionDuration,
          cycles = duration / 17,
          frameDistance = (start - end) / Math.round(cycles);
    let i = 0,
        pos = start;
    const draw = () => {
      i++;
      pos -= frameDistance;
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.moveTo(start, y);
      ctx.lineTo(pos, y);
      ctx.lineWidth = 10;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.stroke();
      if (i >= cycles) {
        clearInterval(interval);
        ctx.clearRect(0, 0, width, height);
        ctx.moveTo(start, y);
        ctx.lineTo(end, y);
        ctx.lineWidth = 10;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };
    const interval = setInterval(draw, 17);
    await this._wait(this.pauseDuration + duration);
    pos = start;
    i = 0;
    const drawReverse = () => {
      i++;
      pos -= frameDistance;
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.moveTo(end, y);
      ctx.lineTo(pos, y);
      ctx.lineWidth = 10;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.stroke();
      if (i >= cycles) {
        clearInterval(intervalReverse);
        ctx.clearRect(0, 0, width, height);
        ctx.moveTo(end, y);
        ctx.lineTo(end, y);
        ctx.lineWidth = 10;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };
    const intervalReverse = setInterval(drawReverse, 17);
    await this._wait(duration + 17);
    ctx.clearRect(0, 0, width, height);
    this.$.canvas.style.pointerEvents = 'none';
    this.$$('.iron-selected').classList.add('ready');
  },
  
  _updateStyles: function() {
    this.updateStyles();
  },
  
  _next: function(e) {
    e.detail.keyboardEvent.preventDefault();
    if (this._focused === this._itemsCount - 1) {
      this._focused = 0;
    } else {
      this._focused++;
    }
    dom(this.root).querySelectorAll('iron-selector > div').forEach(item => {
      if (item.index === this._focused) {
        item.tabIndex = 0;
        item.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  },
  
  _previous: function(e) {
    e.detail.keyboardEvent.preventDefault();
    if (this._focused === 0) {
      this._focused = this._itemsCount - 1;
    } else {
      this._focused--;
    }
    dom(this.root).querySelectorAll('iron-selector > div').forEach(item => {
      if (item.index === this._focused) {
        item.tabIndex = 0;
        item.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  },
  
  _enterSelected: function(e) {
    e.detail.keyboardEvent.preventDefault();
    this.selected = this._focused;
  },
  
  _tabindex: function() {
    this._focused = this.selected;
    dom(this.root).querySelectorAll('iron-selector > div').forEach(item => {
      item.tabIndex = item.index === this.selected ? 0 : -1;
    });
  },
  
  _setupAccessibility: function(a11y) {
    if (a11y) {
      afterNextRender(this, function addTabindex() {
        if (this.$$('iron-selector .iron-selected'))
          this.$$('iron-selector  .iron-selected').tabindex = 0;
        else
          afterNextRender(this, addTabindex);
      });
      this._focused = this.selected;
      this.addOwnKeyBinding('down', '_previous');
      this.addOwnKeyBinding('up', '_next');
      this.addOwnKeyBinding('left', '_previous');
      this.addOwnKeyBinding('right', '_next');
      this.addOwnKeyBinding('space', '_enterSelected');
      this.addOwnKeyBinding('enter', '_enterSelected');
    } else {
      dom(this.root).querySelectorAll('iron-selector > div').forEach(item => {
        item.tabIndex = -1;
      });
      this.removeOwnKeyBindings();
    }
  },
  
  _wait: function(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
});