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

      new Ajax.Request(href, {
        method: "post",
        parameters: { start: e.fetchedBytes },
        requestHeaders: headers,
        onComplete: function (rsp) {
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
          const stickToBottom = scroller.isSticking();
          const text = rsp.responseText;

          if (text !== "") {
            let index = document.querySelectorAll(".app-log-line").length;
            let lines = text.split("\n");
            lines = lines.slice(0, -1);

            lines.forEach((line) => {
              index++;
              const p = document.createElement("DIV");
              p.classList.add("app-log-line");
              p.innerHTML = `<span data-line-number="${index}"></span><span>${line}</span>`;
              e.appendChild(p);
              Behaviour.applySubtree(p);
            });

            e.style.setProperty(
              "--output-inset",
              index.toString().length + "ch"
            );
          }

          e.fetchedBytes = rsp.getResponseHeader("X-Text-Size");
          e.consoleAnnotator = rsp.getResponseHeader("X-ConsoleAnnotator");
          if (rsp.getResponseHeader("X-More-Data") === "true") {
            if (stickToBottom) {
              scroller.scrollToBottom();
            }
            setTimeout(function () {
              fetchNext(e, href, onFinishEvent);
            }, 1000);
          } else {
            if (spinner !== "") {
              document.getElementById(spinner).style.display = "none";
            }
            if (onFinishEvent) {
              Event.fire(window, onFinishEvent);
            }
          }
        },
      });
    }
    document.getElementById(idref).fetchedBytes =
      startOffset !== "" ? Number(startOffset) : 0;
    fetchNext(document.getElementById(idref), href, onFinishEvent);
  }
);
