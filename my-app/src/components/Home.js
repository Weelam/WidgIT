import React, { useState, useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Link } from "@mui/material";
import "./homeStyles.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Examples from "./Examples";
import Documentation from "./Documentation";

const Home = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

	console.log(tab)
  return (
    <div className="home-root">
      <div className="home-topBar">
        <Link
          target="_blank"
          href="https://github.com/csc309-fall-2021/js-library-lintao7"
        >
          {" "}
          <GitHubIcon fontSize="medium" />{" "}
        </Link>
      </div>
      <div className="home-landing">
        <Typography variant="h1" component="h1">
          WidgIT.js
        </Typography>
        <Typography variant="subtitle1" component="h6">
          Eliminate the use of scrolling back and forth on any webpage
        </Typography>
        <Button>
          <KeyboardArrowDownIcon fontSize="large" />
        </Button>
      </div>

      <div className="home-bottom">
        <Tabs className="home-tabs" centered textColor="secondary" value={tab} onChange={handleTab}>
          <Tab label="Examples" />
          <Tab label="Documentation" />
        </Tabs>
				{
					tab === 0 && (
						<Examples/>
					)
				}

				{
					tab === 1 && (
						<Documentation/>
					)
				}
      </div>
    </div>
  );
};

export default Home;
