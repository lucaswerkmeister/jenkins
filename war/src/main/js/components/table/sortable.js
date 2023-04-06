import behaviorShim from "@/util/behavior-shim";

function init() {
  behaviorShim.specify("TABLE.sortable", "table-sortable", 0, function (e) {
    e.sortable = new Sortable.Sortable(e);
  });

  window.ts_refresh = ts_refresh;
}

/* Add the "sortable" CSS class to a table to make it sortable.
The first row must be always table header, and the rest must be table data.
(the script seems to support rows to be fixed at the bottom, but haven't figured out how to use it.)

If the table data is sorted to begin with, you can add 'initialSortDir="up|down"' to the
corresponding cell in the header row to display the direction icon from the beginning.
This is recommended to provide a visual clue that the table can be sorted.

The script guesses the table data, and try to use the right sorting algorithm.
But you can override this behavior by having 'data="..."' attribute on each row,
in which case the sort will be done on that field.
*/

let Sortable = (function () {
  function Sortable(table) {
    this.table = table;
    this.arrows = [];

    let firstRow = this.getFirstRow();
    if (!firstRow) return;

    // We have a first row: assume it's the header, and make its contents clickable links
    firstRow.each(
      function (cell) {
        let noSort = cell.getAttribute("data-sort-disable");
        if (noSort) {
          //TODO the data storage should be changed
          this.arrows.push(null);

          // do not add clickable behavior on a column that is not expected to be sorted
          // like icon columns
          return;
        }
        /*
         * Normally the innerHTML is dangerous, but in this case, we receive the column caption from an escaped jelly
         * and thus, the content there is already escaped.
         * If we use innerText, we will get the unescaped version and potentially trigger a XSS.
         * Using the innerHTML will return the escaped content that could be reused directly within the wrapper.
         */
        cell.innerHTML =
          '<a href="#" class="sortheader">' +
          cell.innerHTML +
          '<span class="sortarrow"></span></a>';
        this.arrows.push(cell.firstElementChild.lastElementChild);

        let self = this;
        cell.firstElementChild.onclick = function () {
          self.onClicked(this);
          return false;
        };
      }.bind(this)
    );

    // figure out the initial sort preference
    this.pref = this.getStoredPreference();
    if (this.pref == null) {
      firstRow.each(
        function (cell, i) {
          let initialSortDir = cell.getAttribute("initialSortDir");
          if (initialSortDir != null) {
            this.pref = { column: i, direction: arrowTable[initialSortDir] };
          }
        }.bind(this)
      );
    }

    this.refresh();
  }

  Sortable.prototype = {
    /**
     * SPAN tags that we use to render directional arrows, for each columns.
     */
    arrows: null /*Array*/,

    /**
     * Current sort preference.
     */
    pref: null /* { column:int, direction:arrow } */,

    getFirstRow: function () {
      if (this.table.rows && this.table.rows.length > 0) {
        return $A(this.table.rows[0].cells);
      }
      return null;
    },

    getDataRows: function () {
      let newRows = [];
      let rows = this.table.rows;
      for (let j = 1; j < rows.length; j++) {
        newRows.push($(rows[j]));
      }
      return newRows;
    },

    /**
     * If there's a persisted sort direction setting, retrieve it
     */
    getStoredPreference: function () {
      let key = this.getStorageKey();
      if (key in sessionStorage) {
        let val = sessionStorage.getItem(key);
        if (val) {
          const vals = val.split(":");
          if (vals.length === 2) {
            return {
              column: parseInt(vals[0]),
              direction: arrowTable[vals[1]],
            };
          }
        }
      }
      return null;
    },

    getStorageKey: function () {
      let uri = document.location;
      let tableIndex = this.getIndexOfSortableTable();
      return "ts_direction::" + uri + "::" + tableIndex;
    },

    savePreference: function () {
      let key = this.getStorageKey();
      sessionStorage.setItem(key, this.pref.column + ":" + this.pref.direction.id);
    },

    /**
     * Determine the sort function for the specified column
     */
    getSorter: function (column) {
      let rows = this.table.rows;
      if (rows.length <= 1) return sorter.fallback;

      let itm = this.extractData(rows[1].cells[column]).trim();
      return sorter.determine(itm);
    },

    /**
     * Called when the column header gets clicked.
     */
    onClicked: function (lnk) {
      let arrow = lnk.lastChild;
      let th = lnk.parentNode;

      let column = th.cellIndex;
      if (column === (this.pref || {}).column) {
        // direction change on the same row
        this.pref.direction = this.pref.direction.next;
      } else {
        this.pref = {
          column: column,
          direction: arrow.sortdir || arrowTable.up,
        };
      }

      arrow.sortdir = this.pref.direction; // remember the last sort direction on this column

      this.refresh();
      this.savePreference();
    },

    /**
     * Call when data has changed. Reapply the current sort setting to the existing data rows.
     * @since 1.484
     */
    refresh: function () {
      if (this.pref == null) return; // not sorting

      let column = this.pref.column;
      let dir = this.pref.direction;

      let s = this.getSorter(column);
      if (dir === arrowTable.up) {
        // ascending
        s = sorter.reverse(s);
      }

      // we allow some rows to stick to the top and bottom, so that is our first sort criteria
      // regardless of the sort function
      function rowPos(r) {
        if (r.hasClassName("sorttop")) return 0;
        if (r.hasClassName("sortbottom")) return 2;
        return 1;
      }

      let rows = this.getDataRows();
      rows.sort(
        function (a, b) {
          let x = rowPos(a) - rowPos(b);
          if (x !== 0) return x;

          return s(
            this.extractData(a.cells[column]),
            this.extractData(b.cells[column])
          );
        }.bind(this)
      );

      rows.each(
        function (e) {
          this.table.tBodies[0].appendChild(e);
        }.bind(this)
      );

      // update arrow rendering
      this.arrows.each(function (e, i) {
        // to check the columns with sort disabled
        if (e) {
          e.innerHTML = (i === column ? dir : arrowTable.none).text;
        }
      });
    },

    getIndexOfSortableTable: function () {
      return $(document.body).select("TABLE.sortable").indexOf(this.table);
    },

    getInnerText: function (el) {
      if (typeof el == "string") return el;
      if (typeof el == "undefined") {
        return el;
      }
      if (el.innerText) return el.innerText; //Not needed but it is faster
      let str = "";

      let cs = el.childNodes;
      let l = cs.length;
      for (let i = 0; i < l; i++) {
        switch (cs[i].nodeType) {
          case 1: //ELEMENT_NODE
            str += this.getInnerText(cs[i]);
            break;
          case 3: //TEXT_NODE
            str += cs[i].nodeValue;
            break;
        }
      }
      return str;
    },

    // extract data for sorting from a cell
    extractData: function (x) {
      if (x == null) return "";
      let data = x.getAttribute("data");
      if (data != null) return data;
      return this.getInnerText(x);
    },
  };

  let arrowTable = {
    up: {
      id: "up",
      text: "&nbsp;&nbsp;&uarr;",
    },
    down: {
      id: "down",
      text: "&nbsp;&nbsp;&darr;",
    },
    none: {
      id: "none",
      text: "",
    },
    lnkRef: null,
  };

  arrowTable.up.next = arrowTable.down;
  arrowTable.down.next = arrowTable.up;

  /**
   * Matches dates like:
   *   "1/4/2017 ignored content"
   *   "03-23-99 1:30 PM also ignored content"
   *   "12-25/1979 13:45:22 always with the ignored content!"
   */
  let date_pattern =
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d\d|\d\d\d\d)(?:\s*(\d{1,2})?:(\d\d)?(?::(\d\d)?)?)?\s*([aA][mM]|[pP][mM])?\b/;

  // available sort functions
  let sorter = {
    date: function (a, b) {
      /**
       * Note - 2-digit years under 50 are considered post-2000,
       * otherwise they're pre-2000. This is terrible, but
       * preserves existing behavior. If you use sortable.js,
       * please make sure you use 4-digit year values.
       */
      function toDate(x) {
        const dmatches = x.match(date_pattern);
        const month = dmatches[1];
        const day = dmatches[2];
        let year = parseInt(dmatches[3]);
        if (year < 50) {
          year += 2000;
        } else if (year < 100) {
          year += 1900;
        }
        let hours = dmatches[4] || 0;
        const minutes = dmatches[5] || 0;
        const seconds = dmatches[6] || 0;
        hours = parseInt(hours);
        if (dmatches[7] && dmatches[7].match(/pm/i) && hours < 12) {
          hours += 12;
        }
        return new Date(year, month, day, hours, minutes, seconds, 0);
      }
      return toDate(a) - toDate(b);
    },

    currency: function (a, b) {
      a = a.replace(/[^0-9.]/g, "");
      b = b.replace(/[^0-9.]/g, "");
      return parseFloat(a) - parseFloat(b);
    },

    percent: function (a, b) {
      a = a.replace(/[^0-9.<>]/g, "");
      b = b.replace(/[^0-9.<>]/g, "");
      if (a === "<100") a = "99.9";
      else if (a === ">0") a = "0.1";
      if (b === "<100") b = "99.9";
      else if (b === ">0") b = "0.1";
      a = a.replace(/[^0-9.]/g, "");
      b = b.replace(/[^0-9.]/g, "");
      return parseFloat(a) - parseFloat(b);
    },

    numeric: function (a, b) {
      a = parseFloat(a);
      if (isNaN(a)) a = 0;
      b = parseFloat(b);
      if (isNaN(b)) b = 0;
      return a - b;
    },

    caseInsensitive: function (a, b) {
      return sorter.fallback(a.toLowerCase(), b.toLowerCase());
    },

    fallback: function (a, b) {
      if (a === b) return 0;
      if (a < b) return -1;
      return 1;
    },

    /**
     * return the sorter to be used for the given value
     * @param {String} itm
     *      Text
     */
    determine: function (itm) {
      let sortfn = this.caseInsensitive;
      if (itm.match(date_pattern)) sortfn = this.date;
      if (itm.match(/^[£$]/)) sortfn = this.currency;
      if (itm.match(/%$/)) sortfn = this.percent;
      if (itm.match(/^-?\d+(\.\d+)?$/)) sortfn = this.numeric;
      return sortfn;
    },

    reverse: function (f) {
      return function (a, b) {
        return -f(a, b);
      };
    },
  };

  return {
    Sortable: Sortable,
    sorter: sorter,
  };
})();

/** Calls table.sortable.refresh() in case the sortable has been initialized; otherwise does nothing. */
function ts_refresh(table) {
  let s = table.sortable;
  if (s != null) {
    s.refresh();
  }
}

export default { init };
