import React, { createContext, useContext } from "react";
import { setup } from "goober";
import { shouldForwardProp } from "goober/should-forward-prop";

export interface Theme {
  sidebarBg: string;
  sidebarPrimary: string;
  sidebarSecondary: string;
  logoBg: string;
}

const defaultTheme: Theme = {
  sidebarBg: "#444141",
  sidebarPrimary: "whitesmoke",
  sidebarSecondary: "#373535",
  logoBg: "#0077bd",
};

const ThemeContext = createContext(defaultTheme);
export const useTheme = () => useContext(ThemeContext);

setup(
  React.createElement,
  undefined,
  useTheme,
  shouldForwardProp((prop) => prop[0] !== "$")
);

export const ThemeProvider: React.FC<{ currentTheme?: Theme }> = ({
  currentTheme,
  children,
}) => (
  <ThemeContext.Provider value={currentTheme || defaultTheme}>
    {children}
  </ThemeContext.Provider>
);
