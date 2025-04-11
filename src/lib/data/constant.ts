import Category from "@/components/icons/category";
// import Notification from "@/components/icons/notification";
import Chat from "@/components/icons/chat";
import Logs from "@/components/icons/clipboard";
import CRM from "@/components/icons/crm";
import Envelope from "@/components/icons/envelope";
import Home from "@/components/icons/home";
import Payment from "@/components/icons/payment";
import Settings from "@/components/icons/settings";
import User from "@/components/icons/user";

/*
NOTE: 用于提供给滚动条
MARK: - Clients
*/
export const clients = [...new Array(10)].map((_, index) => ({
  href: `/${index + 1}.png`,
}));

/*
MARK: - menuOptions
*/
export const menuOptions = [
  { name: "Home", Component: Home, href: "/dashboard" },
  { name: "Template", Component: Category, href: "/dashboard/template" },
  { name: "Notification", Component: User, href: "/dashboard/notification" },
  { name: "Security", Component: User, href: "/dashboard/security" },
  { name: "Team", Component: Chat, href: "/dashboard/team" },
  { name: "Event", Component: Envelope, href: "/dashboard/event" },
  { name: "CRM", Component: CRM, href: "/dashboard/crm" },
  { name: "Data", Component: CRM, href: "/dashboard/data" },
  { name: "Billing", Component: Payment, href: "/dashboard/billing" },
  { name: "Settings", Component: Settings, href: "/dashboard/settings" },
];

// MARK: mobileMenu
export const mobileMenu: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Beijing Program",
    href: "/beijing-program",
    description: "Beijing Program",
  },
  {
    title: "Online Program",
    href: "/online-program",
    description: "Online Program",
  },
  {
    title: "VIP Online Course",
    href: "/vip-online-course",
    description: "VIP Online Course",
  },
  {
    title: "HSK Quiz",
    href: "/hsk-quiz",
    description: "HSK Quiz",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Blog",
  },
  {
    title: "Flashcards",
    href: "/flashcards",
    description: "Flashcards",
  },
  {
    title: "Events",
    href: "/events",
    description: "Events",
  },
  {
    title: "Chinese teachers",
    href: "/chinese-teachers",
    description: "Chinese teachers",
  },
  {
    title: "About",
    href: "/about",
    description: "About",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Contact",
  },
  {
    title: "邮箱",
    href: "/mail",
    description: "邮箱应用",
  },
  {
    title: "Gmail",
    href: "/gmail",
    description: "Gmail邮箱集成",
  },
  {
    title: "登录",
    href: "/auth",
    description: "用户登录",
  },
];
