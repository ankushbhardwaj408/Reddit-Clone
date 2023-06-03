
import { authModalState } from "@/src/atom/authModalAtom";
import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

const AuthButtons: React.FC = () => {
  const setModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        width={{ sm: "70px", md: "110px" }}
        display={{ base: "none", md: "flex" }}
        mr={2}
        onClick={() => {
          setModalState({ open: true, view: "login" });
        }}
      >
        Log In
      </Button>
      <Button
        height="28px"
        width={{ sm: "70px", md: "110px" }}
        display={{ base: "none", md: "flex" }}
        mr={2}
        onClick={() => {
          setModalState({ open: true, view: "signup" });
        }}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
