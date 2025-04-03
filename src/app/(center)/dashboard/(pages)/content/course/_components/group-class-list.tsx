"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GroupClassAvatars } from "@/components/ui/group-class-avatars";
import { GroupClassType } from "@/types/mongo/group-class";

export function GroupClassList() {
  const [classes, setClasses] = useState<GroupClassType[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/groupclass");
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      toast.error("获取课程列表失败");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/groupclass/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("删除成功");
      fetchClasses();
    } catch {
      toast.error("删除失败");
    }
  };


  return (
    <div className="grid gap-4">
      {classes.map((groupClass) => (
        <Card key={groupClass.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-xl font-semibold">{groupClass.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {groupClass.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {groupClass.students?.length}/{groupClass.maxStudents}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  开课时间: {new Date(groupClass.startDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  课程时长: {groupClass.duration}
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {groupClass.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Students */}
              {groupClass.students &&  groupClass.students?.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">课程成员:</span>
                  <GroupClassAvatars
                    students={groupClass.students}
                    teacher={groupClass.teacher!}
                  />
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  <Pencil className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(groupClass.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑课程</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 