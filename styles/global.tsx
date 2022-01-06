import { globalCss } from "stitches.config"

export const globalStyles = globalCss({
  body: {
    backgroundColor: "$black",
    color: "$hiContrast",
    fontFamily: "$untitled",
    margin: 0,
  },
  ul: {
    paddingLeft: "$4",
  },

  figure: { margin: 0 },

  "pre, code": { margin: 0, fontFamily: "$mono" },

  svg: { display: "inline-block", verticalAlign: "middle" },

  "::selection": {
    backgroundColor: "$mauve9",
    color: "$loContrast",
    WebkitTextFillColor: "$colors$loContrast",
  },
})
