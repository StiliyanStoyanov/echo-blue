/* eslint-disable no-unused-vars */
/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, {useEffect, useRef, useState} from "react";
import firebase from "../../../firebase";
import styled from "@emotion/styled";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {css, jsx} from "@emotion/core";
import {usePostDispatch} from "../../../store/PostStoreProvider";
import {useUserStore} from "../../../store/UserStoreProvider";
import CommunityList from "./CommunityList";
import YourProfileItem from "./YourProfileItem";
import SearchIcon from "./SearchIcon";
import { useTheme } from "emotion-theming";

//TODO: More new code than refactoring done LOL - REFACTOR MORE!
const CommunitySelector = () => {
    const theme = useTheme();
    const {subscriptionsData, isLoading} = useUserStore();
    const postDispatch = usePostDispatch();
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [queryParamList, setQueryParamList] = useState([]);
    const [[arrowsSelectedCommunity, arrowSelectedIndex], setArrowSelectedCommunity] = useState([null, null]);
    const [userInput, setUserInput] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [queriedCommunities, setQueriedCommunities] = useState([]);
    const [queriedCommunitiesFiltered, setQueriedCommunitiesFiltered] = useState([]);
    const [userCommunitiesFiltered, setUserCommunitiesFiltered] = useState([]);
    const communitiesCollection = firebase.firestore().collection('communities');
    useEffect(() => {
        if (!userInput) {
            return;
        }
        const filterQueriedCommunities = queriedCommunities?.filter(community => community.name.startsWith(userInput));
        const filterUserCommunities = subscriptionsData?.filter(community => community.name.startsWith(userInput));
        setUserCommunitiesFiltered(filterUserCommunities);
        setQueriedCommunitiesFiltered(filterQueriedCommunities);
    },[queriedCommunities, subscriptionsData, userInput, isLoading]);

    const selectCommunity = (community) => () => {
        postDispatch({type: "SELECT_COMMUNITY", payload: community});
        setUserInput(community.name);
        setOpen(false);
        setFocused(false);
    }

    const handleChange = async (event) => {
        setUserInput(event.target.value);
        // Case when the dropdown content is hidden but input is still focused expand the dropdown
        if (!open) {
            setOpen(true);
        }
        // Clean up the arrows selected if it exist on any input because the content will be filtered
        if (arrowsSelectedCommunity) {
            setArrowSelectedCommunity([null, null]);
        }
        if (isLoading) {
            return false;
        }
        if (!event.target.value) {
            setUserCommunitiesFiltered([]);
            setQueriedCommunitiesFiltered([]);
            return false;
        }

        // check for valid word
        const matchLetter = /[A-Za-z0-9]+/g.exec(event.target.value);
        // if the word is valid proceed
        if (matchLetter) {
            // get the first letter of the word
            const letter = matchLetter[0][0];
            // if the matching letter was already used return
            if (queryParamList.includes(letter)) {
                return false;
            }
            // add the new letter to the query parameters list
            setQueryParamList(prevState => [...prevState, letter]);
            // query for communities based on the new letter
            const query = (await communitiesCollection.where("queryParam", "==", letter).get());
            if (query.empty) {
                return false;
            }
            // filter the result from the query out of the subscriptionsData by the user
            const queryResult = query.docs.reduce((accumulator, currentQuerySnapshot) => {
                const queriedCommunity = currentQuerySnapshot.data();
                const isUserFollowedCommunity = subscriptionsData.some(userFollowedCommunity => {
                    return userFollowedCommunity.name === queriedCommunity.name
                });
                if (!isUserFollowedCommunity) {
                    return [...accumulator, queriedCommunity];
                }
                return [...accumulator];
            }, []);
            // update the query list if there are new communities different from the user ones
            if (queryResult.length > 0) {
                // there is not need for filtering since each query fires only once on a letter,
                // so its guaranteed that the new result will be unique
                setQueriedCommunities(prevState => [...prevState, ...queryResult]);
            }
        }
    };

    const handleBlur = (event) => {
        if (!selectedCommunity) {
            const allCommunities = [...subscriptionsData || [], ...queriedCommunities];
            const communityFound = allCommunities.find(community => community.name === event.target.value);
            if (communityFound) {
                postDispatch({type: "SELECT_COMMUNITY", payload: communityFound});
                setUserInput(communityFound.name);
                setSelectedCommunity(communityFound)
            }
        } else if (selectedCommunity && selectedCommunity.name !== userInput) {
            const allCommunities = [...subscriptionsData, ...queriedCommunities];
            const communityFound = allCommunities.find(community => community.name === event.target.value);
            if (communityFound) {
                postDispatch({type: "SELECT_COMMUNITY", payload: communityFound});
                setUserInput(communityFound.name);
                setSelectedCommunity(communityFound)
            } else {
                postDispatch({type: "CLEAR_COMMUNITY"});
                setSelectedCommunity(null)
            }
        }
        setOpen(false);
        setFocused(false);
        setArrowSelectedCommunity([null, null]);
    }
    const handleFocus = () => {
        setFocused(true);
        setOpen(true);
    }
    const handleCaretMouseDown = (event) => {
        event.preventDefault();
        setOpen(prevState => !prevState);
        if (!focused) {
            setFocused(true);
        }
        return inputRef?.current.focus();
    }
    const handleKeyDown = (event) => {
        if (event.key === "Down" || event.key === "ArrowDown"
            || event.key === "Up" || event.key === "ArrowUp"
            || event.key === "Esc" || event.key === "Escape"
            || event.key === "Enter") {
            event.preventDefault();
            // if no input add the user communities to the array, otherwise add the filtered result to the array
            const allCommunitiesList = [...(userInput.length > 0 ? userCommunitiesFiltered : subscriptionsData), ...queriedCommunitiesFiltered];
            if (allCommunitiesList.length > 0) {
                switch (event.key) {
                    case "Down": // IE/Edge specific value
                    case "ArrowDown":
                        // Do something for "down arrow" key press.
                        // Go one community down from the current  dropdown community list combined array if its possible
                        if (!arrowsSelectedCommunity) {
                            setArrowSelectedCommunity([allCommunitiesList[0].name, 0]);
                        } else if (arrowsSelectedCommunity) {
                            const lastIndex = allCommunitiesList.length - 1;
                            const nextIndex = arrowSelectedIndex + 1;
                            if (lastIndex >= nextIndex) {
                                setArrowSelectedCommunity([allCommunitiesList[nextIndex].name, nextIndex]);
                            }
                        }
                        break;
                    case "Up": // IE/Edge specific value
                    case "ArrowUp":
                        // Do something for "up arrow" key press.
                        // Go one community up from the current dropdown community list combined array if its possible
                        if (!arrowsSelectedCommunity) {
                            setArrowSelectedCommunity([allCommunitiesList[0].name, 0]);
                        } else if (arrowsSelectedCommunity) {
                            const previousIndex = arrowSelectedIndex - 1;
                            if (previousIndex >= 0) {
                                setArrowSelectedCommunity([allCommunitiesList[previousIndex].name, previousIndex]);
                            }
                        }
                        break;
                    case "Enter":
                        setOpen(false);
                        break;
                    case "Esc": // IE/Edge specific value
                    case "Escape":
                        setOpen(false);
                        break;
                    // Do something for "esc" key press.
                    default:
                        return; // Quit when this doesn't handle the key event.
                }
            }
        }
    }
    return (
        <CommunitySelectorContainer>
            <SearchCommunityContainer focused={focused} open={open}>
                <SearchIcon focused={focused} selectedCommunity={selectedCommunity}/>
                <input
                    css={searchInputStyle(theme)}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    value={arrowsSelectedCommunity ? arrowsSelectedCommunity : userInput}
                    type="search"
                    placeholder="Choose a community"
                    spellCheck="false"
                />
                <CaretDown icon={faCaretDown} onMouseDown={handleCaretMouseDown}/>
            </SearchCommunityContainer>
            <SearchCommunityDropdownContent open={open}>
                <CommunityList
                    type={"My Communities"}
                    communityList={userInput.length > 0 ? userCommunitiesFiltered : subscriptionsData}
                    selectCommunity={selectCommunity}
                    currentlySelectedCommunity={arrowsSelectedCommunity ? arrowsSelectedCommunity : userInput}
                />
                <CommunityList
                    type={"Other Communities"}
                    communityList={queriedCommunitiesFiltered}
                    selectCommunity={selectCommunity}
                    currentlySelectedCommunity={arrowsSelectedCommunity ? arrowsSelectedCommunity : userInput}
                />
            </SearchCommunityDropdownContent>
        </CommunitySelectorContainer>
    );
}

/* STYLED COMPONENTS & STYLES USED IN THIS FILE BELOW */
const CommunitySelectorContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
`
const SearchCommunityContainer = styled.div`
  position:relative;
  display: flex;
  align-items: center;
  height: 40px;
  min-width: 300px;
  width: 50%;
  background-color: ${({theme}) => theme.createPost.backgroundColor};
  border: 1px solid ${({theme}) => theme.borderColor};
  ${({theme, focused}) => focused && `box-shadow 0 0 2px 1px ${theme.createCommunity.backgroundColor}`};
  border-radius: 4px;
  border-bottom-left-radius: ${props => props.open ? 0 : '4px'};
  border-bottom-right-radius: ${props => props.open ? 0 : '4px'};
  padding: 0 12px;
  @media screen and (max-width: 560px) {
    width: 100%;
  }
`
const CaretDown = styled(FontAwesomeIcon)`
  height: 20px;
  width: 20px;
  &:hover {
    cursor:pointer;
  }
`
const searchInputStyle = theme => css`
  color: ${theme.color};
  background-color: ${theme.createPost.backgroundColor};
  outline: none;
  border: none;
  max-height: 26px;
  margin: 0 5px;
  width: 100%;
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration { 
    display: none
  }
`
const SearchCommunityDropdownContent = styled.div`
  display: block;
  position: absolute;
  max-height: 300px;
  padding: 3px;
  visibility: ${props => props.open ? 'visible' : 'hidden'};
  z-index: 3;
  ${({theme, focused}) => focused && `box-shadow 0 0 2px 1px ${theme.createCommunity.backgroundColor}`};
  background-color: ${({theme}) => theme.createCommunity.backgroundColor};
  overflow: auto;
  width: 50%;
  border: 1px solid #343536;
  border-top: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  @media screen and (max-width: 560px) {
    width: 100%;
  }
`

export default CommunitySelector
