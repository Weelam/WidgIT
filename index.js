// inline styles
const widgetStyle = `
	animation: begindrag 0.8s ease forwards; 
	opacity: 0.5;
	z-index: 10;
	box-shadow: 0 0 3px black;
	`;

const resizerStyle = `
	position: absolute;
	background-color: transparent;
	z-index: 999999999999999;
	width: 15px;
	height: 15px;
`;

const resizerStyle_nw = `
	cursor: nw-resize;
	top: 0px;
	left: 0px;
`;

const resizerStyle_ne = `
	cursor: ne-resize;
	top: 0px;
	right: 0px;
`;

const resizerStyle_sw = `
	cursor: sw-resize;
	bottom: 0px;
	left: 0px;

`;

const resizerStyle_se = `
	cursor: se-resize;
	bottom: 0px;
	right: 0px;

`;
const taskbarStylePositioner = `
	position: absolute;
	height: 10px;
	width: 10px;
	z-index: 99999999999;
`;
const taskbarStyle = `
	top: 0px;
	right: -8px;
	background: black;
`;
const widgets = document.querySelectorAll(".widgit-widget");
console.log(widgets);
let resizing = false;
const resizes = ["widgit-se", "widgit-sw", "widgit-ne", "widgit-nw"];
let timeout_id;
// [{widget: ... clone:[...]}] -> widget object structure
let widgetObjects = [];
// instantiate all objects into widgetObjects
widgets.forEach((widget, index) => {
  let newObj = {
    id: index,
    original: widget,
    clones: [],
  };
  widgetObjects.push(newObj);
});

console.log(widgetObjects);
widgetObjects.forEach((widgetObject) => {
  const widget = widgetObject["original"];
  // when mouse is down
  widget.addEventListener("mousedown", (e) =>
    handleMouseDown(e, widget, widgetObject)
  );

  // reset widget timeout
  widget.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widget.addEventListener("mouseleave", () => resetTimeout(timeout_id));
});

const handleMouseDown = (e, widget, widgetObject) => {
  if (!resizing) {
    timeout_id = setTimeout(() => {
      const isClone = widget.getAttribute("clone");
      // note: we don't know if "widget" is a clone or not
      if (!isClone) {
        widget = cloneWidget(widget, widgetObject);
        addResizer(widget);
      }
      const wrapper = widget.parentNode;
      openTaskBar(wrapper, widget, widgetObject, isClone);

      // add widget styles
      widget.style.cssText += widgetStyle;
      widget.setAttribute("draggable", false);
      widget.style.cursor = "move";
      // add wrapper styles
      wrapper.style.height = widget.clientHeight + "px";
      wrapper.style.width = widget.clientWidth + "px";
      // this only happens when we mouse down
      let x1 = e.clientX;
      let y1 = e.clientY;
      // console.log("x1", x1, "y1", y1);

      const handleMouseMove = (e) => {
        let x2 = e.clientX - x1;
        let y2 = e.clientY - y1;

        // console.log("x2", x2, "y2", y2);

        // we must change the positioning of the widget relative to the wrapper's positioning
        // this is because the widget itself will mess with the positioning when dragging for some unknown reason
        const bounding = wrapper.getBoundingClientRect();

        // rather than reassigning the position to your cursor location, we are updating the position properties instead
        // through adding an subtracting x2 and y2. By doing so, the element doesn't teleporate to your cursor position
        // when you start dragging.
        widget.style.left = bounding.left + x2 + "px";
        widget.style.top = bounding.top + y2 + "px";
        // must also update the wrapper's location in the same why since we're taking the boundClientRect of the wrpaper
        wrapper.style.left = bounding.left + x2 + "px";
        wrapper.style.top = bounding.top + y2 + "px";
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
        // widget.classList.remove("widgit-dragging");
        widget.style.opacity = null;
        widget.style.animation = null;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }, 1000);
  }
};

// helper functions
const openTaskBar = (wrapper, widget, widgetObject, isClone) => {
  if (!isClone) {
    const originalWidget = widgetObject["original"];
    const taskbar = document.createElement("div");
    taskbar.setAttribute("taskbar", true);
    wrapper.append(taskbar);
    taskbar.style.cssText += taskbarStylePositioner + taskbarStyle;

    const removeWidget = document.createElement("button");
    removeWidget.innerHTML = "Remove";
    removeWidget.onclick = () => {
      const index = widgetObject["clones"].indexOf(widget);
      widgetObject["clones"].splice(index, 1);
      wrapper.remove();
      console.log(widgetObject);
    };
    taskbar.append(removeWidget);

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "Close";
    closeButton.onclick = () => (taskbar.style.display = "none");
    taskbar.append(closeButton);

    const scrollBack = document.createElement("button");
    scrollBack.innerHTML = "Scroll";
    scrollBack.onclick = () => {
      // console.log(originalWidget)
      originalWidget.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    };
    taskbar.append(scrollBack);
  } else {
    let taskbarElement;
    let wrapperArray = [...wrapper.children]
    wrapperArray.forEach((element) => {
      if (element.getAttribute("taskbar")) {
        taskbarElement = element;
      }
    });
    taskbarElement.style.display = "block";
    console.log(taskbarElement)
  }
};
const cloneWidget = (widget, widgetObject) => {
  // clone node
  const parentNode = widget.parentNode;
  let widgetClone = widget.cloneNode(true);
  widgetClone.classList.add("widgit-widget");
  widgetClone.classList.add("box");
  widgetClone.setAttribute("clone", true);
  parentNode.append(widgetClone);

  // wrap clone inside div
  const clonedParentNode = widgetClone.parentNode;
  const wrapper = document.createElement("div");
  wrapper.appendChild(widgetClone);
  clonedParentNode.appendChild(wrapper);

  widgetClone.addEventListener("mousedown", (e) =>
    handleMouseDown(e, widgetClone, widgetObject)
  );

  widgetObject["clones"].push(widgetClone);
  console.log(widgetObject);

  // reset widget timeout
  widgetClone.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widgetClone.addEventListener("mouseleave", () => resetTimeout(timeout_id));
  // widgetClone.addEventListener("click", () => widgetClone.remove())
  const bounding = widget.getBoundingClientRect();

  // must change wrapper's position in the same way since we'll be moving the element relative to the wrapper
  // and not the widget itself
  widgetClone.style.position = "fixed";
  wrapper.style.position = "fixed";
  widgetClone.style.top = bounding.top + "px";
  widgetClone.style.left = bounding.left + "px";
  wrapper.style.top = bounding.top + "px";
  wrapper.style.left = bounding.left + "px";
  return widgetClone;
};

const handleResizer = (widget, resizeNodes) => {
  const wrapper = widget.parentNode;
  resizeNodes.forEach((node) => {
    const handleResizeMouseDown = (e) => {
      currentResizer = e.target;
      resizing = true;
      let x1 = e.clientX;
      let y1 = e.clientY;

      const handleResizeMouseMove = (e) => {
        const bounding = wrapper.getBoundingClientRect();
        const x2 = e.clientX - x1;
        const y2 = e.clientY - y1;

        // before we introduced the idea of positioning relative to a wrapper, resizing was weird
        // now that we have a wrapper, it's good (must also update the width and height of the wrapper the same way as widget too)
        if (currentResizer.getAttribute("se")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          wrapper.style.width = bounding.width + x2 + "px";
          wrapper.style.height = bounding.height + y2 + "px";
        } else if (currentResizer.getAttribute("sw")) {
          widget.style.width = bounding.width - x2 + "px";
          widget.style.height = bounding.height + y2 + "px";
          widget.style.left = bounding.left + x2 + "px";
          wrapper.style.width = bounding.width - x2 + "px";
          wrapper.style.height = bounding.height + y2 + "px";
          wrapper.style.left = bounding.left + x2 + "px";
        } else if (currentResizer.getAttribute("ne")) {
          widget.style.width = bounding.width + x2 + "px";
          widget.style.height = bounding.height - y2 + "px";
          widget.style.top = bounding.top + y2 + "px";
          wrapper.style.width = bounding.width + x2 + "px";
          wrapper.style.height = bounding.height - y2 + "px";
          wrapper.style.top = bounding.top + y2 + "px";
        } else {
          widget.style.width = bounding.width - x2 + "px";
          widget.style.height = bounding.height - y2 + "px";
          widget.style.top = bounding.top + y2 + "px";
          widget.style.left = bounding.left + x2 + "px";
          wrapper.style.width = bounding.width - x2 + "px";
          wrapper.style.height = bounding.height - y2 + "px";
          wrapper.style.top = bounding.top + y2 + "px";
          wrapper.style.left = bounding.left + x2 + "px";
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
  const wrapper = widget.parentNode;
  const nw = document.createElement("div");
  const ne = document.createElement("div");
  const sw = document.createElement("div");
  const se = document.createElement("div");

  nw.setAttribute("nw", true);
  ne.setAttribute("ne", true);
  sw.setAttribute("sw", true);
  se.setAttribute("se", true);

  nw.style.cssText += resizerStyle_nw + resizerStyle;
  ne.style.cssText += resizerStyle_ne + resizerStyle;
  sw.style.cssText += resizerStyle_sw + resizerStyle;
  se.style.cssText += resizerStyle_se + resizerStyle;

  wrapper.append(nw, ne, sw, se);
  handleResizer(widget, [nw, ne, sw, se]);
};

const resetTimeout = (timeout_id) => {
  clearTimeout(timeout_id);
  console.log("timeout cleared");
};

// const updateWidgetclones = () => {
//   let newObj = {
//     id: index,
//     original: widget,
//     clones: []
//   }
//   widgetObjects.push(newObj)
// }
