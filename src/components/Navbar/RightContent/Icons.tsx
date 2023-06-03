import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsArrowUpRightCircle, BsChatDots} from "react-icons/bs";
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from "react-icons/io5";
import { GrAdd } from "react-icons/gr";

const Icons: React.FC = () => {
  return (
    <>
      <Flex>
        <Flex
          align="center"
          borderRight="1px solid "
          borderColor="gray.200"
          display={{ base: "none", md: "flex" }}
        >
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={BsArrowUpRightCircle} fontSize={20} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={IoFilterCircleOutline} fontSize={22} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={IoVideocamOutline} fontSize={22} />
          </Flex>
        </Flex>
        <>
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={BsChatDots} fontSize={20} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={IoNotificationsOutline} fontSize={20} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            borderRadius={4}
          >
            <Icon as={GrAdd} fontSize={20} />
          </Flex>
        </>
      </Flex>
    </>
  );
};
export default Icons;
