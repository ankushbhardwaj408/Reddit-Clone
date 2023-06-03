import React, { useEffect, useState } from "react";
import { authModalState } from "@/src/atom/authModalAtom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";

import { useSetRecoilState } from "recoil";
import { auth, firestore } from "../../../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const setModalState = useSetRecoilState(authModalState);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError("");
    if (signUpForm.confirmPassword !== signUpForm.password) {
      setError("Password do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await setDoc(
      doc(firestore, "users",user?.uid),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(()=>{
if(userCred)
{
  createUserDocument(userCred.user);
  
}
  },[userCred]);

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
        <Input
          required
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
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

        <Text textAlign="center" color="red" fontSize="10px">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>

        <Button width="100%" mt={2} mb={2} type="submit" isLoading={loading}>
          Sign Up
        </Button>
        <Flex fontSize="9pt" justifyContent="center">
          <Text mr={2}>Already a redditor?</Text>
          <Text
            textColor="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() => {
              setModalState((prev) => ({
                ...prev,
                view: "login",
              }));
            }}
          >
            LOG IN
          </Text>
        </Flex>
      </form>
    </>
  );
};
export default SignUp;
