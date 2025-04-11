import Category from "@/components/icons/category";
// import Notification from "@/components/icons/notification";
import Chat from "@/components/icons/chat";
// import Logs from "@/components/icons/clipboard";
import CRM from "@/components/icons/crm";
import Envelope from "@/components/icons/envelope";
import Home from "@/components/icons/home";
import Payment from "@/components/icons/payment";
import Settings from "@/components/icons/settings";
import User from "@/components/icons/user";
import Template from "@/components/icons/cloud_download";
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
  { name: "Template", Component: Template, href: "/dashboard/template" },
  { name: "Notification", Component: User, href: "/dashboard/notification" },
  { name: "Security", Component: User, href: "/dashboard/security" },
  { name: "Team", Component: Chat, href: "/dashboard/team" },
  { name: "Event", Component: Envelope, href: "/dashboard/event" },
  { name: "CRM", Component: CRM, href: "/dashboard/crm" },
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
    title: "Template",
    href: "/dashboard/template",
    description: "Template",
  },
  {
    title: "Notification",
    href: "/dashboard/notification",
    description: "Notification",
  },
  {
    title: "Security",
    href: "/dashboard/security",
    description: "Security",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    description: "Team",
  },
  {
    title: "Event",
    href: "/dashboard/event",
    description: "Event",
  },
  {
    title: "CRM",
    href: "/dashboard/crm",
    description: "CRM",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    description: "Billing",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    description: "Settings",
  },
  {
    title: "登录",
    href: "/auth",
    description: "用户登录",
  },
];
