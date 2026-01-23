// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function ProjectCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-lg border border-gray-200 p-4 bg-gray-100`}
    >
      {/* 右上角菜单按钮占位 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="w-5 h-5 rounded bg-gray-200" />
      </div>

      <div className="mb-4 pr-10">
        {/* 头像占位 */}
        <div className="w-12 h-12 rounded bg-gray-200 mb-2" />

        {/* 标题占位 */}
        <div className="h-5 w-3/4 rounded bg-gray-200 mb-2" />

        {/* 描述占位 */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>

        {/* 状态和优先级标签占位 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>

        {/* 进度条占位 */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-8 rounded bg-gray-200" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 w-1/3 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* 日期占位 */}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}
