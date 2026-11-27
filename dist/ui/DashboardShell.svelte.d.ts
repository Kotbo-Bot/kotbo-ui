export interface ShellNavItem {
    id: string;
    label: string;
    shortLabel?: string;
    icon: string;
    href?: string;
    active: boolean;
    badge?: number;
    badgeTone?: 'default' | 'accent' | 'warn';
    tag?: string;
    onSelect: () => void;
}
export interface ShellSecondaryItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    active?: boolean;
    external?: boolean;
    onSelect?: () => void;
}
export interface ShellUserMenuLink {
    id: string;
    label: string;
    icon: string;
    href: string;
    external?: boolean;
    onSelect?: () => void;
}
export type ShellThemeMode = 'auto' | 'light' | 'dark';
import { type Snippet } from 'svelte';
type $$ComponentProps = {
    brandName?: string;
    brandLogo?: string;
    brandTag?: string;
    brandHref?: string;
    storageKey?: string;
    sectionLabel: string;
    secondarySectionLabel?: string;
    activeTitle: string;
    primaryNav: ShellNavItem[];
    secondaryNav?: ShellSecondaryItem[];
    userMenuLinks?: ShellUserMenuLink[];
    username: string;
    userRoleLabel?: string;
    avatarUrl?: string;
    themeMode?: ShellThemeMode;
    onThemeChange?: (mode: ShellThemeMode) => void;
    onNavigate?: (path: string) => void;
    onLogout?: () => void;
    renderIcon?: Snippet<[string]>;
    topbarLeft?: Snippet;
    topbarRight?: Snippet;
    userMenuExtra?: Snippet;
    children: Snippet;
};
declare const DashboardShell: import("svelte").Component<$$ComponentProps, {}, "">;
type DashboardShell = ReturnType<typeof DashboardShell>;
export default DashboardShell;
