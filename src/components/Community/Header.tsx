import { Community, communityState } from "@/src/atom/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Text, Image } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilValue } from "recoil";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
    const communityValue = useRecoilValue(communityState);
  const { onJoinOrLeaveCommunity, communityStateValue, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );
  return (
    <>
      <Flex direction="column" width="100%" height="146px">
        <Box height="50%" bg="blue.400" />
        <Flex justify="center" bg="white" flexGrow={1}>
          <Flex width="95%" maxWidth="860px">
            {communityValue.currentCommunity?.imageUrl ? (
              <Image
                borderRadius="full"
                boxSize="66px"
                alt="Ankush"
                position="relative"
                top={-3}
                src={communityValue.currentCommunity.imageUrl}
                color="blue.500"
                border="4px solid white"
              ></Image>
            ) : (
              <Icon
                as={FaReddit}
                fontSize={64}
                position="relative"
                top={-3}
                color="blue.500"
                border="4px solid white"
                borderRadius="full"
              ></Icon>
            )}
            <Flex padding="10px 16px">
              <Flex direction="column" mr={6}>
                <Text fontWeight={800} fontSize="16pt">
                  {communityData.id}
                </Text>
                <Text fontWeight={600} fontSize="10pt" color="gray.400">
                  r/{communityData.id}
                </Text>
              </Flex>
              <Button
                variant={isJoined ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                isLoading={loading}
                onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default Header;
