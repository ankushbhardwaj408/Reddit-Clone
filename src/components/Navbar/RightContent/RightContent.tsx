import { auth } from "@/src/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <Flex justify="center" align="center">
        <AuthModal />
        {user ? (
            <Icons/>
          
        ) : (
          <AuthButtons />
        )}
        <UserMenu user={user}/>
      </Flex>
    </>
  );
};
export default RightContent;
