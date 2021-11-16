const widgets = document.querySelectorAll(".widgit-widget");
let resizing = false;
const resizes = ["widgit-se", "widgit-sw", "widgit-ne", "widgit-nw"];
let timeout_id;
let clonedWidgets = [];


widgets.forEach((widget) => {
  // when mouse is down
  widget.addEventListener("mousedown", (e) => handleMouseDown(e, widget));

  // reset widget timeout
  widget.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widget.addEventListener("mouseleave", () => resetTimeout(timeout_id));
});

const handleMouseDown = (e, widget) => {
  if (!resizing) {
    timeout_id = setTimeout(() => {
			console.log(widget.getAttribute("clone"))
      if (!widget.getAttribute("clone")) {
        widget = cloneWidget(widget);
				console.log("new clone")
      } else {
				console.log("no new clone")
			}

      addResizer(widget);
      // add class
      // widget.classList.add("widgit-dragging");
			widget.style.position = "fixed";
      widget.style.cssText +=
        "animation: begindrag 0.8s ease forwards; opacity: 0.5";
      widget.setAttribute("draggable", false);
      
      widget.style.cursor = "move";

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
        // console.log("left",widget.style.left,"top",widget.style.top);
        // console.log(data);
        // need to reassign since clientX and clientY is always changing whenever we move

        x1 = e.clientX;
        y1 = e.clientY;
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        widget.classList.remove("widgit-dragging");
        widget.style.opacity = null;
        widget.style.animation = null;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }, 1000);
  }
};

const cloneWidget = (widget) => {
  // clone node
  const parentNode = widget.parentNode;
  let widgetClone = widget.cloneNode(true);
  widgetClone.classList.add("widgit-widget");
  widgetClone.classList.add("box");
  widgetClone.setAttribute("clone", true);
  parentNode.append(widgetClone);

	widgetClone.addEventListener("mousedown", (e) => handleMouseDown(e, widgetClone));

  // reset widget timeout
  widgetClone.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widgetClone.addEventListener("mouseleave", () => resetTimeout(timeout_id));

	const bounding = widget.getBoundingClientRect();
	widgetClone.style.position = "fixed";
	widgetClone.style.top =  bounding.top + "px";
	widgetClone.style.left = bounding.left + "px";
  return widgetClone;
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

        if (currentResizer.classList.contains("widgit-se")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
        } else if (currentResizer.classList.contains("widgit-sw")) {
          widget.style.width = bounding.width - x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          widget.style.left = bounding.left + x2 + "px";
        } else if (currentResizer.classList.contains("widgit-ne")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height - y2 + "px";
          widget.style.top = bounding.top + y2 + "px";
        } else {
          widget.style.width = bounding.width - x2 + "px";
          widget.style.height = bounding.height - y2 + "px";
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
