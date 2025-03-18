import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to WizMail</h1>
            <p className="text-gray-600">
              Sign in to your account or create a new one to get started
            </p>
          </div>
          <AuthForm />
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">
              Smart Email Management Platform
            </h2>
            <p className="text-xl opacity-90">
              Streamline your email workflow with AI-powered features and
              collaborative tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
