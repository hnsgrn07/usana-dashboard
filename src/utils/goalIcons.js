// goalIcons.js
// Maps each health goal to a representative icon, used anywhere
// goals are displayed (profile form chips, dashboard summary)
import {
  Zap, ShieldCheck, Dumbbell, Salad, HeartPulse, Scale,
  Waves, Moon, Sparkles, Brain, Leaf, Eye, Bone, Droplet, User
} from "lucide-react";

export const GOAL_ICONS = {
  energy_support: Zap,
  immune_support: ShieldCheck,
  joint_support: Dumbbell,
  digestive_health: Salad,
  heart_health: HeartPulse,
  weight_management: Scale,
  stress_management: Waves,
  sleep_quality: Moon,
  skin_health: Sparkles,
  cognitive_support: Brain,
  general_wellness: Leaf,
  eye_health: Eye,
  bone_health: Bone,
  detox_support: Droplet,
  mens_health: User,
};