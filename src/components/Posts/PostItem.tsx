import { Post } from "@/src/atom/postsAtom";
import {
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  Image,
  Skeleton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import moment from "moment";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { async } from "@firebase/util";
import { communityState } from "@/src/atom/communitiesAtom";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onSelectPost?: (post: Post) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  onVote,
  post,
  onSelectPost,
  userVoteValue,
  userIsCreator,
  onDeletePost,
  homePage,
}) => {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singlePostPage = !onSelectPost;
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete the post");
      }
      console.log("Post deleted successfully");

      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        p={2}
        bg={singlePostPage ? "none" : "gray.100"}
        align="center"
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          onClick={(event) => onVote(event, post, 1, post.communityId)}
          fontSize={22}
          cursor="pointer"
        ></Icon>
        <Text fontSize="9pt">{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          onClick={(event) => onVote(event, post, -1, post.communityId)}
          fontSize={22}
          cursor="pointer"
        ></Icon>
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error deleting post</AlertTitle>
          </Alert>
        )}
        <Stack spacing={1} p="10px 10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {homePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  ></Image>
                ) : (
                  <Icon
                    as={FaReddit}
                    fontSize="18pt"
                    mr={1}
                    color="blue.500"
                  ></Icon>
                )}
                <Link
                
                  href={`r/${post.communityId}`}
                  fontWeight={700}
                  _hover={{textDecoration:"underline"}}
                  onClick={event=>{event?.stopPropagation()}}
                >{`r/${post.communityId}`}</Link>
                <Icon as={BsDot} color="gray.500" fontSize={8}></Icon>
              </>
            )}
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center">
              {imageLoading && (
                <Skeleton
                  height="200px"
                  width="100%"
                  borderRadius={4}
                ></Skeleton>
              )}

              <Image
                src={post.imageURL}
                alt="Post Image"
                maxHeight="460px"
                onLoad={() => setImageLoading(false)}
              ></Image>
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2}></Icon>
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2}></Icon>
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2}></Icon>
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm"></Spinner>
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2}></Icon>
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
