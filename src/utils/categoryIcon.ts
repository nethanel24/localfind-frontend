import {
  faTag,
  faBook,
  faScrewdriverWrench,
  faCamera,
  faBolt,
  faBroom,
  faDumbbell,
  faHouse,
  faScissors,
  faDog,
  faCar,
  faSeedling,
  faPaintRoller,
  faLaptop,
  faUtensils,
  faBaby,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const categoryIcons: Record<string, IconDefinition> = {
  "כללי": faTag,
  "ספר": faBook,
  "כלי עבודה": faScrewdriverWrench,
  "מצלמה": faCamera,
  "חשמל": faBolt,
  "נקיון": faBroom,
  "כושר": faDumbbell,
  "בית": faHouse,
  "מספריים": faScissors,
  "כלב": faDog,
  "רכב": faCar,
  "גינון": faSeedling,
  "צביעה": faPaintRoller,
  "מחשב": faLaptop,
  "אוכל": faUtensils,
  "תינוק": faBaby,
};

export const iconOptions = Object.keys(categoryIcons);

export const getCategoryIcon = (name?: string): IconDefinition =>
  (name && categoryIcons[name]) || faTag;