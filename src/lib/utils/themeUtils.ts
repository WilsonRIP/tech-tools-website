"use client";

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that merges multiple class values into a single string
 * Works with Tailwind CSS and helps avoid class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates conditional classes based on theme
 * @param lightClasses - Classes to apply in light mode
 * @param darkClasses - Classes to apply in dark mode
 * @param baseClasses - Classes to apply in both modes
 * @param isDark - Current theme state (dark or light)
 */
export function themeClass(
  lightClasses: string,
  darkClasses: string,
  baseClasses: string = "",
  isDark: boolean = false
): string {
  return cn(
    baseClasses,
    isDark ? darkClasses : lightClasses
  );
}

/**
 * Builds a gradient background class based on the current theme
 * @param lightGradient - Gradient classes for light mode
 * @param darkGradient - Gradient classes for dark mode
 * @param isDark - Current theme state
 */
export function themeGradient(
  lightGradient: string,
  darkGradient: string,
  isDark: boolean = false
): string {
  return isDark ? darkGradient : lightGradient;
}
