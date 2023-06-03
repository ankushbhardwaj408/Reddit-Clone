import { Community } from "@/src/atom/communitiesAtom";
import { Post } from "@/src/atom/postsAtom";
import About from "@/src/components/Community/About";
import PageContent from "@/src/components/Layout/PageContent";
import Comments from "@/src/components/Posts/Comments/Comments";
import PostItem from "@/src/components/Posts/PostItem";
import { auth, firestore } from "@/src/firebase/clientApp";
import useCommunityData from "@/src/hooks/useCommunityData";
import usePosts from "@/src/hooks/usePosts";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

const PagePost: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { communityId } = router.query;
  const { onDeletePost, onVote, postStateValue, setPostStateValue } =
    usePosts();
  const { communityStateValue } = useCommunityData();

  const getPosts = async (pid: string) => {
    try {
      const postDocRef = doc(firestore, "posts", pid);
      const postDoc = await getDoc(postDocRef);

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("error getting singlepost", error.message);
    }
  };
  useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      getPosts(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);
  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost as Post}
            userIsCreator={postStateValue.selectedPost?.creatorId === user?.uid}
            onVote={onVote}
            userVoteValue={
              postStateValue.postVotes.find(
                (p) => p.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            onDeletePost={onDeletePost}
          ></PostItem>
        )}
        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.communityId  as string}
        ></Comments>
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity}></About>
        )}
      </>
    </PageContent>
  );
};
export default PagePost;
