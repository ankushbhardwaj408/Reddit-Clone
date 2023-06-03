import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atom/authModalAtom";
import { communityState } from "../atom/communitiesAtom";
import { Post, postState, PostVote } from "../atom/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const communityStateValue = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
const router=useRouter();
const {communityId,pid}=router.query;
  const onVote = async (event:React.MouseEvent<SVGElement,MouseEvent>, post: Post, vote: number, communityId: string) => {
   event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (item) => item.postId === post.id
      );
      const batch = writeBatch(firestore);
      const updatePost = { ...post };
      const updatePosts = [...postStateValue.posts];
      let updatePostVotes = [...postStateValue.postVotes];

      let voteChange = vote;
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId: communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatePost.voteStatus = voteStatus + vote;
        updatePostVotes = [...updatePostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        if (existingVote.voteValue === vote) {
          updatePost.voteStatus = voteStatus - vote;
          updatePostVotes = updatePostVotes.filter(
            (item) => item.id !== existingVote.id
          );

          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          updatePost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatePostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };

          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );

      updatePosts[postIdx] = updatePost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatePosts,
        postVotes: updatePostVotes,
      }));

      if(postStateValue.selectedPost){
        setPostStateValue(prev=>({
          ...prev,
          selectedPost:updatePost
        }))
      }

      await batch.commit();
    } catch (error: any) {
      console.log("error voting", error.message);
    }
  };





  const onSelectPost = (post:Post) => {
    setPostStateValue(prev=>({
      ...prev,
      selectedPost:post,
    }))
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };





  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const docRef = doc(firestore, `posts/${post.id}`);
      await deleteDoc(docRef);

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => post.id !== item.id),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };
  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };
  useEffect(() => {
    if (!user || !communityStateValue.currentCommunity?.id) return;
    getCommunityPostVotes(communityStateValue.currentCommunity.id);
  }, [user, communityStateValue]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user, loadingUser]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
