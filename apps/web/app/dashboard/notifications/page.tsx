"use client";

import SectionContainer from '@/app/ui/dashboard/section-container';
import { NotificationIcon, UserIcon, CalendarIcon, CheckIcon, XMarkIcon } from '@/app/ui/icons';
import { clsx } from 'clsx';


// 通知类型
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';

// 通知状态
type NotificationStatus = 'unread' | 'read' | 'archived';

// 通知接口
interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  sender?: string;
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
}

// 生成示例通知数据
function generateSampleNotifications(): Notification[] {
  return [
    {
      id: '1',
      title: '新任务分配',
      message: '您被分配了一个新的任务：用户登录功能开发',
      type: 'info',
      status: 'unread',
      sender: '项目经理',
      timestamp: '2024-01-15 10:30',
      actionUrl: '/dashboard/task',
      actionText: '查看任务'
    },
    {
      id: '2',
      title: '缺陷修复完成',
      message: '您报告的缺陷 DEF-001 已经修复完成，请进行验证',
      type: 'success',
      status: 'unread',
      sender: '开发团队',
      timestamp: '2024-01-15 09:15',
      actionUrl: '/dashboard/defect',
      actionText: '验证缺陷'
    },
    {
      id: '3',
      title: '截止日期提醒',
      message: '项目需求文档将在明天截止，请及时提交',
      type: 'warning',
      status: 'read',
      sender: '系统提醒',
      timestamp: '2024-01-14 16:00',
      actionUrl: '/dashboard/requirement',
      actionText: '查看需求'
    },
    {
      id: '4',
      title: '系统维护通知',
      message: '系统将于今晚22:00-24:00进行维护，期间可能无法访问',
      type: 'error',
      status: 'read',
      sender: '系统管理员',
      timestamp: '2024-01-14 14:30'
    },
    {
      id: '5',
      title: '每日任务提醒',
      message: '您今天还有3个每日任务未完成，记得及时处理哦！',
      type: 'reminder',
      status: 'unread',
      sender: '系统提醒',
      timestamp: '2024-01-15 08:00',
      actionUrl: '/dashboard/dailies',
      actionText: '完成任务'
    },
    {
      id: '6',
      title: '团队会议邀请',
      message: '您被邀请参加明天上午10:00的项目评审会议',
      type: 'info',
      status: 'read',
      sender: '会议组织者',
      timestamp: '2024-01-13 15:45'
    },
    {
      id: '7',
      title: '奖励获得',
      message: '恭喜！您完成了本周的所有习惯任务，获得了50积分奖励',
      type: 'success',
      status: 'archived',
      sender: '系统奖励',
      timestamp: '2024-01-12 18:00',
      actionUrl: '/dashboard/rewards',
      actionText: '查看奖励'
    }
  ];
}

// 通知卡片组件
function NotificationCard({ notification, onMarkAsRead, onArchive }: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const typeColors = {
    info: 'bg-blue-50 border-l-blue-400 text-blue-800',
    success: 'bg-green-50 border-l-green-400 text-green-800',
    warning: 'bg-yellow-50 border-l-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-l-red-400 text-red-800',
    reminder: 'bg-purple-50 border-l-purple-400 text-purple-800'
  };

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    reminder: '⏰'
  };

  const isUnread = notification.status === 'unread';

  return (
    <div className={clsx(
      'p-4 rounded-lg border-l-4 border border-gray-200 hover:shadow-md transition-shadow',
      typeColors[notification.type],
      isUnread ? 'bg-opacity-100' : 'bg-opacity-50'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeIcons[notification.type]}</span>
          <h3 className={clsx(
            'font-semibold',
            isUnread ? 'text-gray-900' : 'text-gray-600'
          )}>
            {notification.title}
          </h3>
          {isUnread && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
        <div className="flex gap-1">
          {isUnread && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="标记为已读"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onArchive(notification.id)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="归档"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className={clsx(
        'mb-3',
        isUnread ? 'text-gray-700' : 'text-gray-500'
      )}>
        {notification.message}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {notification.sender && (
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span>{notification.sender}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{notification.timestamp}</span>
          </div>
        </div>
        
        {notification.actionUrl && notification.actionText && (
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
            {notification.actionText}
          </button>
        )}
      </div>
    </div>
  );
}

// 主页面组件
export default function NotificationsPage() {
  const notifications = generateSampleNotifications();
  
  const filters = ['全部', '未读', '已读', '已归档'];
  
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleMarkAsRead = (id: string) => {
    console.log('标记为已读:', id);
    // 这里应该调用API更新通知状态
  };

  const handleArchive = (id: string) => {
    console.log('归档通知:', id);
    // 这里应该调用API归档通知
  };

  const handleMarkAllAsRead = () => {
    console.log('标记全部为已读');
    // 这里应该调用API标记所有通知为已读
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">通知中心</h1>
          <p className="text-gray-600">
            管理您的系统通知和提醒消息
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            全部标记为已读
          </button>
        )}
      </div>

      <SectionContainer
          title="通知中心"
          badge={notifications.length}
          filters={filters}
        >
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onArchive={handleArchive}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                <NotificationIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
              <p className="text-gray-500">
                当有新的通知时，它们会显示在这里
              </p>
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
