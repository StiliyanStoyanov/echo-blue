/** @jsx jsx */
/** @jsxFrag React.Fragment */
/* eslint-disable no-unused-vars */
import React from 'react';
import styled from "@emotion/styled";
import {css, jsx} from '@emotion/core';
import {Scores} from "./Scores/Scores";
import {PostContent} from "./PostContent/PostContent";
import {colors} from "../../styles";
const {borderColor, backgroundColor} = colors

export const Posts = ({ posts }) => {

    return (
        posts ? posts.map((post) => {
            return (
                <PostContainer key={post.postId}>
                    <PostContent post={post}/>
                    <Scores upvotes={post.upvotes}/>
                </PostContainer>
            )
        }) : <div> Loading </div>
    )
};

/* STYLED COMPONENTS & STYLES USED IN THIS FILE BELOW */
const PostContainer = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  margin: 10px auto;
  padding-top: 8px;
  padding-left: 40px;
  border: 1px solid ${borderColor};
  border-radius: 4px;
  background-color: ${backgroundColor};
  min-width: 380px;
  max-width: 700px;
  min-height: 80px;
  max-height: 500px;
  width: 100%;
  cursor: pointer;
  &:hover, &:active {
    border: 1px solid ${colors.borderHover};
  }
  @media (max-width: 420px) {
    padding-left: 0;
  }
`



