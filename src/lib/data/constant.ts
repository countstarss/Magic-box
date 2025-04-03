import Category from '@/components/icons/category'
import Chat from '@/components/icons/chat'
import Logs from '@/components/icons/clipboard'
import CRM from '@/components/icons/crm'
import Envelope from '@/components/icons/envelope'
import Home from '@/components/icons/home'
import Payment from '@/components/icons/payment'
import Settings from '@/components/icons/settings'
import User from '@/components/icons/user'

/*
NOTE: 用于提供给滚动条
MARK: - Clients
*/
export const clients = [...new Array(10)].map((_, index) => ({
    href: `/${index + 1}.png`,
}))


/*
NOTE: Product为page的HeroParallax提供数据
MARK: - Product
*/
export const products = [
    {
        title: 'Moonbeam',
        link: 'https://gomoonbeam.com',
        thumbnail: '/p1.png',
    },
    {
        title: 'Cursor',
        link: 'https://cursor.so',
        thumbnail: '/p2.png',
    },
    {
        title: 'Rogue',
        link: 'https://userogue.com',
        thumbnail: '/p3.png',
    },

    {
        title: 'Editorially',
        link: 'https://editorially.org',
        thumbnail: '/p4.png',
    },
    {
        title: 'Editrix AI',
        link: 'https://editrix.ai',
        thumbnail: '/p5.png',
    },
    {
        title: 'Pixel Perfect',
        link: 'https://app.pixelperfect.quest',
        thumbnail: '/p6.png',
    },

    {
        title: 'Algochurn',
        link: 'https://algochurn.com',
        thumbnail: '/p1.png',
    },
    {
        title: 'Aceternity UI',
        link: 'https://ui.aceternity.com',
        thumbnail: '/p2.png',
    },
    {
        title: 'Tailwind Master Kit',
        link: 'https://tailwindmasterkit.com',
        thumbnail: '/p3.png',
    },
    {
        title: 'SmartBridge',
        link: 'https://smartbridgetech.com',
        thumbnail: '/p4.png',
    },
    {
        title: 'Renderwork Studio',
        link: 'https://renderwork.studio',
        thumbnail: '/p5.png',
    },

    {
        title: 'Creme Digital',
        link: 'https://cremedigital.com',
        thumbnail: '/p6.png',
    },
    {
        title: 'Golden Bells Academy',
        link: 'https://goldenbellsacademy.com',
        thumbnail: '/p1.png',
    },
    {
        title: 'Invoker Labs',
        link: 'https://invoker.lol',
        thumbnail: '/p2.png',
    },
    {
        title: 'E Free Invoice',
        link: 'https://efreeinvoice.com',
        thumbnail: '/p3.png',
    },
]

/*
MARK: - menuOptions
*/
export const menuOptions = [
    { name: 'Home', Component: Home, href: '/dashboard' },
    { name: 'Content', Component: Category, href: '/dashboard/content' },
    { name: 'You', Component: User, href: '/dashboard/you' },
    { name: 'Billing', Component: Payment, href: '/dashboard/billing' },
    { name: 'Settings', Component: Settings, href: '/dashboard/settings' },
]
export const menuOptions2 = [
    { name: 'Logs', Component: Logs, href: '/dashboard/logs' },
    { name: 'Chat', Component: Chat, href: '/dashboard/chat' },
    { name: 'Mail', Component: Envelope, href: '/dashboard/mail' },
    { name: 'CRM', Component: CRM, href: '/dashboard/crm' },
]

/*
TODO: EditorCanvasDefaultCardTypes
NOTE: 定义Editor界面的"Card"
MARK: - EditorCanvasDefaultCardTypes
*/

export const EditorCanvasDefaultCardTypes = {
    Email: { description: 'Send and email to a user', type: 'Action' },
    Condition: {
        description: 'Boolean operator that creates different conditions lanes.',
        type: 'Action',
    },
    AI: {
        description:
            'Use the power of AI to summarize, respond, create and much more.',
        type: 'Action',
    },
    Slack: { description: 'Send a notification to slack', type: 'Action' },
    'Google Drive': {
        description:
            'Connect with Google drive to trigger actions or to create files and folders.',
        type: 'Trigger',
    },
    Notion: { description: 'Create entries directly in notion.', type: 'Action' },
    'Custom Webhook': {
        description:
            'Connect any app that has an API key and send data to your applicaiton.',
        type: 'Action',
    },
    Discord: {
        description: 'Post messages to your discord server',
        type: 'Action',
    },
    'Google Calendar': {
        description: 'Create a calendar invite.',
        type: 'Action',
    },
    Trigger: {
        description: 'An event that starts the workflow.',
        type: 'Trigger',
    },
    Action: {
        description: 'An event that happens after the workflow begins',
        type: 'Action',
    },
    Wait: {
        description: 'Delay the next action step by using the wait timer.',
        type: 'Action',
    },
}
