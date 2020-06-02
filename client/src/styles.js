import { css } from "@emotion/core";

export const padding = '6px';
export const unit = 8;
export const colors = {
    textColor: '#a5a6a8',
    borderColor: '#343536',
    darkGray: '#1a1a1b',
    white: '#ffffff',
    black: '#000000',
};
export const border = {
    radius: '8px'
}

export const globalStyles = css`
  html {
    box-sizing: border-box;
    min-height: 100vh;
    font-size: ${unit * 3}px;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-color: ${colors.black};
    color: ${colors.white}
  }
  *, *::before, *::after {
    box-sizing: inherit
  }
`