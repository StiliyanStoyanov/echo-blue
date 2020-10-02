/* eslint-disable no-unused-vars */
/** @jsx jsx */
import React, {useEffect, useState} from "react";
import firebase from "../../../../firebase"
import styled from "@emotion/styled";
import Title from "./Title/Title";
import ImageContent from "./ContentTypes/ImageContent";
import PostContent from "./ContentTypes/PostContent";
import LinkContent from "./ContentTypes/LinkContent";
import {useStore} from "../../../../store/StoreProvider";
import {css, jsx} from "@emotion/core";
import {usePostStore} from "../../../../store/PostStoreProvider";
import {validateForm, selectSubmitContent} from "../../../../utils/formHelpers";

const Forms = () => {
    const [allowSubmit, setAllowSubmit] = useState(false);
    const {user, userExtraData: {communitiesFollowed, username}} = useStore();
    const postStore = usePostStore();
    const {selectedCommunity, title, selectedFormType} = postStore

    useEffect(() => {
        //TODO: Think of a way to prevent the extra run of the validateForm function when allowSubmit state changes
        const validateFormState = validateForm(postStore, communitiesFollowed);
        if (validateFormState !== allowSubmit) setAllowSubmit(validateFormState);
    }, [postStore, allowSubmit, communitiesFollowed]);
    const submitPost = () => {
        if (!allowSubmit) return false;
        const communityCollection = firebase.firestore().collection('communities');
        const createTimestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            creator: username,
            upvotes: 0,
            title: title,
            content: selectSubmitContent(postStore),
            createdAt: createTimestamp,
            contentType: selectedFormType
        };
        if (selectedFormType === 'post' || selectedFormType === 'link') {
            communityCollection
                .doc(selectedCommunity)
                .collection('posts')
                .add(data)
                .catch(err => console.error(err));
        } else if (selectedFormType === 'image') {
            communityCollection
                .doc(selectedCommunity)
                .collection('posts')
                .add(data)
                .catch(err => console.error(err));
        }
    };
    return (
        <FormContainer>
            <Title/>
            {selectedFormType === 'post' && <PostContent/>}
            {selectedFormType === 'image' && <ImageContent/>}
            {selectedFormType === 'link' && <LinkContent/>}
            <button onClick={submitPost} disabled={!allowSubmit} css={submitButtonCSS}>Create</button>
        </FormContainer>
    )
}

/* STYLED COMPONENTS & STYLES USED IN THIS FILE BELOW */
const FormContainer = styled.div`
  padding: 20px;
`
const submitButtonCSS = css`
 display: block;
 margin: 10px auto 0;
 width: 15%;
 height: 40px
`

export default Forms