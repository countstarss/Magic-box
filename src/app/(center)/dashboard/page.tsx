"use client";

import React from "react";
import Dashboard from "./_components/dashboard";
import ContextMenuWrapper from "@/components/ui/ContextMenuWrapper";

function DashboardPage() {


  return (
    <ContextMenuWrapper>
      <Dashboard
        // userId={session.user.id} // 从 session 中获取 userId
      />
    </ContextMenuWrapper>
  );
}

export default DashboardPage;

