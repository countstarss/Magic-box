// MARK: 邮件 (Mails)
/**
 * 电子邮件接口定义
 */
export interface Email {
  id: string; // 唯一标识符
  name: string; // 发件人姓名
  email: string; // 发件人邮箱地址
  subject: string; // 邮件主题
  text: string; // 邮件正文内容
  date: string; // 邮件日期 (ISO 格式字符串)
  read: boolean; // 是否已读
  labels: string[]; // 标签数组 (例如：工作、个人)
  tags: string[]; // 标记数组 (例如：已发送、垃圾邮件)
  isTrash: boolean; // 是否在垃圾箱中
  isArchive: boolean; // 是否已归档
}

/**
 * 邮件数据列表
 */
export const mails: Email[] = [ // 变量名 'mails' 意为 '邮件列表'
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    name: "威廉·史密斯", // William Smith
    email: "williamsmith@example.com",
    subject: "明天开会", // Meeting Tomorrow
    text: "你好，我们明天开个会讨论项目吧。我回顾了项目细节，有一些想法想分享。为了确保项目成功，我们必须在下一步行动上达成一致。\n\n请准备好你可能有的任何问题或见解。期待我们的会议！\n\n顺颂商祺，威廉",
    date: "2023-10-22T09:00:00",
    read: true,
    labels: ["会议", "工作", "重要"], // ["meeting", "work", "important"]
    tags: ['已发送', '垃圾邮件'], // ['sent','junk']
    isTrash: false,
    isArchive: false
  },
  {
    id: "110e8400-e29b-11d4-a716-446655440000",
    name: "爱丽丝·史密斯", // Alice Smith
    email: "alicesmith@example.com",
    subject: "回复：项目更新", // Re: Project Update
    text: "感谢您的项目更新。看起来很棒！我仔细阅读了报告，进展令人印象深刻。团队做得非常出色，我感谢每个人的辛勤工作。\n\n我有一些小的建议，会包含在附件文档中。\n\n我们下次会议再讨论这些。请继续保持出色的工作！\n\n此致，爱丽丝",
    date: "2023-10-22T10:30:00",
    read: true,
    labels: ["工作", "重要"], // ["work", "important"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    name: "鲍勃·约翰逊", // Bob Johnson
    email: "bobjohnson@example.com",
    subject: "周末计划", // Weekend Plans
    text: "周末有什么计划吗？我在想去附近的山上徒步。我们好久没有进行户外活动了。\n\n如果你感兴趣，请告诉我，我们可以计划一下细节。这将是放松身心、享受大自然的好方法。\n\n期待你的回复！\n\n鲍勃",
    date: "2023-04-10T11:45:00",
    read: true,
    labels: ["个人"], // ["personal"]
    tags: ['已发送', '垃圾邮件'], // ['sent','junk']
    isTrash: false,
    isArchive: false
  },
  {
    id: "61c35085-72d7-42b4-8d62-738f700d4b92",
    name: "艾米丽·戴维斯", // Emily Davis
    email: "emilydavis@example.com",
    subject: "回复：关于预算的问题", // Re: Question about Budget
    text: "我有一个关于即将进行的项目预算的问题。资源分配似乎存在差异。\n\n我查阅了预算报告，并发现了一些我们可以在不影响项目质量的前提下优化支出的地方。\n\n我附上了一份详细的分析供您参考。我们下次会议再详细讨论。\n\n谢谢，艾米丽",
    date: "2023-03-25T13:15:00",
    read: false,
    labels: ["工作", "预算"], // ["work", "budget"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "8f7b5db9-d935-4e42-8e05-1f1d0a3dfb97",
    name: "迈克尔·威尔逊", // Michael Wilson
    email: "michaelwilson@example.com",
    subject: "重要通知", // Important Announcement
    text: "我将在我们的团队会议上宣布一个重要事项。这关系到我们即将推出的产品发布策略的战略性转变。我们收到了 Beta 测试人员的宝贵反馈，我认为现在是时候进行一些调整以更好地满足客户需求了。\n\n这一改变对我们的成功至关重要，我期待与团队讨论。请准备好在会议期间分享你的见解。\n\n此致，迈克尔",
    date: "2023-03-10T15:00:00",
    read: false,
    labels: ["会议", "工作", "重要"], // ["meeting", "work", "important"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "1f0f2c02-e299-40de-9b1d-86ef9e42126b",
    name: "莎拉·布朗", // Sarah Brown
    email: "sarahbrown@example.com",
    subject: "回复：关于提案的反馈", // Re: Feedback on Proposal
    text: "感谢您对提案的反馈。看起来很棒！我很高兴听到您觉得它很有前景。团队努力解决了您提出的所有关键点，我相信我们现在为项目奠定了坚实的基础。\n\n我附上了修订后的提案供您审阅。\n\n如果您有任何进一步的意见或建议，请告诉我。期待您的回复。\n\n顺颂商祺，莎拉",
    date: "2023-02-15T16:30:00",
    read: true,
    labels: ["工作"], // ["work"]
    tags: ['已发送'], // ['sent']
    isTrash: true, // 在垃圾箱中
    isArchive: false
  },
  {
    id: "17c0a96d-4415-42b1-8b4f-764efab57f66",
    name: "大卫·李", // David Lee
    email: "davidlee@example.com",
    subject: "新项目想法", // New Project Idea
    text: "我有一个令人兴奋的新项目想法想和您讨论。它涉及将我们的服务扩展到一个近几个月显示出可观增长的小众市场。\n\n我准备了一份详细的提案，概述了潜在的好处和执行策略。\n\n这个项目有可能对我们的业务产生显著的积极影响。让我们安排一次会议深入探讨细节，并确定它是否符合我们当前的目标。\n\n顺颂商祺，大卫",
    date: "2023-01-28T17:45:00",
    read: false,
    labels: ["会议", "工作", "重要"], // ["meeting", "work", "important"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "2f0130cb-39fc-44c4-bb3c-0a4337edaaab",
    name: "奥利维亚·威尔逊", // Olivia Wilson
    email: "oliviawilson@example.com",
    subject: "假期计划", // Vacation Plans
    text: "我们来计划下个月的假期吧。你觉得怎么样？我一直在考虑去一个热带天堂，我已经整理了一些目的地选项。\n\n我相信是时候让我们放松和充电了。请看看这些选项，告诉我你的偏好。\n\n我们可以开始安排，以确保旅途顺利愉快。\n\n期待你的想法！奥利维亚",
    date: "2022-12-20T18:30:00",
    read: true,
    labels: ["个人"], // ["personal"]
    tags: ['已发送'], // ['sent']
    isTrash: true, // 在垃圾箱中
    isArchive: false
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546014",
    name: "詹姆斯·马丁", // James Martin
    email: "jamesmartin@example.com",
    subject: "回复：会议注册", // Re: Conference Registration
    text: "我已经完成了下个月会议的注册。这次活动有望成为一个很好的社交机会，我期待着参加各种会议，并与行业专家建立联系。\n\n我还附上了会议日程供您参考。\n\n如果您希望我探索任何特定的主题或会议，请告诉我。这是一个激动人心的活动，我会充分利用它。\n\n顺颂商祺，詹姆斯",
    date: "2022-11-30T19:15:00",
    read: true,
    labels: ["工作", "会议"], // ["work", "conference"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "7dd90c63-00f6-40f3-bd87-5060a24e8ee7",
    name: "索菲亚·怀特", // Sophia White
    email: "sophiawhite@example.com",
    subject: "团队聚餐", // Team Dinner
    text: "我们下周搞个团队聚餐庆祝一下我们的成功吧。我们取得了一些重要的里程碑，是时候肯定我们的辛勤工作和奉献精神了。\n\n我在一家不错的餐厅预订了位置，我相信这将是一个愉快的夜晚。\n\n请确认您的出席情况和任何饮食偏好。期待与团队共度一个有趣而难忘的晚餐！\n\n索菲亚",
    date: "2022-11-05T20:30:00",
    read: false,
    labels: ["会议", "工作"], // ["meeting", "work"]
    tags: ['草稿', '已发送'], // ['draft','sent']
    isTrash: false,
    isArchive: true // 已归档
  },
  {
    id: "99a88f78-3eb4-4d87-87b7-7b15a49a0a05",
    name: "丹尼尔·约翰逊", // Daniel Johnson
    email: "danieljohnson@example.com",
    subject: "请求反馈", // Feedback Request
    text: "我希望您能对最新的项目交付成果提供反馈。我们已经取得了显著进展，我重视您的意见以确保我们走在正确的轨道上。\n\n我已附上交付成果供您审阅，我特别想了解您认为我们在哪些方面可以进一步提高质量或效率。\n\n您的反馈非常宝贵，感谢您的时间和专业知识。让我们共同努力，使这个项目取得成功。\n\n此致，丹尼尔",
    date: "2022-10-22T09:30:00",
    read: false,
    labels: ["工作"], // ["work"]
    tags: ['草稿', '已发送'], // ['draft','sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "艾娃·泰勒", // Ava Taylor
    email: "avataylor@example.com",
    subject: "回复：会议议程", // Re: Meeting Agenda
    text: "这是我们下周会议的议程。我已包含了我们需要讨论的所有主题，以及每个主题的时间分配。\n\n如果您有其他需要讨论的项目或任何具体要点，请告诉我，我们可以将其纳入议程。\n\n确保我们的会议富有成效并解决所有相关问题至关重要。\n\n期待我们的会议！艾娃",
    date: "2022-10-10T10:45:00",
    read: true,
    labels: ["会议", "工作"], // ["meeting", "work"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "c1a0ecb4-2540-49c5-86f8-21e5ce79e4e6",
    name: "威廉·安德森", // William Anderson
    email: "williamanderson@example.com",
    subject: "产品发布更新", // Product Launch Update
    text: "产品发布进展顺利。我将在我们的电话会议中提供更新。我们在新产品的开发和营销方面取得了实质性进展。\n\n我很高兴在即将到来的电话会议中与您分享最新动态。我们必须协调努力以确保成功发布。请准备好您可能有的任何问题或见解。\n\n让我们共同使这次产品发布取得巨大成功！\n\n顺颂商祺，威廉",
    date: "2022-09-20T12:00:00",
    read: false,
    labels: ["会议", "工作", "重要"], // ["meeting", "work", "important"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "ba54eefd-4097-4949-99f2-2a9ae4d1a836",
    name: "米娅·哈里斯", // Mia Harris
    email: "miaharris@example.com",
    subject: "回复：旅行行程", // Re: Travel Itinerary
    text: "我收到了旅行行程。看起来很棒！感谢您迅速协助安排细节。我检查了日程安排和住宿，一切似乎都安排妥当了。我期待这次旅行，并相信这将是一次顺利而愉快的经历。\n\n如果您在我们目的地有任何特别推荐的活动或景点，请随时分享您的建议。\n\n期待这次旅行！米娅",
    date: "2022-09-10T13:15:00",
    read: true,
    labels: ["个人", "旅行"], // ["personal", "travel"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "df09b6ed-28bd-4e0c-85a9-9320ec5179aa",
    name: "伊森·克拉克", // Ethan Clark
    email: "ethanclark@example.com",
    subject: "团队建设活动", // Team Building Event
    text: "我们为部门策划一次团队建设活动吧。团队凝聚力和士气对我们的成功至关重要，我相信一次组织良好的团队建设活动会非常有益。我做了一些研究，并有几个有趣且吸引人的活动想法。\n\n请告诉我您的想法和是否有空。我们希望这次活动既愉快又有成效。\n\n我们将共同加强我们的团队并提升我们的表现。\n\n此致，伊森",
    date: "2022-08-25T15:30:00",
    read: false,
    labels: ["会议", "工作"], // ["meeting", "work"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: false
  },
  {
    id: "d67c1842-7f8b-4b4b-9be1-1b3b1ab4611d",
    name: "克洛伊·霍尔", // Chloe Hall
    email: "chloehall@example.com",
    subject: "回复：预算批准", // Re: Budget Approval
    text: "预算已获批准。我们可以开始项目了。我很高兴地通知您，我们的预算提案已获得财务部门的批准。这是一个重要的里程碑，这意味着我们可以按计划推进项目。\n\n我附上了最终预算供您参考。让我们确保我们保持进度，并在预算内按时交付项目。\n\n这对我们来说是一个激动人心的时刻！克洛伊",
    date: "2022-08-10T16:45:00",
    read: true,
    labels: ["工作", "预算"], // ["work", "budget"]
    tags: ['已发送'], // ['sent']
    isTrash: false,
    isArchive: true // 已归档
  },
  {
    id: "6c9a7f94-8329-4d70-95d3-51f68c186ae1",
    name: "塞缪尔·特纳", // Samuel Turner
    email: "samuelturner@example.com",
    subject: "周末徒步", // Weekend Hike
    text: "谁想周末去山里徒步？我一直渴望进行一些户外探险，在山中徒步听起来是完美的逃离方式。如果你愿意接受挑战，我们可以探索一些风景优美的步道，享受大自然的美景。\n\n我做了一些研究，有几条路线可供选择。\n\n如果你感兴趣，请告诉我，我们可以计划细节。\n\n这肯定会是一次难忘的经历！塞缪尔",
    date: "2022-07-28T17:30:00",
    read: false,
    labels: ["个人"], // ["personal"]
    tags: ['已发送', '模板'], // ['sent','template']
    isTrash: false,
    isArchive: false
  },
];

/**
 * 定义邮件类型别名
 */
export type Mail = (typeof mails)[number]; // 类型名 'Mail' 意为 '邮件'

// MARK: 账户 (Accounts)
/**
 * 账户数据列表
 */
export const accounts = [ // 变量名 'accounts' 意为 '账户列表'
  {
    name: "艾丽西亚·科赫", // Alicia Koch
    email: "alicia@example.com",
    icon: ( /* 图标保持不变 */
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "艾丽西亚·科赫", // Alicia Koch
    email: "alicia@gmail.com",
    icon: ( /* 图标保持不变 */
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "艾丽西亚·科赫", // Alicia Koch
    email: "alicia@me.com",
    icon: ( /* 图标保持不变 */
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

/**
 * 定义账户类型别名
 */
export type Account = (typeof accounts)[number]; // 类型名 'Account' 意为 '账户'

// MARK: 联系人 (Contacts)
/**
 * 联系人数据列表
 */
export const contacts = [ // 变量名 'contacts' 意为 '联系人列表'
  {
    name: "艾玛·约翰逊", // Emma Johnson
    email: "emma.johnson@example.com",
  },
  {
    name: "利亚姆·威尔逊", // Liam Wilson
    email: "liam.wilson@example.com",
  },
  {
    name: "奥利维亚·戴维斯", // Olivia Davis
    email: "olivia.davis@example.com",
  },
  {
    name: "诺亚·马丁内斯", // Noah Martinez
    email: "noah.martinez@example.com",
  },
  {
    name: "艾娃·泰勒", // Ava Taylor
    email: "ava.taylor@example.com",
  },
  {
    name: "卢卡斯·布朗", // Lucas Brown
    email: "lucas.brown@example.com",
  },
  {
    name: "索菲亚·史密斯", // Sophia Smith
    email: "sophia.smith@example.com",
  },
  {
    name: "伊森·威尔逊", // Ethan Wilson
    email: "ethan.wilson@example.com",
  },
  {
    name: "伊莎贝拉·杰克逊", // Isabella Jackson
    email: "isabella.jackson@example.com",
  },
  {
    name: "米娅·克拉克", // Mia Clark
    email: "mia.clark@example.com",
  },
  {
    name: "梅森·李", // Mason Lee
    email: "mason.lee@example.com",
  },
  {
    name: "莱拉·哈里斯", // Layla Harris
    email: "layla.harris@example.com",
  },
  {
    name: "威廉·安德森", // William Anderson
    email: "william.anderson@example.com",
  },
  {
    name: "艾拉·怀特", // Ella White
    email: "ella.white@example.com",
  },
  {
    name: "詹姆斯·托马斯", // James Thomas
    email: "james.thomas@example.com",
  },
  {
    name: "哈珀·刘易斯", // Harper Lewis
    email: "harper.lewis@example.com",
  },
  {
    name: "本杰明·摩尔", // Benjamin Moore
    email: "benjamin.moore@example.com",
  },
  {
    name: "阿里亚·霍尔", // Aria Hall
    email: "aria.hall@example.com",
  },
  {
    name: "亨利·特纳", // Henry Turner
    email: "henry.turner@example.com",
  },
  {
    name: "斯嘉丽·亚当斯", // Scarlett Adams
    email: "scarlett.adams@example.com",
  },
];

/**
 * 定义联系人类型别名
 */
export type Contact = (typeof contacts)[number]; // 类型名 'Contact' 意为 '联系人'



// // MARK: Mails
// export interface Email {
//   id: string;
//   name: string;
//   email: string;
//   subject: string;
//   text: string;
//   date: string;
//   read: boolean;
//   labels: string[];
//   tags: string[];
//   isTrash: boolean;
//   isArchive: boolean;
// }

// export const mails = [
//   {
//     id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
//     name: "William Smith",
//     email: "williamsmith@example.com",
//     subject: "Meeting Tomorrow",
//     text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
//     date: "2023-10-22T09:00:00",
//     read: true,
//     labels: ["meeting", "work", "important"],
//     tags:['sent','junk'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "110e8400-e29b-11d4-a716-446655440000",
//     name: "Alice Smith",
//     email: "alicesmith@example.com",
//     subject: "Re: Project Update",
//     text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
//     date: "2023-10-22T10:30:00",
//     read: true,
//     labels: ["work", "important"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
//     name: "Bob Johnson",
//     email: "bobjohnson@example.com",
//     subject: "Weekend Plans",
//     text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun.\n\nIf you're interested, let me know, and we can plan the details. It'll be a great way to unwind and enjoy nature.\n\nLooking forward to your response!\n\nBest, Bob",
//     date: "2023-04-10T11:45:00",
//     read: true,
//     labels: ["personal"],
//     tags:['sent','junk'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "61c35085-72d7-42b4-8d62-738f700d4b92",
//     name: "Emily Davis",
//     email: "emilydavis@example.com",
//     subject: "Re: Question about Budget",
//     text: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources.\n\nI've reviewed the budget report and identified a few areas where we might be able to optimize our spending without compromising the project's quality.\n\nI've attached a detailed analysis for your reference. Let's discuss this further in our next meeting.\n\nThanks, Emily",
//     date: "2023-03-25T13:15:00",
//     read: false,
//     labels: ["work", "budget"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "8f7b5db9-d935-4e42-8e05-1f1d0a3dfb97",
//     name: "Michael Wilson",
//     email: "michaelwilson@example.com",
//     subject: "Important Announcement",
//     text: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the upcoming product launch. We've received valuable feedback from our beta testers, and I believe it's time to make some adjustments to better meet our customers' needs.\n\nThis change is crucial to our success, and I look forward to discussing it with the team. Please be prepared to share your insights during the meeting.\n\nRegards, Michael",
//     date: "2023-03-10T15:00:00",
//     read: false,
//     labels: ["meeting", "work", "important"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "1f0f2c02-e299-40de-9b1d-86ef9e42126b",
//     name: "Sarah Brown",
//     email: "sarahbrown@example.com",
//     subject: "Re: Feedback on Proposal",
//     text: "Thank you for your feedback on the proposal. It looks great! I'm pleased to hear that you found it promising. The team worked diligently to address all the key points you raised, and I believe we now have a strong foundation for the project.\n\nI've attached the revised proposal for your review.\n\nPlease let me know if you have any further comments or suggestions. Looking forward to your response.\n\nBest regards, Sarah",
//     date: "2023-02-15T16:30:00",
//     read: true,
//     labels: ["work"],
//     tags:['sent'],
//     isTrash:true,
//     isArchive:false
//   },
//   {
//     id: "17c0a96d-4415-42b1-8b4f-764efab57f66",
//     name: "David Lee",
//     email: "davidlee@example.com",
//     subject: "New Project Idea",
//     text: "I have an exciting new project idea to discuss with you. It involves expanding our services to target a niche market that has shown considerable growth in recent months.\n\nI've prepared a detailed proposal outlining the potential benefits and the strategy for execution.\n\nThis project has the potential to significantly impact our business positively. Let's set up a meeting to dive into the details and determine if it aligns with our current goals.\n\nBest regards, David",
//     date: "2023-01-28T17:45:00",
//     read: false,
//     labels: ["meeting", "work", "important"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "2f0130cb-39fc-44c4-bb3c-0a4337edaaab",
//     name: "Olivia Wilson",
//     email: "oliviawilson@example.com",
//     subject: "Vacation Plans",
//     text: "Let's plan our vacation for next month. What do you think? I've been thinking of visiting a tropical paradise, and I've put together some destination options.\n\nI believe it's time for us to unwind and recharge. Please take a look at the options and let me know your preferences.\n\nWe can start making arrangements to ensure a smooth and enjoyable trip.\n\nExcited to hear your thoughts! Olivia",
//     date: "2022-12-20T18:30:00",
//     read: true,
//     labels: ["personal"],
//     tags:['sent'],
//     isTrash:true,
//     isArchive:false
//   },
//   {
//     id: "de305d54-75b4-431b-adb2-eb6b9e546014",
//     name: "James Martin",
//     email: "jamesmartin@example.com",
//     subject: "Re: Conference Registration",
//     text: "I've completed the registration for the conference next month. The event promises to be a great networking opportunity, and I'm looking forward to attending the various sessions and connecting with industry experts.\n\nI've also attached the conference schedule for your reference.\n\nIf there are any specific topics or sessions you'd like me to explore, please let me know. It's an exciting event, and I'll make the most of it.\n\nBest regards, James",
//     date: "2022-11-30T19:15:00",
//     read: true,
//     labels: ["work", "conference"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "7dd90c63-00f6-40f3-bd87-5060a24e8ee7",
//     name: "Sophia White",
//     email: "sophiawhite@example.com",
//     subject: "Team Dinner",
//     text: "Let's have a team dinner next week to celebrate our success. We've achieved some significant milestones, and it's time to acknowledge our hard work and dedication.\n\nI've made reservations at a lovely restaurant, and I'm sure it'll be an enjoyable evening.\n\nPlease confirm your availability and any dietary preferences. Looking forward to a fun and memorable dinner with the team!\n\nBest, Sophia",
//     date: "2022-11-05T20:30:00",
//     read: false,
//     labels: ["meeting", "work"],
//     tags:['draft','sent'],
//     isTrash:false,
//     isArchive:true
//   },
//   {
//     id: "99a88f78-3eb4-4d87-87b7-7b15a49a0a05",
//     name: "Daniel Johnson",
//     email: "danieljohnson@example.com",
//     subject: "Feedback Request",
//     text: "I'd like your feedback on the latest project deliverables. We've made significant progress, and I value your input to ensure we're on the right track.\n\nI've attached the deliverables for your review, and I'm particularly interested in any areas where you think we can further enhance the quality or efficiency.\n\nYour feedback is invaluable, and I appreciate your time and expertise. Let's work together to make this project a success.\n\nRegards, Daniel",
//     date: "2022-10-22T09:30:00",
//     read: false,
//     labels: ["work"],
//     tags:['draft','sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
//     name: "Ava Taylor",
//     email: "avataylor@example.com",
//     subject: "Re: Meeting Agenda",
//     text: "Here's the agenda for our meeting next week. I've included all the topics we need to cover, as well as time allocations for each.\n\nIf you have any additional items to discuss or any specific points to address, please let me know, and we can integrate them into the agenda.\n\nIt's essential that our meeting is productive and addresses all relevant matters.\n\nLooking forward to our meeting! Ava",
//     date: "2022-10-10T10:45:00",
//     read: true,
//     labels: ["meeting", "work"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "c1a0ecb4-2540-49c5-86f8-21e5ce79e4e6",
//     name: "William Anderson",
//     email: "williamanderson@example.com",
//     subject: "Product Launch Update",
//     text: "The product launch is on track. I'll provide an update during our call. We've made substantial progress in the development and marketing of our new product.\n\nI'm excited to share the latest updates with you during our upcoming call. It's crucial that we coordinate our efforts to ensure a successful launch. Please come prepared with any questions or insights you may have.\n\nLet's make this product launch a resounding success!\n\nBest regards, William",
//     date: "2022-09-20T12:00:00",
//     read: false,
//     labels: ["meeting", "work", "important"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "ba54eefd-4097-4949-99f2-2a9ae4d1a836",
//     name: "Mia Harris",
//     email: "miaharris@example.com",
//     subject: "Re: Travel Itinerary",
//     text: "I've received the travel itinerary. It looks great! Thank you for your prompt assistance in arranging the details. I've reviewed the schedule and the accommodations, and everything seems to be in order. I'm looking forward to the trip, and I'm confident it'll be a smooth and enjoyable experience.\n\nIf there are any specific activities or attractions you recommend at our destination, please feel free to share your suggestions.\n\nExcited for the trip! Mia",
//     date: "2022-09-10T13:15:00",
//     read: true,
//     labels: ["personal", "travel"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "df09b6ed-28bd-4e0c-85a9-9320ec5179aa",
//     name: "Ethan Clark",
//     email: "ethanclark@example.com",
//     subject: "Team Building Event",
//     text: "Let's plan a team-building event for our department. Team cohesion and morale are vital to our success, and I believe a well-organized team-building event can be incredibly beneficial. I've done some research and have a few ideas for fun and engaging activities.\n\nPlease let me know your thoughts and availability. We want this event to be both enjoyable and productive.\n\nTogether, we'll strengthen our team and boost our performance.\n\nRegards, Ethan",
//     date: "2022-08-25T15:30:00",
//     read: false,
//     labels: ["meeting", "work"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:false
//   },
//   {
//     id: "d67c1842-7f8b-4b4b-9be1-1b3b1ab4611d",
//     name: "Chloe Hall",
//     email: "chloehall@example.com",
//     subject: "Re: Budget Approval",
//     text: "The budget has been approved. We can proceed with the project. I'm delighted to inform you that our budget proposal has received the green light from the finance department. This is a significant milestone, and it means we can move forward with the project as planned.\n\nI've attached the finalized budget for your reference. Let's ensure that we stay on track and deliver the project on time and within budget.\n\nIt's an exciting time for us! Chloe",
//     date: "2022-08-10T16:45:00",
//     read: true,
//     labels: ["work", "budget"],
//     tags:['sent'],
//     isTrash:false,
//     isArchive:true
//   },
//   {
//     id: "6c9a7f94-8329-4d70-95d3-51f68c186ae1",
//     name: "Samuel Turner",
//     email: "samuelturner@example.com",
//     subject: "Weekend Hike",
//     text: "Who's up for a weekend hike in the mountains? I've been craving some outdoor adventure, and a hike in the mountains sounds like the perfect escape. If you're up for the challenge, we can explore some scenic trails and enjoy the beauty of nature.\n\nI've done some research and have a few routes in mind.\n\nLet me know if you're interested, and we can plan the details.\n\nIt's sure to be a memorable experience! Samuel",
//     date: "2022-07-28T17:30:00",
//     read: false,
//     labels: ["personal"],
//     tags:['sent','template'],
//     isTrash:false,
//     isArchive:false
//   },
// ]

// export type Mail = (typeof mails)[number]

// // MARK: Accounts
// export const accounts = [
//   {
//     name: "Alicia Koch",
//     email: "alicia@example.com",
//     icon: (
//       <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <title>Vercel</title>
//         <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
//       </svg>
//     ),
//   },
//   {
//     name: "Alicia Koch",
//     email: "alicia@gmail.com",
//     icon: (
//       <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <title>Gmail</title>
//         <path
//           d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//   },
//   {
//     name: "Alicia Koch",
//     email: "alicia@me.com",
//     icon: (
//       <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <title>iCloud</title>
//         <path
//           d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
//           fill="currentColor"
//         />
//       </svg>
//     ),
//   },
// ]

// export type Account = (typeof accounts)[number]

// // MARK: Contacts
// export const contacts = [
//   {
//     name: "Emma Johnson",
//     email: "emma.johnson@example.com",
//   },
//   {
//     name: "Liam Wilson",
//     email: "liam.wilson@example.com",
//   },
//   {
//     name: "Olivia Davis",
//     email: "olivia.davis@example.com",
//   },
//   {
//     name: "Noah Martinez",
//     email: "noah.martinez@example.com",
//   },
//   {
//     name: "Ava Taylor",
//     email: "ava.taylor@example.com",
//   },
//   {
//     name: "Lucas Brown",
//     email: "lucas.brown@example.com",
//   },
//   {
//     name: "Sophia Smith",
//     email: "sophia.smith@example.com",
//   },
//   {
//     name: "Ethan Wilson",
//     email: "ethan.wilson@example.com",
//   },
//   {
//     name: "Isabella Jackson",
//     email: "isabella.jackson@example.com",
//   },
//   {
//     name: "Mia Clark",
//     email: "mia.clark@example.com",
//   },
//   {
//     name: "Mason Lee",
//     email: "mason.lee@example.com",
//   },
//   {
//     name: "Layla Harris",
//     email: "layla.harris@example.com",
//   },
//   {
//     name: "William Anderson",
//     email: "william.anderson@example.com",
//   },
//   {
//     name: "Ella White",
//     email: "ella.white@example.com",
//   },
//   {
//     name: "James Thomas",
//     email: "james.thomas@example.com",
//   },
//   {
//     name: "Harper Lewis",
//     email: "harper.lewis@example.com",
//   },
//   {
//     name: "Benjamin Moore",
//     email: "benjamin.moore@example.com",
//   },
//   {
//     name: "Aria Hall",
//     email: "aria.hall@example.com",
//   },
//   {
//     name: "Henry Turner",
//     email: "henry.turner@example.com",
//   },
//   {
//     name: "Scarlett Adams",
//     email: "scarlett.adams@example.com",
//   },
// ]

// export type Contact = (typeof contacts)[number]
