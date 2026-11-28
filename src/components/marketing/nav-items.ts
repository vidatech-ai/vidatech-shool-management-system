export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href?: string;
  chevron?: boolean;
  children?: NavChild[];
};

/* Add real links later: give an item an href, or fill its children array. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About" },
  { label: "Features", chevron: true },
  { label: "Pricing" },
  { label: "Schools" },
  { label: "Resources", chevron: true },
  { label: "Support", chevron: true },
];
