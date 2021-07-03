import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { ThemeProvider } from "./theme";
import store from "./store";
import EditorFrame from "./editor/EditorFrame";
import Sidebar from "./sidebar/Sidebar";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Sidebar />
        <EditorFrame />
      </ThemeProvider>
    </Provider>
  );
}

render(<App />, document.getElementById("root"));
