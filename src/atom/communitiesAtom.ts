import { Timestamp } from "firebase/firestore";
import {atom} from "recoil";

export interface Community{
    id:string;
    createrId:string;
    numberOfMembers:number;
    privacyType:'public' | 'restricted' | 'private';
    createdAt?:Timestamp;
    imageUrl?:string;
}

export interface CommunitySnippet{
    communityId:string,
    isModerator?:boolean,
    imageUrl?:string
}
interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  snippetsFetched:boolean;
}
const defaultCommunityState:CommunityState={
    mySnippets:[],
    snippetsFetched:false,
   
}
export const communityState=atom<CommunityState>({
    key:"communitiesState",
    default:defaultCommunityState
})