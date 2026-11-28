import {
  Award, BookOpen, Clock, Globe, Headphones, Map as MapIcon, Phone,
  School, Settings, Shield, TrendingUp, Users, type LucideIcon,
} from "lucide-react";
import type { StatIcon } from "./icons";

export const ICON_MAP: Record<StatIcon, LucideIcon> = {
  school: School,
  users: Users,
  map: MapIcon,
  shield: Shield,
  headset: Headphones,
  chart: TrendingUp,
  phone: Phone,
  settings: Settings,
  book: BookOpen,
  award: Award,
  globe: Globe,
  clock: Clock,
};

export function StatIconView({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name as StatIcon] ?? Globe;
  return <Icon size={size} aria-hidden />;
}
