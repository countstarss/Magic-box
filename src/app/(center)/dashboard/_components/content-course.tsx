"use client";

import React, { useEffect, useState } from "react";
import { PlayCircle, Clock, Heart, Star, Share, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "timeago.js";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    smallSummary: string;
    price: number;
    uploadedAt: Date;
    videoUrl?: string; // 视频链接
    imageUrl: string; // 图片链接
}

interface ContentCourseCardProps {
    courseInfo: Course;
}

export default function ContentCourseCard({ courseInfo }: ContentCourseCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [timeAgo, setTimeAgo] = useState(format(courseInfo.uploadedAt));

    const handleWatchLater = () => {
        toast.success("已添加到Watch Later!");
    };

    // 每 60 秒更新一次上传时间
    useEffect(() => {
        const timer = setInterval(() => {
          setTimeAgo(format(courseInfo.uploadedAt));
        }, 60000); // 每 60 秒更新一次
    
        return () => clearInterval(timer); // 组件卸载时清理定时器
      }, [courseInfo.uploadedAt]);

    return (
        <Card
            className="relative flex flex-col hover:shadow-lg transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsVideoPlaying(false);
            }}
        >
            {/* 视频或图片展示 */}
            <CardHeader className="relative p-0">
                {courseInfo.videoUrl ? (
                    <div className="relative w-full h-[150px] overflow-hidden group">
                        <Image
                            width={100}
                            height={100}
                            src={courseInfo.imageUrl}
                            alt={courseInfo.title}
                            className="w-full h-[150px] object-cover"
                        />
                        <div
                            className={cn(
                                "absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full",
                                isHovered ? "block" : "hidden"
                            )}
                        >
                            <PlayCircle size={20} />
                        </div>
                        {isVideoPlaying && muted && (
                            <Button
                                className="absolute bottom-4 left-4 text-xs"
                                variant="secondary"
                                onClick={() => setMuted(false)}
                            >
                                取消静音
                            </Button>
                        )}
                    </div>
                ) : (
                    <Image
                        width={100}
                        height={100}
                        src={courseInfo.imageUrl}
                        alt={courseInfo.title}
                        className="w-full h-[150px] object-cover"
                    />
                )}
                {/* Hover时的Watch Later按钮 */}
                {isHovered && (
                    <Button
                        variant="outline"
                        className="absolute top-4 right-4 text-sm"
                        onClick={handleWatchLater}
                    >
                        <Clock size={16} className="mr-1" /> Watch Later
                    </Button>
                )}
            </CardHeader>

            {/* 课程信息展示 */}
            <CardContent className="p-4 flex-1 flex flex-row gap-2 justify-start items-start">
                <div className="flex flex-row justify-start w-[10%] min-w-10">
                    <div className="w-10 h-10 rounded-full bg-black" />
                </div>
                <div className="flex flex-row justify-start w-[90%] gap-6">
                    <div className="gap-2 ml-2 w-[80%]">
                        <h3 className="text-lg font-bold">{courseInfo.title}</h3>
                        <p className="text-sm text-muted-foreground">{courseInfo.smallSummary}</p>
                        <div className="mt-2 text-sm font-medium text-gray-500">
                            <span>上传时间：{format(courseInfo.uploadedAt)}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => alert("已添加到喜欢")}>
                                <Heart size={16} className="mr-2" /> 添加到喜欢
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("已添加到收藏")}>
                                <Star size={16} className="mr-2" /> 添加到收藏
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("已添加到播放列表")}>
                                <Clock size={16} className="mr-2" /> 添加播放列表
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                <Share size={16} className="mr-2" /> 分享链接
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}