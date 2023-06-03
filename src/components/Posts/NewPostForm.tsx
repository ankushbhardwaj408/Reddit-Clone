import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { User } from "firebase/auth";
import { Post } from "@/src/atom/postsAtom";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

type NewPostFormProps = {
  user: User;
  commImgUrl?:string;
};
const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Videos",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];
export type Tabitem = {
  title: string;
  icon: typeof Icon.arguments;
};
const NewPostForm: React.FC<NewPostFormProps> = ({ user,commImgUrl }) => {
  const {selectedFile,setSelectedFile,onSelectFile}=useSelectFile();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const handleCreatePost = async () => {
    //create a newpost
    const { communityId } = router.query;
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      communityImageURL:commImgUrl || "", 
    };
    setLoading(true);
    try {
      //store in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      // await updateDoc(postDocRef, {
      //   id: postDocRef.id,
      // });
      // check for selectedfile
      if (selectedFile) {
        // store in storage
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        // update post doc by image
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect user back to home page
    } catch (error: any) {
      console.log("handleCreatePostError", error.message);
      setError(true);
    }
    setLoading(false);
    router.back();
  };

 
  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item,index) => {
          return (
            <TabItem
            key={index}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            ></TabItem>
          );
        })}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Videos" && (
          <ImageUpload
            setSelectedTab={setSelectedTab}
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
          ></ImageUpload>
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error creating post</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
