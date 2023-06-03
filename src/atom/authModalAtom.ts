import { atom } from "recoil";
export interface AuthModalState {
  open: boolean;
  view: ModalView;
}
export type ModalView = "login" | "signup" | "resetpassword";
const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};
export const authModalState = atom({
  key: "authModalState",
  default: defaultModalState,
});
