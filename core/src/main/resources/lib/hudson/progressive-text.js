// Auto-scroll support for progressive log output.
//   See http://radio.javaranch.com/pascarello/2006/08/17/1155837038219.html
//
// eslint-disable-next-line no-unused-vars
function AutoScroller(scrollContainer) {
  return {
    bottomThreshold: 25,
    scrollContainer: scrollContainer,

    getViewportHeight() {
      if (this.scrollContainer === document.body) {
        return this.scrollContainer.scrollHeight;
      }

      return this.scrollContainer.scrollHeight;
    },

    getScrollPosition() {
      return this.scrollContainer.scrollTop;
    },

    // return true if we are in the "stick to bottom" mode
    isSticking: function () {
      const height = this.getViewportHeight();
      const scrollPosition = this.getScrollPosition();

      return height - scrollPosition <= this.bottomThreshold;
    },

    scrollToBottom: function () {
      if (this.scrollContainer === document.body) {
        this.scrollContainer.scrollTo(0, this.getViewportHeight());
      }

      this.scrollContainer.scrollTop = this.getViewportHeight();
    },
  };
}

Behaviour.specify(
  ".terminal", "", 0, (element) => {
    const header = element.querySelector(".terminaltitle");
    const content = element.querySelector(".terminalinside");

    // Animate in the header background based on scroll position
    content.addEventListener("scroll", () => {
      header.style.setProperty("--opacity-thing", content.scrollTop / 50);
    });
  }
)

Behaviour.specify(
  ".progressiveText-holder",
  "progressive-text",
  0,
  function (holder) {
    const parent = holder.closest(".terminalinside") || document.body;
    let href = holder.getAttribute("data-href");
    let idref = holder.getAttribute("data-idref");
    let spinner = holder.getAttribute("data-spinner");
    let startOffset = holder.getAttribute("data-start-offset");
    let onFinishEvent = holder.getAttribute("data-on-finish-event");

    const scroller = new AutoScroller(parent);

    function fetchNext(e, href, onFinishEvent) {
      var headers = crumb.wrap({});
      if (e.consoleAnnotator !== undefined) {
        headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
      }

      fetch(href, {
        method: "post",
        headers,
        body: new URLSearchParams({
          start: e.fetchedBytes,
        }),
      }).then((rsp) => {
        if (rsp.status >= 500 || rsp.status === 0) {
          setTimeout(function () {
            fetchNext(e, href, onFinishEvent);
          }, 1000);
          return;
        }
        if (rsp.status === 403) {
          // likely an expired crumb
          location.reload();
          return;
        }

        /* append text and do autoscroll if applicable */
        let stickToBottom = scroller.isSticking();

        console.log(stickToBottom)

        rsp.text().then((responseText) => {
          var text = responseText;
          if (text !== "") {
            var p = document.createElement("DIV");
            e.appendChild(p); // Needs to be first for IE
            p.innerHTML = text;
            Behaviour.applySubtree(p);
            if (stickToBottom) {
              scroller.scrollToBottom();
            }

            // Scroll to bottom of element on load
            // content.scrollTop = content.scrollHeight;
          }

          e.fetchedBytes = rsp.headers.get("X-Text-Size");
          e.consoleAnnotator = rsp.headers.get("X-ConsoleAnnotator");
          if (rsp.headers.get("X-More-Data") === "true") {
            setTimeout(function () {
              fetchNext(e, href, onFinishEvent);
            }, 1000);
          } else {
            if (spinner !== "") {
              document.getElementById(spinner).style.display = "none";
            }
            if (onFinishEvent) {
              window.dispatchEvent(new Event(onFinishEvent));
            }
          }
        });
      });
    }

    document.getElementById(idref).fetchedBytes =
      startOffset !== "" ? Number(startOffset) : 0;
    fetchNext(document.getElementById(idref), href, onFinishEvent);
  }
);
