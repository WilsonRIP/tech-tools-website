// src/data/navigation.ts

export interface NavigationLink {
  name: string;
  url: string;
  isExternal?: boolean;
}

export interface NavigationGroup {
  title: string;
  links: NavigationLink[];
}

// Main navigation links used in both navbar and footer
export const mainNavLinks: NavigationLink[] = [
  // { name: "Home", url: "/" }, // Home is typically handled by the logo
];

// Additional links for footer only
export const resourceLinks: NavigationLink[] = [
];

// Category quick links for footer
export const categoryLinks: NavigationLink[] = [
];

// Organized footer link groups
export const footerLinkGroups: NavigationGroup[] = [
  {
    title: "Navigation",
    links: mainNavLinks,
  },
  {
    title: "Explore",
    links: categoryLinks,
  },
  {
    title: "Resources",
    links: resourceLinks,
  },
];
