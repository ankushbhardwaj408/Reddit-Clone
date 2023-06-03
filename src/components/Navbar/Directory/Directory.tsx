import { authModalState } from "@/src/atom/authModalAtom";
import useDirectory from "@/src/hooks/useDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Icon, Menu, MenuButton, MenuList, Text,Image } from "@chakra-ui/react";
import React from "react";
import { TiHome } from "react-icons/ti";
import { useSetRecoilState } from "recoil";
import CreateCommunity from "./CreateCommunity";

const UserMenu: React.FC = () => {
  const { toggleMenuOpen, directoryState } = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        padding="0px 6px"
        cursor="pointer"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={() => toggleMenuOpen()}
      >
        <Flex
          align="center"
          justify="space-evenly"
          width={{ base: "auot", lg: "200px" }}
        >
          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image src={directoryState.selectedMenuItem.imageURL} borderRadius="full" boxSize="24px" mr={2}></Image>
            ) : (
              <Icon as={directoryState.selectedMenuItem.icon} color={directoryState.selectedMenuItem.iconColor} fontSize={24} mr={{ base: 1, md: 2 }}></Icon>
            )}
            <Flex display={{ base: "none", md: "flex" }}>
              <Text fontSize="10pt" fontWeight={600}>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon></ChevronDownIcon>
        </Flex>
      </MenuButton>
      <MenuList>
        <CreateCommunity />
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
