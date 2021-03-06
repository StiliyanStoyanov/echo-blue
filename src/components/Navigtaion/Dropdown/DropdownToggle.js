/** @jsx jsx */
import styled from "@emotion/styled";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {css, jsx} from "@emotion/core";
import {useTheme} from "emotion-theming";

const DropdownToggle = ({icon, open, toggleDropdown, enableFocusLock}) => {
    const theme = useTheme();
    const preventDefault = event => {
        event.preventDefault();
    }
    const handleKeyDown = event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            enableFocusLock();
            toggleDropdown();
        }
    }
    const handleMouseDown = () => {
        toggleDropdown();
        document.activeElement.blur();
    }
    return (
        <div css={toggleFocusableContainerStyle(theme)} tabIndex={0} onKeyDown={handleKeyDown} onMouseDown={preventDefault}>
            <div css={toggleContainerStyle(theme, open)} tabIndex={-1} onMouseDown={handleMouseDown}>
                <ToggleIcon open={open} icon={icon}/>
                <div css={overlayStyle(theme)}/>
            </div>
        </div>

    )
}
const toggleFocusableContainerStyle = theme => css`
  border-radius: 50%;
  &:focus {
    background-color: ${theme.nav.hoverOverlay};
  }
`
const toggleContainerStyle = (theme, open) => css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  &:active, &:focus {
    outline: none;
  }
  background-color: ${open ? theme.nav.iconContainerActiveBackground : theme.nav.iconContainerBackground};
  cursor:pointer;
  border-radius: 50%;
`
const ToggleIcon = styled(FontAwesomeIcon)`
  height: 20px;
  width: 20px;
  color: ${({open, theme}) => open ? theme.nav.iconActiveColor : theme.nav.iconColor};
`;
const overlayStyle = theme => css`
 border-radius: 50%;
 position: absolute;
 width: 100%;
 height: 100%;
 &:hover {
    background-color: ${theme.nav.hoverOverlay};
 }
`;
export default DropdownToggle