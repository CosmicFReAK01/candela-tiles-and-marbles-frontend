"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  Package,
  Boxes,
  Image as ImageIcon,
  MessageSquare,
  Building2,
  ShieldCheck,
  ChevronRight,
  Home,
  FileText,
  Navigation,
  FolderTree,
  Layers,
  Warehouse,
  Receipt,
  BarChart3,
  Sparkles,
} from "lucide-react";

export type AdminConsoleTab =
  | "dashboard"
  | "website"
  | "catalogue"
  | "inspiration"
  | "inventory"
  | "media"
  | "sales"
  | "business"
  | "system";

interface SubItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  id: AdminConsoleTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: SubItem[];
}

interface AdminSidebarProps {
  activeTab: AdminConsoleTab;
  activeSubTab?: string;
  onTabChange: (tab: AdminConsoleTab, subTab?: string) => void;
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeTab,
  activeSubTab,
  onTabChange,
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<AdminConsoleTab>>(
    new Set<AdminConsoleTab>(["catalogue", "sales", "website"])
  );

  const toggleGroup = (id: AdminConsoleTab) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const NAV_GROUPS: NavGroup[] = [
    {
      id: "dashboard",
      label: "Executive Overview",
      icon: LayoutDashboard,
    },
    {
      id: "catalogue",
      label: "Catalogue",
      icon: Package,
      subItems: [
        { id: "catalogue-products", label: "Products & Slabs", icon: Layers },
        { id: "catalogue-categories", label: "Categories", icon: FolderTree },
        { id: "catalogue-collections", label: "Collections", icon: Boxes },
      ],
    },
    {
      id: "sales",
      label: "Sales & Enquiries",
      icon: MessageSquare,
      badge: "CRM",
      subItems: [
        { id: "sales-analytics", label: "Revenue Analytics", icon: BarChart3 },
        { id: "sales-enquiries", label: "Customer Leads", icon: Receipt },
      ],
    },
    {
      id: "inventory",
      label: "Inventory & Yard",
      icon: Warehouse,
    },
    {
      id: "website",
      label: "Storefront CMS",
      icon: Globe,
      badge: "CMS",
      subItems: [
        { id: "website-homepage", label: "Homepage", icon: Home },
        { id: "website-pages", label: "Site Pages", icon: FileText },
        { id: "website-navigation", label: "Navigation", icon: Navigation },
      ],
    },
    {
      id: "media",
      label: "Media Library",
      icon: ImageIcon,
    },
    {
      id: "inspiration",
      label: "Realized Projects",
      icon: Sparkles,
    },
    {
      id: "business",
      label: "Showrooms & Concierge",
      icon: Building2,
    },
    {
      id: "system",
      label: "Security & System",
      icon: ShieldCheck,
    },
  ];

  const handleSelect = (tab: AdminConsoleTab, subId?: string) => {
    onTabChange(tab, subId);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <aside
      className={`flex h-full flex-col border-r border-white/10 bg-[#161513] text-[#D7D2C8] transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      } shrink-0`}
    >
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-3 mb-2 border-b border-white/10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8B6914] font-semibold">
              Atelier Navigation
            </p>
          </div>
        )}

        {NAV_GROUPS.map((group) => {
          const Icon = group.icon;
          const isActive = activeTab === group.id;
          const hasSubItems = !!group.subItems?.length;
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => {
                  handleSelect(group.id, group.subItems?.[0]?.id);
                  if (hasSubItems && !collapsed) {
                    toggleGroup(group.id);
                  }
                }}
                className={`group flex w-full items-center justify-between px-3 py-2.5 transition text-left cursor-pointer border-l-2 ${
                  isActive
                    ? "border-candela-accent bg-candela-accent/15 text-white font-medium"
                    : "border-transparent text-[#B8B2A8] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition ${
                      isActive
                        ? "text-candela-accent"
                        : "text-[#8E887E] group-hover:text-candela-accent"
                    }`}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="text-xs font-sans tracking-wide truncate">
                      {group.label}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {group.badge && (
                      <span
                        className={`px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider border ${
                          isActive
                            ? "border-candela-accent/60 bg-candela-accent text-white"
                            : "border-white/15 bg-white/[0.04] text-[#A8A298]"
                        }`}
                      >
                        {group.badge}
                      </span>
                    )}
                    {hasSubItems && (
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        } ${isActive ? "text-candela-accent" : "text-[#7A746C]"}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                )}
              </button>

              {hasSubItems && isExpanded && !collapsed && (
                <div className="ml-5 pl-3 border-l border-white/10 mt-1 mb-2 space-y-0.5">
                  {group.subItems!.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = isActive && activeSubTab === sub.id;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelect(group.id, sub.id)}
                        className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                          isSubActive
                            ? "text-candela-accent font-semibold bg-white/[0.04]"
                            : "text-[#9E988E] hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        <SubIcon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSubActive ? "text-candela-accent" : "text-[#7A746C]"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!collapsed && (
        <div className="border-t border-white/10 p-4 font-mono text-[10px] text-[#7A746C] space-y-1">
          <div className="flex items-center justify-between">
            <span>Architecture</span>
            <span className="text-candela-accent">Next.js 14</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Database</span>
            <span className="text-emerald-400">Supabase PG 17</span>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
