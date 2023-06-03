import { Community, communityState } from "@/src/atom/communitiesAtom";
import { Post } from "@/src/atom/postsAtom";
import { auth, firestore } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import { Flex, Stack } from "@chakra-ui/react";
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading,setLoading]=useState(false);
  
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();
  const getPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
      console.log("posts", posts);
    } catch (error: any) {
      console.log("getting post error", error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getPosts();
  }, [communityData]);
  return (
    <>
    {loading?(<PostLoader/>):(

      <Stack>
      {postStateValue.posts.map((item) => (
        <PostItem
        post={item}
        userIsCreator={user?.uid === item.creatorId}
        onVote={onVote}
        userVoteValue={postStateValue.postVotes.find((p)=>p.postId===item.id)?.voteValue}
        onDeletePost={onDeletePost}
        onSelectPost={onSelectPost}
        ></PostItem>
        ))}
    </Stack>
        )}
        </>
  );
};
export default Posts;
