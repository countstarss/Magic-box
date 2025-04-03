import GmailEmailList from "@/components/gmail/GmailEmailList";

export default function GmailPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gmail 邮箱</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <GmailEmailList />
      </div>
    </div>
  );
}
