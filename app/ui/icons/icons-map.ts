import { 
  UserIcon, LockIcon, EyeOffIcon, EyeIcon, ChevronRightIcon, StarIcon,
  DashboardIcon, ProjectIcon, TaskIcon, DatabaseIcon, NotificationIcon,
  SettingsIcon, LogoutIcon, DailiesIcon, HabitsIcon, TodosIcon, RewardIcon,
  DefectIcon, CalendarIcon, ClockIcon, ArrowRightIcon, ArrowLeftIcon,
  ArrowPathIcon, ArrowSolidIcon, CheckIcon, PencilIcon, PlusIcon, TrashIcon,
  PowerIcon, MagnifyingGlassIcon, XMarkIcon
} from './index';

export const Icons = {
  user: UserIcon,
  lock: LockIcon,
  eyeOff: EyeOffIcon,
  eye: EyeIcon,
  chevronRight: ChevronRightIcon,
  star: StarIcon,
  dashboard: DashboardIcon,
  project: ProjectIcon,
  task: TaskIcon,
  database: DatabaseIcon,
  notification: NotificationIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
  dailies: DailiesIcon,
  habits: HabitsIcon,
  todos: TodosIcon,
  reward: RewardIcon,
  defect: DefectIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  arrowPath: ArrowPathIcon,
  arrowSolid: ArrowSolidIcon,
  check: CheckIcon,
  pencil: PencilIcon,
  plus: PlusIcon,
  trash: TrashIcon,
  power: PowerIcon,
  magnifyingGlass: MagnifyingGlassIcon,
  xMark: XMarkIcon,
} as const;

export type IconName = keyof typeof Icons;
