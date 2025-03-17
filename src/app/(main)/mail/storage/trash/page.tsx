"use client";

import * as React from "react";
import { Search, Trash2, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/hooks/use-mail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariantFromLabel } from "../../components/badgeHighlight";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Email } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const TrashPage = () => {
  const { getFilteredMails, config, markAsRead, emptyTrash } = useMail();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isEmptyDialogOpen, setIsEmptyDialogOpen] = React.useState(false);

  // 获取垃圾箱文件夹的邮件
  const trashMails = React.useMemo(() => {
    const mails = getFilteredMails("trash");
    if (!searchQuery) return mails;

    // 如果有搜索查询，筛选匹配的邮件
    return mails.filter(
      (mail) =>
        mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [getFilteredMails, searchQuery]);

  const handleMailClick = (mail: Email) => {
    // 开启详情预览
    // 对于存储类型页面，我们可以简单地标记为已读
    markAsRead(mail.id);

    // 如果需要查看详情，可以通过URL参数或状态管理来显示一个modal
    window.open(`/mail/view?id=${mail.id}`, "_blank");
  };

  const handleEmptyTrash = () => {
    // 这里应该是调用API来清空垃圾箱
    if (emptyTrash) {
      emptyTrash();
      toast({
        title: "Trash emptied",
        description: "All items in trash have been permanently deleted.",
      });
    }
    setIsEmptyDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ResizablePanel minSize={14} maxSize={14} className="flex-1">
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <h1 className="text-xl font-bold">Trash</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmptyDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                Empty trash
              </Button>
              <TabsList>
                <TabsTrigger value="all">All deleted</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <Separator />

          {/* Search */}
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in trash"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Items in trash will be automatically deleted after 30 days.</p>
            </div>
          </div>

          {/* Mail List */}
          <TabsContent value="all" className="m-0">
            <div className="h-[calc(100vh-10rem)] overflow-y-auto pb-32">
              <ScrollArea>
                <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                  <AnimatePresence initial={false}>
                    {trashMails.length > 0 ? (
                      trashMails.map((mail) => (
                        <motion.div
                          key={mail.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent w-full h-full"
                            )}
                            onClick={() => handleMailClick(mail)}
                          >
                            <div className="flex w-full flex-col gap-1">
                              <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold">
                                    {mail.name}
                                  </div>
                                  {!mail.read && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                  )}
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(mail.date), {
                                    addSuffix: true,
                                  })}
                                </div>
                              </div>
                              <div className="text-xs font-medium">
                                {mail.subject}
                              </div>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground">
                              {mail.text.substring(0, 300)}
                            </div>
                            {mail.labels.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {mail.labels.map((label) => (
                                  <Badge
                                    key={label}
                                    variant={getBadgeVariantFromLabel(label)}
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center col-span-2">
                        <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">
                          Trash is empty
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          No deleted emails in trash. Items you delete will
                          appear here.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="m-0">
            <div className="h-[calc(100vh-10rem)] overflow-y-auto pb-32">
              <ScrollArea>
                <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                  <AnimatePresence initial={false}>
                    {trashMails.filter(
                      (mail) =>
                        new Date(mail.date) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length > 0 ? (
                      trashMails
                        .filter(
                          (mail) =>
                            new Date(mail.date) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        )
                        .map((mail) => (
                          <motion.div
                            key={mail.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent w-full h-full"
                              )}
                              onClick={() => handleMailClick(mail)}
                            >
                              <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="font-semibold">
                                      {mail.name}
                                    </div>
                                    {!mail.read && (
                                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                  </div>
                                  <div className="ml-auto text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(mail.date), {
                                      addSuffix: true,
                                    })}
                                  </div>
                                </div>
                                <div className="text-xs font-medium">
                                  {mail.subject}
                                </div>
                              </div>
                              <div className="line-clamp-2 text-xs text-muted-foreground">
                                {mail.text.substring(0, 300)}
                              </div>
                              {mail.labels.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {mail.labels.map((label) => (
                                    <Badge
                                      key={label}
                                      variant={getBadgeVariantFromLabel(label)}
                                    >
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </button>
                          </motion.div>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center col-span-2">
                        <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">
                          No recent deletions
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          You haven't deleted any emails in the past 7 days.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </ResizablePanel>

      {/* Empty Trash Confirmation Dialog */}
      <AlertDialog open={isEmptyDialogOpen} onOpenChange={setIsEmptyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Trash</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all items in the trash. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Empty Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrashPage;
