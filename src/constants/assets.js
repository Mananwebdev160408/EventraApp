export const DUMMY_IMAGES = {
  event1: require("../../assets/WhatsApp Image 2026-02-23 at 10.18.58 AM.jpeg"),
  event2: require("../../assets/WhatsApp Image 2026-02-23 at 10.19.11 AM.jpeg"),
  event3: require("../../assets/WhatsApp Image 2026-02-23 at 10.21.28 AM.jpeg"),
  event4: require("../../assets/WhatsApp Image 2026-02-23 at 10.21.57 AM.jpeg"),
  stadium1: require("../../assets/WhatsApp Image 2026-02-23 at 2.05.54 PM.jpeg"),
  stadium2: require("../../assets/WhatsApp Image 2026-02-23 at 2.05.55 PM (1).jpeg"),
  stadium3: require("../../assets/WhatsApp Image 2026-02-23 at 2.05.55 PM (2).jpeg"),
  stadium4: require("../../assets/WhatsApp Image 2026-02-23 at 2.05.55 PM.jpeg"),
};

export const getEventImage = (id) => {
  const images = [
    DUMMY_IMAGES.event1,
    DUMMY_IMAGES.event2,
    DUMMY_IMAGES.event3,
    DUMMY_IMAGES.event4,
  ];
  return images[id % images.length] || images[0];
};

export const getStadiumImage = (id) => {
  const images = [
    DUMMY_IMAGES.stadium1,
    DUMMY_IMAGES.stadium2,
    DUMMY_IMAGES.stadium3,
    DUMMY_IMAGES.stadium4,
  ];
  return images[id % images.length] || images[0];
};
