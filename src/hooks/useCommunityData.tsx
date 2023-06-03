import { async } from "@firebase/util";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atom/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atom/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityState = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const [numOfMem, setNumOfMem] = useState(0);

  const authModalStateValue = useSetRecoilState(authModalState);
  const router = useRouter();

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (!user) {
      authModalStateValue({
        open: true,
        view: "login",
      });
      return;
    }

    if (isJoined) {
      console.log(numOfMem);
      leaveCommunity(communityData.id, communityData);
      console.log(numOfMem);
      return;
    }
    if (!isJoined) {
      console.log(numOfMem);
      joinCommunity(communityData);
      console.log(numOfMem);
      return;
    }
  };

  const getMySnippets = async () => {
    setloading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched:true,
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
    setloading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    setloading(true);
    try {
      const batch = writeBatch(firestore);
      const newSnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || "",
        isModerator:user?.uid==communityData.createrId,
      };
      //add the mySnippets into the user
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      //increase the no of memebers in the particular community
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      //updating numof mem

      // getNumofMem();

      await batch.commit();
      const docRef = doc(firestore, "communities", communityData.id);
      const docSnap = await getDoc(docRef);
      const x = docSnap.data()?.numberOfMembers;
      //update the communityStateValue
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
        currentCommunity: {
          ...prev.currentCommunity,
          numberOfMembers: x,
        } as Community,
      }));
    } catch (error: any) {
      console.log("joining community error", error);
      setError(error.message);
    }

    setloading(false);
  };
  const leaveCommunity = async (
    communityId: string,
    communityData: Community
  ) => {
    setloading(true);
    try {
      const batch = writeBatch(firestore);

      //add the mySnippets into the user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      //increase the no of memebers in the particular community
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      // getNumofMem();
      await batch.commit();
      const docRef = doc(firestore, "communities", communityData.id);
      const docSnap = await getDoc(docRef);
      const y = docSnap.data()?.numberOfMembers;
      //update the communityStateValue

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
        currentCommunity: {
          ...prev.currentCommunity,
          numberOfMembers: y,
        } as Community,
      }));
    } catch (error: any) {
      console.log("joining community error", error);
      setError(error.message);
    }

    setloading(false);
  };
const getCommunityData=async(communityId:string)=>{
  try {
    const docRef = doc(firestore, "communities", communityId);
    const data = await getDoc(docRef);
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: { id: data.id, ...data.data() } as Community,
    }));
  } catch (error:any) {
    console.log("error getting comm",error.meassege)
  }
};
useEffect(()=>{
const {communityId}=router.query;
if(communityId && !communityStateValue.currentCommunity){
  getCommunityData(communityId as string)
}
},[router.query,communityStateValue.currentCommunity])
  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched:false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityState;
