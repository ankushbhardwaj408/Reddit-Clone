import { Community, communityState } from "@/src/atom/communitiesAtom";
import { auth, firestore, storage } from "@/src/firebase/clientApp";
import useSelectFile from "@/src/hooks/useSelectFile";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { error } from "console";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";

import Link from "next/link";
import { useRouter } from "next/router";

import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();

     
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [uploadingImage,setUploadingImage]=useState(false);
 const [communityStateValue, setCommunityStateValue] =
   useRecoilState(communityState);
const [mem,setMem]=useState();
  const router = useRouter();
  const onUpdateImage=async ()=>{
setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageUrl: downloadURL,
      });


      const userRef = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityData.id
      );
       await updateDoc(userRef, { imageUrl :communityData.imageUrl});

      
   
setCommunityStateValue((prev)=>({
  ...prev,
  currentCommunity:{...prev.currentCommunity,
    imageUrl:downloadURL,
  } as Community
  
}))

    } catch (error:any) {
console.log("error uploading image",error.message)}
setUploadingImage(false);
  }
  return (
    <Box position="sticky" top="14px" width="100%">
      <Flex
        align="center"
        color="white"
        bg="blue.400"
        justify="space-between"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal}></Icon>
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex flexGrow={1} direction="column">
              <Text>
                <>
                
                  {communityStateValue.currentCommunity?.numberOfMembers.toLocaleString()}
               
                </>
              </Text>
              <Text>Members</Text>
            </Flex>
            <Flex flexGrow={1} direction="column">
              <Text>1</Text>

              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider></Divider>
          <Flex
            align="center"
            width="100%"
            fontSize="10pt"
            fontWeight={500}
            p={1}
          >
            <Icon as={RiCakeLine} mr={2} fontSize={18}></Icon>
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt?.seconds * 1000)
                ).fromNow()}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height="30px" width="100%">
              Create Post
            </Button>
          </Link>

          {user?.uid === communityData.createrId && (
            <>
              <Divider></Divider>
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                    cursor="pointer"
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageUrl || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageUrl}
                      boxSize="40px"
                      borderRadius="full"
                      alt="Community Image"
                    ></Image>
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    ></Icon>
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner></Spinner>
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  ref={selectedFileRef}
                  type="file"
                  hidden
                  onChange={onSelectFile}
                ></input>
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
