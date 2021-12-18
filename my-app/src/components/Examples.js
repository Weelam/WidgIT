import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./examplesStyles.css";

const Examples = () => {
  useEffect(() => {
    const widgets = document.querySelectorAll(".examples-widgit");
    console.log(widgets);

		// createWidget(widgets[0])
  }, []);
  return (
    <div className="examples-root">
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Basic usage{" "}
        </Typography>
        <div className="examples-content">
          <div className="examples-widgitDiv">
            <img
              className="examples-widgit"
              src={require("../media/cookout.jpg")}
            />
          </div>
        </div>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Resizing{" "}
        </Typography>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Scroll{" "}
        </Typography>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Remove widget{" "}
        </Typography>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Change identifier{" "}
        </Typography>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Set hold down time{" "}
        </Typography>
      </div>
      <div className="examples-example">
        <Typography color="secondary" variant="h4" component="h4">
          {" "}
          Set menu close/open animation speed{" "}
        </Typography>
      </div>
    </div>
  );
};

export default Examples;
