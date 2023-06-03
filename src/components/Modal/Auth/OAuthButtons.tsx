import { Button, Flex ,Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Image } from "@chakra-ui/react";
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import { auth, firestore } from "@/src/firebase/clientApp";
import { User } from "firebase/auth";
import {  collection, doc, setDoc } from "firebase/firestore";

const OAuthModal: React.FC = () => { 
  const [signInWithGoogle,userCred,loading,error]=useSignInWithGoogle(auth);
  
   const createUserDocument = async (user: User) => {
     await setDoc(doc(firestore,"users",user.uid),JSON.parse(JSON.stringify(user)))
   };

   useEffect(() => {
     if (userCred) {
       createUserDocument(userCred.user);
     }
   }, [userCred]);

  return(
  <Flex width="100%" mb={4} direction="column">
    <Button width="100%" variant="oauth" mb={2} isLoading={loading} onClick={()=>signInWithGoogle()}>
      <Image src="/images/googlelogo.png" height="20px" mr={4} />
      Continue with Google
    </Button>
    <Button width="100%" variant="oauth">
      Some Other Provider
    </Button>
    <Text>{error?.message}</Text>
  </Flex>
)};
export default OAuthModal;
