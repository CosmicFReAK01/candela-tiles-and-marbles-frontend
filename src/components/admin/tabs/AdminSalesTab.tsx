"use client";

import React, { useState, useEffect } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { EnquiryStatus, EnquiryRecord } from "@/types";
import {
  MessageSquare,
  Search,
  ExternalLink,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Filter,
  Edit3,
  Save,
  Trash2,
  Plus,
  X,
  User,
  MapPin,
  FileText,
  DollarSign,
  Tag,
  Check,
  BarChart3,
  TrendingUp,
  Receipt,
  Layers,
  ArrowUpRight,
  Download,
  Warehouse,
} from "lucide-react";

interface AdminSalesTabProps {
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
}

export function AdminSalesTab({
  activeSubTab = "sales-analytics",
  onSubTabChange,
}: AdminSalesTabProps) {
  const {
    enquiries,
    updateEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    createManualEnquiry,
    products,
  } = useCandelaStore();

  const [currentSection, setCurrentSection] = useState<"analytics" | "enquiries">(
    activeSubTab === "sales-enquiries" ? "enquiries" : "analytics"
  );

  useEffect(() => {
    if (activeSubTab === "sales-enquiries") setCurrentSection("enquiries");
    else setCurrentSection("analytics");
  }, [activeSubTab]);

  const handleSwitchSection = (sec: "analytics" | "enquiries") => {
    setCurrentSection(sec);
    if (onSubTabChange) onSubTabChange(`sales-${sec}`);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. PRODUCT SALES ANALYTICS STATE (Weekly, Monthly, Yearly)
  // ──────────────────────────────────────────────────────────────────────────
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [salesLoading, setSalesLoading] = useState(false);

  // Sales data payload state
  const [salesData, setSalesData] = useState<{
    summary: { totalRevenueInr: number; totalSqftSold: number; totalOrders: number; averageOrderValueInr: number };
    timeSeries: { label: string; revenue: number; sqft: number; orders: number }[];
    topProducts: { name: string; category: string; revenue: number; sqft: number }[];
    recentOrders: any[];
  }>({
    summary: {
      totalRevenueInr: 25482000,
      totalSqftSold: 28450,
      totalOrders: 18,
      averageOrderValueInr: 1415666,
    },
    timeSeries: [
      { label: "May 2026", revenue: 3960000, sqft: 3600, orders: 3 },
      { label: "Jun 2026", revenue: 4060000, sqft: 2800, orders: 2 },
      { label: "Jul 2026", revenue: 2204000, sqft: 5800, orders: 4 },
      { label: "Aug 2026", revenue: 4620000, sqft: 4200, orders: 3 },
      { label: "Sep 2026", revenue: 4495000, sqft: 3100, orders: 2 },
      { label: "Oct 2026", revenue: 6143000, sqft: 8950, orders: 4 },
    ],
    topProducts: [
      { name: "Calacatta Viola Riserva Slab Lot", category: "Marble", revenue: 11207500, sqft: 7750 },
      { name: "Travertino Navona Vein Cut Slabs", category: "Marble", revenue: 8645000, sqft: 7550 },
      { name: "Calacatta Gold Grande Tile", category: "Tiles", revenue: 4896000, sqft: 13200 },
      { name: "Fluted Monolith Basin & Faucet Suite", category: "Sanitaryware", revenue: 582000, sqft: 12 },
    ],
    recentOrders: [
      {
        id: "ord-2026-w42-01",
        order_number: "CND-ORD-1092",
        customer_name: "Morphogenesis Architecture",
        project_city: "Mumbai",
        product_name: "Calacatta Viola Riserva Slab Lot",
        master_category: "Marble",
        quantity_sqft: 1850,
        unit_price_inr: 1450,
        total_amount_inr: 2682500,
        order_status: "completed",
        created_at: "2026-10-21T10:30:00Z",
      },
      {
        id: "ord-2026-w42-02",
        order_number: "CND-ORD-1093",
        customer_name: "Kunal & Associates Interior",
        project_city: "Pune",
        product_name: "Calacatta Gold Grande Tile",
        master_category: "Tiles",
        quantity_sqft: 3200,
        unit_price_inr: 380,
        total_amount_inr: 1216000,
        order_status: "completed",
        created_at: "2026-10-20T14:15:00Z",
      },
      {
        id: "ord-2026-w42-03",
        order_number: "CND-ORD-1094",
        customer_name: "Oberoi Penthouse Client",
        project_city: "Mumbai",
        product_name: "Travertino Navona Vein Cut Slabs",
        master_category: "Marble",
        quantity_sqft: 950,
        unit_price_inr: 1100,
        total_amount_inr: 1045000,
        order_status: "completed",
        created_at: "2026-10-19T16:45:00Z",
      },
      {
        id: "ord-2026-w42-05",
        order_number: "CND-ORD-1096",
        customer_name: "Lodha Luxury Villa #14",
        project_city: "Alibaug",
        product_name: "Calacatta Viola Riserva Slab Lot",
        master_category: "Marble",
        quantity_sqft: 1400,
        unit_price_inr: 1450,
        total_amount_inr: 2030000,
        order_status: "completed",
        created_at: "2026-10-18T11:00:00Z",
      },
    ],
  });

  // Fetch actual data from DB based on selected timeframe
  useEffect(() => {
    let isMounted = true;
    async function loadSales() {
      setSalesLoading(true);
      try {
        const res = await fetch(`/api/v1/admin/sales?timeframe=${timeframe}`);
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          setSalesData(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch live sales data:", e);
      } finally {
        if (isMounted) setSalesLoading(false);
      }
    }
    loadSales();
    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const maxRevenue = Math.max(...salesData.timeSeries.map((d) => d.revenue), 1);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. ENQUIRIES & LEADS PIPELINE STATE
  // ──────────────────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string>(
    enquiries[0]?.id || ""
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EnquiryRecord | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState<Partial<EnquiryRecord>>({
    clientName: "",
    firmOrProjectName: "",
    role: "Architect / Interior Designer",
    phoneWhatsApp: "+91 ",
    email: "",
    projectCity: "Mumbai",
    projectTimeline: "Immediate (0-30 Days)",
    notes: "",
    assignedAdvisor: "Bhiwandi Showroom Concierge",
    items: [],
  });

  const selectedEnquiry =
    enquiries.find((e) => e.id === selectedEnquiryId) || enquiries[0] || null;

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesSearch =
      e.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.projectCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.assignedAdvisor && e.assignedAdvisor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const startEditing = (enq: EnquiryRecord) => {
    setEditForm(JSON.parse(JSON.stringify(enq)));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    updateEnquiry(editForm.id, editForm);
    setIsEditing(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleDeleteEnquiry = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete lead "${name}"?`)) {
      deleteEnquiry(id);
    }
  };

  const handleCreateNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.clientName || !newLeadForm.phoneWhatsApp) {
      alert("Client name and phone number are required.");
      return;
    }

    const newRecord: EnquiryRecord = {
      id: `enq-manual-${Date.now()}`,
      referenceCode: `CND-SHOWROOM-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newLeadForm.clientName,
      firmOrProjectName: newLeadForm.firmOrProjectName || "",
      role: newLeadForm.role as any,
      phoneWhatsApp: newLeadForm.phoneWhatsApp,
      email: newLeadForm.email || "",
      projectCity: newLeadForm.projectCity || "Mumbai",
      projectTimeline: newLeadForm.projectTimeline as any,
      notes: newLeadForm.notes || "",
      status: "RECEIVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAdvisor: newLeadForm.assignedAdvisor || "Bhiwandi Showroom Concierge",
      items: newLeadForm.items || [],
    };

    createManualEnquiry(newRecord);
    setIsNewLeadModalOpen(false);
    setSelectedEnquiryId(newRecord.id);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ─── TOP SECTION BAR ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Commercial Intelligence &amp; Revenue Operations
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Sales &amp; Architectural Revenue
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Analyze weekly, monthly, and yearly product sales, order volume, and direct client specification pipeline.
          </p>
        </div>

        {/* Section Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-sm border border-gray-200">
          <button
            type="button"
            onClick={() => handleSwitchSection("analytics")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "analytics"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#9E7B47]" />
            Product Sales (W/M/Y)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchSection("enquiries")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "enquiries"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Receipt className="h-3.5 w-3.5 text-[#9E7B47]" />
            Enquiries &amp; Leads ({enquiries.length})
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-VIEW 1: PRODUCT SALES ANALYTICS (Weekly, Monthly, Yearly)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentSection === "analytics" && (
        <div className="space-y-6">
          {/* Timeframe Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-sm border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-500">Sales Period:</span>
              <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setTimeframe("weekly")}
                  className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
                    timeframe === "weekly"
                      ? "bg-[#9E7B47] text-white font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Weekly (Last 7 Days)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("monthly")}
                  className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
                    timeframe === "monthly"
                      ? "bg-[#9E7B47] text-white font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Monthly (Last 12 Months)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("yearly")}
                  className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
                    timeframe === "yearly"
                      ? "bg-[#9E7B47] text-white font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Yearly (2024 - 2026)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Sales Engine Active</span>
            </div>
          </div>

          {/* 4 Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
                <span>Gross Product Revenue</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-heading font-semibold text-gray-900">
                ₹{(salesData.summary.totalRevenueInr / 100000).toFixed(2)}{" "}
                <span className="text-sm font-sans font-normal text-gray-500">Lakhs</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                {timeframe === "weekly" ? "Past 7 days volume" : timeframe === "monthly" ? "Past 12 months" : "Multi-year comparison"}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
                <span>Total Surface Area Sold</span>
                <Layers className="h-4 w-4 text-[#9E7B47]" />
              </div>
              <div className="text-2xl font-heading font-semibold text-gray-900">
                {salesData.summary.totalSqftSold.toLocaleString()}{" "}
                <span className="text-sm font-sans font-normal text-gray-500">sq.ft</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Calibrated slabs &amp; architectural tiles</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
                <span>Average Order Value (AOV)</span>
                <DollarSign className="h-4 w-4 text-[#9E7B47]" />
              </div>
              <div className="text-2xl font-heading font-semibold text-gray-900">
                ₹{(salesData.summary.averageOrderValueInr / 100000).toFixed(2)}{" "}
                <span className="text-sm font-sans font-normal text-gray-500">Lakhs</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">High architectural ticket sizes</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
                <span>Completed Orders</span>
                <Receipt className="h-4 w-4 text-[#9E7B47]" />
              </div>
              <div className="text-2xl font-heading font-semibold text-gray-900">
                {salesData.summary.totalOrders}{" "}
                <span className="text-sm font-sans font-normal text-gray-500">Invoices</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">100% fulfilled &amp; dispatched</p>
            </div>
          </div>

          {/* Visual Sales Chart & Top Products Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Time Series Revenue Breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
                    Sales Revenue Velocity
                  </span>
                  <h3 className="font-heading text-base font-semibold text-gray-900">
                    {timeframe === "weekly"
                      ? "Weekly Daily Trend"
                      : timeframe === "monthly"
                      ? "Monthly Revenue Trend"
                      : "Yearly Growth Comparison"}
                  </h3>
                </div>
                <span className="text-xs font-mono text-gray-400">Values in ₹ INR</span>
              </div>

              {/* Bar Chart Representation */}
              <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-200">
                {salesData.timeSeries.map((item, index) => {
                  const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10 mb-1">
                        <div>₹{(item.revenue / 100000).toFixed(1)} Lakhs</div>
                        <div className="text-gray-400 text-[9px]">{item.sqft.toLocaleString()} sq.ft</div>
                      </div>

                      <div
                        className="w-full bg-[#EADCC9] group-hover:bg-[#9E7B47] transition-all rounded-t-xs"
                        style={{ height: `${heightPercent}%` }}
                      />

                      <span className="text-[10px] font-mono text-gray-500 truncate w-full text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-1">
                <span>Low Base</span>
                <span>Peak Period Performance</span>
              </div>
            </div>

            {/* Right: Top Performing Products (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
                  Top Product Lines
                </span>
                <h3 className="font-heading text-base font-semibold text-gray-900">
                  Leading Sales Volume
                </h3>
              </div>

              <div className="space-y-4">
                {salesData.topProducts.map((prod, idx) => {
                  const percent = Math.min(
                    100,
                    Math.round(
                      (prod.revenue / (salesData.topProducts[0]?.revenue || 1)) * 100
                    )
                  );
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-sans">
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">
                          {prod.name}
                        </span>
                        <span className="font-mono font-semibold text-gray-900">
                          ₹{(prod.revenue / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#9E7B47] h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>Category: {prod.category}</span>
                        <span>{prod.sqft.toLocaleString()} sq.ft dispatched</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sales Orders Detailed Ledger */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden space-y-2">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-semibold text-gray-900">
                  Recent Product Sales Orders ({salesData.recentOrders.length})
                </h3>
                <p className="text-xs text-gray-500 font-light">
                  Line item invoicing for verified client purchases.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF5EE] border-b border-gray-200 text-gray-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Invoice #</th>
                    <th className="py-2.5 px-4">Architect / Client</th>
                    <th className="py-2.5 px-4">Product Sourced</th>
                    <th className="py-2.5 px-4">Volume (Sq.Ft)</th>
                    <th className="py-2.5 px-4">Gross Total (₹)</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Order Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesData.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4 font-semibold text-[#9E7B47]">
                        {ord.order_number}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-gray-900">
                        {ord.customer_name}
                        <span className="block text-[10px] font-mono text-gray-400">
                          {ord.project_city || "Mumbai"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-sans">
                        {ord.product_name}
                        <span className="block text-[10px] font-mono text-gray-400">
                          {ord.master_category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {Number(ord.quantity_sqft).toLocaleString()} sq.ft
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{Number(ord.total_amount_inr).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                          {ord.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-VIEW 2: ENQUIRIES & LEADS PIPELINE
      ══════════════════════════════════════════════════════════════════════ */}
      {currentSection === "enquiries" && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gray-500">Pipeline Status:</span>
              {["all", "RECEIVED", "UNDER_REVIEW", "QUOTATION_SHARED", "CONVERTED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 font-mono text-xs uppercase rounded transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#9E7B47] text-white font-semibold"
                      : "bg-white border border-gray-300 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsNewLeadModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#9E7B47] text-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Showroom Lead</span>
            </button>
          </div>

          {/* Enquiries Master / Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Lead List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lead code, architect, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredEnquiries.map((enq) => {
                  const isSelected = enq.id === selectedEnquiryId;
                  return (
                    <div
                      key={enq.id}
                      onClick={() => {
                        setSelectedEnquiryId(enq.id);
                        setIsEditing(false);
                      }}
                      className={`p-3.5 rounded-sm border transition cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF5EE] border-[#9E7B47] shadow-xs"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-[#9E7B47] font-semibold">
                          {enq.referenceCode}
                        </span>
                        <span className="text-[9px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">
                          {enq.status.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="font-heading text-sm font-semibold text-gray-900 truncate">
                        {enq.clientName}
                      </h4>
                      <div className="text-xs text-gray-500 font-light flex items-center justify-between mt-1">
                        <span>{enq.role}</span>
                        <span>{enq.projectCity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Lead Detail (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-gray-200 shadow-xs space-y-5">
              {selectedEnquiry ? (
                <div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <span className="font-mono text-[10px] text-[#9E7B47] uppercase font-semibold">
                        Lead Reference: {selectedEnquiry.referenceCode}
                      </span>
                      <h3 className="font-heading text-xl font-semibold text-gray-900">
                        {selectedEnquiry.clientName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedEnquiry.status}
                        onChange={(e) =>
                          updateEnquiryStatus(selectedEnquiry.id, e.target.value as any)
                        }
                        className="rounded border border-gray-300 text-xs font-mono py-1 px-2 text-gray-700 bg-white"
                      >
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        <option value="QUOTATION_SHARED">QUOTATION SHARED</option>
                        <option value="CONVERTED">CONVERTED</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteEnquiry(selectedEnquiry.id, selectedEnquiry.clientName)
                        }
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Phone / WhatsApp</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.phoneWhatsApp}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Email</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Project City</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.projectCity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Assigned Advisor</span>
                      <span className="font-semibold text-[#9E7B47]">
                        {selectedEnquiry.assignedAdvisor || "Bhiwandi Desk"}
                      </span>
                    </div>
                  </div>

                  {selectedEnquiry.notes && (
                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 font-sans border border-gray-100 mb-4">
                      <span className="font-mono text-[10px] text-gray-400 uppercase block mb-1">
                        Client Specifications &amp; Architectural Notes:
                      </span>
                      <p>{selectedEnquiry.notes}</p>
                    </div>
                  )}

                  {selectedEnquiry.items?.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-gray-400 uppercase block">
                        Surface Items Enquired:
                      </span>
                      {selectedEnquiry.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded border border-gray-200 text-xs font-mono"
                        >
                          <div>
                            <span className="font-semibold text-gray-900 block font-sans">
                              {item.productName}
                            </span>
                            <span className="text-gray-400 text-[10px]">SKU: {item.sku}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">
                              {item.requestedSqft} sq.ft
                            </span>
                            <span className="block text-[10px] text-gray-400">
                              ~{item.estimatedBoxes} crates
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-xs font-mono text-gray-400">
                  Select a lead from the left to view specifications.
                </div>
              )}
            </div>
          </div>

          {/* New Lead Modal */}
          {isNewLeadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-heading text-base font-semibold text-gray-900">
                    Log Walk-In Showroom Client Lead
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsNewLeadModalOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateNewLead} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-gray-600 mb-1">Architect / Client Name *</label>
                    <input
                      type="text"
                      required
                      value={newLeadForm.clientName}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, clientName: e.target.value })
                      }
                      className="w-full rounded border border-gray-300 p-2 font-sans text-gray-900"
                      placeholder="e.g. Ar. Rahul Mehta"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1">WhatsApp Phone *</label>
                      <input
                        type="text"
                        required
                        value={newLeadForm.phoneWhatsApp}
                        onChange={(e) =>
                          setNewLeadForm({ ...newLeadForm, phoneWhatsApp: e.target.value })
                        }
                        className="w-full rounded border border-gray-300 p-2 text-gray-900"
                        placeholder="+91 98200 12345"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        value={newLeadForm.projectCity}
                        onChange={(e) =>
                          setNewLeadForm({ ...newLeadForm, projectCity: e.target.value })
                        }
                        className="w-full rounded border border-gray-300 p-2 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Client Specifications &amp; Notes</label>
                    <textarea
                      rows={3}
                      value={newLeadForm.notes}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                      className="w-full rounded border border-gray-300 p-2 font-sans text-gray-900"
                      placeholder="Client looking for 2400 sq.ft Calacatta marble slabs for duplex penthouse living room..."
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsNewLeadModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#9E7B47] text-white px-5 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold"
                    >
                      Save Lead Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
