import {
  CalendarDays,
  Camera,
  ChartColumn,
  Clapperboard,
  Compass,
  Handshake,
  Heart,
  Lightbulb,
  Megaphone,
  MessagesSquare,
  Palette,
  PenTool,
  Presentation,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'

import type {ServiceIconValue} from '@/sanity/lib/constants'

/** Maps the icon names an editor can pick in the Studio to lucide components. */
const ICONS: Record<ServiceIconValue, LucideIcon> = {
  megaphone: Megaphone,
  'calendar-days': CalendarDays,
  'pen-tool': PenTool,
  camera: Camera,
  clapperboard: Clapperboard,
  'chart-column': ChartColumn,
  'trending-up': TrendingUp,
  'users-round': UsersRound,
  'messages-square': MessagesSquare,
  target: Target,
  sparkles: Sparkles,
  palette: Palette,
  handshake: Handshake,
  lightbulb: Lightbulb,
  rocket: Rocket,
  compass: Compass,
  presentation: Presentation,
  heart: Heart,
}

interface ServiceIconProps extends Omit<LucideProps, 'name'> {
  name: string | null | undefined
}

export function ServiceIcon({name, ...props}: ServiceIconProps) {
  const Icon = (name && ICONS[name as ServiceIconValue]) || Sparkles
  return <Icon aria-hidden {...props} />
}
