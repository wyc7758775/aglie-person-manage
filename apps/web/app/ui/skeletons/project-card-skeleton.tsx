// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

/**
 * 项目卡片骨架屏
 * 用于项目列表加载状态的占位显示
 * 布局与 ProjectCard 组件保持一致
 */
export function ProjectCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-2xl border border-white/60`}
    >
      {/* 背景渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/50 to-gray-50" />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" />

      {/* 内容区域 */}
      <div className="relative p-4 flex flex-col h-full">
        {/* 头部：图标和菜单 */}
        <div className="flex items-start justify-between mb-2 flex-shrink-0">
          {/* 头像占位 */}
          <div className="w-12 h-12 rounded-xl bg-gray-200/80 backdrop-blur-sm border border-white/50" />

          {/* 右侧：进入指示 + 更多菜单 */}
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-xl bg-gray-200/60" />
            <div className="w-8 h-8 rounded-xl bg-gray-200/60" />
          </div>
        </div>

        {/* 项目名称和积分 */}
        <div className="mb-2 h-[48px] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            {/* 标题占位 */}
            <div className="h-5 w-3/4 rounded bg-gray-200/80" />
            {/* 积分徽章占位 */}
            <div className="h-7 w-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex-shrink-0" />
          </div>
        </div>

        {/* 描述 */}
        <div className="h-[40px] mb-3 flex-shrink-0 space-y-1">
          <div className="h-4 w-full rounded bg-gray-200/60" />
          <div className="h-4 w-5/6 rounded bg-gray-200/60" />
        </div>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-3 h-[26px] flex-shrink-0">
          {/* 状态标签占位 */}
          <div className="h-6 w-20 rounded-full bg-gray-200/70 border border-gray-300/30" />
          {/* 优先级标签占位 */}
          <div className="h-6 w-20 rounded-full bg-gray-200/70 border border-gray-300/30" />
        </div>

        {/* 进度条 */}
        <div className="mb-3 flex-shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="h-4 w-12 rounded bg-gray-200/60" />
            <div className="h-4 w-10 rounded bg-gray-200/60" />
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-gray-200/50">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-gray-300 to-gray-200" />
          </div>
        </div>

        {/* 截止日期区域 */}
        <div className="flex-shrink-0 h-[36px]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg h-full bg-gray-200/40">
            <div className="w-4 h-4 rounded bg-gray-300/70" />
            <div className="h-4 w-24 rounded bg-gray-300/70" />
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent" />
    </div>
  );
}

/**
 * 项目列表骨架屏
 * 显示多个项目卡片占位符
 */
export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-2" data-testid="project-skeleton">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}

export default ProjectCardSkeleton;
