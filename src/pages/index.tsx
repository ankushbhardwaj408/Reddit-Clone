import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import PageContent from "../components/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";
import CreatePostLink from "../components/Community/CreatePostLink";
import { async } from "@firebase/util";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Post, PostVote } from "../atom/postsAtom";
import { Stack } from "@chakra-ui/react";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { useRecoilState } from "recoil";
import { communityState, CommunitySnippet } from "../atom/communitiesAtom";
import useCommunityData from "../hooks/useCommunityData";
import { defaultMenuItem, directoryMenuState } from "../atom/directoryMenuAtom";
import Recommendations from "../components/Community/Recommendations";
import Premium from "../components/Community/Premium";
import PersonalHome from "../components/Community/PersonalHome";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {
    onDeletePost,
    onSelectPost,
    onVote,
    postStateValue,
    setPostStateValue,
  } = usePosts();
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);


 const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  
 
 const { communityStateValue } = useCommunityData();
  const buildNoUserHomeFeed = async () => {
    try {
      const postDocQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postDocQuery);
      const posts = postDocs.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("error getting no user home feed", error);
    }
  };

  const buildUserHomeFeed = async () => {
    try {
      if (communityStateValue.mySnippets.length) {
        const mySnippets = communityStateValue.mySnippets.map(
          (item) => item.communityId
        );
        const postDocQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", mySnippets),
          limit(10)
        );
        const postDocs = await getDocs(postDocQuery);
        const posts = postDocs.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("error getting  user home feed", error);
    }
  };



    const getUserPostVotes = async () => {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
        const postVotes = querySnapshot.docs.map((postVote) => ({
          id: postVote.id,
          ...postVote.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes as PostVote[],
        }));
      });

      return () => unsubscribe();
    };


//
  useEffect(()=>{
  setDirectoryState((prev) => ({
    ...prev,
    selectedMenuItem: defaultMenuItem,
  }));
},[directoryState.selectedMenuItem])
//


  useEffect(() => {
    if (communityStateValue.snippetsFetched) {
      buildUserHomeFeed();
    }
  },[communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(()=>{
if(user && postStateValue.posts.length)getUserPostVotes();
return()=>{
  setPostStateValue((prev)=>({
    ...prev,
    postVotes:[]
  }))
}
  },[user,postStateValue.posts])
  return (
    <PageContent>
      <>
        <CreatePostLink></CreatePostLink>
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((item,index) => (
              <PostItem
              key={index}
                post={item}
                userIsCreator={user?.uid === item.creatorId}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find((p) => p.postId === item.id)
                    ?.voteValue
                }
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                homePage
              ></PostItem>
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5} position="sticky" top="14px">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
}
