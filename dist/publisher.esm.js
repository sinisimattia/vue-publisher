import { EditorMenuBar, EditorContent, EditorMenuBubble, Editor } from 'tiptap';
import { Bold, Italic, Blockquote, Heading, Link } from 'tiptap-extensions';
import { Renderer } from 'prosemirror-to-html-js';

//
var script = {
  components: {
    EditorMenuBar,
    EditorContent,
    EditorMenuBubble
  },
  props: {
    value: Object
  },

  data() {
    return {
      editor: new Editor({
        extensions: [new Bold(), new Italic(), new Blockquote(), new Heading({
          levels: [1, 2, 3]
        }), new Link()],
        onUpdate: ({
          getJSON
        }) => {
          this.$emit("input", getJSON());
        }
      }),
      linkUrl: null,
      linkMenuIsActive: false
    };
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },

    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },

    setLinkUrl(command, url) {
      command({
        href: url
      });
      this.hideLinkMenu();
    }

  },
  watch: {
    value: {
      immediate: true,
      deep: true,

      handler(value) {
        this.editor.setContent(value);
      }

    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "editor"
  }, [_c('editor-menu-bubble', {
    staticClass: "menububble",
    attrs: {
      "editor": _vm.editor
    },
    on: {
      "hide": _vm.hideLinkMenu
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (ref) {
        var commands = ref.commands;
        var isActive = ref.isActive;
        var getMarkAttrs = ref.getMarkAttrs;
        var menu = ref.menu;
        return [_c('div', {
          staticClass: "menububble",
          class: {
            'is-active': menu.isActive
          },
          style: "left: " + menu.left + "px; bottom: " + menu.bottom + "px;"
        }, [_vm.linkMenuIsActive ? _c('form', {
          on: {
            "submit": function ($event) {
              $event.preventDefault();
              return _vm.setLinkUrl(commands.link, _vm.linkUrl);
            }
          }
        }, [_c('input', {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: _vm.linkUrl,
            expression: "linkUrl"
          }],
          ref: "linkInput",
          staticClass: "input",
          attrs: {
            "type": "search",
            "placeholder": "https://"
          },
          domProps: {
            "value": _vm.linkUrl
          },
          on: {
            "keydown": function ($event) {
              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
                return null;
              }

              return _vm.hideLinkMenu($event);
            },
            "input": function ($event) {
              if ($event.target.composing) {
                return;
              }

              _vm.linkUrl = $event.target.value;
            }
          }
        })]) : [_c('button', {
          staticClass: "button",
          class: {
            'is-active': isActive.link()
          },
          on: {
            "click": function ($event) {
              _vm.showLinkMenu(getMarkAttrs('link'));
            }
          }
        }, [_c('span', [_vm._t("link", [_vm._v("Add link")])], 2)])]], 2)];
      }
    }])
  }), _vm._v(" "), _c('editor-menu-bar', {
    attrs: {
      "editor": _vm.editor
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (ref) {
        var commands = ref.commands;
        var isActive = ref.isActive;
        return [_c('div', {
          staticClass: "commands"
        }, [_c('button', {
          class: {
            'is-active': isActive.heading({
              level: 1
            })
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": function ($event) {
              return commands.heading({
                level: 1
              });
            }
          }
        }, [_vm._t("h1", [_c('span', [_vm._v("H1")])])], 2), _vm._v(" "), _c('button', {
          class: {
            'is-active': isActive.heading({
              level: 2
            })
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": function ($event) {
              return commands.heading({
                level: 2
              });
            }
          }
        }, [_vm._t("h2", [_c('span', [_vm._v("H2")])])], 2), _vm._v(" "), _c('button', {
          class: {
            'is-active': isActive.heading({
              level: 3
            })
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": function ($event) {
              return commands.heading({
                level: 3
              });
            }
          }
        }, [_vm._t("h3", [_c('span', [_vm._v("H3")])])], 2), _vm._v(" "), _c('button', {
          class: {
            'is-active': isActive.bold()
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": commands.bold
          }
        }, [_vm._t("bold", [_c('b', [_vm._v("B")])])], 2), _vm._v(" "), _c('button', {
          class: {
            'is-active': isActive.italic()
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": commands.italic
          }
        }, [_vm._t("italic", [_c('i', [_vm._v("I")])])], 2), _vm._v(" "), _c('button', {
          class: {
            'is-active': isActive.blockquote()
          },
          attrs: {
            "type": "button"
          },
          on: {
            "click": commands.blockquote
          }
        }, [_vm._t("blockquote", [_c('span', [_vm._v("Q")])])], 2)])];
      }
    }], null, true)
  }), _vm._v(" "), _c('editor-content', {
    staticClass: "content",
    attrs: {
      "editor": _vm.editor
    }
  })], 1);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-ab9bce42_0", {
    source: ".editor[data-v-ab9bce42]{position:relative}.menububble[data-v-ab9bce42]{position:absolute;z-index:20;transform:translateX(-50%);visibility:hidden;opacity:0}.menububble.is-active[data-v-ab9bce42]{opacity:1;visibility:visible}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-ab9bce42";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

//
var script$1 = {
  props: {
    value: Object
  },

  data() {
    return {
      renderer: new Renderer(),
      result: String
    };
  },

  watch: {
    value: {
      immediate: true,

      handler(value) {
        this.result = this.renderer.render(value);
      }

    }
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "content",
    domProps: {
      "innerHTML": _vm._s(_vm.result)
    }
  });
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Publisher: __vue_component__,
  Reader: __vue_component__$1
});

// Import vue components
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// install function executed by Vue.use()
const install = function installPublisher(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__ as Publisher, __vue_component__$1 as Reader };
