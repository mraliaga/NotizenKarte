import { goToIcon, homeIcon, jobIcon, parkIcon } from "./constant.js";

//Status durumunu belirleyen fonk
export const getStatus = (status) => {
  switch (status) {
    case "goto":
      return "Visit";
    case "home":
      return "Home";
    case "park":
      return "Parking Area";
    case "job":
      return "Work Place";
    default:
      return "Another";
  }
};

//Status degerine bagli olrak icon belirleyecek fonk

export const getIcon = (status) => {
  switch (status) {
    case "goto":
      return goToIcon;
    case "home":
      return homeIcon;
    case "park":
      return parkIcon;
    case "job":
      return jobIcon;
    default:
      return null;
  }
};
