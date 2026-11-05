import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ComposedChart,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Home,
  TrendingUp,
  BarChart3,
  User,
  Search,
  Bell,
  Star,
  StarOff,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Play,
  Lock,
  BookOpen,
  Gift,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  X,
  Check,
  Info,
  Crown,
  Sparkles,
  GraduationCap,
  Shield,
  Wallet,
  History,
  HelpCircle,
  Mail,
  ChevronDown,
  Zap,
  Globe,
  Users,
  Award,
  Target,
  Headphones,
  Clock,
  ArrowRight,
  Menu,
  Building2,
  PieChart,
  Smartphone,
  ShieldCheck,
  BadgeCheck,
  Quote,
  Plus,
  Minus,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
  Trophy,
  Medal,
  AlertTriangle,
  BellRing,
  TrendingDown,
  Newspaper,
  KeyRound,
  Fingerprint,
  CandlestickChart,
  Activity,
  RefreshCw,
  RefreshCcw,
  Calendar,
  DollarSign,
  Percent,
  Filter,
  SortDesc,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Flame,
  Link as LinkIcon,
  Diamond,
  Vote,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Music,
  Disc,
  MessageCircle,
  Lightbulb,
  ImageIcon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  useUser,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useUserByEmail,
  useStock,
  useStocks,
  useStockBySymbol,
  useFeaturedStocks,
  useUpdateStock,
  usePriceHistory,
  useCreatePriceHistory,
  usePortfolio,
  usePortfolioItem,
  useCreatePortfolio,
  useUpdatePortfolio,
  useOrders,
  usePendingOrders,
  useCreateOrder,
  useUpdateOrder,
  useCancelOrder,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useTransactions,
  useCreateTransaction,
  useNotifications,
  useUnreadNotifications,
  useCreateNotification,
  useMarkNotificationRead,
  useExclusiveContent,
  useAllExclusiveContent,
  useEducationalContent,
  useUserContentProgress,
  useUpdateContentProgress,
  type UserModel,
  type StockModel,
  type PortfolioModel,
  type OrderModel,
  type WatchlistModel,
  type NotificationModel,
  type ExclusiveContentModel,
  type EducationalContentModel,
  UserRiskProfile,
  OrderOrderType,
  OrderSide,
  OrderStatus,
  TransactionType,
  NotificationType,
  ExclusiveContentContentType,
  EducationalContentCategory,
  EducationalContentContentType,
  EducationalContentDifficulty,
} from "@/hooks/use-trading-api";

import { StockORM } from "@/components/data/orm/orm_stock";
import { UserORM } from "@/components/data/orm/orm_user";
import { PortfolioORM } from "@/components/data/orm/orm_portfolio";
import { WatchlistORM } from "@/components/data/orm/orm_watchlist";
import { OrderORM } from "@/components/data/orm/orm_order";
import { TransactionORM } from "@/components/data/orm/orm_transaction";
import { PriceHistoryORM } from "@/components/data/orm/orm_price_history";
import { NotificationORM } from "@/components/data/orm/orm_notification";
import { ExclusiveContentORM } from "@/components/data/orm/orm_exclusive_content";
import { EducationalContentORM } from "@/components/data/orm/orm_educational_content";

export const Route = createFileRoute("/")({
  component: App,
});

const APP_VIEWS: AppView[] = [
  "splash", "login", "register", "forgot-password", "onboarding",
  "portfolio", "trade", "markets", "account", "stock-detail",
  "exclusive", "education", "notifications", "transaction-history",
  "portfolio-analytics", "leaderboard", "security-settings", "price-alerts",
  "fan-vestor", "weverse-wallet", "nft-collectibles", "agm-voting",
  "recurring-buys", "fandom-analytics", "sell-shares", "settlement-status",
  "withdraw-funds",
];

const PUBLIC_VIEWS = new Set<AppView>(["splash", "login", "register", "forgot-password"]);

function isAppView(value: string | null): value is AppView {
  return !!value && APP_VIEWS.includes(value as AppView);
}

function readRequestedView(): AppView {
  if (typeof window === "undefined") return "splash";
  const page = new URLSearchParams(window.location.search).get("page");
  if (!isAppView(page)) return "splash";
  const signedIn = !!localStorage.getItem("hybe_paper_user_id");
  if (!signedIn && !PUBLIC_VIEWS.has(page)) return "login";
  return page;
}

function readReturnView(): AppView | null {
  if (typeof window === "undefined") return null;
  const page = new URLSearchParams(window.location.search).get("page");
  const signedIn = !!localStorage.getItem("hybe_paper_user_id");
  if (isAppView(page) && !PUBLIC_VIEWS.has(page) && !signedIn) return page;
  return null;
}

function pageTitle(view: AppView, symbol?: string): string {
  if (view === "stock-detail" && symbol) return `${symbol} · HYBE INSIGHT`;
  const labels: Partial<Record<AppView, string>> = {
    splash: "HYBE INSIGHT",
    login: "Sign in",
    register: "Create account",
    "forgot-password": "Reset password",
    portfolio: "Portfolio",
    trade: "Trade",
    markets: "Markets",
    account: "Account",
    education: "Learn",
    "transaction-history": "Transactions",
    "price-alerts": "Price alerts",
  };
  const label = labels[view];
  return label && label !== "HYBE INSIGHT" ? `${label} · HYBE INSIGHT` : "HYBE INSIGHT";
}

function buildPageUrl(view: AppView, symbol?: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set("page", view);
  if (view === "stock-detail") {
    if (symbol) url.searchParams.set("symbol", symbol);
  } else {
    url.searchParams.delete("symbol");
  }
  return `${url.pathname}${url.search}`;
}

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type AppView =
  | "splash"
  | "login"
  | "register"
  | "forgot-password"
  | "onboarding"
  | "portfolio"
  | "trade"
  | "markets"
  | "account"
  | "stock-detail"
  | "exclusive"
  | "education"
  | "notifications"
  | "transaction-history"
  | "portfolio-analytics"
  | "leaderboard"
  | "security-settings"
  | "price-alerts"
  | "fan-vestor"
  | "weverse-wallet"
  | "nft-collectibles"
  | "agm-voting"
  | "recurring-buys"
  | "fandom-analytics"
  | "sell-shares"
  | "settlement-status"
  | "withdraw-funds";

type TimeFrame = "1D" | "1W" | "1M" | "1Y" | "All";

type ChartType = "line" | "candlestick" | "area";

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceAlert {
  id: string;
  stockId: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  portfolioValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  rank: number;
  trades: number;
  winRate: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  category: "earnings" | "tour" | "release" | "market" | "general";
  sentiment: "positive" | "negative" | "neutral";
  relatedStocks: string[];
}

interface RiskQuestion {
  question: string;
  options: { label: string; value: number }[];
}

// Fan-Vestor Tier System
interface ShareholderTier {
  name: string;
  minShares: number;
  color: string;
  badge: string;
  benefits: string[];
}

const SHAREHOLDER_TIERS: ShareholderTier[] = [
  {
    name: "Standard",
    minShares: 0,
    color: "#6B7280",
    badge: "Fan",
    benefits: ["Basic app access"]
  },
  {
    name: "Bronze",
    minShares: 1,
    color: "#CD7F32",
    badge: "Shareholder",
    benefits: ["Digital shareholder ID", "Access to basic exclusive content"]
  },
  {
    name: "Silver",
    minShares: 10,
    color: "#C0C0C0",
    badge: "Silver Shareholder",
    benefits: ["5% Weverse Shop discount", "Priority content access", "Silver badge on Weverse"]
  },
  {
    name: "Gold",
    minShares: 50,
    color: "#FFD700",
    badge: "Gold Shareholder",
    benefits: ["10% Weverse Shop discount", "Concert ticket pre-sale access", "Gold badge on Weverse", "Quarterly shareholder reports"]
  },
  {
    name: "Platinum",
    minShares: 100,
    color: "#E5E4E2",
    badge: "Platinum Shareholder",
    benefits: ["15% Weverse Shop discount", "1-hour early ticket access", "IR Town Hall invitations", "Platinum badge on Weverse", "Exclusive NFT drops"]
  }
];

// Recurring Buy Triggers
interface RecurringBuyConfig {
  id: string;
  artistGroup: string;
  triggerType: "album_release" | "concert_announce" | "weekly" | "monthly";
  amount: number;
  isActive: boolean;
  createdAt: string;
}

// NFT Collectible
interface NFTCollectible {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  rarity: "common" | "rare" | "legendary";
  acquiredDate: string;
  quarter: string;
  description: string;
}

// AGM Voting Proposal
interface AGMProposal {
  id: string;
  title: string;
  description: string;
  category: "board" | "compensation" | "strategy" | "other";
  deadline: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  userVote?: "yes" | "no" | "abstain";
  reward: string;
}

// Weverse Wallet Integration
interface WeverseWallet {
  cashBalance: number;
  pendingDividends: number;
  lastDividendDate?: string;
  dividendPreference: "cash" | "weverse_cash" | "nft";
}

// Fandom Analytics Data
interface FandomMetric {
  date: string;
  albumSales: number;
  streamingCount: number;
  socialMentions: number;
  stockPrice: number;
  correlation: number;
}

// ============================================================================
// SELL/SETTLEMENT/WITHDRAWAL TYPES
// ============================================================================

// Sell Order Status for tracking through settlement
type SellOrderStatus = "EXECUTED" | "PENDING_SETTLEMENT" | "SETTLED" | "CANCELLED";

// Withdrawal Request Status
type WithdrawalStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

// Sell Order tracking with settlement info
interface SellOrderRecord {
  id: string;
  userId: string;
  stockId: string;
  stockSymbol: string;
  sharesQuantity: number;
  executedPrice: number;
  totalProceeds: number;
  status: SellOrderStatus;
  executionDate: string;
  settlementDate: string;
  settlementCompleted: boolean;
}

// User's linked bank account
interface BankAccountInfo {
  id: string;
  userId: string;
  bankName: string;
  accountNumberMasked: string;
  routingNumber: string;
  isPrimary: boolean;
  isVerified: boolean;
}

// Cash balance tracking
interface CashBalanceInfo {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}

// Withdrawal request record
interface WithdrawalRequestRecord {
  id: string;
  userId: string;
  bankAccountId: string;
  amount: number;
  status: WithdrawalStatus;
  initiatedAt: string;
  completedAt: string | null;
  transferFee: number;
  currencyConversionRate: number | null;
}

// Artist Groups for theming
const ARTIST_GROUPS = [
  { name: "BTS", color: "#7B61FF", members: ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jung Kook"] },
  { name: "SEVENTEEN", color: "#F8B4D9", members: ["S.Coups", "Jeonghan", "Joshua", "Jun", "Hoshi", "Wonwoo", "Woozi", "DK", "Mingyu", "The8", "Seungkwan", "Vernon", "Dino"] },
  { name: "TXT", color: "#00BFFF", members: ["Soobin", "Yeonjun", "Beomgyu", "Taehyun", "Huening Kai"] },
  { name: "NewJeans", color: "#87CEEB", members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"] },
  { name: "LE SSERAFIM", color: "#FF4081", members: ["Sakura", "Kim Chaewon", "Huh Yunjin", "Kazuha", "Hong Eunchae"] },
  { name: "ENHYPEN", color: "#1E90FF", members: ["Jungwon", "Heeseung", "Jay", "Jake", "Sunghoon", "Sunoo", "Ni-ki"] },
  { name: "fromis_9", color: "#FFB6C1", members: ["Saerom", "Hayoung", "Gyuri", "Jiwon", "Jisun", "Seoyeon", "Chaeyoung", "Nagyung", "Jiheon"] },
];

// Mock NFT Collectibles
const MOCK_NFTS: NFTCollectible[] = [
  {
    id: "1",
    name: "BTS Dynamite Era",
    artist: "BTS",
    imageUrl: "https://picsum.photos/seed/bts-dynamite/300/300",
    rarity: "legendary",
    acquiredDate: "2024-03-31",
    quarter: "Q1 2024",
    description: "Proof of HODL - 90 days of continuous shareholding"
  },
  {
    id: "2",
    name: "SEVENTEEN MAESTRO",
    artist: "SEVENTEEN",
    imageUrl: "https://picsum.photos/seed/svt-maestro/300/300",
    rarity: "rare",
    acquiredDate: "2024-06-30",
    quarter: "Q2 2024",
    description: "Commemorating SEVENTEEN's MAESTRO comeback"
  },
  {
    id: "3",
    name: "NewJeans Bubble Gum",
    artist: "NewJeans",
    imageUrl: "https://picsum.photos/seed/nj-bubblegum/300/300",
    rarity: "common",
    acquiredDate: "2024-09-30",
    quarter: "Q3 2024",
    description: "Summer vibes from NewJeans"
  }
];

// Mock AGM Proposals
const MOCK_AGM_PROPOSALS: AGMProposal[] = [
  {
    id: "1",
    title: "Re-election of Board Director Kim",
    description: "Proposal to re-elect Mr. Kim as an independent board director for a 2-year term.",
    category: "board",
    deadline: "2025-03-30",
    yesVotes: 85420,
    noVotes: 12340,
    abstainVotes: 5230,
    reward: "Voting Photocard"
  },
  {
    id: "2",
    title: "Executive Compensation Package",
    description: "Approval of the 2025 executive compensation plan including stock options.",
    category: "compensation",
    deadline: "2025-03-30",
    yesVotes: 72100,
    noVotes: 28450,
    abstainVotes: 8920,
    reward: "Voting Photocard"
  },
  {
    id: "3",
    title: "Global Expansion Strategy",
    description: "Approval of investment in new markets including Latin America and Southeast Asia.",
    category: "strategy",
    deadline: "2025-03-30",
    yesVotes: 95200,
    noVotes: 5800,
    abstainVotes: 3450,
    reward: "Exclusive Digital Poster"
  }
];

// Fandom Analytics Mock Data
const generateFandomData = (): FandomMetric[] => {
  const data: FandomMetric[] = [];
  const baseDate = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const albumSales = Math.floor(Math.random() * 500000) + 100000;
    const streamingCount = Math.floor(Math.random() * 50000000) + 10000000;
    const socialMentions = Math.floor(Math.random() * 2000000) + 500000;
    const stockPrice = 234500 + Math.floor(Math.random() * 10000 - 5000);
    const correlation = 0.65 + Math.random() * 0.25;

    data.push({
      date: date.toISOString().split("T")[0],
      albumSales,
      streamingCount,
      socialMentions,
      stockPrice,
      correlation
    });
  }
  return data;
};

const RISK_QUESTIONS: RiskQuestion[] = [
  {
    question: "How would you describe your investment experience?",
    options: [
      { label: "Beginner - I'm new to investing", value: 1 },
      { label: "Intermediate - I have some experience", value: 2 },
      { label: "Advanced - I'm an experienced investor", value: 3 },
    ],
  },
  {
    question: "How would you react if your portfolio dropped 20% in a month?",
    options: [
      { label: "Sell everything immediately", value: 1 },
      { label: "Hold and wait for recovery", value: 2 },
      { label: "Buy more at the lower prices", value: 3 },
    ],
  },
  {
    question: "What is your investment time horizon?",
    options: [
      { label: "Less than 1 year", value: 1 },
      { label: "1-5 years", value: 2 },
      { label: "More than 5 years", value: 3 },
    ],
  },
  {
    question: "What percentage of your savings are you willing to invest?",
    options: [
      { label: "Less than 25%", value: 1 },
      { label: "25-50%", value: 2 },
      { label: "More than 50%", value: 3 },
    ],
  },
];

const HYBE_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  gradientStart: "#7B61FF",
  gradientEnd: "#4A90E2",
  gain: "#00C805",
  loss: "#FF0000",
};

// Company brand colors for each stock
const STOCK_BRAND_COLORS: Record<string, { primary: string; secondary: string; logo: string }> = {
  HYBE: { primary: "#000000", secondary: "#7B61FF", logo: "H" },
  SM: { primary: "#FF2D78", secondary: "#FFB8D4", logo: "SM" },
  JYP: { primary: "#FF6B00", secondary: "#FFBB8C", logo: "J" },
  YG: { primary: "#000000", secondary: "#FFD700", logo: "YG" },
  CUBE: { primary: "#00C7AE", secondary: "#80E8D9", logo: "C" },
  STARSHIP: { primary: "#1E90FF", secondary: "#87CEEB", logo: "S" },
  FNC: { primary: "#E31C79", secondary: "#FFB6C1", logo: "F" },
  PLEDIS: { primary: "#7B61FF", secondary: "#B8A9FF", logo: "P" },
};

// Korean market hours (KST = UTC+9)
const KOREAN_MARKET = {
  openHour: 9,
  closeHour: 15,
  closeMinute: 30,
  timezone: "Asia/Seoul",
};

// Portfolio pie chart colors
const PORTFOLIO_COLORS = ["#7B61FF", "#4A90E2", "#00C805", "#FFB800", "#FF6B6B", "#36D7B7", "#9B59B6", "#3498DB"];

// Mock news feed data
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "BTS Announces 2025 World Tour Reunion",
    summary: "HYBE shares surge 8% as BTS confirms first group tour since military service completion. Expected to generate record-breaking revenue.",
    source: "K-Pop Daily",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "tour",
    sentiment: "positive",
    relatedStocks: ["HYBE"],
  },
  {
    id: "2",
    title: "SM Entertainment Reports Record Q3 Earnings",
    summary: "NCT and aespa album sales drive 35% YoY revenue growth. Company raises full-year guidance.",
    source: "Korea Economic Daily",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: "earnings",
    sentiment: "positive",
    relatedStocks: ["SM"],
  },
  {
    id: "3",
    title: "JYP Entertainment's Stray Kids Breaks Billboard Record",
    summary: "Fifth consecutive album to debut at #1 on Billboard 200. Stock reaches 52-week high.",
    source: "Billboard Korea",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: "release",
    sentiment: "positive",
    relatedStocks: ["JYP"],
  },
  {
    id: "4",
    title: "YG Entertainment Faces Delay in BLACKPINK Contract Renewal",
    summary: "Negotiations ongoing as members explore individual opportunities. Investors await clarity.",
    source: "Seoul Finance",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: "general",
    sentiment: "negative",
    relatedStocks: ["YG"],
  },
  {
    id: "5",
    title: "K-Pop Industry Market Cap Exceeds $20 Billion",
    summary: "Combined market capitalization of major K-pop entertainment companies reaches all-time high amid global expansion.",
    source: "K-Pop Business Insider",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: "market",
    sentiment: "positive",
    relatedStocks: ["HYBE", "SM", "JYP", "YG"],
  },
  {
    id: "6",
    title: "SEVENTEEN's World Tour Sells Out in Minutes",
    summary: "1.5 million tickets sold across 30 cities. HYBE subsidiary Pledis sees strong booking revenue.",
    source: "Variety Korea",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    category: "tour",
    sentiment: "positive",
    relatedStocks: ["HYBE", "PLEDIS"],
  },
];

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: "1", name: "김민준 (MinJun)", portfolioValue: 45680000, totalReturn: 35680000, totalReturnPercent: 356.8, rank: 1, trades: 247, winRate: 78 },
  { id: "2", name: "이서연 (Seoyeon)", portfolioValue: 38920000, totalReturn: 28920000, totalReturnPercent: 289.2, rank: 2, trades: 189, winRate: 72 },
  { id: "3", name: "박지호 (Jiho)", portfolioValue: 32450000, totalReturn: 22450000, totalReturnPercent: 224.5, rank: 3, trades: 312, winRate: 68 },
  { id: "4", name: "정수빈 (Subin)", portfolioValue: 28100000, totalReturn: 18100000, totalReturnPercent: 181.0, rank: 4, trades: 156, winRate: 71 },
  { id: "5", name: "최예진 (Yejin)", portfolioValue: 25780000, totalReturn: 15780000, totalReturnPercent: 157.8, rank: 5, trades: 203, winRate: 65 },
  { id: "6", name: "강도현 (Dohyun)", portfolioValue: 23400000, totalReturn: 13400000, totalReturnPercent: 134.0, rank: 6, trades: 178, winRate: 63 },
  { id: "7", name: "윤하늘 (Haneul)", portfolioValue: 21890000, totalReturn: 11890000, totalReturnPercent: 118.9, rank: 7, trades: 145, winRate: 67 },
  { id: "8", name: "임재민 (Jaemin)", portfolioValue: 19560000, totalReturn: 9560000, totalReturnPercent: 95.6, rank: 8, trades: 234, winRate: 61 },
  { id: "9", name: "한지우 (Jiwoo)", portfolioValue: 17890000, totalReturn: 7890000, totalReturnPercent: 78.9, rank: 9, trades: 112, winRate: 64 },
  { id: "10", name: "오승우 (Seungwoo)", portfolioValue: 16240000, totalReturn: 6240000, totalReturnPercent: 62.4, rank: 10, trades: 198, winRate: 59 },
];

// Initial K-Pop entertainment stocks data
const INITIAL_STOCKS: Partial<StockModel>[] = [
  {
    symbol: "HYBE",
    company_name: "HYBE Corporation",
    current_price: 234500,
    previous_close: 232000,
    day_high: 236000,
    day_low: 231000,
    week_52_high: 310000,
    week_52_low: 180000,
    market_cap: "9.8T KRW",
    pe_ratio: 45.2,
    volume: "1.2M",
    description: "HYBE is a South Korean entertainment company known for managing BTS, SEVENTEEN, TXT, and other K-pop artists.",
    sector: "Entertainment",
    is_featured: true,
  },
  {
    symbol: "SM",
    company_name: "SM Entertainment",
    current_price: 89500,
    previous_close: 88200,
    day_high: 90100,
    day_low: 87800,
    week_52_high: 125000,
    week_52_low: 72000,
    market_cap: "2.1T KRW",
    pe_ratio: 28.5,
    volume: "850K",
    description: "SM Entertainment is one of the largest entertainment companies in South Korea, home to EXO, NCT, aespa, and Red Velvet.",
    sector: "Entertainment",
    is_featured: true,
  },
  {
    symbol: "JYP",
    company_name: "JYP Entertainment",
    current_price: 78200,
    previous_close: 79500,
    day_high: 80000,
    day_low: 77500,
    week_52_high: 98000,
    week_52_low: 65000,
    market_cap: "3.2T KRW",
    pe_ratio: 32.1,
    volume: "620K",
    description: "JYP Entertainment manages TWICE, Stray Kids, ITZY, and NMIXX, among others.",
    sector: "Entertainment",
    is_featured: true,
  },
  {
    symbol: "YG",
    company_name: "YG Entertainment",
    current_price: 52300,
    previous_close: 51800,
    day_high: 53200,
    day_low: 51500,
    week_52_high: 78000,
    week_52_low: 45000,
    market_cap: "960B KRW",
    pe_ratio: 25.8,
    volume: "420K",
    description: "YG Entertainment is known for BLACKPINK, TREASURE, and legendary acts like BIGBANG.",
    sector: "Entertainment",
    is_featured: false,
  },
  {
    symbol: "CUBE",
    company_name: "Cube Entertainment",
    current_price: 18500,
    previous_close: 18200,
    day_high: 18800,
    day_low: 18000,
    week_52_high: 25000,
    week_52_low: 15000,
    market_cap: "280B KRW",
    pe_ratio: 18.2,
    volume: "180K",
    description: "Cube Entertainment manages (G)I-DLE, PENTAGON, and other rising K-pop groups.",
    sector: "Entertainment",
    is_featured: false,
  },
  {
    symbol: "STARSHIP",
    company_name: "Starship Entertainment",
    current_price: 24800,
    previous_close: 24500,
    day_high: 25200,
    day_low: 24200,
    week_52_high: 32000,
    week_52_low: 20000,
    market_cap: "450B KRW",
    pe_ratio: 22.5,
    volume: "210K",
    description: "Starship Entertainment is home to IVE, MONSTA X, and WJSN.",
    sector: "Entertainment",
    is_featured: false,
  },
  {
    symbol: "FNC",
    company_name: "FNC Entertainment",
    current_price: 8200,
    previous_close: 8350,
    day_high: 8400,
    day_low: 8100,
    week_52_high: 12000,
    week_52_low: 7000,
    market_cap: "180B KRW",
    pe_ratio: 15.2,
    volume: "95K",
    description: "FNC Entertainment manages SF9, Cherry Bullet, and P1Harmony.",
    sector: "Entertainment",
    is_featured: false,
  },
  {
    symbol: "PLEDIS",
    company_name: "Pledis Entertainment",
    current_price: 45600,
    previous_close: 44800,
    day_high: 46200,
    day_low: 44500,
    week_52_high: 58000,
    week_52_low: 38000,
    market_cap: "620B KRW",
    pe_ratio: 35.8,
    volume: "320K",
    description: "Pledis Entertainment (subsidiary of HYBE) manages SEVENTEEN and fromis_9.",
    sector: "Entertainment",
    is_featured: false,
  },
];

// Initial exclusive content
const INITIAL_EXCLUSIVE_CONTENT: Partial<ExclusiveContentModel>[] = [
  {
    title: "BTS: Behind the Scenes of 'Dynamite'",
    description: "Exclusive footage from the making of the hit single",
    content_type: ExclusiveContentContentType.Video,
    content_url: "https://example.com/bts-dynamite-bts",
    thumbnail_url: "https://picsum.photos/seed/bts1/400/225",
    min_shares_required: 1,
  },
  {
    title: "SEVENTEEN Practice Room Session",
    description: "Watch SEVENTEEN perfect their choreography",
    content_type: ExclusiveContentContentType.Video,
    content_url: "https://example.com/svt-practice",
    thumbnail_url: "https://picsum.photos/seed/svt1/400/225",
    min_shares_required: 5,
  },
  {
    title: "TXT Photo Shoot Gallery",
    description: "Exclusive photos from the latest album shoot",
    content_type: ExclusiveContentContentType.Photo,
    content_url: "https://example.com/txt-photos",
    thumbnail_url: "https://picsum.photos/seed/txt1/400/225",
    min_shares_required: 3,
  },
  {
    title: "HYBE Q3 2024 Shareholder Letter",
    description: "CEO's message to shareholders with insights on company direction",
    content_type: ExclusiveContentContentType.Announcement,
    content_url: "https://example.com/hybe-shareholder-letter",
    thumbnail_url: "https://picsum.photos/seed/hybe1/400/225",
    min_shares_required: 10,
  },
  {
    title: "NewJeans Documentary: The Beginning",
    description: "The untold story of NewJeans' debut journey",
    content_type: ExclusiveContentContentType.Video,
    content_url: "https://example.com/nj-documentary",
    thumbnail_url: "https://picsum.photos/seed/nj1/400/225",
    min_shares_required: 15,
  },
  {
    title: "LE SSERAFIM Exclusive Interview",
    description: "Members discuss their upcoming world tour",
    content_type: ExclusiveContentContentType.Article,
    content_url: "https://example.com/lsf-interview",
    thumbnail_url: "https://picsum.photos/seed/lsf1/400/225",
    min_shares_required: 8,
  },
];

// Initial educational content
const INITIAL_EDUCATIONAL_CONTENT: Partial<EducationalContentModel>[] = [
  {
    title: "Introduction to Stock Trading",
    description: "Learn the basics of buying and selling stocks",
    content_type: EducationalContentContentType.Article,
    content_url: "https://example.com/intro-trading",
    category: EducationalContentCategory.Basics,
    difficulty: EducationalContentDifficulty.Beginner,
  },
  {
    title: "Understanding P/E Ratios",
    description: "How to evaluate stocks using price-to-earnings ratios",
    content_type: EducationalContentContentType.Video,
    content_url: "https://example.com/pe-ratio",
    category: EducationalContentCategory.Fundamentals,
    difficulty: EducationalContentDifficulty.Intermediate,
  },
  {
    title: "HYBE's Business Model Explained",
    description: "Deep dive into how HYBE generates revenue",
    content_type: EducationalContentContentType.Article,
    content_url: "https://example.com/hybe-business",
    category: EducationalContentCategory.HYBE,
    difficulty: EducationalContentDifficulty.Beginner,
  },
  {
    title: "The K-Pop Industry Ecosystem",
    description: "Understanding the K-pop entertainment business landscape",
    content_type: EducationalContentContentType.Video,
    content_url: "https://example.com/kpop-ecosystem",
    category: EducationalContentCategory.KPOP,
    difficulty: EducationalContentDifficulty.Beginner,
  },
  {
    title: "Technical Analysis for Beginners",
    description: "Reading charts and identifying trends",
    content_type: EducationalContentContentType.Video,
    content_url: "https://example.com/technical-analysis",
    category: EducationalContentCategory.Strategies,
    difficulty: EducationalContentDifficulty.Intermediate,
  },
  {
    title: "Risk Management Strategies",
    description: "Protecting your portfolio from major losses",
    content_type: EducationalContentContentType.Article,
    content_url: "https://example.com/risk-management",
    category: EducationalContentCategory.Strategies,
    difficulty: EducationalContentDifficulty.Advanced,
  },
  {
    title: "Market Orders vs Limit Orders",
    description: "Choosing the right order type for your trades",
    content_type: EducationalContentContentType.Video,
    content_url: "https://example.com/order-types",
    category: EducationalContentCategory.Basics,
    difficulty: EducationalContentDifficulty.Beginner,
  },
  {
    title: "Fan Economy and Stock Performance",
    description: "How fandom activity impacts entertainment stocks",
    content_type: EducationalContentContentType.Article,
    content_url: "https://example.com/fan-economy",
    category: EducationalContentCategory.KPOP,
    difficulty: EducationalContentDifficulty.Intermediate,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(value: number, currency = "KRW"): string {
  if (currency === "KRW") {
    return `₩${value.toLocaleString()}`;
  }
  return `$${value.toLocaleString()}`;
}

function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function calculateChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt or similar
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

function generatePriceHistory(
  basePrice: number,
  days: number,
  volatility = 0.02
): { date: string; price: number; volume: number }[] {
  const history: { date: string; price: number; volume: number }[] = [];
  let price = basePrice * (1 - volatility * days * 0.1);
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.5);
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }

  // Ensure the last price matches current price
  if (history.length > 0) {
    history[history.length - 1].price = basePrice;
  }

  return history;
}

// Enhanced realistic price simulation with volatility clustering and mean reversion
function simulatePriceMovement(currentPrice: number, volatility = 0.005): number {
  // Add some randomness with slight upward bias (market tends to go up long-term)
  const trend = 0.0001; // Slight upward drift
  const meanReversion = 0.1; // Pull back towards moving average

  // Volatility clustering (high volatility tends to follow high volatility)
  const dynamicVolatility = volatility * (0.8 + Math.random() * 0.4);

  // Random walk with drift and mean reversion
  const randomComponent = (Math.random() - 0.5) * 2 * dynamicVolatility * currentPrice;
  const trendComponent = trend * currentPrice;

  // Add occasional larger moves (fat tails)
  const fatTail = Math.random() > 0.95 ? (Math.random() - 0.5) * 0.02 * currentPrice : 0;

  const change = randomComponent + trendComponent + fatTail;
  return Math.round(Math.max(currentPrice + change, currentPrice * 0.9)); // Floor at 90% to prevent crash
}

// Generate OHLC candlestick data
function generateCandlestickData(
  basePrice: number,
  days: number,
  volatility = 0.02
): CandlestickData[] {
  const history: CandlestickData[] = [];
  let prevClose = basePrice * (1 - volatility * days * 0.05);
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);

    // Generate OHLC with realistic patterns
    const dailyVolatility = volatility * (0.5 + Math.random());
    const direction = Math.random() > 0.45 ? 1 : -1; // Slight bullish bias

    const open = prevClose * (1 + (Math.random() - 0.5) * 0.005);
    const change = direction * dailyVolatility * prevClose * Math.random();
    const close = Math.max(open + change, prevClose * 0.95);

    // High and low based on intraday volatility
    const intradayRange = Math.abs(close - open) + prevClose * volatility * 0.5 * Math.random();
    const high = Math.max(open, close) + intradayRange * Math.random();
    const low = Math.min(open, close) - intradayRange * Math.random();

    history.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(Math.max(low, prevClose * 0.9)),
      close: Math.round(close),
      volume: Math.floor(Math.random() * 1500000) + 200000,
    });

    prevClose = close;
  }

  // Ensure the last close matches current price
  if (history.length > 0) {
    history[history.length - 1].close = basePrice;
  }

  return history;
}

// Calculate Simple Moving Average
function calculateSMA(data: CandlestickData[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      sma.push(Math.round(sum / period));
    }
  }
  return sma;
}

// Calculate RSI (Relative Strength Index)
function calculateRSI(data: CandlestickData[], period = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);

    if (i < period) {
      rsi.push(null);
    } else {
      const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(Math.round(100 - (100 / (1 + rs))));
      }
    }
  }
  return rsi;
}

// Calculate MACD
function calculateMACD(data: CandlestickData[]): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const ema12: number[] = [];
  const ema26: number[] = [];
  const macdLine: (number | null)[] = [];
  const signalLine: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  const multiplier12 = 2 / (12 + 1);
  const multiplier26 = 2 / (26 + 1);
  const signalMultiplier = 2 / (9 + 1);

  for (let i = 0; i < data.length; i++) {
    // Calculate EMA 12
    if (i === 0) {
      ema12.push(data[i].close);
      ema26.push(data[i].close);
    } else {
      ema12.push((data[i].close - ema12[i - 1]) * multiplier12 + ema12[i - 1]);
      ema26.push((data[i].close - ema26[i - 1]) * multiplier26 + ema26[i - 1]);
    }

    if (i < 25) {
      macdLine.push(null);
      signalLine.push(null);
      histogram.push(null);
    } else {
      const macd = ema12[i] - ema26[i];
      macdLine.push(Math.round(macd));

      if (i === 25) {
        signalLine.push(Math.round(macd));
      } else {
        const prevSignal = signalLine[i - 1] || macd;
        const signal = (macd - prevSignal) * signalMultiplier + prevSignal;
        signalLine.push(Math.round(signal));
      }

      const currentSignal = signalLine[i];
      histogram.push(currentSignal !== null ? Math.round(macd - currentSignal) : null);
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

// Format relative time
function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Check if Korean market is open
function isKoreanMarketOpen(): { isOpen: boolean; status: string; nextEvent: string } {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: KOREAN_MARKET.timezone }));
  const hours = koreaTime.getHours();
  const minutes = koreaTime.getMinutes();
  const day = koreaTime.getDay();
  const currentMinutes = hours * 60 + minutes;
  const openMinutes = KOREAN_MARKET.openHour * 60;
  const closeMinutes = KOREAN_MARKET.closeHour * 60 + KOREAN_MARKET.closeMinute;

  // Weekend check
  if (day === 0 || day === 6) {
    const daysUntilMonday = day === 0 ? 1 : 2;
    return {
      isOpen: false,
      status: "Closed",
      nextEvent: `Opens Mon ${KOREAN_MARKET.openHour}:00 KST`
    };
  }

  // Before market open
  if (currentMinutes < openMinutes) {
    const minsUntilOpen = openMinutes - currentMinutes;
    const hoursUntilOpen = Math.floor(minsUntilOpen / 60);
    const remainingMins = minsUntilOpen % 60;
    return {
      isOpen: false,
      status: "Pre-market",
      nextEvent: hoursUntilOpen > 0 ? `Opens in ${hoursUntilOpen}h ${remainingMins}m` : `Opens in ${remainingMins}m`
    };
  }

  // After market close
  if (currentMinutes >= closeMinutes) {
    return {
      isOpen: false,
      status: "After-hours",
      nextEvent: day === 5 ? "Opens Mon 9:00 KST" : "Opens tomorrow 9:00 KST"
    };
  }

  // Market is open
  const minsUntilClose = closeMinutes - currentMinutes;
  const hoursUntilClose = Math.floor(minsUntilClose / 60);
  const remainingMins = minsUntilClose % 60;
  return {
    isOpen: true,
    status: "Open",
    nextEvent: hoursUntilClose > 0 ? `Closes in ${hoursUntilClose}h ${remainingMins}m` : `Closes in ${remainingMins}m`
  };
}

// Get stock brand colors
function getStockBrandColors(symbol: string): { primary: string; secondary: string; logo: string } {
  return STOCK_BRAND_COLORS[symbol] || { primary: "#7B61FF", secondary: "#4A90E2", logo: symbol[0] };
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const queryClient = useQueryClient();

  // App state
  const [currentView, setCurrentView] = useState<AppView>(readRequestedView);
  const [returnView, setReturnView] = useState<AppView | null>(readReturnView);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Auth state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetUser, setResetUser] = useState<UserModel | null>(null);
  const [resetMessage, setResetMessage] = useState("");

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [hybePermitLicense, setHybePermitLicense] = useState("");

  // Valid HYBE Permit Licenses for New Year + Jin & V Celebration with user details
  const VALID_HYBE_PERMITS: Record<string, { name: string; email: string }> = {
    "HYBH4CEX464RW": { name: "Jennifer Wollenmann", email: "wollenmannj@yahoo.com" },
    "HYB10250GB0680": { name: "Elisabete Magalhaes", email: "bettamagalhaes@gmail.com" },
    "HYB59371A4C9F2": { name: "Meghana Vaishnavi", email: "vrsingh9910@gmail.com" },
    "B07200EF6667": { name: "Radhika Verma", email: "vrsingh9910@gmail.com" },
    "HYB07280EF6207": { name: "Aneeta Varghese", email: "aneetatheresa@gmail.com" },
  };

  // Permit validation state
  const [isValidatingPermit, setIsValidatingPermit] = useState(false);
  const [permitValidated, setPermitValidated] = useState(false);

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);

  // Trading state
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<OrderOrderType>(OrderOrderType.Market);
  const [tradeQuantity, setTradeQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  // Chart state
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("1M");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [showIndicators, setShowIndicators] = useState({ sma: true, rsi: false, macd: false });

  // Notification state
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Price alerts state
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem("hybe_price_alerts");
      return saved ? JSON.parse(saved) as PriceAlert[] : [];
    } catch {
      return [];
    }
  });
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertCondition, setNewAlertCondition] = useState<"above" | "below">("above");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [triggeredAlertIds, setTriggeredAlertIds] = useState<Set<string>>(new Set());

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceAlertNotifications, setPriceAlertNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Transaction history state
  const [transactionFilter, setTransactionFilter] = useState<"all" | "buy" | "sell">("all");
  const [transactionSort, setTransactionSort] = useState<"newest" | "oldest" | "largest">("newest");

  // Price flash animation tracking - stores stock_id -> "up" | "down" | null
  const [priceFlash, setPriceFlash] = useState<Record<string, "up" | "down" | null>>({});

  // Fan-Vestor state
  const [weverseConnected, setWeverseConnected] = useState(false);
  const [weverseId, setWeverseId] = useState("");
  const [recurringBuys, setRecurringBuys] = useState<RecurringBuyConfig[]>([]);
  const [userNfts] = useState<NFTCollectible[]>(MOCK_NFTS);
  const [agmProposals, setAgmProposals] = useState<AGMProposal[]>(MOCK_AGM_PROPOSALS);
  const [weverseWallet, setWeverseWallet] = useState<WeverseWallet>({
    cashBalance: 125000,
    pendingDividends: 8500,
    dividendPreference: "weverse_cash"
  });
  const [selectedArtistTheme, setSelectedArtistTheme] = useState<string>("BTS");
  const [fandomData] = useState<FandomMetric[]>(generateFandomData());
  const [showNewRecurringBuyDialog, setShowNewRecurringBuyDialog] = useState(false);
  const [newRecurringBuyArtist, setNewRecurringBuyArtist] = useState("BTS");
  const [newRecurringBuyTrigger, setNewRecurringBuyTrigger] = useState<RecurringBuyConfig["triggerType"]>("album_release");
  const [newRecurringBuyAmount, setNewRecurringBuyAmount] = useState("10000");

  // Market status
  const [marketStatus, setMarketStatus] = useState(isKoreanMarketOpen());

  // ============================================================================
  // SELL/SETTLEMENT/WITHDRAWAL STATE
  // ============================================================================

  // Sell shares state
  const [sellSharesQuantity, setSellSharesQuantity] = useState("");
  const [sellOrderError, setSellOrderError] = useState("");
  const [sellOrderProcessing, setSellOrderProcessing] = useState(false);
  const [showSellConfirmation, setShowSellConfirmation] = useState(false);

  // Settlement tracking state
  const [sellOrders, setSellOrders] = useState<SellOrderRecord[]>([]);
  const [selectedSellOrder, setSelectedSellOrder] = useState<SellOrderRecord | null>(null);

  // Cash balance state
  const [cashBalance, setCashBalance] = useState<CashBalanceInfo>({
    userId: "",
    availableBalance: 0,
    pendingBalance: 0,
    currency: "KRW"
  });

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequestRecord[]>([]);

  // Bank account state (mock linked bank account)
  const [linkedBankAccount] = useState<BankAccountInfo>({
    id: "bank-001",
    userId: "",
    bankName: "KB Kookmin Bank",
    accountNumberMasked: "••••1234",
    routingNumber: "000-000",
    isPrimary: true,
    isVerified: true
  });

  // Settlement progress state (moved from render function to avoid hook rules violation)
  const [settlementProgress, setSettlementProgress] = useState(0);

  // Data queries
  const { data: stocks = [], refetch: refetchStocks } = useStocks();
  const { data: featuredStocks = [] } = useFeaturedStocks();
  const { data: portfolio = [] } = usePortfolio(currentUser?.id || "");
  const { data: watchlist = [] } = useWatchlist(currentUser?.id || "");
  const { data: orders = [] } = useOrders(currentUser?.id || "");
  const { data: pendingOrders = [] } = usePendingOrders(currentUser?.id || "");
  const { data: transactions = [] } = useTransactions(currentUser?.id || "");
  const { data: notifications = [] } = useNotifications(currentUser?.id || "");
  const { data: unreadCount = 0 } = useUnreadNotifications(currentUser?.id || "");
  const { data: exclusiveContent = [] } = useExclusiveContent(currentUser?.id || "");
  const { data: allExclusiveContent = [] } = useAllExclusiveContent();
  const { data: educationalContent = [] } = useEducationalContent();
  const { data: contentProgress = [] } = useUserContentProgress(currentUser?.id || "");

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateStock = useUpdateStock();
  const createPortfolio = useCreatePortfolio();
  const updatePortfolio = useUpdatePortfolio();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const cancelOrder = useCancelOrder();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const createTransaction = useCreateTransaction();
  const createNotification = useCreateNotification();
  const markNotificationRead = useMarkNotificationRead();
  const updateContentProgress = useUpdateContentProgress();
  const createPriceHistory = useCreatePriceHistory();

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      if (isInitialized) return;

      try {
        // Check if stocks exist
        const stockOrm = StockORM.getInstance();
        const existingStocks = await stockOrm.getAllStock();

        if (existingStocks.length === 0) {
          // Initialize stocks
          await stockOrm.insertStock(INITIAL_STOCKS as StockModel[]);

          // Initialize price history for each stock
          const priceHistoryOrm = PriceHistoryORM.getInstance();
          const newStocks = await stockOrm.getAllStock();

          for (const stock of newStocks) {
            const history = generatePriceHistory(stock.current_price, 365);
            for (const entry of history.slice(-30)) { // Last 30 days
              await priceHistoryOrm.insertPriceHistory([{
                stock_id: stock.id,
                price: entry.price,
                volume: entry.volume,
                timestamp: entry.date,
              } as any]);
            }
          }
        }

        // Check if exclusive content exists
        const exclusiveOrm = ExclusiveContentORM.getInstance();
        const existingExclusive = await exclusiveOrm.getAllExclusiveContent();

        if (existingExclusive.length === 0) {
          await exclusiveOrm.insertExclusiveContent(INITIAL_EXCLUSIVE_CONTENT as ExclusiveContentModel[]);
        }

        // Check if educational content exists
        const educationalOrm = EducationalContentORM.getInstance();
        const existingEducational = await educationalOrm.getAllEducationalContent();

        if (existingEducational.length === 0) {
          await educationalOrm.insertEducationalContent(INITIAL_EDUCATIONAL_CONTENT as EducationalContentModel[]);
        }

        // Check for saved session
        const savedUserId = localStorage.getItem("hybe_paper_user_id");
        if (savedUserId) {
          const userOrm = UserORM.getInstance();
          const users = await userOrm.getUserById(savedUserId);
          if (users.length > 0) {
            setCurrentUser(users[0]);
            const requested = new URLSearchParams(window.location.search).get("page");
            if (!isAppView(requested) || PUBLIC_VIEWS.has(requested)) {
              setCurrentView("portfolio");
            }
          }
        }

        setIsInitialized(true);
        await refetchStocks();
        queryClient.invalidateQueries();
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [isInitialized, queryClient, refetchStocks]);

  useEffect(() => {
    localStorage.setItem("hybe_price_alerts", JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    const symbol = currentView === "stock-detail" ? selectedStock?.symbol : undefined;
    const nextUrl = buildPageUrl(currentView, symbol);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      const hasPage = new URLSearchParams(window.location.search).has("page");
      const state = { page: currentView };
      if (hasPage) window.history.pushState(state, "", nextUrl);
      else window.history.replaceState(state, "", nextUrl);
    }
    document.title = pageTitle(currentView, symbol);
  }, [currentView, selectedStock?.symbol]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page");
      const signedIn = !!localStorage.getItem("hybe_paper_user_id");
      if (!isAppView(page)) {
        setCurrentView("splash");
        return;
      }
      if (!signedIn && !PUBLIC_VIEWS.has(page)) {
        setCurrentView("login");
        return;
      }
      setCurrentView(page);
      const symbol = params.get("symbol");
      if (symbol) {
        const stock = stocks.find((item) => item.symbol === symbol);
        if (stock) setSelectedStock(stock);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [stocks]);

  useEffect(() => {
    if (currentView !== "stock-detail" || selectedStock) return;
    const symbol = new URLSearchParams(window.location.search).get("symbol");
    if (!symbol) return;
    const stock = stocks.find((item) => item.symbol === symbol);
    if (stock) setSelectedStock(stock);
  }, [currentView, selectedStock, stocks]);

  // Simulate market price updates
  useEffect(() => {
    if (!isInitialized || stocks.length === 0) return;

    const interval = setInterval(async () => {
      const stockOrm = StockORM.getInstance();
      const allStocks = await stockOrm.getAllStock();

      // Track price changes for flash animations
      const newFlashes: Record<string, "up" | "down" | null> = {};

      for (const stock of allStocks) {
        const newPrice = simulatePriceMovement(stock.current_price);

        // Determine price direction for flash
        if (newPrice > stock.current_price) {
          newFlashes[stock.id] = "up";
        } else if (newPrice < stock.current_price) {
          newFlashes[stock.id] = "down";
        }

        const updatedStock = {
          ...stock,
          current_price: newPrice,
          day_high: Math.max(stock.day_high, newPrice),
          day_low: Math.min(stock.day_low, newPrice),
        };
        await stockOrm.setStockById(stock.id, updatedStock);
      }

      // Update price flash state
      setPriceFlash(newFlashes);

      // Clear flashes after animation
      setTimeout(() => setPriceFlash({}), 800);

      // Update market status
      setMarketStatus(isKoreanMarketOpen());

      // Check price alerts and create notifications
      if (currentUser && priceAlertNotifications) {
        const notificationOrm = NotificationORM.getInstance();
        const newTriggeredIds = new Set(triggeredAlertIds);

        for (const alert of priceAlerts) {
          if (!alert.isActive || triggeredAlertIds.has(alert.id)) continue;

          const stock = allStocks.find(s => s.id === alert.stockId);
          if (!stock) continue;

          const isTriggered = alert.condition === "above"
            ? stock.current_price >= alert.targetPrice
            : stock.current_price <= alert.targetPrice;

          if (isTriggered) {
            // Create price alert notification
            await notificationOrm.insertNotification([{
              user_id: currentUser.id,
              type: NotificationType.PriceAlert,
              title: `Price Alert: ${alert.symbol}`,
              message: `${alert.symbol} is now ${alert.condition === "above" ? "above" : "below"} your target of ${formatCurrency(alert.targetPrice)}. Current price: ${formatCurrency(stock.current_price)}`,
              is_read: false,
            } as NotificationModel]);

            newTriggeredIds.add(alert.id);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        }

        if (newTriggeredIds.size > triggeredAlertIds.size) {
          setTriggeredAlertIds(newTriggeredIds);
        }
      }

      // Process pending orders
      if (currentUser) {
        const orderOrm = OrderORM.getInstance();
        const pending = await orderOrm.getOrderByStatusUserId(OrderStatus.Pending, currentUser.id);

        for (const order of pending) {
          const stock = allStocks.find(s => s.id === order.stock_id);
          if (!stock) continue;

          let shouldExecute = false;

          if (order.order_type === OrderOrderType.Limit) {
            if (order.side === OrderSide.Buy && stock.current_price <= (order.price || 0)) {
              shouldExecute = true;
            } else if (order.side === OrderSide.Sell && stock.current_price >= (order.price || 0)) {
              shouldExecute = true;
            }
          } else if (order.order_type === OrderOrderType.Stop) {
            if (order.side === OrderSide.Buy && stock.current_price >= (order.price || 0)) {
              shouldExecute = true;
            } else if (order.side === OrderSide.Sell && stock.current_price <= (order.price || 0)) {
              shouldExecute = true;
            }
          }

          if (shouldExecute) {
            await executeOrder(order, stock.current_price);
          }
        }
      }

      refetchStocks();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isInitialized, stocks.length, currentUser, refetchStocks, priceAlerts, priceAlertNotifications, triggeredAlertIds, queryClient]);

  // Execute an order
  const executeOrder = async (order: OrderModel, executedPrice: number) => {
    if (!currentUser) return;

    const orderOrm = OrderORM.getInstance();
    const portfolioOrm = PortfolioORM.getInstance();
    const userOrm = UserORM.getInstance();
    const transactionOrm = TransactionORM.getInstance();
    const notificationOrm = NotificationORM.getInstance();

    const totalAmount = executedPrice * order.quantity;

    if (order.side === OrderSide.Buy) {
      // Check balance
      if (currentUser.virtual_balance < totalAmount) {
        return;
      }

      // Update user balance
      const newBalance = currentUser.virtual_balance - totalAmount;
      const updatedUser = { ...currentUser, virtual_balance: newBalance };
      await userOrm.setUserById(currentUser.id, updatedUser);
      setCurrentUser(updatedUser);

      // Update or create portfolio entry
      const existing = await portfolioOrm.getPortfolioByStockIdUserId(order.stock_id, currentUser.id);

      if (existing.length > 0) {
        const portfolio = existing[0];
        const totalShares = portfolio.shares + order.quantity;
        const totalCost = portfolio.average_cost * portfolio.shares + totalAmount;
        const newAvgCost = totalCost / totalShares;

        await portfolioOrm.setPortfolioById(portfolio.id, {
          ...portfolio,
          shares: totalShares,
          average_cost: newAvgCost,
        });
      } else {
        await portfolioOrm.insertPortfolio([{
          user_id: currentUser.id,
          stock_id: order.stock_id,
          shares: order.quantity,
          average_cost: executedPrice,
        } as PortfolioModel]);
      }

      // Record transaction
      await transactionOrm.insertTransaction([{
        user_id: currentUser.id,
        order_id: order.id,
        type: TransactionType.Buy,
        amount: totalAmount,
        balance_after: newBalance,
      } as any]);

      // Award loyalty points for HYBE purchases
      const stock = stocks.find(s => s.id === order.stock_id);
      if (stock?.symbol === "HYBE") {
        const pointsEarned = Math.floor(order.quantity * 10);
        await userOrm.setUserById(currentUser.id, {
          ...updatedUser,
          loyalty_points: (updatedUser.loyalty_points || 0) + pointsEarned,
        });
      }
    } else {
      // Sell order
      const newBalance = currentUser.virtual_balance + totalAmount;
      const updatedUser = { ...currentUser, virtual_balance: newBalance };
      await userOrm.setUserById(currentUser.id, updatedUser);
      setCurrentUser(updatedUser);

      // Update portfolio
      const existing = await portfolioOrm.getPortfolioByStockIdUserId(order.stock_id, currentUser.id);

      if (existing.length > 0) {
        const portfolio = existing[0];
        const remainingShares = portfolio.shares - order.quantity;

        if (remainingShares <= 0) {
          await portfolioOrm.deletePortfolioById(portfolio.id);
        } else {
          await portfolioOrm.setPortfolioById(portfolio.id, {
            ...portfolio,
            shares: remainingShares,
          });
        }
      }

      // Record transaction
      await transactionOrm.insertTransaction([{
        user_id: currentUser.id,
        order_id: order.id,
        type: TransactionType.Sell,
        amount: totalAmount,
        balance_after: newBalance,
      } as any]);
    }

    // Update order status
    await orderOrm.setOrderById(order.id, {
      ...order,
      status: OrderStatus.Executed,
      executed_price: executedPrice,
      executed_at: new Date().toISOString(),
    });

    // Create notification
    const stock = stocks.find(s => s.id === order.stock_id);
    await notificationOrm.insertNotification([{
      user_id: currentUser.id,
      type: NotificationType.OrderExecuted,
      title: `Order Executed`,
      message: `Your ${order.side} order for ${order.quantity} shares of ${stock?.symbol || "stock"} has been executed at ${formatCurrency(executedPrice)}`,
      is_read: false,
    } as NotificationModel]);

    queryClient.invalidateQueries();
  };

  // Handle login
  const handleLogin = async () => {
    setAuthError("");

    if (!loginEmail || !loginPassword) {
      setAuthError("Please enter email and password");
      return;
    }

    try {
      const userOrm = UserORM.getInstance();
      const users = await userOrm.getUserByEmail(loginEmail);

      if (users.length === 0) {
        setAuthError("User not found");
        return;
      }

      const user = users[0];

      if (!verifyPassword(loginPassword, user.password_hash)) {
        setAuthError("Invalid password");
        return;
      }

      setCurrentUser(user);
      localStorage.setItem("hybe_paper_user_id", user.id);

      // Create login notification
      const notificationOrm = NotificationORM.getInstance();
      await notificationOrm.insertNotification([{
        user_id: user.id,
        type: NotificationType.Announcement,
        title: "Welcome Back!",
        message: `You've successfully logged in. Last login: ${new Date().toLocaleString()}`,
        is_read: false,
      } as NotificationModel]);

      if (!user.onboarding_completed) {
        setCurrentView("onboarding");
      } else if (returnView) {
        setCurrentView(returnView);
        setReturnView(null);
      } else {
        setCurrentView("portfolio");
      }

      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      setAuthError("Login failed. Please try again.");
    }
  };

  const handleResetLookup = async () => {
    setAuthError("");
    setResetMessage("");
    if (!resetEmail.trim()) {
      setAuthError("Enter the email on your account");
      return;
    }
    try {
      const users = await UserORM.getInstance().getUserByEmail(resetEmail.trim());
      if (users.length === 0) {
        setAuthError("No account uses that email");
        setResetUser(null);
        return;
      }
      setResetUser(users[0]);
    } catch (error) {
      console.error("Password reset lookup failed:", error);
      setAuthError("Could not look up that account");
    }
  };

  const handleResetPassword = async () => {
    setAuthError("");
    if (!resetUser) return;
    if (resetPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    try {
      await UserORM.getInstance().setUserById(resetUser.id, {
        ...resetUser,
        password_hash: hashPassword(resetPassword),
      });
      setResetPassword("");
      setResetConfirmPassword("");
      setResetMessage(`Password updated for ${resetUser.email}. Sign in with the new password.`);
      setResetUser(null);
      setLoginEmail(resetEmail.trim());
    } catch (error) {
      console.error("Password reset failed:", error);
      setAuthError("Could not update the password");
    }
  };

  // Handle permit license validation with loading and auto-prefill
  const handlePermitValidation = async (permitCode: string) => {
    const trimmedCode = permitCode.trim().toUpperCase();
    setHybePermitLicense(trimmedCode);

    // Reset validation state when code changes
    if (permitValidated) {
      setPermitValidated(false);
    }

    // Only validate if code has reasonable length
    if (trimmedCode.length >= 10) {
      setIsValidatingPermit(true);
      setAuthError("");

      // Simulate 3 second validation delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (trimmedCode in VALID_HYBE_PERMITS) {
        const permitDetails = VALID_HYBE_PERMITS[trimmedCode];
        setPermitValidated(true);
        setRegisterName(permitDetails.name);
        setRegisterEmail(permitDetails.email);
      } else {
        setAuthError("Invalid HYBE Permit License. Please enter a valid permit code.");
        setPermitValidated(false);
      }

      setIsValidatingPermit(false);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    setAuthError("");

    // Validate HYBE Permit License first (required for New Year + Jin & V celebration)
    if (!hybePermitLicense.trim()) {
      setAuthError("HYBE Permit License is required for registration during the New Year + Jin & V celebration period.");
      return;
    }

    const licenseUpperCase = hybePermitLicense.trim().toUpperCase();
    if (!(licenseUpperCase in VALID_HYBE_PERMITS)) {
      setAuthError("Invalid HYBE Permit License. Please enter a valid permit code provided by HYBE to participate in the celebration events.");
      return;
    }

    if (!registerName || !registerEmail || !registerPassword) {
      setAuthError("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    try {
      const userOrm = UserORM.getInstance();

      // Check if user exists
      let existing: UserModel[] = [];
      try {
        existing = await userOrm.getUserByEmail(registerEmail);
      } catch (emailCheckError) {
        console.error("Error checking existing email:", emailCheckError);
        // Continue with registration - email check failure shouldn't block registration
      }

      if (existing.length > 0) {
        setAuthError("Email already registered");
        return;
      }

      // Create new user
      let newUsers: UserModel[] = [];
      try {
        newUsers = await userOrm.insertUser([{
          email: registerEmail,
          password_hash: hashPassword(registerPassword),
          name: registerName,
          risk_profile: UserRiskProfile.Moderate,
          virtual_balance: 10000000, // 10,000,000 KRW starting balance
          loyalty_points: 0,
          two_factor_enabled: false,
          onboarding_completed: false,
        } as UserModel]);
      } catch (insertError) {
        console.error("Error inserting user:", insertError);
        setAuthError("Failed to create account. Please check your connection and try again.");
        return;
      }

      if (newUsers.length === 0) {
        setAuthError("Failed to create account. The server did not return user data.");
        return;
      }

      const newUser = newUsers[0];
      setCurrentUser(newUser);
      localStorage.setItem("hybe_paper_user_id", newUser.id);

      // Add HYBE to watchlist by default (non-blocking)
      const hybeStock = stocks.find(s => s.symbol === "HYBE");
      if (hybeStock) {
        try {
          const watchlistOrm = WatchlistORM.getInstance();
          await watchlistOrm.insertWatchlist([{
            user_id: newUser.id,
            stock_id: hybeStock.id,
            position: 0,
          } as WatchlistModel]);
        } catch (watchlistError) {
          console.error("Error adding HYBE to watchlist:", watchlistError);
          // Don't fail registration for watchlist error
        }
      }

      setCurrentView("onboarding");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setHybePermitLicense("");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setAuthError(`Registration failed: ${errorMessage}`);
    }
  };

  // Handle onboarding completion
  const handleCompleteOnboarding = async () => {
    if (!currentUser) return;

    // Calculate risk profile based on answers
    const totalScore = riskAnswers.reduce((sum, val) => sum + val, 0);
    const avgScore = totalScore / riskAnswers.length;

    let riskProfile: UserRiskProfile;
    if (avgScore <= 1.5) {
      riskProfile = UserRiskProfile.Conservative;
    } else if (avgScore <= 2.5) {
      riskProfile = UserRiskProfile.Moderate;
    } else {
      riskProfile = UserRiskProfile.Aggressive;
    }

    try {
      const userOrm = UserORM.getInstance();
      const updatedUser = {
        ...currentUser,
        risk_profile: riskProfile,
        onboarding_completed: true,
      };

      await userOrm.setUserById(currentUser.id, updatedUser);
      setCurrentUser(updatedUser);

      // Create welcome notification
      const notificationOrm = NotificationORM.getInstance();
      await notificationOrm.insertNotification([{
        user_id: currentUser.id,
        type: NotificationType.Announcement,
        title: "Welcome to HYBE Paper Trading!",
        message: `You've received ${formatCurrency(10000000)} in virtual funds. Start trading now!`,
        is_read: false,
      } as NotificationModel]);

      setCurrentView("portfolio");
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("hybe_paper_user_id");
    setCurrentView("splash");
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!currentUser || !selectedStock || !tradeQuantity) return;

    const quantity = parseInt(tradeQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    const price = orderType === OrderOrderType.Market
      ? selectedStock.current_price
      : parseFloat(limitPrice);

    if (orderType !== OrderOrderType.Market && (isNaN(price) || price <= 0)) return;

    // Validation
    if (tradeMode === "buy") {
      const totalCost = (orderType === OrderOrderType.Market ? selectedStock.current_price : price) * quantity;
      if (totalCost > currentUser.virtual_balance) {
        setAuthError("Insufficient balance");
        return;
      }
    } else {
      const holding = portfolio.find(p => p.stock_id === selectedStock.id);
      if (!holding || holding.shares < quantity) {
        setAuthError("Insufficient shares");
        return;
      }
    }

    try {
      const orderOrm = OrderORM.getInstance();

      const newOrder: Partial<OrderModel> = {
        user_id: currentUser.id,
        stock_id: selectedStock.id,
        order_type: orderType,
        side: tradeMode === "buy" ? OrderSide.Buy : OrderSide.Sell,
        quantity,
        price: orderType === OrderOrderType.Market ? selectedStock.current_price : price,
        status: OrderStatus.Pending,
      };

      const orders = await orderOrm.insertOrder([newOrder as OrderModel]);

      if (orders.length > 0 && orderType === OrderOrderType.Market) {
        // Execute market orders immediately
        await executeOrder(orders[0], selectedStock.current_price);
      }

      setShowOrderConfirmation(true);
      setTradeQuantity("");
      setLimitPrice("");
      setShowOrderDialog(false);

      setTimeout(() => {
        setShowOrderConfirmation(false);
      }, 3000);

      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Failed to place order:", error);
      setAuthError("Failed to place order");
    }
  };

  // Handle add/remove from watchlist
  const handleToggleWatchlist = async (stock: StockModel) => {
    if (!currentUser) return;

    const isInWatchlist = watchlist.some(w => w.stock_id === stock.id);

    try {
      const watchlistOrm = WatchlistORM.getInstance();
      const notificationOrm = NotificationORM.getInstance();

      if (isInWatchlist) {
        await watchlistOrm.deleteWatchlistByStockIdUserId(stock.id, currentUser.id);
        // Create notification for removing from watchlist
        await notificationOrm.insertNotification([{
          user_id: currentUser.id,
          type: NotificationType.Announcement,
          title: "Watchlist Updated",
          message: `${stock.symbol} has been removed from your watchlist.`,
          is_read: false,
        } as NotificationModel]);
      } else {
        await watchlistOrm.insertWatchlist([{
          user_id: currentUser.id,
          stock_id: stock.id,
          position: watchlist.length,
        } as WatchlistModel]);
        // Create notification for adding to watchlist
        await notificationOrm.insertNotification([{
          user_id: currentUser.id,
          type: NotificationType.Announcement,
          title: "Watchlist Updated",
          message: `${stock.symbol} has been added to your watchlist. You'll receive updates on this stock.`,
          is_read: false,
        } as NotificationModel]);
      }

      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    return portfolio.reduce((total, holding) => {
      const stock = stocks.find(s => s.id === holding.stock_id);
      if (!stock) return total;
      return total + stock.current_price * holding.shares;
    }, 0);
  }, [portfolio, stocks]);

  const totalValue = (currentUser?.virtual_balance || 0) + portfolioValue;

  // Calculate daily change
  const dailyChange = useMemo(() => {
    return portfolio.reduce((total, holding) => {
      const stock = stocks.find(s => s.id === holding.stock_id);
      if (!stock) return total;
      const change = (stock.current_price - stock.previous_close) * holding.shares;
      return total + change;
    }, 0);
  }, [portfolio, stocks]);

  // Get top gainers and losers
  const marketMovers = useMemo(() => {
    const sorted = [...stocks].sort((a, b) => {
      const changeA = calculateChange(a.current_price, a.previous_close);
      const changeB = calculateChange(b.current_price, b.previous_close);
      return changeB - changeA;
    });

    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    };
  }, [stocks]);

  // Filter stocks by search
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const query = searchQuery.toLowerCase();
    return stocks.filter(
      s => s.symbol.toLowerCase().includes(query) ||
           s.company_name.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  // Get HYBE shares held
  const hybeShares = useMemo(() => {
    const hybeStock = stocks.find(s => s.symbol === "HYBE");
    if (!hybeStock) return 0;
    const holding = portfolio.find(p => p.stock_id === hybeStock.id);
    return holding?.shares || 0;
  }, [stocks, portfolio]);

  // Get current shareholder tier based on HYBE shares
  const currentTier = useMemo(() => {
    for (let i = SHAREHOLDER_TIERS.length - 1; i >= 0; i--) {
      if (hybeShares >= SHAREHOLDER_TIERS[i].minShares) {
        return SHAREHOLDER_TIERS[i];
      }
    }
    return SHAREHOLDER_TIERS[0];
  }, [hybeShares]);

  // Get next tier
  const nextTier = useMemo(() => {
    const currentIndex = SHAREHOLDER_TIERS.findIndex(t => t.name === currentTier.name);
    if (currentIndex < SHAREHOLDER_TIERS.length - 1) {
      return SHAREHOLDER_TIERS[currentIndex + 1];
    }
    return null;
  }, [currentTier]);

  // Get artist theme color
  const artistThemeColor = useMemo(() => {
    const artist = ARTIST_GROUPS.find(a => a.name === selectedArtistTheme);
    return artist?.color || "#7B61FF";
  }, [selectedArtistTheme]);

  // Education category state (moved from renderEducation to fix hooks rule)
  const [selectedEducationCategory, setSelectedEducationCategory] = useState<EducationalContentCategory | "all">("all");

  // Filtered education content
  const filteredEducation = useMemo(() => {
    return selectedEducationCategory === "all"
      ? educationalContent
      : educationalContent.filter(c => c.category === selectedEducationCategory);
  }, [selectedEducationCategory, educationalContent]);

  // Transaction history - filtered and sorted (moved from renderTransactionHistory to fix hooks rule)
  const filteredTransactionsData = useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (transactionFilter !== "all") {
      filtered = filtered.filter(t =>
        transactionFilter === "buy"
          ? t.type === TransactionType.Buy
          : t.type === TransactionType.Sell
      );
    }

    // Sort
    switch (transactionSort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime());
        break;
      case "largest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
    }

    return filtered;
  }, [transactions, transactionFilter, transactionSort]);

  // Transaction stats (moved from renderTransactionHistory to fix hooks rule)
  const transactionStats = useMemo(() => {
    const buyTotal = transactions
      .filter(t => t.type === TransactionType.Buy)
      .reduce((sum, t) => sum + t.amount, 0);
    const sellTotal = transactions
      .filter(t => t.type === TransactionType.Sell)
      .reduce((sum, t) => sum + t.amount, 0);
    const netFlow = sellTotal - buyTotal;

    return { buyTotal, sellTotal, netFlow, totalTrades: transactions.length };
  }, [transactions]);

  // Portfolio breakdown (moved from renderPortfolioAnalytics to fix hooks rule)
  const portfolioBreakdownData = useMemo(() => {
    return portfolio.map((holding) => {
      const stock = stocks.find(s => s.id === holding.stock_id);
      if (!stock) return null;

      const value = stock.current_price * holding.shares;
      const costBasis = holding.average_cost * holding.shares;
      const gain = value - costBasis;
      const gainPercent = (gain / costBasis) * 100;

      return {
        id: holding.id,
        symbol: stock.symbol,
        name: stock.company_name,
        shares: holding.shares,
        value,
        costBasis,
        gain,
        gainPercent,
        allocation: 0, // Will be calculated after
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [portfolio, stocks]);

  // Leaderboard user rank (moved from renderLeaderboard to fix hooks rule)
  const userRankData = useMemo(() => {
    if (!currentUser) return null;

    const userTotalValue = totalValue;
    const startingBalance = 10000000;
    const userReturn = userTotalValue - startingBalance;
    const userReturnPercent = (userReturn / startingBalance) * 100;

    // Find position in leaderboard
    const position = MOCK_LEADERBOARD.filter(u => u.totalReturnPercent > userReturnPercent).length + 1;

    return {
      rank: position,
      totalReturn: userReturn,
      totalReturnPercent: userReturnPercent,
      portfolioValue: userTotalValue,
      trades: orders.length,
      winRate: orders.length > 0
        ? Math.round((orders.filter(o => o.status === OrderStatus.Executed).length / orders.length) * 100)
        : 0,
    };
  }, [currentUser, totalValue, orders]);

  // Security settings state (moved from renderSecuritySettings to fix hooks rule)
  const [securityShowSuccess, setSecurityShowSuccess] = useState(false);
  const [securityPasswordError, setSecurityPasswordError] = useState("");

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  // Landing page state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // FAQ Data
  const faqData = [
    {
      question: "What is HYBE INSIGHT?",
      answer: "HYBE INSIGHT is a Fan-Vestor platform that connects your fandom with investment. Practice trading K-pop entertainment stocks while earning real shareholder benefits - from Weverse Shop discounts to concert pre-sale access."
    },
    {
      question: "How much virtual money do I start with?",
      answer: "Every new user receives 10,000,000 KRW in virtual funds to start trading. This allows you to build a diversified portfolio across multiple K-pop entertainment companies."
    },
    {
      question: "Is my money real?",
      answer: "No, HYBE INSIGHT uses virtual currency for trading practice. However, the shareholder tier benefits (discounts, pre-sale access) are real perks tied to your verified share holdings!"
    },
    {
      question: "What stocks can I trade?",
      answer: "You can trade shares of major K-pop entertainment companies including HYBE, SM Entertainment, JYP Entertainment, YG Entertainment, and more. We cover all the major players in the K-pop industry."
    },
    {
      question: "What are Fan-Shareholder Benefits?",
      answer: "When you hold HYBE shares in your virtual portfolio, you unlock exclusive content including behind-the-scenes videos, exclusive photos, and special announcements. The more shares you hold, the more content you unlock!"
    },
    {
      question: "How do the stock prices move?",
      answer: "Stock prices are simulated based on realistic market movement patterns. While not connected to real markets, they provide a realistic trading experience for learning purposes."
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "Kim Soo-young",
      role: "ARMY since 2017",
      content: "Finally, a way to understand why HYBE stock moves when BTS announces a tour! I've learned so much about investing while following my favorite artists.",
      avatar: "KS"
    },
    {
      name: "Park Ji-min",
      role: "Multi-fandom Investor",
      content: "The paper trading feature helped me gain confidence before investing real money in K-pop stocks. The educational content is top-notch!",
      avatar: "PJ"
    },
    {
      name: "Lee Min-ho",
      role: "Finance Student",
      content: "As someone studying finance, this app perfectly combines my K-pop passion with learning. The exclusive content is an amazing bonus!",
      avatar: "LM"
    }
  ];

  // Platform stats
  const platformStats = [
    { label: "Active Traders", value: "50K+", icon: Users },
    { label: "K-Pop Stocks", value: "15+", icon: Building2 },
    { label: "Daily Trades", value: "200K+", icon: TrendingUp },
    { label: "Countries", value: "120+", icon: Globe }
  ];

  // Features data
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Simulated Trading",
      description: "Experience realistic market movements with our advanced simulation engine. Practice buying and selling K-pop entertainment stocks."
    },
    {
      icon: Shield,
      title: "Risk-Free Learning",
      description: "Start with 10,000,000 KRW virtual currency. Learn to trade without risking real money while developing your investment skills."
    },
    {
      icon: Crown,
      title: "Fan-Shareholder Benefits",
      description: "Unlock exclusive content as you build your HYBE holdings. Access behind-the-scenes videos, photos, and special announcements."
    },
    {
      icon: GraduationCap,
      title: "Educational Resources",
      description: "Learn investing fundamentals with our comprehensive education center. From basics to advanced strategies, we've got you covered."
    },
    {
      icon: PieChart,
      title: "Portfolio Analytics",
      description: "Track your performance with detailed analytics. See your gains, losses, and learn from your trading decisions."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Trade on the go with our beautifully designed mobile experience. Never miss an opportunity, wherever you are."
    }
  ];

  // Landing/Splash screen
  const renderSplash = () => (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                <span className="text-white text-xl font-bold">H</span>
              </div>
              <span className="text-white text-xl font-bold">HYBE INSIGHT</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Fan-Vestor Tiers</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setCurrentView("login")}
              >
                Sign In
              </Button>
              <Button
                className="text-white"
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                onClick={() => setCurrentView("register")}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white py-2">Features</a>
              <a href="#benefits" className="block text-gray-300 hover:text-white py-2">Fan-Vestor Tiers</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white py-2">Testimonials</a>
              <a href="#faq" className="block text-gray-300 hover:text-white py-2">FAQ</a>
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                  onClick={() => setCurrentView("login")}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full text-white"
                  style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                  onClick={() => setCurrentView("register")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* New Year + Jin & V Celebration Banner */}
            <div className="mb-6 p-4 rounded-2xl border border-purple-500/50 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjMpIi8+PC9zdmc+')] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 font-bold text-lg">2025 NEW YEAR CELEBRATION</span>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">JIN</span>
                  </div>
                  <span className="text-gray-500">&</span>
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-semibold">V</span>
                  </div>
                  <span className="text-white font-medium">Upcoming Celebrations!</span>
                </div>
                <p className="text-sm text-gray-300">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-yellow-500" />
                  Exclusive access for investors with <span className="text-yellow-400 font-semibold">HYBE Permit License</span>
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">The Fan-Vestor Platform for K-Pop Shareholders</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Be a Fan.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                Be an Investor.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Link your Weverse ID, trade HYBE shares, and unlock real benefits -
              from shop discounts to concert pre-sale access and exclusive NFT drops.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg text-white"
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                onClick={() => setCurrentView("register")}
              >
                Start Trading Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg border-zinc-600 text-white hover:bg-white/10"
                onClick={() => setCurrentView("login")}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>100% Risk-Free</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                <span>No Real Money Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 rounded-2xl border border-zinc-700/50 p-4 sm:p-8 backdrop-blur">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Preview Card */}
                <Card className="bg-gradient-to-br from-purple-600 to-blue-500 border-0 text-white col-span-1 lg:col-span-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/80 text-sm">Total Portfolio Value</p>
                        <h2 className="text-3xl font-bold">₩12,450,000</h2>
                      </div>
                      <div className="flex items-center text-green-300">
                        <ArrowUp className="w-5 h-5 mr-1" />
                        <span className="font-medium">+24.5%</span>
                      </div>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={generatePriceHistory(12450000, 30)}>
                          <defs>
                            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#ffffff"
                            fill="url(#heroGradient)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Stock Ticker Preview */}
                <div className="space-y-3">
                  {[
                    { symbol: "HYBE", price: "₩234,500", change: "+1.08%" },
                    { symbol: "SM", price: "₩89,500", change: "+1.47%" },
                    { symbol: "JYP", price: "₩78,200", change: "-1.64%" },
                  ].map((stock) => (
                    <Card key={stock.symbol} className="bg-zinc-800/80 border-zinc-700">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                          >
                            {stock.symbol[0]}
                          </div>
                          <span className="text-white font-medium">{stock.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{stock.price}</p>
                          <p className={stock.change.startsWith("+") ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                            {stock.change}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-4">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                Learn Trading
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform combines realistic trading simulation with exclusive K-pop content to make learning investing fun and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}20, ${HYBE_COLORS.gradientEnd}20)` }}
                  >
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Trading in{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and begin your journey to becoming a savvy K-pop investor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up for free and complete a quick risk assessment to personalize your experience.",
                icon: User
              },
              {
                step: "02",
                title: "Get Virtual Funds",
                description: "Receive 10,000,000 KRW in virtual currency to start building your K-pop portfolio.",
                icon: Wallet
              },
              {
                step: "03",
                title: "Start Trading",
                description: "Buy and sell K-pop entertainment stocks, learn from the experience, and unlock exclusive content.",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-800 border-2 border-purple-500 flex items-center justify-center text-sm font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="h-14 px-8 text-lg text-white"
              style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              onClick={() => setCurrentView("register")}
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Exclusive Content Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-purple-300">Fan-Shareholder Benefits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Unlock{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                >
                  Exclusive Content
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                As a HYBE shareholder (even with virtual shares!), you gain access to exclusive content that regular fans can't see.
                The more shares you hold, the more content you unlock.
              </p>
              <ul className="space-y-4">
                {[
                  "Behind-the-scenes videos and photos",
                  "Exclusive artist announcements",
                  "Special shareholder letters from HYBE leadership",
                  "Early access to merchandise previews"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "BTS Behind the Scenes", shares: "1 share", locked: false },
                { title: "SEVENTEEN Practice", shares: "5 shares", locked: false },
                { title: "TXT Photo Gallery", shares: "3 shares", locked: true },
                { title: "CEO Letter", shares: "10 shares", locked: true }
              ].map((content, index) => (
                <Card
                  key={index}
                  className={cn(
                    "border overflow-hidden",
                    content.locked ? "bg-zinc-900/50 border-zinc-800/50" : "bg-zinc-900 border-zinc-800"
                  )}
                >
                  <div className="relative h-32 bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                    {content.locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h4 className={cn("font-medium text-sm mb-1", content.locked ? "text-gray-500" : "text-white")}>
                      {content.title}
                    </h4>
                    <p className="text-xs text-gray-500">Requires {content.shares}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                K-Pop Fans Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of fans who are learning to invest while following their favorite artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-purple-400/50 mb-4" />
                  <p className="text-gray-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about HYBE INSIGHT.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card
                key={index}
                className={cn(
                  "border transition-all duration-300 cursor-pointer",
                  openFaqIndex === index ? "bg-zinc-800 border-purple-500/50" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                )}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium pr-4">{faq.question}</h3>
                    <div className="shrink-0">
                      {openFaqIndex === index ? (
                        <Minus className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {openFaqIndex === index && (
                    <p className="text-gray-400 mt-4 pt-4 border-t border-zinc-700">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card
            className="border-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
          >
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your K-Pop Investment Journey?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of fans learning to invest while enjoying exclusive content.
                It's free, risk-free, and fun!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-black hover:bg-gray-100"
                  onClick={() => setCurrentView("register")}
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10"
                  onClick={() => setCurrentView("login")}
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                >
                  <span className="text-white text-xl font-bold">H</span>
                </div>
                <span className="text-white text-xl font-bold">HYBE INSIGHT</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The Fan-Vestor platform connecting your fandom with investment.
                Trade HYBE shares and unlock real shareholder benefits.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Education</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Exclusive Content</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              2025 HYBE INSIGHT. All rights reserved. A Fan-Vestor platform - shareholder benefits are tied to verified holdings.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Login screen
  const renderLogin = () => (
    <div className="min-h-screen bg-black flex flex-col p-6">
      <button
        className="text-white mb-8 flex items-center"
        onClick={() => setCurrentView("splash")}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <h1 className="text-white text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-400 mb-8">Sign in to continue trading</p>

      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Email</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {authError && (
          <p className="text-red-500 text-sm">{authError}</p>
        )}

        <button
          className="text-sm"
          style={{ color: HYBE_COLORS.gradientStart }}
          onClick={() => setCurrentView("forgot-password")}
        >
          Forgot password?
        </button>

        <Button
          className="w-full h-12 text-lg mt-4"
          style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
          onClick={handleLogin}
        >
          Sign In
        </Button>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <button
            style={{ color: HYBE_COLORS.gradientStart }}
            onClick={() => setCurrentView("register")}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );

  // Register screen
  const renderRegister = () => (
    <div className="min-h-screen bg-black flex flex-col p-6 overflow-y-auto">
      <button
        className="text-white mb-6 flex items-center"
        onClick={() => setCurrentView("splash")}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Celebration Banner */}
      <div className="mb-6 p-4 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjMpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold">2025 NEW YEAR CELEBRATION</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">JIN</span>
            <span className="text-gray-500">&</span>
            <Crown className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 font-medium">V</span>
            <span className="text-gray-400">Upcoming Celebrations</span>
          </div>
        </div>
      </div>

      <h1 className="text-white text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-400 mb-1">Join as an exclusive Fan-Vestor</p>
      <p className="text-yellow-500 text-sm mb-6 flex items-center gap-1">
        <Lock className="w-3.5 h-3.5" />
        HYBE Permit License required for registration
      </p>

      <div className="space-y-4">
        {/* HYBE Permit License Field - Required */}
        <div className={`p-4 rounded-xl border ${permitValidated ? 'border-green-500/50 bg-green-900/20' : 'border-yellow-500/50 bg-yellow-900/20'}`}>
          <Label className={`${permitValidated ? 'text-green-400' : 'text-yellow-400'} mb-2 block flex items-center gap-2`}>
            <KeyRound className="w-4 h-4" />
            HYBE Permit License *
            {isValidatingPermit && (
              <Loader2 className="w-4 h-4 animate-spin text-yellow-400 ml-auto" />
            )}
            {permitValidated && !isValidatingPermit && (
              <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
            )}
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., HYB3X7K9M2P4Q"
              value={hybePermitLicense}
              onChange={(e) => handlePermitValidation(e.target.value)}
              disabled={isValidatingPermit}
              className={`bg-zinc-900 ${permitValidated ? 'border-green-600/50' : 'border-yellow-600/50'} text-white placeholder:text-gray-500 uppercase pr-10`}
            />
            {isValidatingPermit && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
              </div>
            )}
            {permitValidated && !isValidatingPermit && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            )}
          </div>
          {permitValidated ? (
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Valid permit license verified! Your details have been auto-filled below.
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              Enter your exclusive HYBE permit license code to participate in the New Year + Jin & V celebration events.
            </p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2 block flex items-center gap-2">
            Name
            {permitValidated && <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs">Auto-filled</Badge>}
          </Label>
          <Input
            type="text"
            placeholder="Your name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            readOnly={permitValidated}
            className={`bg-zinc-900 border-zinc-700 text-white ${permitValidated ? 'bg-zinc-800 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <Label className="text-white mb-2 block flex items-center gap-2">
            Email
            {permitValidated && <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs">Auto-filled</Badge>}
          </Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            readOnly={permitValidated}
            className={`bg-zinc-900 border-zinc-700 text-white ${permitValidated ? 'bg-zinc-800 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Confirm Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        {authError && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {authError}
            </p>
          </div>
        )}

        <Button
          className="w-full h-12 text-lg mt-4"
          style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
          onClick={handleRegister}
        >
          <Shield className="w-5 h-5 mr-2" />
          Create Exclusive Account
        </Button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <button
            style={{ color: HYBE_COLORS.gradientStart }}
            onClick={() => setCurrentView("login")}
          >
            Sign in
          </button>
        </p>

        <p className="text-xs text-gray-500 text-center mt-2">
          By creating an account, you confirm you are an authorized HYBE investor participating in the New Year and BTS Jin & V celebration events.
        </p>
      </div>
    </div>
  );

  // Forgot password screen
  const renderForgotPassword = () => (
    <div className="min-h-screen bg-black flex flex-col p-6">
      <button
        className="text-white mb-8 flex items-center"
        onClick={() => setCurrentView("login")}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <h1 className="text-white text-2xl font-bold mb-2">Reset Password</h1>
      <p className="text-gray-400 mb-8">
        {resetUser ? `Choose a new password for ${resetUser.email}` : "Look up your account, then choose a new password"}
      </p>

      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Email</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        {resetUser && (
          <>
            <div>
              <Label className="text-white mb-2 block">New password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Confirm new password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={resetConfirmPassword}
                onChange={(event) => setResetConfirmPassword(event.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </>
        )}

        {authError && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50">
            <p className="text-red-400 text-sm">{authError}</p>
          </div>
        )}
        {resetMessage && (
          <div className="p-3 rounded-lg bg-green-900/30 border border-green-500/50">
            <p className="text-green-400 text-sm">{resetMessage}</p>
          </div>
        )}

        {resetUser ? (
          <Button
            className="w-full h-12 text-lg"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
            onClick={handleResetPassword}
          >
            Update Password
          </Button>
        ) : !resetMessage ? (
          <Button
            className="w-full h-12 text-lg"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
            onClick={handleResetLookup}
          >
            Find Account
          </Button>
        ) : null}
        {resetMessage && (
          <Button
            className="w-full h-12 text-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800"
            onClick={() => setCurrentView("login")}
          >
            Back to Sign In
          </Button>
        )}
      </div>
    </div>
  );

  // Onboarding screen
  const renderOnboarding = () => {
    if (onboardingStep === 0) {
      // Welcome screen
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <div
            className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Welcome, {currentUser?.name}!</h1>
          <p className="text-gray-400 mb-8 max-w-xs">
            Let's set up your account and discover your investment style
          </p>
          <Button
            className="w-full max-w-xs h-12 text-lg"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
            onClick={() => setOnboardingStep(1)}
          >
            Get Started
          </Button>
        </div>
      );
    }

    if (onboardingStep <= RISK_QUESTIONS.length) {
      const question = RISK_QUESTIONS[onboardingStep - 1];
      return (
        <div className="min-h-screen bg-black flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              className="text-white flex items-center"
              onClick={() => setOnboardingStep(onboardingStep - 1)}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <span className="text-gray-400">{onboardingStep}/{RISK_QUESTIONS.length}</span>
          </div>

          <Progress value={(onboardingStep / RISK_QUESTIONS.length) * 100} className="mb-8" />

          <h2 className="text-white text-xl font-bold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  riskAnswers[onboardingStep - 1] === option.value
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-gray-300 hover:border-zinc-600"
                )}
                onClick={() => {
                  const newAnswers = [...riskAnswers];
                  newAnswers[onboardingStep - 1] = option.value;
                  setRiskAnswers(newAnswers);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <Button
              className="w-full h-12 text-lg"
              style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              disabled={riskAnswers[onboardingStep - 1] === undefined}
              onClick={() => {
                if (onboardingStep < RISK_QUESTIONS.length) {
                  setOnboardingStep(onboardingStep + 1);
                } else {
                  setOnboardingStep(RISK_QUESTIONS.length + 1);
                }
              }}
            >
              {onboardingStep < RISK_QUESTIONS.length ? "Next" : "Complete"}
            </Button>
          </div>
        </div>
      );
    }

    // Completion screen
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div
          className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
        >
          <Check className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">You're All Set!</h1>
        <p className="text-gray-400 mb-4 max-w-xs">
          Your risk profile has been determined and your account is ready
        </p>
        <div className="bg-zinc-900 rounded-lg p-6 mb-8 w-full max-w-xs">
          <p className="text-gray-400 text-sm mb-2">Starting Balance</p>
          <p className="text-white text-3xl font-bold">{formatCurrency(10000000)}</p>
        </div>
        <Button
          className="w-full max-w-xs h-12 text-lg"
          style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
          onClick={handleCompleteOnboarding}
        >
          Start Trading
        </Button>
      </div>
    );
  };

  // Portfolio dashboard
  const renderPortfolio = () => (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h1 className="text-white text-xl font-bold">{currentUser?.name}</h1>
          </div>
          <button
            className="relative"
            onClick={() => setShowNotificationPanel(true)}
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Market Status Indicator */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-900 rounded-lg">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            marketStatus.isOpen ? "bg-green-500" : "bg-yellow-500"
          )} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">KRX {marketStatus.status}</span>
              <Badge variant="outline" className="text-xs border-zinc-700 text-gray-400">
                KOSDAQ
              </Badge>
            </div>
            <p className="text-gray-500 text-xs">{marketStatus.nextEvent}</p>
          </div>
          <Clock className="w-4 h-4 text-gray-500" />
        </div>

        {/* Portfolio value card */}
        <Card
          className="bg-gradient-to-br from-purple-600 to-blue-500 border-0 text-white cursor-pointer"
          onClick={() => setCurrentView("portfolio-analytics")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/80 text-sm">Total Portfolio Value</p>
              <PieChart className="w-4 h-4 text-white/60" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{formatCurrency(totalValue)}</h2>
            <div className={cn(
              "flex items-center text-sm",
              dailyChange >= 0 ? "text-green-300" : "text-red-300"
            )}>
              {dailyChange >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatCurrency(Math.abs(dailyChange))} ({formatPercentage(dailyChange / (totalValue - dailyChange) * 100)}) today
            </div>
            <p className="text-white/60 text-xs mt-2">Tap for detailed analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center text-gray-400 text-sm mb-1">
              <Wallet className="w-4 h-4 mr-1" />
              Cash Balance
            </div>
            <p className="text-white font-bold">{formatCurrency(currentUser?.virtual_balance || 0)}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center text-gray-400 text-sm mb-1">
              <Crown className="w-4 h-4 mr-1" />
              Loyalty Points
            </div>
            <p className="text-white font-bold">{currentUser?.loyalty_points?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Time frame selector */}
      <div className="px-6 mb-4">
        <div className="flex gap-2">
          {(["1D", "1W", "1M", "1Y", "All"] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-all",
                selectedTimeFrame === tf
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-800 text-gray-400"
              )}
              onClick={() => setSelectedTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="px-6 mb-6 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={generatePriceHistory(totalValue, 30).map((d, i) => ({
              ...d,
              value: d.price + Math.random() * 500000 - 250000,
            }))}
          >
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={HYBE_COLORS.gradientStart} stopOpacity={0.3} />
                <stop offset="95%" stopColor={HYBE_COLORS.gradientStart} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={HYBE_COLORS.gradientStart}
              fill="url(#portfolioGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Your Holdings</h3>
          <span className="text-gray-400 text-sm">{portfolio.length} stocks</span>
        </div>

        {portfolio.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No holdings yet</p>
              <Button
                className="mt-4"
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                onClick={() => setCurrentView("trade")}
              >
                Start Trading
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {portfolio.map((holding) => {
              const stock = stocks.find(s => s.id === holding.stock_id);
              if (!stock) return null;

              const currentValue = stock.current_price * holding.shares;
              const costBasis = holding.average_cost * holding.shares;
              const gainLoss = currentValue - costBasis;
              const gainLossPercent = (gainLoss / costBasis) * 100;
              const brandColors = getStockBrandColors(stock.symbol);
              const flash = priceFlash[stock.id];

              return (
                <Card
                  key={holding.id}
                  className={cn(
                    "bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-all duration-300",
                    flash === "up" && "ring-1 ring-green-500/50 bg-green-900/10",
                    flash === "down" && "ring-1 ring-red-500/50 bg-red-900/10"
                  )}
                  onClick={() => {
                    setSelectedStock(stock);
                    setCurrentView("stock-detail");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                        >
                          {brandColors.logo}
                        </div>
                        <div>
                          <p className="text-white font-medium">{stock.symbol}</p>
                          <p className="text-gray-400 text-sm">{holding.shares} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-white font-medium transition-colors duration-300",
                          flash === "up" && "text-green-400",
                          flash === "down" && "text-red-400"
                        )}>
                          {formatCurrency(currentValue)}
                        </p>
                        <p className={cn(
                          "text-sm",
                          gainLoss >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {formatPercentage(gainLossPercent)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Orders Panel */}
      {pendingOrders.length > 0 && (
        <div className="px-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Pending Orders</h3>
            <Badge variant="secondary" className="text-xs">
              {pendingOrders.length} active
            </Badge>
          </div>
          <div className="space-y-2">
            {pendingOrders.slice(0, 3).map((order) => {
              const stock = stocks.find(s => s.id === order.stock_id);
              if (!stock) return null;
              const brandColors = getStockBrandColors(stock.symbol);

              return (
                <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                        >
                          {brandColors.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{stock.symbol}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs px-1.5 py-0",
                                order.side === OrderSide.Buy
                                  ? "border-green-500/50 text-green-400"
                                  : "border-red-500/50 text-red-400"
                              )}
                            >
                              {order.side === OrderSide.Buy ? "BUY" : "SELL"}
                            </Badge>
                          </div>
                          <p className="text-gray-500 text-xs">
                            {order.order_type === OrderOrderType.Limit ? "Limit" : "Stop"} @ {formatCurrency(order.price || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-white text-sm font-medium">{order.quantity} shares</p>
                          <p className="text-gray-500 text-xs">
                            {stock.current_price > (order.price || 0) ? (
                              <span className="text-yellow-500">Waiting...</span>
                            ) : (
                              <span className="text-green-500">Near trigger</span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            cancelOrder.mutateAsync(order);
                          }}
                          className="p-1.5 hover:bg-zinc-800 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {pendingOrders.length > 3 && (
              <button
                className="w-full text-center text-gray-400 text-sm py-2 hover:text-white"
                onClick={() => setCurrentView("transaction-history")}
              >
                View all {pendingOrders.length} orders
              </button>
            )}
          </div>
        </div>
      )}

      {/* HYBE Fan Benefits Banner */}
      {hybeShares > 0 && (
        <div className="px-6 mt-6">
          <Card
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 cursor-pointer"
            onClick={() => setCurrentView("exclusive")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Fan-Shareholder Benefits</p>
                  <p className="text-gray-400 text-sm">{hybeShares} HYBE shares = Exclusive access</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Trade screen
  const renderTrade = () => (
    <div className="min-h-screen bg-black pb-20">
      {/* Search header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl font-bold">Trade</h1>
          <button
            className="relative"
            onClick={() => setShowNotificationPanel(true)}
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white pl-10"
          />
        </div>
      </div>

      {/* Watchlist */}
      {!searchQuery && watchlist.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="text-white font-bold mb-3">Watchlist</h3>
          <div className="space-y-2">
            {watchlist.map((item) => {
              const stock = stocks.find(s => s.id === item.stock_id);
              if (!stock) return null;

              const change = calculateChange(stock.current_price, stock.previous_close);
              const brandColors = getStockBrandColors(stock.symbol);
              const flash = priceFlash[stock.id];

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-all duration-300",
                    flash === "up" && "ring-1 ring-green-500/50 bg-green-900/10",
                    flash === "down" && "ring-1 ring-red-500/50 bg-red-900/10"
                  )}
                  onClick={() => {
                    setSelectedStock(stock);
                    setCurrentView("stock-detail");
                  }}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                      >
                        {brandColors.logo}
                      </div>
                      <div>
                        <p className="text-white font-medium">{stock.symbol}</p>
                        <p className="text-gray-400 text-xs">{stock.company_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-white font-medium transition-colors duration-300",
                        flash === "up" && "text-green-400",
                        flash === "down" && "text-red-400"
                      )}>
                        {formatCurrency(stock.current_price)}
                      </p>
                      <p className={cn(
                        "text-sm",
                        change >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {formatPercentage(change)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured stocks */}
      {!searchQuery && (
        <div className="px-6 mb-6">
          <h3 className="text-white font-bold mb-3">Featured Stocks</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {featuredStocks.map((stock) => {
                const change = calculateChange(stock.current_price, stock.previous_close);
                const brandColors = getStockBrandColors(stock.symbol);
                const flash = priceFlash[stock.id];

                return (
                  <Card
                    key={stock.id}
                    className={cn(
                      "bg-zinc-900 border-zinc-800 min-w-[160px] cursor-pointer hover:bg-zinc-800 transition-all duration-300",
                      flash === "up" && "ring-1 ring-green-500/50",
                      flash === "down" && "ring-1 ring-red-500/50"
                    )}
                    onClick={() => {
                      setSelectedStock(stock);
                      setCurrentView("stock-detail");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                        >
                          {brandColors.logo}
                        </div>
                        <span className="text-white font-bold">{stock.symbol}</span>
                      </div>
                      <p className={cn(
                        "text-white font-bold transition-colors duration-300",
                        flash === "up" && "text-green-400",
                        flash === "down" && "text-red-400"
                      )}>
                        {formatCurrency(stock.current_price)}
                      </p>
                      <p className={cn(
                        "text-sm",
                        change >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {formatPercentage(change)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* All stocks / Search results */}
      <div className="px-6">
        <h3 className="text-white font-bold mb-3">
          {searchQuery ? "Search Results" : "All Stocks"}
        </h3>
        <div className="space-y-2">
          {filteredStocks.map((stock) => {
            const change = calculateChange(stock.current_price, stock.previous_close);
            const isInWatchlist = watchlist.some(w => w.stock_id === stock.id);
            const brandColors = getStockBrandColors(stock.symbol);
            const flash = priceFlash[stock.id];

            return (
              <Card
                key={stock.id}
                className={cn(
                  "bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-all duration-300",
                  flash === "up" && "ring-1 ring-green-500/50 bg-green-900/10",
                  flash === "down" && "ring-1 ring-red-500/50 bg-red-900/10"
                )}
                onClick={() => {
                  setSelectedStock(stock);
                  setCurrentView("stock-detail");
                }}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                    >
                      {brandColors.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{stock.symbol}</p>
                        {stock.is_featured && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">Featured</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{stock.company_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn(
                        "text-white font-medium transition-colors duration-300",
                        flash === "up" && "text-green-400",
                        flash === "down" && "text-red-400"
                      )}>
                        {formatCurrency(stock.current_price)}
                      </p>
                      <p className={cn(
                        "text-sm",
                        change >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {formatPercentage(change)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWatchlist(stock);
                      }}
                      className="p-1"
                    >
                      {isInWatchlist ? (
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <Star className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Stock detail screen
  const renderStockDetail = () => {
    if (!selectedStock) return null;

    const change = calculateChange(selectedStock.current_price, selectedStock.previous_close);
    const isInWatchlist = watchlist.some(w => w.stock_id === selectedStock.id);
    const holding = portfolio.find(p => p.stock_id === selectedStock.id);

    const days = selectedTimeFrame === "1D" ? 1 :
      selectedTimeFrame === "1W" ? 7 :
      selectedTimeFrame === "1M" ? 30 :
      selectedTimeFrame === "1Y" ? 365 : 365;

    const chartData = generatePriceHistory(selectedStock.current_price, days);

    // Generate candlestick data for advanced charts
    const candlestickData = generateCandlestickData(selectedStock.current_price, days);

    // Calculate technical indicators
    const sma20 = calculateSMA(candlestickData, 20);
    const sma50 = calculateSMA(candlestickData, 50);
    const rsiData = calculateRSI(candlestickData);
    const macdData = calculateMACD(candlestickData);

    // Merge candlestick with indicators
    const chartWithIndicators = candlestickData.map((candle, i) => ({
      ...candle,
      sma20: sma20[i],
      sma50: sma50[i],
      rsi: rsiData[i],
      macd: macdData.macd[i],
      signal: macdData.signal[i],
      histogram: macdData.histogram[i],
    }));

    // Get current RSI for sentiment
    const currentRSI = rsiData[rsiData.length - 1];
    const rsiSentiment = currentRSI !== null ?
      (currentRSI > 70 ? "Overbought" : currentRSI < 30 ? "Oversold" : "Neutral") :
      "N/A";

    return (
      <div className="min-h-screen bg-black pb-20">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-white flex items-center"
              onClick={() => setCurrentView("trade")}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <button
              onClick={() => handleToggleWatchlist(selectedStock)}
            >
              {isInWatchlist ? (
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const brandColors = getStockBrandColors(selectedStock.symbol);
              const flash = priceFlash[selectedStock.id];
              return (
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all duration-300",
                    flash === "up" && "ring-2 ring-green-500",
                    flash === "down" && "ring-2 ring-red-500"
                  )}
                  style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                >
                  {brandColors.logo}
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white text-2xl font-bold">{selectedStock.symbol}</h1>
                <Badge variant="outline" className="text-xs border-zinc-700 text-gray-400">
                  KOSDAQ
                </Badge>
              </div>
              <p className="text-gray-400">{selectedStock.company_name}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className={cn(
              "text-white text-3xl font-bold transition-colors duration-300",
              priceFlash[selectedStock.id] === "up" && "text-green-400",
              priceFlash[selectedStock.id] === "down" && "text-red-400"
            )}>
              {formatCurrency(selectedStock.current_price)}
            </p>
            <div className={cn(
              "flex items-center",
              change >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {change >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatCurrency(Math.abs(selectedStock.current_price - selectedStock.previous_close))} ({formatPercentage(change)}) today
            </div>
          </div>
        </div>

        {/* Time frame selector */}
        <div className="px-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(["1D", "1W", "1M", "1Y", "All"] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-all",
                    selectedTimeFrame === tf
                      ? "bg-purple-500 text-white"
                      : "bg-zinc-800 text-gray-400"
                  )}
                  onClick={() => setSelectedTimeFrame(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
            {/* Chart type toggle */}
            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
              <button
                className={cn(
                  "p-1.5 rounded transition-all",
                  chartType === "line" ? "bg-purple-500" : "bg-transparent"
                )}
                onClick={() => setChartType("line")}
                title="Line Chart"
              >
                <Activity className="w-4 h-4 text-white" />
              </button>
              <button
                className={cn(
                  "p-1.5 rounded transition-all",
                  chartType === "candlestick" ? "bg-purple-500" : "bg-transparent"
                )}
                onClick={() => setChartType("candlestick")}
                title="Candlestick Chart"
              >
                <CandlestickChart className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Price chart */}
        <div className="px-6 mb-2">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: number) => [formatCurrency(value), "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={change >= 0 ? HYBE_COLORS.gain : HYBE_COLORS.loss}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              ) : (
                <ComposedChart data={chartWithIndicators}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: number, name: string) => {
                      if (name === "close") return [formatCurrency(value), "Close"];
                      if (name === "sma20") return [formatCurrency(value), "SMA 20"];
                      if (name === "sma50") return [formatCurrency(value), "SMA 50"];
                      return [formatCurrency(value), name];
                    }}
                  />
                  {/* Price line */}
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={change >= 0 ? HYBE_COLORS.gain : HYBE_COLORS.loss}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  {/* SMA lines */}
                  {showIndicators.sma && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="sma20"
                        stroke="#FFB800"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="3 3"
                      />
                      <Line
                        type="monotone"
                        dataKey="sma50"
                        stroke="#00B8D9"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="5 5"
                      />
                    </>
                  )}
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Chart */}
        {chartType === "candlestick" && (
          <div className="px-6 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-xs">Volume</span>
              <span className="text-gray-500 text-xs">
                {chartWithIndicators.length > 0 && (
                  <>Avg: {Math.round(chartWithIndicators.reduce((a, b) => a + b.volume, 0) / chartWithIndicators.length).toLocaleString()}</>
                )}
              </span>
            </div>
            <div className="h-12 bg-zinc-900/50 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartWithIndicators}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, "auto"]} />
                  <Bar
                    dataKey="volume"
                    fill="#7B61FF40"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Technical Indicators Toggle */}
        {chartType === "candlestick" && (
          <div className="px-6 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1",
                  showIndicators.sma ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : "bg-zinc-800 text-gray-400"
                )}
                onClick={() => setShowIndicators({ ...showIndicators, sma: !showIndicators.sma })}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                SMA
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1",
                  showIndicators.rsi ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" : "bg-zinc-800 text-gray-400"
                )}
                onClick={() => setShowIndicators({ ...showIndicators, rsi: !showIndicators.rsi })}
              >
                RSI: {currentRSI?.toFixed(0) || "N/A"}
              </button>
              <Badge
                className={cn(
                  "text-xs",
                  rsiSentiment === "Overbought" && "bg-red-500/20 text-red-400",
                  rsiSentiment === "Oversold" && "bg-green-500/20 text-green-400",
                  rsiSentiment === "Neutral" && "bg-gray-500/20 text-gray-400"
                )}
              >
                {rsiSentiment}
              </Badge>
            </div>
          </div>
        )}

        {/* RSI Chart (if enabled) */}
        {chartType === "candlestick" && showIndicators.rsi && (
          <div className="px-6 mb-4">
            <div className="h-20 bg-zinc-900 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartWithIndicators}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Area
                    type="monotone"
                    dataKey="rsi"
                    stroke="#7B61FF"
                    fill="#7B61FF20"
                    strokeWidth={1.5}
                  />
                  {/* Overbought/Oversold lines */}
                  <Line type="monotone" dataKey={() => 70} stroke="#FF6B6B" strokeDasharray="2 2" dot={false} />
                  <Line type="monotone" dataKey={() => 30} stroke="#00C805" strokeDasharray="2 2" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Oversold (&lt;30)</span>
              <span>RSI</span>
              <span>Overbought (&gt;70)</span>
            </div>
          </div>
        )}

        {/* Key statistics */}
        <div className="px-6 mb-6">
          <h3 className="text-white font-bold mb-3">Key Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-white font-medium">{selectedStock.market_cap}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">P/E Ratio</p>
                <p className="text-white font-medium">{selectedStock.pe_ratio?.toFixed(2) || "N/A"}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">52W High</p>
                <p className="text-white font-medium">{formatCurrency(selectedStock.week_52_high)}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">52W Low</p>
                <p className="text-white font-medium">{formatCurrency(selectedStock.week_52_low)}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">Day High</p>
                <p className="text-white font-medium">{formatCurrency(selectedStock.day_high)}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <p className="text-gray-400 text-sm">Day Low</p>
                <p className="text-white font-medium">{formatCurrency(selectedStock.day_low)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Your position */}
        {holding && (
          <div className="px-6 mb-6">
            <h3 className="text-white font-bold mb-3">Your Position</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Shares Owned</p>
                    <p className="text-white font-bold text-lg">{holding.shares}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Market Value</p>
                    <p className="text-white font-bold text-lg">
                      {formatCurrency(holding.shares * selectedStock.current_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Cost</p>
                    <p className="text-white font-medium">{formatCurrency(holding.average_cost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Return</p>
                    {(() => {
                      const gain = (selectedStock.current_price - holding.average_cost) * holding.shares;
                      const gainPercent = ((selectedStock.current_price - holding.average_cost) / holding.average_cost) * 100;
                      return (
                        <p className={cn(
                          "font-medium",
                          gain >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {formatCurrency(gain)} ({formatPercentage(gainPercent)})
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* About */}
        <div className="px-6 mb-6">
          <h3 className="text-white font-bold mb-3">About</h3>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <p className="text-gray-300 text-sm leading-relaxed">{selectedStock.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  {selectedStock.sector}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade buttons */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-zinc-800">
          <div className="flex gap-3">
            <Button
              className="flex-1 h-12"
              style={{ background: HYBE_COLORS.gain }}
              onClick={() => {
                setTradeMode("buy");
                setShowOrderDialog(true);
              }}
            >
              Buy
            </Button>
            <Button
              className="flex-1 h-12"
              style={{ background: HYBE_COLORS.loss }}
              onClick={() => {
                setTradeMode("sell");
                setShowOrderDialog(true);
              }}
              disabled={!holding}
            >
              Sell
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Markets screen
  const renderMarkets = () => (
    <div className="min-h-screen bg-black pb-20">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl font-bold">Markets</h1>
          <button
            className="relative"
            onClick={() => setShowNotificationPanel(true)}
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <Tabs defaultValue="movers" className="px-6">
        <TabsList className="w-full bg-zinc-900 mb-4">
          <TabsTrigger value="movers" className="flex-1">Movers</TabsTrigger>
          <TabsTrigger value="news" className="flex-1">News</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="movers">
          {/* Top Gainers */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <ArrowUp className="w-5 h-5 text-green-500 mr-2" />
              Top Gainers
            </h3>
            <div className="space-y-2">
              {marketMovers.gainers.map((stock, index) => {
                const change = calculateChange(stock.current_price, stock.previous_close);
                return (
                  <Card
                    key={stock.id}
                    className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      setSelectedStock(stock);
                      setCurrentView("stock-detail");
                    }}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 w-6">{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{stock.symbol}</p>
                          <p className="text-gray-400 text-sm">{stock.company_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(stock.current_price)}</p>
                        <p className="text-green-500 text-sm">{formatPercentage(change)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Top Losers */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center">
              <ArrowDown className="w-5 h-5 text-red-500 mr-2" />
              Top Losers
            </h3>
            <div className="space-y-2">
              {marketMovers.losers.map((stock, index) => {
                const change = calculateChange(stock.current_price, stock.previous_close);
                return (
                  <Card
                    key={stock.id}
                    className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      setSelectedStock(stock);
                      setCurrentView("stock-detail");
                    }}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 w-6">{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{stock.symbol}</p>
                          <p className="text-gray-400 text-sm">{stock.company_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(stock.current_price)}</p>
                        <p className="text-red-500 text-sm">{formatPercentage(change)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-bold">K-Pop Industry News</h3>
            </div>
            {MOCK_NEWS.map((news) => (
              <Card key={news.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      news.sentiment === "positive" && "bg-green-500/20",
                      news.sentiment === "negative" && "bg-red-500/20",
                      news.sentiment === "neutral" && "bg-gray-500/20"
                    )}>
                      {news.category === "tour" && <Headphones className="w-5 h-5 text-purple-400" />}
                      {news.category === "earnings" && <TrendingUp className="w-5 h-5 text-green-400" />}
                      {news.category === "release" && <Sparkles className="w-5 h-5 text-blue-400" />}
                      {news.category === "market" && <BarChart3 className="w-5 h-5 text-yellow-400" />}
                      {news.category === "general" && <Newspaper className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-medium text-sm leading-tight">{news.title}</h4>
                        <Badge
                          className={cn(
                            "text-xs shrink-0",
                            news.sentiment === "positive" && "bg-green-500/20 text-green-400",
                            news.sentiment === "negative" && "bg-red-500/20 text-red-400",
                            news.sentiment === "neutral" && "bg-gray-500/20 text-gray-400"
                          )}
                        >
                          {news.sentiment === "positive" && <ArrowUp className="w-3 h-3 mr-1" />}
                          {news.sentiment === "negative" && <ArrowDown className="w-3 h-3 mr-1" />}
                          {news.sentiment}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{news.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {news.relatedStocks.slice(0, 3).map((symbol) => (
                            <Badge key={symbol} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-gray-500 text-xs">{news.source} • {formatRelativeTime(news.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">K-Pop Entertainment Rally</h4>
                    <p className="text-gray-400 text-sm">Entertainment stocks surge on strong Q3 concert revenue reports</p>
                    <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">HYBE Announces New Artist Group</h4>
                    <p className="text-gray-400 text-sm">Shares rise 3% on debut announcement</p>
                    <p className="text-gray-500 text-xs mt-2">5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Global Album Sales Record</h4>
                    <p className="text-gray-400 text-sm">K-pop industry breaks monthly sales record</p>
                    <p className="text-gray-500 text-xs mt-2">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Account screen
  const renderAccount = () => (
    <div className="min-h-screen bg-black pb-20">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl font-bold">Account</h1>
          <button
            className="relative"
            onClick={() => setShowNotificationPanel(true)}
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile card */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                {currentUser?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-white text-lg font-bold">{currentUser?.name}</h2>
                <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                <Badge className="mt-1 capitalize">{currentUser?.risk_profile}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fan-Vestor Tier Card */}
        <Card
          className="mb-6 cursor-pointer border-2 overflow-hidden"
          style={{ borderColor: currentTier.color, background: `linear-gradient(135deg, ${currentTier.color}20, ${currentTier.color}05)` }}
          onClick={() => setCurrentView("fan-vestor")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}80)` }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Fan-Vestor Tier</p>
                  <h3 className="text-white font-bold text-lg">{currentTier.name}</h3>
                  <Badge style={{ backgroundColor: currentTier.color }} className="text-xs">{currentTier.badge}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">HYBE Shares</p>
                <p className="text-white font-bold text-xl">{hybeShares}</p>
                {nextTier && (
                  <p className="text-gray-500 text-xs">{nextTier.minShares - hybeShares} to {nextTier.name}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <Wallet className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-bold text-lg">{formatCurrency(weverseWallet.cashBalance)}</p>
              <p className="text-gray-400 text-sm">Weverse Cash</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-bold text-lg">{userNfts.length}</p>
              <p className="text-gray-400 text-sm">NFT TAKEs</p>
            </CardContent>
          </Card>
        </div>

        {/* Fan-Vestor Features */}
        <h3 className="text-gray-400 text-sm font-medium mb-3 px-1">FAN-VESTOR FEATURES</h3>
        <div className="space-y-2 mb-6">
          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("fan-vestor")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-white">My Fan-Vestor Status</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("weverse-wallet")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-green-400" />
                <span className="text-white">Integrated Wallet</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("agm-voting")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vote className="w-5 h-5 text-blue-400" />
                <span className="text-white">AGM Voting</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs">3 Active</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Sell & Withdraw Section */}
        <h3 className="text-gray-400 text-sm font-medium mb-3 px-1">SELL & WITHDRAW</h3>
        <div className="space-y-2 mb-6">
          <Card
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 cursor-pointer hover:from-purple-900/40 hover:to-blue-900/40 transition-colors"
            onClick={() => setCurrentView("sell-shares")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-white font-medium">Sell HYBE Shares</span>
                  <p className="text-gray-400 text-xs">Execute sell orders for your holdings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("settlement-status")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <span className="text-white">Settlement Status</span>
                  <p className="text-gray-400 text-xs">Track pending settlements</p>
                </div>
              </div>
              {cashBalance.pendingBalance > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                  {formatCurrency(cashBalance.pendingBalance)} pending
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("withdraw-funds")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-green-400" />
                <div>
                  <span className="text-white">Withdraw to Bank</span>
                  <p className="text-gray-400 text-xs">Transfer settled funds to your bank</p>
                </div>
              </div>
              {cashBalance.availableBalance > 0 && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  {formatCurrency(cashBalance.availableBalance)} available
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Menu items */}
        <h3 className="text-gray-400 text-sm font-medium mb-3 px-1">ACCOUNT</h3>
        <div className="space-y-2">
          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("exclusive")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-400" />
                <span className="text-white">Exclusive Content</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("education")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="text-white">Education Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("transaction-history")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-orange-400" />
                <span className="text-white">Transaction History</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("price-alerts")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5 text-yellow-400" />
                <span className="text-white">Price Alerts</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("leaderboard")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-white">Leaderboard</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setCurrentView("security-settings")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white">Security Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="text-white">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </CardContent>
          </Card>

          <Card
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={handleLogout}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Sign Out</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Exclusive content screen
  const renderExclusive = () => (
    <div className="min-h-screen bg-black pb-20">
      <div className="p-6 pb-4">
        <button
          className="text-white mb-4 flex items-center"
          onClick={() => setCurrentView("account")}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <h1 className="text-white text-2xl font-bold mb-2">Fan-Shareholder Benefits</h1>
        <p className="text-gray-400 mb-4">Exclusive content for HYBE shareholders</p>

        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Your HYBE Holdings</p>
              <p className="text-white text-2xl font-bold">{hybeShares} shares</p>
            </div>
            <Crown className="w-10 h-10 text-yellow-400" />
          </CardContent>
        </Card>
      </div>

      <div className="px-6 space-y-4">
        {allExclusiveContent.map((content) => {
          const isUnlocked = hybeShares >= content.min_shares_required;

          return (
            <Card
              key={content.id}
              className={cn(
                "border overflow-hidden",
                isUnlocked ? "bg-zinc-900 border-zinc-800" : "bg-zinc-900/50 border-zinc-800/50"
              )}
            >
              <div className="relative">
                <img
                  src={content.thumbnail_url || "https://picsum.photos/400/225"}
                  alt={content.title}
                  className={cn(
                    "w-full h-40 object-cover",
                    !isUnlocked && "opacity-50"
                  )}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">
                        Requires {content.min_shares_required} shares
                      </p>
                    </div>
                  </div>
                )}
                {isUnlocked && content.content_type === ExclusiveContentContentType.Video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {content.content_type}
                  </Badge>
                </div>
                <h3 className={cn(
                  "font-bold mb-1",
                  isUnlocked ? "text-white" : "text-gray-500"
                )}>
                  {content.title}
                </h3>
                <p className={cn(
                  "text-sm",
                  isUnlocked ? "text-gray-400" : "text-gray-600"
                )}>
                  {content.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Education screen - uses top-level selectedEducationCategory and filteredEducation
  const renderEducation = () => {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Education Center</h1>
          <p className="text-gray-400 mb-4">Learn about investing and K-pop industry</p>

          {/* Progress Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Your Progress</span>
                </div>
                <Badge className="bg-white/20 text-white">
                  {contentProgress.filter(p => p.completed).length} / {educationalContent.length} completed
                </Badge>
              </div>
              <Progress
                value={(contentProgress.filter(p => p.completed).length / educationalContent.length) * 100 || 0}
                className="h-2 bg-white/20"
              />
              <div className="flex justify-between text-xs text-white/70 mt-2">
                <span>
                  {Math.round((contentProgress.filter(p => p.completed).length / educationalContent.length) * 100) || 0}% complete
                </span>
                <span>
                  {educationalContent.length - contentProgress.filter(p => p.completed).length} lessons remaining
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category filter */}
        <ScrollArea className="px-6 mb-6">
          <div className="flex gap-2 pb-2">
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
                selectedEducationCategory === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-800 text-gray-400"
              )}
              onClick={() => setSelectedEducationCategory("all")}
            >
              All
            </button>
            {Object.entries(EducationalContentCategory)
              .filter(([key, value]) => typeof value === "number" && value !== 0)
              .map(([key, value]) => (
              <button
                key={key}
                className={cn(
                  "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all capitalize",
                  selectedEducationCategory === value
                    ? "bg-purple-500 text-white"
                    : "bg-zinc-800 text-gray-400"
                )}
                onClick={() => setSelectedEducationCategory(value as EducationalContentCategory)}
              >
                {key}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Content list */}
        <div className="px-6 space-y-4">
          {filteredEducation.map((content) => {
            const isCompleted = contentProgress.some(
              p => p.content_id === content.id && p.completed
            );

            return (
              <Card key={content.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      content.content_type === EducationalContentContentType.Video
                        ? "bg-red-500/20"
                        : "bg-blue-500/20"
                    )}>
                      {content.content_type === EducationalContentContentType.Video ? (
                        <Play className="w-6 h-6 text-red-400" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium">{content.title}</h3>
                        {isCompleted && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{content.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {content.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            content.difficulty === EducationalContentDifficulty.Beginner && "border-green-500/50 text-green-400",
                            content.difficulty === EducationalContentDifficulty.Intermediate && "border-yellow-500/50 text-yellow-400",
                            content.difficulty === EducationalContentDifficulty.Advanced && "border-red-500/50 text-red-400"
                          )}
                        >
                          {content.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Notifications panel
  const renderNotifications = () => (
    <div className="min-h-screen bg-black pb-20">
      <div className="p-6 pb-4">
        <button
          className="text-white mb-4 flex items-center"
          onClick={() => setShowNotificationPanel(false)}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <h1 className="text-white text-2xl font-bold mb-4">Notifications</h1>
      </div>

      <div className="px-6 space-y-3">
        {notifications.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "border cursor-pointer hover:bg-zinc-800 transition-colors",
                notification.is_read
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-zinc-800 border-purple-500/30"
              )}
              onClick={async () => {
                if (!notification.is_read) {
                  const notificationOrm = NotificationORM.getInstance();
                  await notificationOrm.setNotificationById(notification.id, {
                    ...notification,
                    is_read: true,
                  });
                  queryClient.invalidateQueries();
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    notification.type === NotificationType.OrderExecuted && "bg-green-500/20",
                    notification.type === NotificationType.PriceAlert && "bg-yellow-500/20",
                    notification.type === NotificationType.Content && "bg-purple-500/20",
                    notification.type === NotificationType.Announcement && "bg-blue-500/20"
                  )}>
                    {notification.type === NotificationType.OrderExecuted && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                    {notification.type === NotificationType.PriceAlert && (
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                    )}
                    {notification.type === NotificationType.Content && (
                      <Gift className="w-5 h-5 text-purple-400" />
                    )}
                    {notification.type === NotificationType.Announcement && (
                      <Bell className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{notification.title}</h4>
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{notification.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  // Order dialog
  const renderOrderDialog = () => {
    if (!selectedStock || !currentUser) return null;

    const quantity = parseInt(tradeQuantity, 10) || 0;
    const price = orderType === OrderOrderType.Market
      ? selectedStock.current_price
      : parseFloat(limitPrice) || selectedStock.current_price;
    const total = quantity * price;
    const holding = portfolio.find(p => p.stock_id === selectedStock.id);

    return (
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {tradeMode === "buy" ? (
                <span className="text-green-500">Buy</span>
              ) : (
                <span className="text-red-500">Sell</span>
              )}
              {selectedStock.symbol}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Current price: {formatCurrency(selectedStock.current_price)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order type */}
            <div>
              <Label className="text-gray-400 mb-2 block">Order Type</Label>
              <div className="flex gap-2">
                {([OrderOrderType.Market, OrderOrderType.Limit, OrderOrderType.Stop] as OrderOrderType[]).map((type) => (
                  <button
                    key={type}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm transition-all capitalize",
                      orderType === type
                        ? "bg-purple-500 text-white"
                        : "bg-zinc-800 text-gray-400"
                    )}
                    onClick={() => setOrderType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {orderType === OrderOrderType.Limit && (
                <p className="text-gray-500 text-xs mt-2">
                  <Info className="w-3 h-3 inline mr-1" />
                  Executes when price reaches your target
                </p>
              )}
              {orderType === OrderOrderType.Stop && (
                <p className="text-gray-500 text-xs mt-2">
                  <Info className="w-3 h-3 inline mr-1" />
                  Triggers when price reaches your stop level
                </p>
              )}
            </div>

            {/* Limit/Stop price */}
            {orderType !== OrderOrderType.Market && (
              <div>
                <Label className="text-gray-400 mb-2 block">
                  {orderType === OrderOrderType.Limit ? "Limit Price" : "Stop Price"}
                </Label>
                <Input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder={selectedStock.current_price.toString()}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-gray-400 mb-2 block">Quantity</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(e.target.value)}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-white flex-1"
                />
                <div className="flex gap-1">
                  {[10, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 border border-purple-500/30"
                      onClick={() => {
                        const currentQty = parseInt(tradeQuantity, 10) || 0;
                        setTradeQuantity((currentQty + amount).toString());
                      }}
                    >
                      +{amount}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    className={cn(
                      "flex-1 py-1.5 rounded text-sm transition-all",
                      pct === 100
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                    )}
                    onClick={() => {
                      if (tradeMode === "buy") {
                        const maxShares = Math.floor(currentUser.virtual_balance / price);
                        setTradeQuantity(Math.floor(maxShares * pct / 100).toString());
                      } else if (holding) {
                        setTradeQuantity(Math.floor(holding.shares * pct / 100).toString());
                      }
                    }}
                  >
                    {pct === 100 ? "MAX" : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white">{quantity} shares</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white">{formatCurrency(price)}</span>
                </div>
                <div className="border-t border-zinc-700 pt-2 flex justify-between">
                  <span className="text-gray-400">Estimated Total</span>
                  <span className="text-white font-bold">{formatCurrency(total)}</span>
                </div>
                {tradeMode === "buy" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Available Cash</span>
                    <span className="text-gray-300">{formatCurrency(currentUser.virtual_balance)}</span>
                  </div>
                )}
                {tradeMode === "sell" && holding && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shares Owned</span>
                    <span className="text-gray-300">{holding.shares}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {authError && (
              <p className="text-red-500 text-sm">{authError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOrderDialog(false);
                setAuthError("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              style={{
                background: tradeMode === "buy" ? HYBE_COLORS.gain : HYBE_COLORS.loss
              }}
              onClick={handlePlaceOrder}
              disabled={quantity <= 0 || (tradeMode === "buy" && total > currentUser.virtual_balance)}
            >
              {tradeMode === "buy" ? "Buy" : "Sell"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================================
  // ENHANCEMENT #1: Transaction History View
  // ============================================================================
  // Transaction history - uses top-level filteredTransactionsData and transactionStats
  const renderTransactionHistory = () => {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Transaction History</h1>
          <p className="text-gray-400 mb-4">Your complete trading activity</p>
        </div>

        {/* Summary Cards */}
        <div className="px-6 grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <ArrowUp className="w-4 h-4" />
                <span className="text-xs text-gray-400">Total Bought</span>
              </div>
              <p className="text-white font-bold">{formatCurrency(transactionStats.buyTotal)}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <ArrowDown className="w-4 h-4" />
                <span className="text-xs text-gray-400">Total Sold</span>
              </div>
              <p className="text-white font-bold">{formatCurrency(transactionStats.sellTotal)}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Net Cash Flow</span>
              </div>
              <p className={cn(
                "font-bold",
                transactionStats.netFlow >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatCurrency(transactionStats.netFlow)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Total Trades</span>
              </div>
              <p className="text-white font-bold">{transactionStats.totalTrades}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="px-6 mb-4">
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <div className="flex gap-1">
                {(["all", "buy", "sell"] as const).map((filter) => (
                  <button
                    key={filter}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize",
                      transactionFilter === filter
                        ? "bg-purple-500 text-white"
                        : "bg-zinc-800 text-gray-400"
                    )}
                    onClick={() => setTransactionFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              {(["newest", "oldest", "largest"] as const).map((sort) => (
                <button
                  key={sort}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize",
                    transactionSort === sort
                      ? "bg-purple-500 text-white"
                      : "bg-zinc-800 text-gray-400"
                  )}
                  onClick={() => setTransactionSort(sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="px-6 space-y-2">
          {filteredTransactionsData.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet</p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactionsData.map((transaction) => {
              const order = orders.find(o => o.id === transaction.order_id);
              const stock = order ? stocks.find(s => s.id === order.stock_id) : null;

              return (
                <Card key={transaction.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          transaction.type === TransactionType.Buy
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        )}>
                          {transaction.type === TransactionType.Buy ? (
                            <ArrowUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              transaction.type === TransactionType.Buy
                                ? "text-green-500"
                                : "text-red-500"
                            )}>
                              {transaction.type === TransactionType.Buy ? "Bought" : "Sold"}
                            </span>
                            {stock && (
                              <span className="text-white font-medium">{stock.symbol}</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">
                            {order && `${order.quantity} shares @ ${formatCurrency(order.executed_price ?? order.price ?? 0)}`}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(transaction.create_time).toLocaleDateString()} {new Date(transaction.create_time).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-bold",
                          transaction.type === TransactionType.Buy ? "text-red-500" : "text-green-500"
                        )}>
                          {transaction.type === TransactionType.Buy ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Balance: {formatCurrency(transaction.balance_after)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // ENHANCEMENT #5: Portfolio Analytics
  // ============================================================================
  // Portfolio analytics - uses top-level portfolioBreakdownData
  const renderPortfolioAnalytics = () => {
    // Calculate allocations using top-level portfolioBreakdownData
    const totalPortfolioValue = portfolioBreakdownData.reduce((sum, item) => sum + item.value, 0);
    const portfolioWithAllocations = portfolioBreakdownData.map(item => ({
      ...item,
      allocation: (item.value / totalPortfolioValue) * 100 || 0,
    }));

    // Performance metrics
    const totalCostBasis = portfolioBreakdownData.reduce((sum, item) => sum + item.costBasis, 0);
    const totalGain = totalPortfolioValue - totalCostBasis;
    const totalGainPercent = (totalGain / totalCostBasis) * 100 || 0;

    // Best and worst performers
    const sortedByGain = [...portfolioWithAllocations].sort((a, b) => b.gainPercent - a.gainPercent);
    const bestPerformer = sortedByGain[0];
    const worstPerformer = sortedByGain[sortedByGain.length - 1];

    // Pie chart data
    const pieData = portfolioWithAllocations.map(item => ({
      name: item.symbol,
      value: item.value,
    }));

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("portfolio")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Portfolio Analytics</h1>
          <p className="text-gray-400 mb-4">Detailed breakdown of your investments</p>
        </div>

        {/* Portfolio Summary */}
        <div className="px-6 mb-6">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-500 border-0 text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-sm">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Return</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    totalGain >= 0 ? "text-green-300" : "text-red-300"
                  )}>
                    {formatPercentage(totalGainPercent)}
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Cost Basis</p>
                  <p className="text-lg font-medium">{formatCurrency(totalCostBasis)}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Unrealized P&L</p>
                  <p className={cn(
                    "text-lg font-medium",
                    totalGain >= 0 ? "text-green-300" : "text-red-300"
                  )}>
                    {totalGain >= 0 ? "+" : ""}{formatCurrency(totalGain)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocation Pie Chart */}
        {pieData.length > 0 && (
          <div className="px-6 mb-6">
            <h3 className="text-white font-bold mb-3">Asset Allocation</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend
                        formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Best & Worst Performers */}
        {portfolioWithAllocations.length > 0 && (
          <div className="px-6 mb-6 grid grid-cols-2 gap-3">
            <Card className="bg-zinc-900 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-400">Best Performer</span>
                </div>
                {bestPerformer && (
                  <>
                    <p className="text-white font-bold">{bestPerformer.symbol}</p>
                    <p className="text-green-500 text-sm font-medium">
                      {formatPercentage(bestPerformer.gainPercent)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-400">Worst Performer</span>
                </div>
                {worstPerformer && (
                  <>
                    <p className="text-white font-bold">{worstPerformer.symbol}</p>
                    <p className={cn(
                      "text-sm font-medium",
                      worstPerformer.gainPercent >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {formatPercentage(worstPerformer.gainPercent)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Holdings Breakdown */}
        <div className="px-6">
          <h3 className="text-white font-bold mb-3">Holdings Breakdown</h3>
          <div className="space-y-3">
            {portfolioWithAllocations.map((holding, index) => (
              <Card key={holding.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length] }}
                      >
                        {holding.symbol[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{holding.symbol}</p>
                        <p className="text-gray-400 text-xs">{holding.shares} shares</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(holding.value)}</p>
                      <p className={cn(
                        "text-sm",
                        holding.gain >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {formatPercentage(holding.gainPercent)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Allocation</span>
                      <span className="text-white">{holding.allocation.toFixed(1)}%</span>
                    </div>
                    <Progress value={holding.allocation} className="h-1" />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Cost Basis</span>
                      <span className="text-white">{formatCurrency(holding.costBasis)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Unrealized P&L</span>
                      <span className={holding.gain >= 0 ? "text-green-500" : "text-red-500"}>
                        {holding.gain >= 0 ? "+" : ""}{formatCurrency(holding.gain)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // ENHANCEMENT #6: Leaderboard & Social Trading
  // ============================================================================
  // Leaderboard - uses top-level userRankData
  const renderLeaderboard = () => {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400 mb-4">Top Fan-Vestors on HYBE INSIGHT</p>
        </div>

        {/* Your Ranking Card */}
        {userRankData && (
          <div className="px-6 mb-6">
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                    >
                      {currentUser?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold">Your Ranking</p>
                      <p className="text-gray-400 text-sm">#{userRankData.rank} of {MOCK_LEADERBOARD.length + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-2xl font-bold",
                      userRankData.totalReturnPercent >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {formatPercentage(userRankData.totalReturnPercent)}
                    </p>
                    <p className="text-gray-400 text-sm">Return</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-white font-medium">{formatCurrency(userRankData.portfolioValue)}</p>
                    <p className="text-gray-400 text-xs">Portfolio</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{userRankData.trades}</p>
                    <p className="text-gray-400 text-xs">Trades</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{userRankData.winRate}%</p>
                    <p className="text-gray-400 text-xs">Win Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Traders */}
        <div className="px-6">
          <h3 className="text-white font-bold mb-3">Top Traders</h3>
          <div className="space-y-3">
            {MOCK_LEADERBOARD.map((user, index) => (
              <Card
                key={user.id}
                className={cn(
                  "bg-zinc-900 border-zinc-800",
                  index < 3 && "border-yellow-500/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        index === 0 && "bg-yellow-500 text-black",
                        index === 1 && "bg-gray-300 text-black",
                        index === 2 && "bg-amber-600 text-white",
                        index > 2 && "bg-zinc-700 text-white"
                      )}>
                        {index < 3 ? (
                          <Trophy className="w-5 h-5" />
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{user.trades} trades</span>
                          <span>•</span>
                          <span>{user.winRate}% win rate</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-bold">
                        {formatPercentage(user.totalReturnPercent)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatCurrency(user.portfolioValue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // ENHANCEMENT #4: Price Alerts System
  // ============================================================================
  const renderPriceAlerts = () => {
    const handleCreateAlert = () => {
      if (!selectedStock || !newAlertPrice) return;

      const price = parseFloat(newAlertPrice);
      if (isNaN(price) || price <= 0) return;

      const newAlert: PriceAlert = {
        id: Date.now().toString(),
        stockId: selectedStock.id,
        symbol: selectedStock.symbol,
        targetPrice: price,
        condition: newAlertCondition,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setPriceAlerts([...priceAlerts, newAlert]);
      setNewAlertPrice("");
      setShowAlertDialog(false);
    };

    const handleDeleteAlert = (alertId: string) => {
      setPriceAlerts(priceAlerts.filter(a => a.id !== alertId));
    };

    const handleToggleAlert = (alertId: string) => {
      setPriceAlerts(priceAlerts.map(a =>
        a.id === alertId ? { ...a, isActive: !a.isActive } : a
      ));
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white text-2xl font-bold">Price Alerts</h1>
              <p className="text-gray-400">Get notified when prices change</p>
            </div>
            <Button
              onClick={() => {
                setSelectedStock(stocks[0] || null);
                setShowAlertDialog(true);
              }}
              style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Alert
            </Button>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="px-6 space-y-3">
          {priceAlerts.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <BellRing className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No price alerts set</p>
                <p className="text-gray-500 text-sm">Create alerts to get notified when stocks hit your target prices</p>
              </CardContent>
            </Card>
          ) : (
            priceAlerts.map((alert) => {
              const stock = stocks.find(s => s.id === alert.stockId);
              const currentPrice = stock?.current_price || 0;
              const isTriggered = alert.condition === "above"
                ? currentPrice >= alert.targetPrice
                : currentPrice <= alert.targetPrice;

              return (
                <Card
                  key={alert.id}
                  className={cn(
                    "bg-zinc-900 border-zinc-800",
                    isTriggered && "border-yellow-500/50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          alert.condition === "above" ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                          {alert.condition === "above" ? (
                            <ArrowUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{alert.symbol}</p>
                            {isTriggered && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Triggered</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            Alert when price goes {alert.condition} {formatCurrency(alert.targetPrice)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Current: {formatCurrency(currentPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => handleToggleAlert(alert.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Create Alert Dialog */}
        <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription className="text-gray-400">
                Get notified when the price reaches your target
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 mb-2 block">Stock</Label>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {stocks.map((stock) => (
                      <button
                        key={stock.id}
                        className={cn(
                          "w-full p-3 rounded-lg text-left transition-all flex items-center justify-between",
                          selectedStock?.id === stock.id
                            ? "bg-purple-500/20 border border-purple-500"
                            : "bg-zinc-800 border border-transparent hover:bg-zinc-700"
                        )}
                        onClick={() => setSelectedStock(stock)}
                      >
                        <span className="text-white font-medium">{stock.symbol}</span>
                        <span className="text-gray-400">{formatCurrency(stock.current_price)}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <Label className="text-gray-400 mb-2 block">Condition</Label>
                <div className="flex gap-2">
                  <button
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm transition-all",
                      newAlertCondition === "above"
                        ? "bg-green-500 text-white"
                        : "bg-zinc-800 text-gray-400"
                    )}
                    onClick={() => setNewAlertCondition("above")}
                  >
                    Above
                  </button>
                  <button
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm transition-all",
                      newAlertCondition === "below"
                        ? "bg-red-500 text-white"
                        : "bg-zinc-800 text-gray-400"
                    )}
                    onClick={() => setNewAlertCondition("below")}
                  >
                    Below
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 mb-2 block">Target Price (KRW)</Label>
                <Input
                  type="number"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(e.target.value)}
                  placeholder={selectedStock?.current_price.toString() || "0"}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateAlert}
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ============================================================================
  // ENHANCEMENT #11: Security Settings Page
  // ============================================================================
  // Security settings - uses top-level securityShowSuccess and securityPasswordError
  const renderSecuritySettings = () => {
    const handlePasswordChange = () => {
      setSecurityPasswordError("");

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        setSecurityPasswordError("Please fill in all fields");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setSecurityPasswordError("New passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        setSecurityPasswordError("Password must be at least 6 characters");
        return;
      }

      // Simulate password change and create security notification
      if (currentUser) {
        const notificationOrm = NotificationORM.getInstance();
        notificationOrm.insertNotification([{
          user_id: currentUser.id,
          type: NotificationType.Announcement,
          title: "Password Changed",
          message: "Your password has been successfully updated. If you didn't make this change, please contact support immediately.",
          is_read: false,
        } as NotificationModel]);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }

      setSecurityShowSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => setSecurityShowSuccess(false), 3000);
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Security Settings</h1>
          <p className="text-gray-400 mb-4">Manage your account security</p>
        </div>

        {/* Success Toast */}
        {securityShowSuccess && (
          <div className="fixed top-4 left-4 right-4 z-50 p-4 rounded-lg bg-green-500 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-medium">Settings saved successfully!</span>
            </div>
          </div>
        )}

        <div className="px-6 space-y-6">
          {/* Two-Factor Authentication */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    setTwoFactorEnabled(checked);
                    if (currentUser) {
                      const notificationOrm = NotificationORM.getInstance();
                      notificationOrm.insertNotification([{
                        user_id: currentUser.id,
                        type: NotificationType.Announcement,
                        title: checked ? "2FA Enabled" : "2FA Disabled",
                        message: checked
                          ? "Two-factor authentication has been enabled for your account. Your account is now more secure."
                          : "Two-factor authentication has been disabled. We recommend keeping it enabled for security.",
                        is_read: false,
                      } as NotificationModel]);
                      queryClient.invalidateQueries({ queryKey: ["notifications"] });
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <div>
            <h3 className="text-white font-bold mb-3">Notification Settings</h3>
            <div className="space-y-3">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Order confirmations & reports</p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BellRing className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Price Alert Notifications</p>
                        <p className="text-gray-400 text-sm">Get notified when alerts trigger</p>
                      </div>
                    </div>
                    <Switch
                      checked={priceAlertNotifications}
                      onCheckedChange={setPriceAlertNotifications}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h3 className="text-white font-bold mb-3">Change Password</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-400 mb-2 block">Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 mb-2 block">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 mb-2 block">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {securityPasswordError && (
                  <p className="text-red-500 text-sm">{securityPasswordError}</p>
                )}

                <Button
                  className="w-full"
                  onClick={handlePasswordChange}
                  style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Session Info */}
          <div>
            <h3 className="text-white font-bold mb-3">Account Info</h3>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Account Created</span>
                  <span className="text-white">
                    {currentUser?.create_time
                      ? new Date(currentUser.create_time).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Profile</span>
                  <Badge className="capitalize">{currentUser?.risk_profile}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Order confirmation toast
  const renderOrderConfirmation = () => (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all",
        "bg-green-500 text-white",
        showOrderConfirmation ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3">
        <Check className="w-6 h-6" />
        <span className="font-medium">Order placed successfully!</span>
      </div>
    </div>
  );

  // ============================================================================
  // FAN-VESTOR IDENTITY PAGE
  // ============================================================================
  const renderFanVestor = () => {
    const sharesToNextTier = nextTier ? nextTier.minShares - hybeShares : 0;
    const progressToNextTier = nextTier
      ? ((hybeShares - currentTier.minShares) / (nextTier.minShares - currentTier.minShares)) * 100
      : 100;

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Fan-Vestor Identity</h1>
          <p className="text-gray-400 mb-4">Your shareholder status & benefits</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Current Tier Card */}
          <Card
            className="border-2 overflow-hidden"
            style={{ borderColor: currentTier.color, background: `linear-gradient(135deg, ${currentTier.color}20, ${currentTier.color}05)` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}80)` }}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Tier</p>
                    <h2 className="text-white text-2xl font-bold">{currentTier.name}</h2>
                    <Badge style={{ backgroundColor: currentTier.color }} className="mt-1">
                      {currentTier.badge}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">HYBE Shares</p>
                  <p className="text-white text-3xl font-bold">{hybeShares}</p>
                </div>
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to {nextTier.name}</span>
                    <span className="text-white">{sharesToNextTier} shares needed</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weverse Connection */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Weverse Account</p>
                    {weverseConnected ? (
                      <p className="text-green-400 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Connected as @{weverseId}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">Link your Weverse ID for benefits</p>
                    )}
                  </div>
                </div>
                {weverseConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setWeverseConnected(false);
                      setWeverseId("");
                    }}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                    onClick={() => {
                      setWeverseConnected(true);
                      setWeverseId("fan_vestor_" + Math.floor(Math.random() * 10000));
                    }}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Benefits */}
          <div>
            <h3 className="text-white font-bold mb-4">Your Benefits</h3>
            <div className="space-y-3">
              {currentTier.benefits.map((benefit, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${currentTier.color}30` }}
                    >
                      <Check className="w-5 h-5" style={{ color: currentTier.color }} />
                    </div>
                    <span className="text-white">{benefit}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Tiers */}
          <div>
            <h3 className="text-white font-bold mb-4">All Shareholder Tiers</h3>
            <div className="space-y-3">
              {SHAREHOLDER_TIERS.map((tier) => (
                <Card
                  key={tier.name}
                  className={cn(
                    "border",
                    tier.name === currentTier.name ? "border-purple-500 bg-zinc-800" : "bg-zinc-900 border-zinc-800"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}80)` }}
                        >
                          {tier.name === "Platinum" && <Diamond className="w-5 h-5 text-white" />}
                          {tier.name === "Gold" && <Crown className="w-5 h-5 text-white" />}
                          {tier.name === "Silver" && <Award className="w-5 h-5 text-white" />}
                          {tier.name === "Bronze" && <BadgeCheck className="w-5 h-5 text-white" />}
                          {tier.name === "Standard" && <User className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{tier.name}</p>
                          <p className="text-gray-400 text-sm">{tier.minShares}+ shares</p>
                        </div>
                      </div>
                      {tier.name === currentTier.name && (
                        <Badge className="bg-purple-500">Current</Badge>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {tier.benefits.slice(0, 2).join(" • ")}
                      {tier.benefits.length > 2 && ` +${tier.benefits.length - 2} more`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // WEVERSE WALLET PAGE
  // ============================================================================
  const renderWeverseWallet = () => {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Integrated Wallet</h1>
          <p className="text-gray-400 mb-4">Your stocks & Weverse Cash in one place</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Portfolio Value Card */}
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Total Portfolio Value</p>
                  <h2 className="text-white text-3xl font-bold">{formatCurrency(totalValue)}</h2>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-xs">Stock Holdings</p>
                  <p className="text-white font-bold">{formatCurrency(portfolioValue)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Cash Balance</p>
                  <p className="text-white font-bold">{formatCurrency(currentUser?.virtual_balance || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weverse Cash Card */}
          <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Weverse Cash Balance</p>
                  <h2 className="text-white text-2xl font-bold">{formatCurrency(weverseWallet.cashBalance)}</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
              {weverseWallet.pendingDividends > 0 && (
                <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">Pending Dividend</span>
                  </div>
                  <span className="text-white font-bold">+{formatCurrency(weverseWallet.pendingDividends)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dividend Preference */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-4">Dividend Preference</h3>
              <div className="space-y-3">
                {[
                  { value: "cash", label: "Cash Deposit", description: "Receive dividends as cash" },
                  { value: "weverse_cash", label: "Weverse Cash (+10%)", description: "Convert to Weverse Cash with bonus" },
                  { value: "nft", label: "NFT Collectible", description: "Receive exclusive NFT instead" }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      weverseWallet.dividendPreference === option.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    )}
                    onClick={() => setWeverseWallet({ ...weverseWallet, dividendPreference: option.value as WeverseWallet["dividendPreference"] })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{option.label}</p>
                        <p className="text-gray-400 text-sm">{option.description}</p>
                      </div>
                      {weverseWallet.dividendPreference === option.value && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-16 border-zinc-700"
              onClick={() => setCurrentView("nft-collectibles")}
            >
              <div className="flex flex-col items-center">
                <ImageIcon className="w-5 h-5 mb-1" />
                <span className="text-sm">My NFTs</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-zinc-700"
              onClick={() => setCurrentView("recurring-buys")}
            >
              <div className="flex flex-col items-center">
                <RefreshCcw className="w-5 h-5 mb-1" />
                <span className="text-sm">Auto-Invest</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // NFT COLLECTIBLES PAGE
  // ============================================================================
  const renderNftCollectibles = () => {
    const rarityColors = {
      common: "#6B7280",
      rare: "#3B82F6",
      legendary: "#F59E0B"
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("weverse-wallet")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">My TAKEs</h1>
          <p className="text-gray-400 mb-4">Your Proof of HODL collectibles</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{userNfts.length}</p>
                <p className="text-gray-400 text-xs">Total TAKEs</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {userNfts.filter(n => n.rarity === "legendary").length}
                </p>
                <p className="text-gray-400 text-xs">Legendary</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {userNfts.filter(n => n.rarity === "rare").length}
                </p>
                <p className="text-gray-400 text-xs">Rare</p>
              </CardContent>
            </Card>
          </div>

          {/* NFT Grid */}
          <div className="space-y-4">
            {userNfts.map((nft) => (
              <Card
                key={nft.id}
                className="bg-zinc-900 border-zinc-800 overflow-hidden"
              >
                <div className="flex">
                  <div
                    className="w-24 h-24 flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${rarityColors[nft.rarity]}40, ${rarityColors[nft.rarity]}20)` }}
                  >
                    <Sparkles className="w-10 h-10" style={{ color: rarityColors[nft.rarity] }} />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-bold">{nft.name}</h3>
                        <p className="text-gray-400 text-sm">{nft.artist}</p>
                      </div>
                      <Badge
                        style={{ backgroundColor: rarityColors[nft.rarity] }}
                        className="capitalize"
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{nft.description}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Acquired: {nft.quarter} ({nft.acquiredDate})
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Next TAKE */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Next TAKE Drop</p>
                  <p className="text-gray-400 text-sm">Hold through Q4 2024 to receive your next collectible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ============================================================================
  // AGM VOTING PAGE
  // ============================================================================
  const renderAgmVoting = () => {
    const handleVote = (proposalId: string, vote: "yes" | "no" | "abstain") => {
      setAgmProposals(prev =>
        prev.map(p =>
          p.id === proposalId ? { ...p, userVote: vote } : p
        )
      );
    };

    const votedCount = agmProposals.filter(p => p.userVote).length;

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("account")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">AGM Voting</h1>
          <p className="text-gray-400 mb-4">Vote on shareholder proposals</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Voting Progress */}
          <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                    <Vote className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Voting Progress</p>
                    <p className="text-gray-400 text-sm">{votedCount} of {agmProposals.length} proposals voted</p>
                  </div>
                </div>
                {votedCount === agmProposals.length && (
                  <Badge className="bg-green-500">Complete!</Badge>
                )}
              </div>
              <Progress value={(votedCount / agmProposals.length) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Proposals */}
          <div className="space-y-4">
            {agmProposals.map((proposal) => {
              const totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes;
              const yesPercent = (proposal.yesVotes / totalVotes) * 100;
              const noPercent = (proposal.noVotes / totalVotes) * 100;

              return (
                <Card key={proposal.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2 capitalize">{proposal.category}</Badge>
                        <h3 className="text-white font-bold">{proposal.title}</h3>
                      </div>
                      {proposal.userVote && (
                        <Badge className="bg-purple-500">Voted</Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{proposal.description}</p>

                    {/* Vote Distribution */}
                    <div className="mb-4">
                      <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                        <div className="bg-green-500" style={{ width: `${yesPercent}%` }} />
                        <div className="bg-red-500" style={{ width: `${noPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-green-400">Yes: {yesPercent.toFixed(1)}%</span>
                        <span className="text-red-400">No: {noPercent.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {!proposal.userVote ? (
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-400 hover:bg-green-500/20"
                          onClick={() => handleVote(proposal.id, "yes")}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleVote(proposal.id, "no")}
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          No
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-500 text-gray-400 hover:bg-gray-500/20"
                          onClick={() => handleVote(proposal.id, "abstain")}
                        >
                          Abstain
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Check className="w-4 h-4 text-green-400" />
                          You voted: <span className="text-white capitalize">{proposal.userVote}</span>
                        </span>
                        <span className="text-purple-400 text-sm flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          {proposal.reward}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RECURRING BUYS PAGE
  // ============================================================================
  const renderRecurringBuys = () => {
    const triggerLabels = {
      album_release: "Album Release",
      concert_announce: "Concert Announcement",
      weekly: "Every Week",
      monthly: "Every Month"
    };

    const handleAddRecurringBuy = () => {
      const newBuy: RecurringBuyConfig = {
        id: Date.now().toString(),
        artistGroup: newRecurringBuyArtist,
        triggerType: newRecurringBuyTrigger,
        amount: parseInt(newRecurringBuyAmount) || 10000,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setRecurringBuys([...recurringBuys, newBuy]);
      setShowNewRecurringBuyDialog(false);
      setNewRecurringBuyAmount("10000");
    };

    const toggleRecurringBuy = (id: string) => {
      setRecurringBuys(prev =>
        prev.map(buy =>
          buy.id === id ? { ...buy, isActive: !buy.isActive } : buy
        )
      );
    };

    const deleteRecurringBuy = (id: string) => {
      setRecurringBuys(prev => prev.filter(buy => buy.id !== id));
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("weverse-wallet")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold mb-2">Biased Recurring Buy</h1>
              <p className="text-gray-400">Auto-invest when your bias releases new music</p>
            </div>
            <Button
              size="sm"
              style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              onClick={() => setShowNewRecurringBuyDialog(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {recurringBuys.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8 text-center">
                <RefreshCcw className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">No Recurring Buys Yet</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Set up auto-investments triggered by your favorite artist's activities
                </p>
                <Button
                  style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
                  onClick={() => setShowNewRecurringBuyDialog(true)}
                >
                  Create Your First
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recurringBuys.map((buy) => {
                const artist = ARTIST_GROUPS.find(a => a.name === buy.artistGroup);
                return (
                  <Card key={buy.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: `linear-gradient(135deg, ${artist?.color || "#7B61FF"}, ${artist?.color || "#7B61FF"}80)` }}
                          >
                            {buy.artistGroup[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{buy.artistGroup}</p>
                            <p className="text-gray-400 text-sm">{triggerLabels[buy.triggerType]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={buy.isActive}
                            onCheckedChange={() => toggleRecurringBuy(buy.id)}
                          />
                          <button
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                            onClick={() => deleteRecurringBuy(buy.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Amount per trigger</span>
                        <span className="text-white font-bold">{formatCurrency(buy.amount)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* New Recurring Buy Dialog */}
        <Dialog open={showNewRecurringBuyDialog} onOpenChange={setShowNewRecurringBuyDialog}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">New Biased Recurring Buy</DialogTitle>
              <DialogDescription>
                Automatically invest in HYBE when your favorite artist has activities
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 mb-2 block">Select Artist</Label>
                <Select value={newRecurringBuyArtist} onValueChange={setNewRecurringBuyArtist}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTIST_GROUPS.map((artist) => (
                      <SelectItem key={artist.name} value={artist.name}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400 mb-2 block">Trigger</Label>
                <Select value={newRecurringBuyTrigger} onValueChange={(v) => setNewRecurringBuyTrigger(v as RecurringBuyConfig["triggerType"])}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="album_release">Album Release</SelectItem>
                    <SelectItem value="concert_announce">Concert Announcement</SelectItem>
                    <SelectItem value="weekly">Every Week</SelectItem>
                    <SelectItem value="monthly">Every Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400 mb-2 block">Amount (KRW)</Label>
                <Input
                  type="number"
                  value={newRecurringBuyAmount}
                  onChange={(e) => setNewRecurringBuyAmount(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewRecurringBuyDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddRecurringBuy}
                style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ============================================================================
  // FANDOM ANALYTICS PAGE
  // ============================================================================
  const renderFandomAnalytics = () => {
    const latestData = fandomData[fandomData.length - 1];
    const previousData = fandomData[fandomData.length - 2];

    const calculateChange = (current: number, previous: number) => {
      return ((current - previous) / previous) * 100;
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("education")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Fandom Analytics</h1>
          <p className="text-gray-400 mb-4">See how fan activity impacts stock performance</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Correlation Score */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Fan-Stock Correlation</p>
                  <h2 className="text-white text-4xl font-bold">{(latestData.correlation * 100).toFixed(0)}%</h2>
                  <p className="text-purple-400 text-sm mt-1">Strong positive correlation</p>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Music className="w-5 h-5 text-blue-400" />
                  <span className={cn(
                    "text-xs",
                    calculateChange(latestData.streamingCount, previousData.streamingCount) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}>
                    {calculateChange(latestData.streamingCount, previousData.streamingCount) >= 0 ? "+" : ""}
                    {calculateChange(latestData.streamingCount, previousData.streamingCount).toFixed(1)}%
                  </span>
                </div>
                <p className="text-white text-lg font-bold">
                  {(latestData.streamingCount / 1000000).toFixed(1)}M
                </p>
                <p className="text-gray-400 text-xs">Daily Streams</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Disc className="w-5 h-5 text-pink-400" />
                  <span className={cn(
                    "text-xs",
                    calculateChange(latestData.albumSales, previousData.albumSales) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}>
                    {calculateChange(latestData.albumSales, previousData.albumSales) >= 0 ? "+" : ""}
                    {calculateChange(latestData.albumSales, previousData.albumSales).toFixed(1)}%
                  </span>
                </div>
                <p className="text-white text-lg font-bold">
                  {(latestData.albumSales / 1000).toFixed(0)}K
                </p>
                <p className="text-gray-400 text-xs">Album Sales (7d)</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span className={cn(
                    "text-xs",
                    calculateChange(latestData.socialMentions, previousData.socialMentions) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}>
                    {calculateChange(latestData.socialMentions, previousData.socialMentions) >= 0 ? "+" : ""}
                    {calculateChange(latestData.socialMentions, previousData.socialMentions).toFixed(1)}%
                  </span>
                </div>
                <p className="text-white text-lg font-bold">
                  {(latestData.socialMentions / 1000000).toFixed(1)}M
                </p>
                <p className="text-gray-400 text-xs">Social Mentions</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  <span className={cn(
                    "text-xs",
                    calculateChange(latestData.stockPrice, previousData.stockPrice) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}>
                    {calculateChange(latestData.stockPrice, previousData.stockPrice) >= 0 ? "+" : ""}
                    {calculateChange(latestData.stockPrice, previousData.stockPrice).toFixed(2)}%
                  </span>
                </div>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(latestData.stockPrice)}
                </p>
                <p className="text-gray-400 text-xs">HYBE Stock Price</p>
              </CardContent>
            </Card>
          </div>

          {/* Correlation Chart */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-4">Fan Activity vs Stock Price</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fandomData.slice(-14)}>
                    <defs>
                      <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="date"
                      stroke="#71717a"
                      tick={{ fill: "#71717a", fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis stroke="#71717a" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="stockPrice"
                      stroke="#A855F7"
                      fill="url(#stockGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insight Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">AI Insight</h4>
                  <p className="text-gray-400 text-sm">
                    SEVENTEEN's recent album sales spike (+45%) has historically preceded
                    a 2-5% increase in HYBE stock within 2 weeks. Consider this pattern
                    when making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ============================================================================
  // STEP 1: SELL SHARES PAGE
  // ============================================================================
  const renderSellShares = () => {
    // Get HYBE stock data
    const hybeStock = stocks.find(s => s.symbol === "HYBE");
    const hybeHolding = portfolio.find(p => hybeStock && p.stock_id === hybeStock.id);
    const availableShares = hybeHolding?.shares || 0;
    const currentPrice = hybeStock?.current_price || 234500;
    const quantity = parseInt(sellSharesQuantity, 10) || 0;
    const estimatedProceeds = quantity * currentPrice;

    // Calculate T+2 settlement date
    const calculateSettlementDate = (): string => {
      const today = new Date();
      let businessDays = 0;
      const settlementDate = new Date(today);

      while (businessDays < 2) {
        settlementDate.setDate(settlementDate.getDate() + 1);
        const dayOfWeek = settlementDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        }
      }
      return settlementDate.toISOString().split("T")[0];
    };

    // Handle sell order execution
    const handleExecuteSellOrder = async () => {
      if (!currentUser || !hybeStock || !hybeHolding) return;

      if (quantity <= 0) {
        setSellOrderError("Please enter a valid quantity");
        return;
      }

      if (quantity > availableShares) {
        setSellOrderError("Insufficient shares");
        return;
      }

      setSellOrderProcessing(true);
      setSellOrderError("");

      try {
        const orderOrm = OrderORM.getInstance();
        const portfolioOrm = PortfolioORM.getInstance();
        const transactionOrm = TransactionORM.getInstance();
        const notificationOrm = NotificationORM.getInstance();

        // Create and execute sell order
        const newOrder: Partial<OrderModel> = {
          user_id: currentUser.id,
          stock_id: hybeStock.id,
          order_type: OrderOrderType.Market,
          side: OrderSide.Sell,
          quantity,
          price: currentPrice,
          status: OrderStatus.Executed,
          executed_price: currentPrice,
          executed_at: new Date().toISOString(),
        };

        const createdOrders = await orderOrm.insertOrder([newOrder as OrderModel]);
        const createdOrder = createdOrders[0];

        // Update portfolio
        const remainingShares = hybeHolding.shares - quantity;
        if (remainingShares <= 0) {
          await portfolioOrm.deletePortfolioById(hybeHolding.id);
        } else {
          await portfolioOrm.setPortfolioById(hybeHolding.id, {
            ...hybeHolding,
            shares: remainingShares,
          });
        }

        // Create sell order record for settlement tracking
        const executionDate = new Date().toISOString();
        const settlementDate = calculateSettlementDate();
        const sellOrderRecord: SellOrderRecord = {
          id: `sell-${Date.now()}`,
          userId: currentUser.id,
          stockId: hybeStock.id,
          stockSymbol: "HYBE",
          sharesQuantity: quantity,
          executedPrice: currentPrice,
          totalProceeds: estimatedProceeds,
          status: "PENDING_SETTLEMENT",
          executionDate,
          settlementDate,
          settlementCompleted: false,
        };

        setSellOrders(prev => [...prev, sellOrderRecord]);

        // Update cash balance (add to pending)
        setCashBalance(prev => ({
          ...prev,
          pendingBalance: prev.pendingBalance + estimatedProceeds,
        }));

        // Record transaction
        await transactionOrm.insertTransaction([{
          user_id: currentUser.id,
          order_id: createdOrder.id,
          type: TransactionType.Sell,
          amount: estimatedProceeds,
          balance_after: currentUser.virtual_balance,
        } as any]);

        // Create notification
        await notificationOrm.insertNotification([{
          user_id: currentUser.id,
          type: NotificationType.OrderExecuted,
          title: "Sell Order Executed",
          message: `Your sell order for ${quantity} HYBE shares has been executed at ${formatCurrency(currentPrice)}. Funds will settle by ${settlementDate}.`,
          is_read: false,
        } as NotificationModel]);

        queryClient.invalidateQueries();

        setShowSellConfirmation(true);
        setSellSharesQuantity("");

        // Navigate to settlement status after delay
        setTimeout(() => {
          setShowSellConfirmation(false);
          setSelectedSellOrder(sellOrderRecord);
          setCurrentView("settlement-status");
        }, 2000);
      } catch (error) {
        console.error("Failed to execute sell order:", error);
        setSellOrderError("Failed to execute sell order. Please try again.");
      } finally {
        setSellOrderProcessing(false);
      }
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("portfolio")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">H</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Sell HYBE Shares</h1>
              <p className="text-gray-400">KRX: 352820</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 my-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-purple-400 text-sm font-medium">Sell</span>
            </div>
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">2</span>
              </div>
              <span className="text-gray-500 text-sm">Settle</span>
            </div>
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">3</span>
              </div>
              <span className="text-gray-500 text-sm">Withdraw</span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Current Price Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Current HYBE Price</p>
                  <h2 className="text-white text-3xl font-bold">{formatCurrency(currentPrice)}</h2>
                  {hybeStock && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1",
                      hybeStock.current_price >= hybeStock.previous_close ? "text-green-400" : "text-red-400"
                    )}>
                      {hybeStock.current_price >= hybeStock.previous_close ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {Math.abs(((hybeStock.current_price - hybeStock.previous_close) / hybeStock.previous_close) * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Your Shares</p>
                  <p className="text-white text-2xl font-bold">{availableShares}</p>
                  <p className="text-white/60 text-sm">
                    Worth {formatCurrency(availableShares * currentPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sell Input Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-white mb-2 block">Shares to Sell</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={sellSharesQuantity}
                    onChange={(e) => {
                      setSellSharesQuantity(e.target.value);
                      setSellOrderError("");
                    }}
                    placeholder="Enter quantity"
                    className="bg-zinc-800 border-zinc-700 text-white text-lg pr-20"
                    min="1"
                    max={availableShares}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-medium"
                    onClick={() => setSellSharesQuantity(availableShares.toString())}
                  >
                    MAX
                  </button>
                </div>
                {availableShares > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    Available: {availableShares} shares
                  </p>
                )}
              </div>

              {/* Quick Select */}
              {availableShares > 0 && (
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-zinc-700"
                      onClick={() => setSellSharesQuantity(Math.floor(availableShares * percent / 100).toString())}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              )}

              {/* Estimated Proceeds */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Estimated Proceeds</span>
                  <span className="text-white text-xl font-bold">{formatCurrency(estimatedProceeds)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Settlement Date (T+2)</span>
                  <span className="text-gray-400">{calculateSettlementDate()}</span>
                </div>
              </div>

              {sellOrderError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{sellOrderError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settlement Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Settlement Period</h4>
                  <p className="text-gray-400 text-sm">
                    After your sale is executed, funds will be available for withdrawal after the T+2 settlement period (2 business days).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sell Button */}
          <Button
            className="w-full h-14 text-lg font-bold"
            style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
            onClick={handleExecuteSellOrder}
            disabled={sellOrderProcessing || quantity <= 0 || quantity > availableShares || availableShares === 0}
          >
            {sellOrderProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : availableShares === 0 ? (
              "No HYBE Shares to Sell"
            ) : (
              `Place Sell Order - ${formatCurrency(estimatedProceeds)}`
            )}
          </Button>
        </div>

        {/* Sell Confirmation Dialog */}
        <Dialog open={showSellConfirmation} onOpenChange={setShowSellConfirmation}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Order Executed!</h3>
              <p className="text-gray-400 text-center">
                Your sell order has been executed. Redirecting to settlement status...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ============================================================================
  // STEP 2: SETTLEMENT STATUS PAGE
  // ============================================================================
  const renderSettlementStatus = () => {
    // Get active sell orders that are pending settlement
    const pendingSettlementOrders = sellOrders.filter(o => o.status === "PENDING_SETTLEMENT");
    const settledOrders = sellOrders.filter(o => o.status === "SETTLED");
    const displayOrder = selectedSellOrder || pendingSettlementOrders[0];

    // Calculate time remaining until settlement
    const calculateTimeRemaining = (settlementDate: string): { days: number; hours: number; isSettled: boolean } => {
      const now = new Date();
      const settlement = new Date(settlementDate + "T15:30:00"); // KRX closes at 15:30

      const diff = settlement.getTime() - now.getTime();
      if (diff <= 0) {
        return { days: 0, hours: 0, isSettled: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return { days, hours, isSettled: false };
    };

    // Handle settlement completion (simulate)
    const handleSettlementComplete = (orderId: string) => {
      setSellOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: "SETTLED" as SellOrderStatus, settlementCompleted: true }
          : o
      ));

      // Move funds from pending to available
      const completedOrder = sellOrders.find(o => o.id === orderId);
      if (completedOrder) {
        setCashBalance(prev => ({
          ...prev,
          availableBalance: prev.availableBalance + completedOrder.totalProceeds,
          pendingBalance: prev.pendingBalance - completedOrder.totalProceeds,
        }));
      }
    };

    // Simulate settlement progress
    useEffect(() => {
      if (!displayOrder || displayOrder.status === "SETTLED") return;

      const { isSettled } = calculateTimeRemaining(displayOrder.settlementDate);

      if (isSettled) {
        handleSettlementComplete(displayOrder.id);
        return;
      }

      // Simulate progress
      const interval = setInterval(() => {
        setSettlementProgress(prev => Math.min(prev + 10, 90));
      }, 3000);

      return () => clearInterval(interval);
    }, [displayOrder]);

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("portfolio")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Settlement Status</h1>
          <p className="text-gray-400">Track your pending settlements</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 my-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">Sell</span>
            </div>
            <div className="w-8 h-0.5 bg-purple-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-purple-400 text-sm font-medium">Settle</span>
            </div>
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">3</span>
              </div>
              <span className="text-gray-500 text-sm">Withdraw</span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Settlement Info Banner */}
          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Funds Settling</h4>
                  <p className="text-gray-400 text-sm">
                    Funds from your sale are settling. This process typically takes 2 business days (T+2).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Balance Summary */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">Cash Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Available</p>
                  <p className="text-green-400 text-xl font-bold">{formatCurrency(cashBalance.availableBalance)}</p>
                  <p className="text-gray-500 text-xs mt-1">Ready for withdrawal</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-yellow-400 text-xl font-bold">{formatCurrency(cashBalance.pendingBalance)}</p>
                  <p className="text-gray-500 text-xs mt-1">Awaiting settlement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Settlements */}
          {pendingSettlementOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Pending Settlements</h3>
              {pendingSettlementOrders.map((order) => {
                const timeRemaining = calculateTimeRemaining(order.settlementDate);
                return (
                  <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 font-bold">H</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">HYBE ({order.stockSymbol})</p>
                            <p className="text-gray-500 text-sm">{order.sharesQuantity} shares @ {formatCurrency(order.executedPrice)}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Settling
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total Proceeds</span>
                          <span className="text-white font-medium">{formatCurrency(order.totalProceeds)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Execution Date</span>
                          <span className="text-gray-300">{new Date(order.executionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Settlement Date</span>
                          <span className="text-gray-300">{order.settlementDate}</span>
                        </div>

                        {/* Countdown */}
                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Time Remaining</span>
                            <span className="text-white font-medium">
                              {timeRemaining.isSettled
                                ? "Ready!"
                                : `${timeRemaining.days}d ${timeRemaining.hours}h`}
                            </span>
                          </div>
                          <Progress value={settlementProgress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Settled Orders */}
          {settledOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Settled</h3>
              {settledOrders.map((order) => (
                <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{formatCurrency(order.totalProceeds)}</p>
                          <p className="text-gray-500 text-sm">{order.sharesQuantity} shares settled</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Settled
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {pendingSettlementOrders.length === 0 && settledOrders.length === 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-white font-medium mb-2">No Pending Settlements</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sell shares to start the settlement process
                </p>
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-400"
                  onClick={() => setCurrentView("sell-shares")}
                >
                  Sell HYBE Shares
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Withdraw Button */}
          <Button
            className="w-full h-14 text-lg font-bold"
            style={{ background: cashBalance.availableBalance > 0
              ? `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})`
              : undefined
            }}
            disabled={cashBalance.availableBalance <= 0}
            onClick={() => setCurrentView("withdraw-funds")}
          >
            {cashBalance.availableBalance > 0
              ? `Withdraw ${formatCurrency(cashBalance.availableBalance)}`
              : "No Funds Available for Withdrawal"}
          </Button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // STEP 3: WITHDRAW FUNDS PAGE
  // ============================================================================
  const renderWithdrawFunds = () => {
    const amount = parseFloat(withdrawAmount) || 0;
    const maxWithdraw = cashBalance.availableBalance;
    const transferFee = 3000; // 3,000 KRW flat fee
    const netAmount = Math.max(0, amount - transferFee);

    // Handle withdrawal initiation
    const handleInitiateWithdrawal = async () => {
      if (!currentUser) return;

      if (amount <= 0) {
        setWithdrawError("Please enter a valid amount");
        return;
      }

      if (amount > maxWithdraw) {
        setWithdrawError("Insufficient available balance");
        return;
      }

      if (amount <= transferFee) {
        setWithdrawError("Amount must be greater than the transfer fee");
        return;
      }

      setWithdrawProcessing(true);
      setWithdrawError("");

      try {
        // Create withdrawal request
        const withdrawalRequest: WithdrawalRequestRecord = {
          id: `withdraw-${Date.now()}`,
          userId: currentUser.id,
          bankAccountId: linkedBankAccount.id,
          amount,
          status: "PROCESSING",
          initiatedAt: new Date().toISOString(),
          completedAt: null,
          transferFee,
          currencyConversionRate: null,
        };

        setWithdrawalRequests(prev => [...prev, withdrawalRequest]);

        // Deduct from available balance
        setCashBalance(prev => ({
          ...prev,
          availableBalance: prev.availableBalance - amount,
        }));

        // Create notification
        const notificationOrm = NotificationORM.getInstance();
        await notificationOrm.insertNotification([{
          user_id: currentUser.id,
          type: NotificationType.Announcement,
          title: "Withdrawal Initiated",
          message: `Withdrawal of ${formatCurrency(amount)} to ${linkedBankAccount.bankName} ${linkedBankAccount.accountNumberMasked} has been initiated.`,
          is_read: false,
        } as NotificationModel]);

        queryClient.invalidateQueries();

        setShowWithdrawConfirmation(true);
        setWithdrawAmount("");

        // Simulate completion after delay
        setTimeout(() => {
          setWithdrawalRequests(prev => prev.map(r =>
            r.id === withdrawalRequest.id
              ? { ...r, status: "COMPLETED" as WithdrawalStatus, completedAt: new Date().toISOString() }
              : r
          ));
        }, 5000);
      } catch (error) {
        console.error("Failed to initiate withdrawal:", error);
        setWithdrawError("Failed to initiate withdrawal. Please try again.");
      } finally {
        setWithdrawProcessing(false);
      }
    };

    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="p-6 pb-4">
          <button
            className="text-white mb-4 flex items-center"
            onClick={() => setCurrentView("settlement-status")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <h1 className="text-white text-2xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-gray-400">Transfer to your bank account</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 my-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">Sell</span>
            </div>
            <div className="w-8 h-0.5 bg-green-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">Settle</span>
            </div>
            <div className="w-8 h-0.5 bg-purple-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-purple-400 text-sm font-medium">Withdraw</span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Available Balance Card */}
          <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Available for Withdrawal</p>
                  <h2 className="text-white text-3xl font-bold">{formatCurrency(maxWithdraw)}</h2>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked Bank Account */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Transferring to</h3>
              <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{linkedBankAccount.bankName}</p>
                  <p className="text-gray-400 text-sm">{linkedBankAccount.accountNumberMasked}</p>
                </div>
                {linkedBankAccount.isVerified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Amount Input */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-white mb-2 block">Withdrawal Amount</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      setWithdrawError("");
                    }}
                    placeholder="Enter amount"
                    className="bg-zinc-800 border-zinc-700 text-white text-lg pr-20"
                    min="0"
                    max={maxWithdraw}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-medium"
                    onClick={() => setWithdrawAmount(maxWithdraw.toString())}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Quick Select */}
              {maxWithdraw > 0 && (
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-zinc-700"
                      onClick={() => setWithdrawAmount(Math.floor(maxWithdraw * percent / 100).toString())}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Withdrawal Amount</span>
                  <span className="text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Transfer Fee</span>
                  <span className="text-red-400">-{formatCurrency(transferFee)}</span>
                </div>
                <div className="border-t border-zinc-700 pt-2 flex items-center justify-between">
                  <span className="text-gray-400 font-medium">You'll Receive</span>
                  <span className="text-green-400 text-lg font-bold">{formatCurrency(netAmount)}</span>
                </div>
              </div>

              {withdrawError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{withdrawError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Time Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Transfer Timeline</h4>
                  <p className="text-gray-400 text-sm">
                    Funds typically arrive within 1-2 business days. Transfers initiated after 2 PM KST may process on the next business day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          {withdrawalRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Recent Withdrawals</h3>
              {withdrawalRequests.slice(-3).reverse().map((request) => (
                <Card key={request.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          request.status === "COMPLETED" ? "bg-green-500/20" : "bg-yellow-500/20"
                        )}>
                          {request.status === "COMPLETED" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{formatCurrency(request.amount)}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(request.initiatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn(
                        request.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      )}>
                        {request.status === "COMPLETED" ? "Complete" : "Processing"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Withdraw Button */}
          <Button
            className="w-full h-14 text-lg font-bold"
            style={{ background: maxWithdraw > 0 && amount > transferFee
              ? `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})`
              : undefined
            }}
            onClick={handleInitiateWithdrawal}
            disabled={withdrawProcessing || amount <= 0 || amount > maxWithdraw || amount <= transferFee || maxWithdraw <= 0}
          >
            {withdrawProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : maxWithdraw <= 0 ? (
              "No Funds Available"
            ) : (
              `Withdraw to Bank - ${formatCurrency(netAmount)}`
            )}
          </Button>
        </div>

        {/* Withdraw Confirmation Dialog */}
        <Dialog open={showWithdrawConfirmation} onOpenChange={setShowWithdrawConfirmation}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Withdrawal Initiated!</h3>
              <p className="text-gray-400 text-center mb-4">
                Your withdrawal to {linkedBankAccount.bankName} is being processed.
              </p>
              <p className="text-gray-500 text-sm text-center">
                Funds will arrive within 1-2 business days.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Bottom navigation
  const renderBottomNav = () => {
    if (!currentUser || ["splash", "login", "register", "forgot-password", "onboarding"].includes(currentView)) {
      return null;
    }

    const navItems = [
      { view: "portfolio" as AppView, icon: Home, label: "Portfolio" },
      { view: "trade" as AppView, icon: TrendingUp, label: "Trade" },
      { view: "markets" as AppView, icon: BarChart3, label: "Markets" },
      { view: "account" as AppView, icon: User, label: "Account" },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-40">
        <div className="flex justify-around py-2">
          {navItems.map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              className={cn(
                "flex flex-col items-center py-2 px-4 transition-colors",
                currentView === view || (view === "trade" && currentView === "stock-detail")
                  ? "text-purple-400"
                  : "text-gray-500"
              )}
              onClick={() => setCurrentView(view)}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  };

  // Main render
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full animate-pulse flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
        >
          <span className="text-white text-2xl font-bold">H</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {currentView === "splash" && renderSplash()}
      {currentView === "login" && renderLogin()}
      {currentView === "register" && renderRegister()}
      {currentView === "forgot-password" && renderForgotPassword()}
      {currentView === "onboarding" && renderOnboarding()}
      {currentView === "portfolio" && renderPortfolio()}
      {currentView === "trade" && renderTrade()}
      {currentView === "stock-detail" && renderStockDetail()}
      {currentView === "markets" && renderMarkets()}
      {currentView === "account" && renderAccount()}
      {currentView === "exclusive" && renderExclusive()}
      {currentView === "education" && renderEducation()}
      {currentView === "transaction-history" && renderTransactionHistory()}
      {currentView === "portfolio-analytics" && renderPortfolioAnalytics()}
      {currentView === "leaderboard" && renderLeaderboard()}
      {currentView === "security-settings" && renderSecuritySettings()}
      {currentView === "price-alerts" && renderPriceAlerts()}
      {currentView === "fan-vestor" && renderFanVestor()}
      {currentView === "weverse-wallet" && renderWeverseWallet()}
      {currentView === "nft-collectibles" && renderNftCollectibles()}
      {currentView === "agm-voting" && renderAgmVoting()}
      {currentView === "recurring-buys" && renderRecurringBuys()}
      {currentView === "fandom-analytics" && renderFandomAnalytics()}
      {currentView === "sell-shares" && renderSellShares()}
      {currentView === "settlement-status" && renderSettlementStatus()}
      {currentView === "withdraw-funds" && renderWithdrawFunds()}

      {showNotificationPanel && renderNotifications()}
      {renderOrderDialog()}
      {renderOrderConfirmation()}
      {renderBottomNav()}
    </div>
  );
}
