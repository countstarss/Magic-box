"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ComposePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    content: "",
    attachments: [] as File[]
  });

  // Handle URL parameters for reply/forward functionality
  useEffect(() => {
    // Get parameters from URL
    const to = searchParams.get("to") || "";
    const cc = searchParams.get("cc") || "";
    const bcc = searchParams.get("bcc") || "";
    const subject = searchParams.get("subject") || "";
    const content = searchParams.get("content") || "";

    // Update form with URL parameters if they exist
    if (to || cc || bcc || subject || content) {
      setFormData(prev => ({
        ...prev,
        to,
        cc,
        bcc,
        subject,
        content
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 调用我们的API端点发送邮件
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to,
          cc: formData.cc || undefined,
          bcc: formData.bcc || undefined,
          subject: formData.subject,
          content: formData.content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '发送失败');
      }
      
      // 显示成功的toast提示
      toast.success("邮件已发送", {
        description: `成功发送邮件到 ${formData.to}`,
        position: "bottom-right"
      });
      
      // 可以在这里记录发送成功的ID
      console.log("Email sent with ID:", result.data.id);
      
      // 跳转前简短延迟，让用户看到成功提示
      setTimeout(() => {
        // 导航回到收件箱
        router.push("/mail");
      }, 1500);
      
    } catch (error) {
      // 显示错误的toast提示
      toast.error("发送失败", {
        description: error instanceof Error ? error.message : "邮件发送过程中出现错误，请稍后再试",
        position: "bottom-right"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 h-full">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>撰写新邮件</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">收件人</Label>
              <Input
                id="to"
                name="to"
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cc">抄送</Label>
              <Input
                id="cc"
                name="cc"
                placeholder="cc@example.com"
                value={formData.cc}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bcc">密送</Label>
              <Input
                id="bcc"
                name="bcc"
                placeholder="bcc@example.com"
                value={formData.bcc}
                onChange={handleChange}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="subject">主题</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="邮件主题"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="在此处输入邮件内容..."
                value={formData.content}
                onChange={handleChange}
                required
                className="min-h-[200px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachments">附件</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  添加附件
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                  className="hidden"
                />
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "发送中..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
