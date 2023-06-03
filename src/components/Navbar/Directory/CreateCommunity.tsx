import { communityState } from "@/src/atom/communitiesAtom";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import MenuListItem from "./MenuListItem";

type CreateCommunityProps = {};

const CreateCommunity: React.FC<CreateCommunityProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>

        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
            key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor={"brand.100"}
              link={`/r/${snippet.communityId}`}
              imageURL={snippet.imageUrl}
            ></MenuListItem>
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          fontSize="10pt"
          width="100%"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex>
            <Icon fontSize={20} mr={2} as={GrAdd}></Icon>
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
          key={snippet.communityId}
            displayText={`r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor={"gray.500"}
            link={`/r/${snippet.communityId}`}
            imageURL={snippet.imageUrl}
          ></MenuListItem>
        ))}
      </Box>
    </>
  );
};
export default CreateCommunity;
