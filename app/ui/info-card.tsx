"use client";

import { StarIcon, ChevronRightIcon } from "@/app/ui/icons";
import AgButton from "@/app/ui/ag-button";

interface LocationInfo {
  city: string;
  region: string;
  country: string;
  ip: string;
  timezone: string;
}

interface DateInfo {
  weekday: string;
  dayWithSuffix: string;
}

interface TimeInfo {
  time: string;
  period: string;
  displayTime: string;
}

interface InfoCardProps {
  locationInfo: LocationInfo;
  dateInfo: DateInfo;
  timeInfo: TimeInfo;
  isSignUpMode: boolean;
  onJoinInClick: () => void;
  className?: string;
}

export default function InfoCard({
  locationInfo,
  dateInfo,
  timeInfo,
  isSignUpMode,
  onJoinInClick,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`relative w-80 h-[540px] transition-all duration-[900ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${className} ${
        isSignUpMode
          ? "transform translate-x-[-130px] translate-y-[-70px] scale-53 rotate-[7deg] opacity-70"
          : "transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
      }`}
      style={{
        zIndex: isSignUpMode ? 2 : 20,
      }}
    >
      {/* 第一层：白色背景底层 */}
      <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl">
        {/* 橙色圆形装饰 - 居中对齐 */}
        <div className="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full">
          {/* 内部装饰 */}
          <div className="absolute top-6 right-6 w-6 h-6 bg-orange-200/40 rounded-full"></div>
        </div>
      </div>
      {/* 第二层：毛玻璃效果容器 - 左侧半宽 */}
      <div className="relative z-10 w-40 h-full bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
        {/*  当前地址 */}
        <div className="absolute top-4 left-4 text-left">
          <div className="text-gray-600 text-xs font-medium">
            {locationInfo.city}
          </div>
          <div className="text-gray-500 text-xs">
            {locationInfo.region}
          </div>
        </div>

        {/* 主要内容 */}
        <div className="flex flex-col h-full">
          {/* 日期部分 */}
          <div className="mb-6 mt-8">
            <div className="text-4xl font-bold text-gray-900 leading-none">
              {dateInfo.weekday}
            </div>
            <div className="text-2xl font-light text-gray-400 mt-1">
              {dateInfo.dayWithSuffix}
            </div>
          </div>

          {/* 中间空间 */}
          <div className="flex-1"></div>

          {/* 底部信息 */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-gray-700 font-medium text-sm">
                {timeInfo.displayTime}
              </div>
              <div className="text-gray-600 text-xs">
                {locationInfo.ip}
              </div>
              <div className="text-gray-600 text-xs">
                {locationInfo.country}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <StarIcon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm brand-text">
                Star
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Join in 按钮 - 位于第一层右下角 */}
      <div className="absolute bottom-6 right-6">
        <AgButton
          variant="primary"
          size="md"
          onClick={onJoinInClick}
          icon={<ChevronRightIcon className="w-4 h-4" />}
        >
          Join in
        </AgButton>
      </div>
    </div>
  );
}
