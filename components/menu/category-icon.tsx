import {
  ChefHat,
  CupSoda,
  Drumstick,
  Pizza,
  Salad,
  Soup,
  type LucideIcon,
} from "lucide-react"

/** Category → icon, shared by the browse-menu filter tiles and the home section. */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  "Classic Pizzas": Pizza,
  "Vegetarian Pizzas": Salad,
  "Meat Lovers": Drumstick,
  "Specialty / Gourmet Pizzas": ChefHat,
  "Sides & Appetizers": Soup,
  "Beverages & Desserts": CupSoda,
}

export function getCategoryIcon(
  category: string,
  fallback: LucideIcon = Pizza
): LucideIcon {
  return CATEGORY_ICON[category] ?? fallback
}
