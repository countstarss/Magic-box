import { MailListExample } from "@/components/examples/mail-list-example";

export const metadata = {
  title: "React Query Demo | WizMail",
  description: "Demonstration of React Query integration with WizMail",
};

export default function QueryDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">React Query Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how to use React Query with WizMail. When
          connected to a real backend API, this example will work without major
          changes.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden h-[600px]">
        <MailListExample />
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This example uses{" "}
            <code className="bg-background px-1 rounded">
              @tanstack/react-query
            </code>{" "}
            for state management
          </li>
          <li>
            API calls are abstracted in{" "}
            <code className="bg-background px-1 rounded">
              src/lib/api/mail-service.ts
            </code>
          </li>
          <li>
            React Query hooks are defined in{" "}
            <code className="bg-background px-1 rounded">
              src/hooks/use-query-mail.ts
            </code>
          </li>
          <li>
            The global provider is set up in{" "}
            <code className="bg-background px-1 rounded">
              src/providers/query-provider.tsx
            </code>
          </li>
          <li>
            This example will automatically work with real API endpoints once
            the backend is implemented
          </li>
        </ul>
      </div>
    </div>
  );
}
