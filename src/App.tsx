import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setup } from "goober";

import store from "./store";
import EditorFrame from "./editor/EditorFrame";
import Sidebar from "./sidebar/Sidebar";

setup(React.createElement);

function App() {
  return (
    <Provider store={store}>
      <Sidebar />
      <EditorFrame />
    </Provider>
  );
}

render(<App />, document.getElementById("root"));
