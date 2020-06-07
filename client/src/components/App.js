/** @jsx jsx */
/** @jsxFrag React.Fragment */
/* eslint-disable no-unused-vars */
import React from 'react';
import {jsx, css} from "@emotion/core";
import Navigation from "./Navigation/Navigation";
import {Global} from "@emotion/core";
import {globalStyles} from "../styles";
import {Switch, Route} from "react-router-dom";
import {Posts} from "./Posts/Posts";
import {UserPanel} from "./UserPanel/UserPanel";


const App = () => {
    return (
        <>
            <Global styles={globalStyles}/>
            <Navigation/>
            <div css={wrapper}>
                <Switch>
                    <Route path="/posts">
                        <Posts/>
                    </Route>
                    <Route path="/user">
                        <UserPanel/>
                    </Route>
                    <Route path="/" />
                </Switch>
            </div>
        </>
    );
}
/* STYLED COMPONENTS & STYLES USED IN THIS FILE BELOW */
const wrapper = css`
  max-width: 100%;
  padding: 15px 24px;
  margin-top: 5px;
  @media (max-width: 700px) {
    padding: 0
  }
`

export default App;
