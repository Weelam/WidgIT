const widgets = document.querySelectorAll(".widgit-widget");
let resizing = false;
let timeout_id;

widgets.forEach((widget) => {
  // when mouse is down
  widget.addEventListener("mousedown", (e) => handleMouseDown(e, widget));

  // reset widget timeout
  widget.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widget.addEventListener("mouseleave", () => resetTimeout(timeout_id));
});

const handleMouseDown = (e, widget) => {
  // clone node
  // const parentNode = widget.parentNode;
  // let widgetClone = widget.cloneNode(true);
  // widgetClone.classList.remove(...widgetClone.classList);
  // widgetClone.classList.add("widgit-widget")
  // widgetClone.classList.add("box")

  // parentNode.append(widgetClone);
  // console.log(widgetClone)
  if (!resizing) {
    timeout_id = setTimeout(() => {
      addResizer(widget);
      // add class
      widget.classList.add("widgit-dragging");
      widget.style.position = "fixed";
      widget.style.cursor = "move";

      console.log("dragging now");
      // this only happens when we mouse down
      let x1 = e.clientX;
      let y1 = e.clientY;
      // console.log("x1", x1, "y1", y1);

      const handleMouseMove = (e) => {
        let x2 = e.clientX - x1;
        let y2 = e.clientY - y1;
        // console.log("x2", x2, "y2", y2);

        const bounding = widget.getBoundingClientRect();

        // rather than reassigning the position to your cursor location, we are updating the position properties instead
        // through adding an subtracting x2 and y2. By doing so, the element doesn't teleporate to your cursor position
        // when you start dragging.
        widget.style.left = bounding.left + x2 + "px";
        widget.style.top = bounding.top + y2 + "px";
        let data = {
          x2: x2,
          y2: y2,
          boundingLeft: bounding.left,
          boundingTop: bounding.top,
        };
        console.log("left", widget.style.left, "top", widget.style.top);
        console.log(data);
        // need to reassign since clientX and clientY is always changing whenever we move

        x1 = e.clientX;
        y1 = e.clientY;
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        widget.classList.remove("widgit-dragging");
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }, 1000);
  }
};

const handleResizer = (widget, resizeNodes) => {
  resizeNodes.forEach((node) => {
    const handleResizeMouseDown = (e) => {
      currentResizer = e.target;
      resizing = true;

      let x1 = e.clientX;
      let y1 = e.clientY;

      const handleResizeMouseMove = (e) => {
        const bounding = widget.getBoundingClientRect();
        const x2 = e.clientX - x1;
        const y2 = e.clientY - y1;

        if (currentResizer.classList.contains("se")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
        } else if (currentResizer.classList.contains("sw")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          widget.style.left = bounding.left + x2 + "px";
        } else if (currentResizer.classList.contains("ne")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          widget.style.top = bounding.top + y2 + "px";
        } else {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          widget.style.top = bounding.top + y2 + "px";
          widget.style.left = bounding.left + x2 + "px";
        }

        x1 = e.clientX;
        y1 = e.clientY;
      };

      const handleResizeMouseUp = () => {
        window.removeEventListener("mousemove", handleResizeMouseMove);
        window.removeEventListener("mouseup", handleResizeMouseUp);
        resizing = false;
      };

      window.addEventListener("mousemove", handleResizeMouseMove);
      window.addEventListener("mouseup", handleResizeMouseUp);
    };
    node.addEventListener("mousedown", handleResizeMouseDown);
  });
};
const addResizer = (widget) => {
  const nw = document.createElement("div");
  const ne = document.createElement("div");
  const sw = document.createElement("div");
  const se = document.createElement("div");

  nw.className += "widgit-sizer widgit-nw";
  ne.className += "widgit-sizer widgit-ne";
  sw.className += "widgit-sizer widgit-sw";
  se.className += "widgit-sizer widgit-se";

  widget.append(nw, ne, sw, se);
  handleResizer(widget, [nw, ne, sw, se]);
};

const resetTimeout = (timeout_id) => {
  clearTimeout(timeout_id);
  console.log("timeout cleared");
};
