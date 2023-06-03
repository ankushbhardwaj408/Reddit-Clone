import { Post, postState } from "@/src/atom/postsAtom";
import { firestore } from "@/src/firebase/clientApp";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { async } from "@firebase/util";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import CommentItem, { Comment } from "./CommentItem";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId,setLoadingDeleteId]=useState("");
  const setPostStateValue = useSetRecoilState(postState);
  const onCreateComment = async (commentText: string) => {
    try {
      setCreateLoading(true);
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment = {
        id: commentDocRef.id,
        communityId,
        creatorId: user.uid!,
        creatorDisplayText: user?.email?.split("@")[0]!,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });
      await batch.commit();
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      console.log(comments);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("error create comment", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
    
      const batch = writeBatch(firestore);
      const commentDocRef=doc(firestore,"comments",comment.id);
      batch.delete(commentDocRef);

      const postDocRef=doc(firestore,"posts",selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();
setPostStateValue((prev) => ({
  ...prev,
  selectedPost: {
    ...prev.selectedPost,
    numberOfComments: prev.selectedPost?.numberOfComments! - 1,
  } as Post,
}));
     setComments((prev)=>prev.filter(item=>item.id!==comment.id));
    } catch (error) {
       console.log("fetching comments", error);
    }
    setLoadingDeleteId("");
  };
  const getPostComments = async () => {
    try {
      const commentDocRef = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentDocRef);

      const comments = commentDocs.docs.map((comm) => ({
        id: comm.id,
        ...comm.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log("fetching comments", error);
    }
    setFetchLoading(false);
  };
  useEffect(() => {
    if(!selectedPost)return;
    getPostComments();
  }, [selectedPost]);
  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex direction="column" pl={10} pr={6} mb={4}>
       {!fetchLoading && <CommentInput
          commentText={commentText}
          user={user}
          setCommentText={setCommentText}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        ></CommentInput>}
      </Flex>
      <Stack spacing={6}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length ? (
              <>
                {comments.map((item: Comment) => (
                  <CommentItem
                    key={item.id}
                    comment={item}
                    onDeleteComment={onDeleteComment}
                    isLoading={loadingDeleteId===item.id}
                    userId={user?.uid}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
