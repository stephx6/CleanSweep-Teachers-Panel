// types/types.ts
import React from "react";

export type LayoutProps = {
  children: React.ReactNode;
};

export type inputSize = "sm" | "md" | "lg";

// Fixed: Changed 'inputsize' to 'size' for better API, or keep as 'inputsize' but be consistent
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: inputSize; // Changed to 'size' for better API (or keep 'inputsize' if you prefer)
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface HeaderProps {
  onMenuClick?: () => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface CardWithSkeletonProps extends CardProps {
  isLoading?: boolean;
  skeletonHeight?: string;
  skeletonWidth?: string;
  fullWidth?: boolean;
}

export interface Player {
  id : string; 
  username : string;
  totalTrashSegregated : number | null;
  envirocoins : number;
}

export interface PopUpModalProps {
  player : Player | null;
  isOpen : boolean;
  onClose : () => void;
}