const widgets = document.querySelectorAll(".widgit-widget");

let timeout_id;

const handleMouseDown = (e, widget) => {
  // clone node
  // const parentNode = widget.parentNode;
  // let widgetClone = widget.cloneNode(true);
  // widgetClone.classList.remove(...widgetClone.classList);
  // widgetClone.classList.add("widgit-widget")
  // widgetClone.classList.add("box")

  // parentNode.append(widgetClone);
  // console.log(widgetClone)
  timeout_id = setTimeout(() => {
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
};

const resetTimeout = (timeout_id) => {
  clearTimeout(timeout_id);
  console.log("timeout cleared");
};

widgets.forEach((widget) => {
  // when mouse is down
  widget.addEventListener("mousedown", (e) => handleMouseDown(e, widget));

  // reset widget timeout
  widget.addEventListener("mouseup", () => resetTimeout(timeout_id));
  widget.addEventListener("mouseleave", () => resetTimeout(timeout_id));
});

// drag and drop
// widgets.forEach((widget) => {
//   widget.setAttribute("draggable", true);

//   widget.addEventListener("dragstart", (e) => {
// 		widget.classList.add("widgit-dragging");
// 		widget.style.position = "fixed";

// 		// hide ghost imgae
// 		// let image = new Image();
// 		// image.src =  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
// 		e.dataTransfer.setDragImage(e.target, 0, 0);

// 	});

// 	widget.addEventListener("drag", (e) => {
// 		e.preventDefault()
// 	});

// 	widget.addEventListener("dragend", (e) => {
// 		widget.classList.remove("widgit-dragging");
// 		widget.style.top = e.clientY + "px";
// 		widget.style.left = e.clientX + "px";

// 	});
// });

// document.addEventListener("dragover", e => {
// 	e.preventDefault()
// 	console.log("dragged over")
// })
