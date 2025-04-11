import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Team,
  TeamMember,
  CreateTeamData,
  UpdateTeamData,
  InviteMemberData,
  MemberRole,
  TeamType,
} from "./types";

interface TeamState {
  // 团队数据
  teams: Team[];
  selectedTeamId: string | null;

  // 获取选中的团队
  selectedTeam: Team | null;

  // 团队操作
  createTeam: (data: CreateTeamData) => Promise<Team>;
  updateTeam: (id: string, data: UpdateTeamData) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  selectTeam: (id: string | null) => void;

  // 成员操作
  inviteMember: (teamId: string, data: InviteMemberData) => Promise<TeamMember>;
  removeMember: (teamId: string, memberId: string) => Promise<void>;
  updateMemberRole: (
    teamId: string,
    memberId: string,
    role: MemberRole
  ) => Promise<void>;
}

// 生成模拟团队数据
const generateMockTeams = (): Team[] => {
  const currentUser: TeamMember = {
    id: "current-user",
    name: "当前用户",
    email: "current@example.com",
    role: "owner",
    joinedAt: new Date("2023-01-15"),
    lastActive: new Date(),
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
  };

  const team1Members: TeamMember[] = [
    currentUser,
    {
      id: "member-1",
      name: "张三",
      email: "zhang.san@example.com",
      role: "admin",
      joinedAt: new Date("2023-01-20"),
      lastActive: new Date("2023-11-15"),
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member1",
    },
    {
      id: "member-2",
      name: "李四",
      email: "li.si@example.com",
      role: "member",
      joinedAt: new Date("2023-02-10"),
      lastActive: new Date("2023-11-10"),
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member2",
    },
    {
      id: "member-3",
      name: "王五",
      email: "wang.wu@example.com",
      role: "member",
      joinedAt: new Date("2023-03-05"),
      lastActive: new Date("2023-10-25"),
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member3",
    },
  ];

  const team2Members: TeamMember[] = [
    currentUser,
    {
      id: "member-4",
      name: "赵六",
      email: "zhao.liu@example.com",
      role: "member",
      joinedAt: new Date("2023-05-12"),
      lastActive: new Date("2023-11-01"),
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member4",
    },
  ];

  return [
    {
      id: "team-1",
      name: "市场部",
      description: "负责公司的营销和推广活动",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=team1",
      type: "business",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-11-01"),
      members: team1Members,
      isVerified: true,
      plan: {
        name: "专业版",
        maxMembers: 10,
        maxStorage: 100 * 1024, // 100GB
        features: ["无限邮件", "高级协作", "优先支持"],
        price: 19.99,
      },
      stats: {
        totalEmails: 1245,
        monthlyEmails: 156,
        activeChats: 3,
        pendingMessages: 8,
        sharedDocs: 27,
        recentDocs: 5,
      },
    },
    {
      id: "team-2",
      name: "个人项目",
      description: "个人工作和副业项目",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=team2",
      type: "personal",
      createdAt: new Date("2023-05-10"),
      updatedAt: new Date("2023-10-20"),
      members: team2Members,
      isVerified: false,
      plan: {
        name: "免费版",
        maxMembers: 3,
        maxStorage: 5 * 1024, // 5GB
        features: ["基本邮件", "基本协作"],
        price: 0,
      },
      stats: {
        totalEmails: 287,
        monthlyEmails: 42,
        activeChats: 1,
        pendingMessages: 2,
        sharedDocs: 8,
        recentDocs: 2,
      },
    },
  ];
};

// 创建 Zustand store
export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // 初始状态
      teams: generateMockTeams(),
      selectedTeamId: "team-1",

      // 获取选中的团队
      get selectedTeam() {
        const { teams, selectedTeamId } = get();
        if (!selectedTeamId) return null;
        return teams.find((team) => team.id === selectedTeamId) || null;
      },

      // 团队操作
      createTeam: async (data: CreateTeamData) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        const currentUser: TeamMember = {
          id: "current-user",
          name: "当前用户",
          email: "current@example.com",
          role: "owner",
          joinedAt: new Date(),
          lastActive: new Date(),
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
        };

        const newTeam: Team = {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          type: data.type,
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [currentUser],
          isVerified: false,
          avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${data.name}`,
          plan: {
            name: "免费版",
            maxMembers: 3,
            maxStorage: 5 * 1024, // 5GB
            features: ["基本邮件", "基本协作"],
            price: 0,
          },
          stats: {
            totalEmails: 0,
            monthlyEmails: 0,
            activeChats: 0,
            pendingMessages: 0,
            sharedDocs: 0,
            recentDocs: 0,
          },
        };

        set((state) => ({
          teams: [newTeam, ...state.teams],
          selectedTeamId: newTeam.id,
        }));

        return newTeam;
      },

      updateTeam: async (id: string, data: UpdateTeamData) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        let updatedTeam: Team | null = null;

        set((state) => {
          const teams = state.teams.map((team) => {
            if (team.id === id) {
              updatedTeam = {
                ...team,
                ...data,
                updatedAt: new Date(),
              };
              return updatedTeam;
            }
            return team;
          });

          return { teams };
        });

        if (!updatedTeam) {
          throw new Error("Team not found");
        }

        return updatedTeam;
      },

      deleteTeam: async (id: string) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          const teams = state.teams.filter((team) => team.id !== id);
          const selectedTeamId =
            state.selectedTeamId === id
              ? teams.length > 0
                ? teams[0].id
                : null
              : state.selectedTeamId;

          return {
            teams,
            selectedTeamId,
          };
        });
      },

      selectTeam: (id) => {
        set({ selectedTeamId: id });
      },

      // 成员操作
      inviteMember: async (teamId: string, data: InviteMemberData) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newMember: TeamMember = {
          id: uuidv4(),
          name: data.email.split("@")[0], // 临时用邮箱前缀作为名称
          email: data.email,
          role: data.role,
          joinedAt: new Date(),
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        };

        set((state) => {
          const teams = state.teams.map((team) => {
            if (team.id === teamId) {
              return {
                ...team,
                members: [...team.members, newMember],
                updatedAt: new Date(),
              };
            }
            return team;
          });

          return { teams };
        });

        return newMember;
      },

      removeMember: async (teamId: string, memberId: string) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          const teams = state.teams.map((team) => {
            if (team.id === teamId) {
              return {
                ...team,
                members: team.members.filter(
                  (member) => member.id !== memberId
                ),
                updatedAt: new Date(),
              };
            }
            return team;
          });

          return { teams };
        });
      },

      updateMemberRole: async (
        teamId: string,
        memberId: string,
        role: MemberRole
      ) => {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          const teams = state.teams.map((team) => {
            if (team.id === teamId) {
              return {
                ...team,
                members: team.members.map((member) => {
                  if (member.id === memberId) {
                    return {
                      ...member,
                      role,
                    };
                  }
                  return member;
                }),
                updatedAt: new Date(),
              };
            }
            return team;
          });

          return { teams };
        });
      },
    }),
    {
      name: "team-storage",
      // 选择性持久化
      partialize: (state) => ({
        selectedTeamId: state.selectedTeamId,
      }),
    }
  )
);
