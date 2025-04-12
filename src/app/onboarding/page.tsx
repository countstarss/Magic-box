import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import nylasService from "@/lib/services/nylas-service";

export default function OnboardingPage() {
  // 获取授权URL
  const authUrl = nylasService.getAuthUrl();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Connect Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect your email account to get started with Mail Box
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Choose Email Provider</CardTitle>
            <CardDescription>
              Select your email provider to authorize access
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href={authUrl} className="w-full">
              <Button className="w-full flex items-center justify-start space-x-3">
                <Image 
                  src="/google.svg" 
                  alt="Google" 
                  width={20} 
                  height={20} 
                  className="mr-2" 
                />
                <span>Connect with Gmail</span>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            
            {/* 更多提供商可以在这里添加 */}
            <Button variant="outline" className="w-full flex items-center justify-start space-x-3" disabled>
              <Mail className="mr-2 h-5 w-5" />
              <span>Other Email Provider</span>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              By connecting your account, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Link href="/mail" className="w-full">
              <Button variant="outline" className="w-full">
                Continue without connecting
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 