Behaviour.specify(
  ".progressiveText-holder",
  "progressive-text",
  0,
  function (holder) {
    const href = holder.getAttribute("data-href");
    const idref = holder.getAttribute("data-idref");
    const spinner = holder.getAttribute("data-spinner");
    const startOffset = holder.getAttribute("data-start-offset");
    const onFinishEvent = holder.getAttribute("data-on-finish-event");

    const scroller = new AutoScroller(document.body);

    /*
     * fetches the latest update from the server
     * @param e DOM node that gets the text appended to
     * @param href Where to retrieve additional text from
     */
    function fetchNext(e, href, onFinishEvent) {
      const headers = {};
      if (e.consoleAnnotator !== undefined) {
        headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
      }

      function isBottom() {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        return distanceFromBottom < 30 && scrollTop !== 0;
      }

      new Ajax.Request(href, {
        method: "post",
        parameters: { start: e.fetchedBytes },
        requestHeaders: headers,
        onComplete: function (rsp) {
          /* append text and do autoscroll if applicable */
          const stickToBottom = isBottom();
          const text = rsp.responseText;

          console.log(text.split("asda"))

          if (text !== "") {
            let index = document.querySelectorAll(".longhorn").length;
            let lines = text.split("\n");
            lines = lines.slice(0, -1);

            lines.forEach((line) => {
              index ++;
              const p = document.createElement("DIV");
              p.classList.add("longhorn")
              p.innerHTML = `<span data-line-number="${index}"></span><span>${line}</span>`;
              e.appendChild(p);
              Behaviour.applySubtree(p);
            })

            e.style.setProperty('--output-inset', index.toString().length + "ch");

            if (stickToBottom) {
              scroller.scrollToBottom();
            }
          }

          e.fetchedBytes = rsp.getResponseHeader("X-Text-Size");
          e.consoleAnnotator = rsp.getResponseHeader("X-ConsoleAnnotator");
          if (rsp.getResponseHeader("X-More-Data") === "true") {
            setTimeout(function () {
              fetchNext(e, href, onFinishEvent);
            }, 1000);
          } else {
            if (spinner !== "") {
              $(spinner).style.display = "none";
            }
            if (onFinishEvent) {
              Event.fire(window, onFinishEvent);
            }
          }
        },
      });
    }
    $(idref).fetchedBytes = startOffset !== "" ? Number(startOffset) : 0;
    fetchNext($(idref), href, onFinishEvent);
  }
);
