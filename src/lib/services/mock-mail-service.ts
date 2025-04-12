import { EmailAccount, EmailContact, EmailMessage } from "../types/nylas-types";

// 模拟邮箱帐户
const mockAccount: EmailAccount = {
  id: "mock-account-id",
  grantId: "mock-grant-id",
  email: "johndoe@example.com",
  name: "John Doe",
  provider: "gmail",
  organizationName: "Example Corp",
  profilePicture: "https://i.pravatar.cc/300",
};

// 模拟联系人
const mockContacts: EmailContact[] = [
  { email: "alice@example.com", name: "Alice Smith" },
  { email: "bob@example.com", name: "Bob Johnson" },
  { email: "charlie@example.com", name: "Charlie Brown" },
  { email: "david@example.com", name: "David Williams" },
  { email: "eva@example.com", name: "Eva Garcia" },
  { email: "frank@example.com", name: "Frank Miller" },
  { email: "grace@example.com", name: "Grace Wilson" },
  { email: "henry@example.com", name: "Henry Taylor" },
  { email: "inbox@acmecorp.com", name: "ACME Corporation" },
  { email: "notifications@github.com", name: "GitHub" },
  { email: "no-reply@newsletter.com", name: "Weekly Newsletter" },
  { email: "support@cloudservice.com", name: "Cloud Service Support" },
];

// 模拟邮件主题
const mockSubjects = [
  "Project Status Update",
  "Meeting Invitation: Quarterly Review",
  "Your Invoice #12345",
  "Action Required: Update Your Password",
  "Welcome to Our Newsletter",
  "Important Announcement",
  "Reminder: Event Tomorrow",
  "Thank You for Your Purchase",
  "Your Account Summary",
  "New Feature Release",
  "Document Shared With You",
  "Weekly Team Updates",
  "Changes to Our Terms of Service",
  "Your Subscription is About to Expire",
  "Holiday Office Closure Notice",
];

// 模拟邮件内容片段
const mockSnippets = [
  "Here is the latest update on our project progress...",
  "We would like to invite you to our quarterly review meeting...",
  "Please find attached your invoice for services rendered...",
  "For security reasons, we recommend updating your password...",
  "Welcome to our monthly newsletter! This month we are featuring...",
  "We are pleased to announce some important changes to our service...",
  "This is a reminder that you have an upcoming event scheduled...",
  "Thank you for your recent purchase. Your order details are...",
  "Here is a summary of your account activity for the past month...",
  "We are excited to announce the release of our latest feature...",
  "A document has been shared with you for collaboration...",
  "Here is a summary of this week's team activities and achievements...",
  "We are updating our terms of service effective next month...",
  "Your subscription will expire in 7 days. To continue enjoying our services...",
  "Please note that our office will be closed during the upcoming holiday...",
];

// 模拟邮件正文
const generateMockBody = (snippet: string): string => {
  return `<div>
    <p>${snippet}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo vel nisi tincidunt finibus. Vivamus nec tellus sed magna lobortis pharetra.</p>
    <p>Mauris auctor magna in velit tincidunt, in commodo diam aliquam. Sed viverra, nisl id lobortis faucibus, elit libero commodo felis, at elementum neque massa id nisi.</p>
    <p>Regards,<br>The Sender</p>
  </div>`;
};

// 生成指定数量的模拟邮件
const generateMockEmails = (count: number): EmailMessage[] => {
  const messages: EmailMessage[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const subjectIndex = Math.floor(Math.random() * mockSubjects.length);
    const senderIndex = Math.floor(Math.random() * mockContacts.length);
    const recipientCount = Math.floor(Math.random() * 3) + 1;
    const recipients: EmailContact[] = [];

    // 添加收件人
    recipients.push({ name: mockAccount.name, email: mockAccount.email });

    // 可能添加抄送人
    for (let j = 0; j < recipientCount - 1; j++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * mockContacts.length);
      } while (randomIndex === senderIndex);
      recipients.push(mockContacts[randomIndex]);
    }

    // 创建随机日期（过去30天内）
    const dateOffset = Math.floor(Math.random() * 30) * dayInMs;
    const messageDate = new Date(now - dateOffset);

    // 创建随机是否已读状态（70%已读，30%未读）
    const unread = Math.random() > 0.7;

    // 创建随机是否有附件状态（20%有附件）
    const hasAttachments = Math.random() < 0.2;

    const snippetIndex = Math.floor(Math.random() * mockSnippets.length);
    const snippet = mockSnippets[snippetIndex];

    messages.push({
      id: `mock-message-${i}`,
      subject: mockSubjects[subjectIndex],
      snippet: snippet,
      body: generateMockBody(snippet),
      sender: mockContacts[senderIndex],
      recipients: recipients,
      date: messageDate,
      unread: unread,
      hasAttachments: hasAttachments,
    });
  }

  // 按日期排序（最新的在前）
  return messages.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// 获取模拟邮件列表
const getEmails = (limit: number = 20, offset: number = 0): EmailMessage[] => {
  // 生成总共50封模拟邮件
  const allEmails = generateMockEmails(50);

  // 返回分页后的邮件
  return allEmails.slice(offset, offset + limit);
};

// 根据ID获取模拟邮件详情
const getEmail = (messageId: string): EmailMessage | null => {
  // 由于这是模拟数据，我们可以根据ID动态生成一封邮件
  const idParts = messageId.split("-");
  if (
    idParts.length !== 3 ||
    idParts[0] !== "mock" ||
    idParts[1] !== "message"
  ) {
    return null;
  }

  const index = parseInt(idParts[2], 10);
  if (isNaN(index)) {
    return null;
  }

  // 生成一封特定的邮件
  const subjectIndex = index % mockSubjects.length;
  const senderIndex = index % mockContacts.length;
  const snippet = mockSnippets[index % mockSnippets.length];

  return {
    id: messageId,
    subject: mockSubjects[subjectIndex],
    snippet: snippet,
    body: generateMockBody(snippet),
    sender: mockContacts[senderIndex],
    recipients: [
      { name: mockAccount.name, email: mockAccount.email },
      mockContacts[(senderIndex + 1) % mockContacts.length],
    ],
    date: new Date(Date.now() - index * 3600000),
    unread: false,
    hasAttachments: index % 5 === 0,
    attachments:
      index % 5 === 0
        ? [
            {
              id: `attachment-${index}-1`,
              filename: "document.pdf",
              contentType: "application/pdf",
              size: 1024 * 1024 * ((index % 5) + 1),
            },
          ]
        : undefined,
  };
};

// 获取模拟账户信息
const getAccount = (): EmailAccount => {
  return { ...mockAccount };
};

const mockMailService = {
  getAccount,
  getEmails,
  getEmail,
};

export default mockMailService;
