import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
// necessary for the widgit
// import $ from 'jquery';

function App() {
  const [script, setScript] = useState("script");
  useEffect(() => {
    const div = document.createElement("div");
    // jquery
    const jquery = document.createElement("script");
    jquery.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    jquery.async = true;
    // jquery.setAttribute("type", "text/babel")
    document.body.appendChild(jquery);
    jquery.onload = () => console.log(Object.keys(global));

    const babel = document.createElement("script");
    babel.src =
      "unpkg.com/@babel/standalone/babel.min.js";
    babel.async = true;
    document.body.appendChild(babel);
    babel.onload = () => console.log(Object.keys(global));

    // widigt js
    const script = document.createElement("script");
    script.src = "./widgit/widgit.js";
    script.async = true;
    script.type = "text/babel";
    document.body.appendChild(script);
    script.onload = () => console.log(Object.keys(global));

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(jquery);
    };
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
