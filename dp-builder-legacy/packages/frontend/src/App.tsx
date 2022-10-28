import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { ThemeProvider } from "./theme";
import store from "./store";
import useHistory from "./editor/useHistory";
import EditorFrame from "./editor/EditorFrame";
import Sidebar from "./sidebar/Sidebar";
import { MenuProvider } from "./editor/contextMenu";

function App() {
  useHistory();

  return (
    <ThemeProvider>
      <MenuProvider>
        <Sidebar />
        <EditorFrame />
      </MenuProvider>
    </ThemeProvider>
  );
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
