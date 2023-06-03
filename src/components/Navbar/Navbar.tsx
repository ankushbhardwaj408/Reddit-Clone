import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import Directory from "./Directory/Directory";
import useDirectory from "@/src/hooks/useDirectory";
import { defaultMenuItem } from "@/src/atom/directoryMenuAtom";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
   const { onSelectMenuItem } = useDirectory();
  return (
    <div>
      <Flex bg="white" height="44px" padding="6px 12px" align="center" justify={{md:"space-between",}}>
        <Flex align="center" width={{base:"40px",md:"auto"}} mr={{base:0,md:2}} cursor="pointer" onClick={()=>onSelectMenuItem(defaultMenuItem)}>
          <Image src="/images/redditFace.svg" height="30px" />
          <Image
            src="/images/redditText.svg"
            height="46px"
            display={{ base: "none", md: "unset" }}
          />
        </Flex>
        {user && <Directory />}
        <SearchInput user={user} />
        <RightContent user={user} />
      </Flex>
    </div>
  );
};
export default Navbar;
