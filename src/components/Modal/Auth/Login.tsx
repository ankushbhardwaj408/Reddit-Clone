import { authModalState } from "@/src/atom/authModalAtom";
import { auth } from "@/src/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const setModalState = useSetRecoilState(authModalState);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          required
          name="email"
          type="email"
          placeholder="email"
          mb={2}
          onChange={handleChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="password"
          mb={2}
          onChange={handleChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Flex justifyContent="center" mb={2}>
          <Text fontSize="9pt" mr={1}>
            Forget your password?
          </Text>
          <Text
            fontSize="9pt"
            color="blue.500"
            cursor="pointer"
            onClick={() => {setModalState((prev) => ({
              ...prev,
              view: "resetpassword",
            }));}}
          >
            Reset
          </Text>
        </Flex>
        <Text textAlign="center" color="red" fontSize="10px">
          {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
        <Button width="100%" mt={2} mb={2} type="submit" isLoading={loading}>
          Login
        </Button>
        <Flex fontSize="9pt" justifyContent="center">
          <Text mr={2}>New here?</Text>
          <Text
            textColor="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() => {
              setModalState((prev) => ({
                ...prev,
                view: "signup",
              }));
            }}
          >
            SIGN UP
          </Text>
        </Flex>
      </form>
    </>
  );
};
export default Login;
