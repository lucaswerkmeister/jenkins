/*
   Behaviour v1.1 by Ben Nolan, June 2005. Based largely on the work
   of Simon Willison (see comments by Simon below).

   Description:

   	Uses css selectors to apply javascript behaviours to enable
   	unobtrusive javascript in html documents.

   Usage:

        Behaviour.specify('b.someclass', 'myrules.alert', 10, function(element) {
            element.onclick = function() {
                alert(this.innerHTML);
            }
        });
        Behaviour.specify('#someid u', 'myrules.blah', 0, function(element) {
            element.onmouseover = function() {
                this.innerHTML = "BLAH!";
            }
        });

	// Call Behaviour.apply() to re-apply the rules (if you
	// update the dom, etc).

   License:

   	This file is entirely BSD licensed.

   More information:

   	http://ripcord.co.nz/behaviour/

*/

var Behaviour = (function() {
    var storage = [{selector: '', id: '_deprecated', priority: 0}];
    return {

    /**
     * Specifies something to do when an element matching a CSS selector is encountered.
     * @param {String} selector a CSS selector triggering your behavior
     * @param {String} id combined with selector, uniquely identifies this behavior; prevents duplicate registrations
     * @param {Number} priority relative position of this behavior in case multiple apply to a given element; lower numbers applied first (sorted by id then selector in case of tie); choose 0 if you do not care
     * @param {Function} behavior callback function taking one parameter, a (DOM) {@link Element}, and returning void
     */
    specify : function(selector, id, priority, behavior) {
        for (var i = 0; i < storage.length; i++) {
            if (storage[i].selector == selector && storage[i].id == id) {
                storage.splice(i, 1);
                break;
            }
        }
        storage.push({selector: selector, id: id, priority: priority, behavior: behavior});
        storage.sort(function(a, b) {
            var location = a.priority - b.priority;
            return location != 0 ? location : a.id < b.id ? -1 : a.id > b.id ? 1 : a.selector < b.selector ? -1 : a.selector > b.selector ? 1 : 0;
        });
    },

        /** @deprecated For backward compatibility only; use {@link specify} instead. */
	list : new Array,

        /** @deprecated For backward compatibility only; use {@link specify} instead. */
	register : function(sheet){
		Behaviour.list.push(sheet);
	},

	start : function(){
		Behaviour.addLoadEvent(function(){
			Behaviour.apply();
		});
	},

	apply : function(){
        this.applySubtree(document);
    },

    /**
     * Applies behaviour rules to a subtree/subforest.
     *
     * @param {HTMLElement|HTMLElement[]} startNode
     *      Subtree/forest to apply rules.
     *
     *      Within a single subtree, rules are the outer loop and the nodes in the tree are the inner loop,
     *      and sometimes the behaviour rules rely on this ordering to work correctly. When you pass a forest,
     *      this semantics is preserved.
     */
    applySubtree : function(startNode,includeSelf) {
        if (!(startNode instanceof Array)) {
            startNode = [startNode];
        }
        storage._each(function (registration) {
            if (registration.id == '_deprecated') {
                Behaviour.list._each(function(sheet) {
                    for (const selector in sheet){
                        startNode._each(function (n) {
                          try {
                            const list = includeSelf ? n.parentNode.querySelectorAll(selector) : n.querySelectorAll(selector);
                            [...list].forEach(() => sheet[selector]);
                          } catch (e) {
                              console.error(e)
                          }
                        });
                    }
                });
            } else {
                startNode._each(function (node) {
                  try {
                    const list = includeSelf ? node.parentNode.querySelectorAll(registration.selector) : node.querySelectorAll(registration.selector);
                    [...list].forEach(registration.behavior);
                  } catch (e) {
                      console.error(e)
                  }
                });
            }
        });
    },

    addLoadEvent : function(func){
		var oldonload = window.onload;

		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function(e) {
				oldonload(e);
				func(e);
			}
		}
	}
}})();

Behaviour.start();
