import "goober";
import { Theme as ThemeType } from "./theme";

declare module "goober" {
  export interface DefaultTheme extends ThemeType {}
}
