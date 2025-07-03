import { ReactNode } from 'react';

// Basic props
export interface BaseProps {
  className?: string;
  id?: string;
}

// Feature interface
export interface Feature {
  title: string;
  description: string;
  icon: string; // Icon name
  gradient: string;
  badge?: string;
}

// Technology interface
export interface Technology {
  name: string;
  logo: string;
  color: string;
}

// Component props
export interface HeroSectionProps extends BaseProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  secondaryCtaText?: string;
  secondaryCtaAction?: () => void;
  isVisible?: boolean;
  animate?: boolean;
  navigate?: (path: string) => void;
}

export interface TechStackSectionProps extends BaseProps {
  technologies?: Technology[];
  isVisible?: boolean;
}

export interface FeaturesSectionProps extends BaseProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
  isVisible?: boolean;
}

export interface FeatureCardProps extends BaseProps {
  feature: Feature;
  index?: number;
  isVisible?: boolean;
}

// ShowcaseItem interface
export interface ShowcaseItem {
  title: string;
  description: string;
  features?: string[];
  gradient?: string;
}

export interface ShowcaseSectionProps extends BaseProps {
  title?: string;
  subtitle?: string;
  items?: ShowcaseItem[];
  isVisible?: boolean;
}

export interface TestimonialSectionProps extends BaseProps {
  testimonials?: {
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar?: string;
  }[];
  title?: string;
  subtitle?: string;
  isVisible?: boolean;
}

export interface CtaSectionProps extends BaseProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonAction?: () => void;
  backgroundImage?: string;
  isVisible?: boolean;
}

export interface FooterProps extends BaseProps {
  links?: {
    title: string;
    items: {
      text: string;
      href: string;
    }[];
  }[];
  socialLinks?: {
    icon: ReactNode;
    href: string;
    label: string;
  }[];
  copyrightText?: string;
}

export interface NavigationProps extends BaseProps {
  transparent?: boolean;
}

// Layout interfaces
export interface LayoutProps {
  children: ReactNode;
  isHomePage?: boolean;
  isCompliancePage?: boolean;
}

// Animation props
export interface AnimatedElementProps extends BaseProps {
  isVisible?: boolean;
  delay?: number;
  duration?: number;
  initialPosition?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  children?: ReactNode;
}

// Form props
export interface FormInputProps extends BaseProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
} 