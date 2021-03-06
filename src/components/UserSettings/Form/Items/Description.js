/** @jsx jsx */
import {css, jsx} from "@emotion/core";

const Description = ({children}) => {
    return (
        <p css={p}>{children}</p>
    );
};

const p = css`
  margin-top: 8px;
  font-size: 16px;
  margin-bottom: 0;
  line-height: 20px;
  font-weight: 400;
`
export default Description;
