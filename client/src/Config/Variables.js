import { Styles } from "./Colors";
import { TinyColor } from "@ctrl/tinycolor";

export const Variables = {
  verfiedOTP: "OTP verified",
  SignedIn: "SignedIn",
  AdminRole: "Admin",
  ManagerRole: "Manager",
  SuccessMessage: "success",
  ApprovedText: "Approved",
  RejectedText: "Rejected",
  otpRequired: "OTP is required",
  MedicalText:"Medical"
};
export const OPTIONS = [
  { value: "Create", label: "Create" },
  { value: "Edit", label: "Edit" },
  { value: "View", label: "View" },
  { value: "Delete", label: "Delete" },
];
export const STATUSOPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "In-Active" },
];
export const ButtonColor = [

  Styles.varButtonColor,
  Styles.varButtonColor,
  Styles.varButtonColor,
];
export const getHoverColors = (colors) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
export const getActiveColors = (colors) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());
