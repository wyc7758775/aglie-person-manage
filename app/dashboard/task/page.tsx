"use client";

import SectionContainer from "@/app/ui/dashboard/section-container";
import { UserIcon, CalendarIcon, ClockIcon } from "@/app/ui/icons";
import { clsx } from "clsx";
import { useLanguage } from "@/app/lib/i18n";

type TaskStatus = "todo" | "in_progress" | "review" | "done";

type TaskPriority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  tags: string[];
}

function generateSampleTasks(): Task[] {
  return [
    {
      id: "1",
      title: "User Login Feature",
      description: "Implement user login, registration and password reset",
      status: "in_progress",
      priority: "high",
      assignee: "Zhang San",
      dueDate: "2024-01-15",
      estimatedHours: 16,
      completedHours: 8,
      tags: ["Frontend", "Auth"],
    },
    {
      id: "2",
      title: "API Documentation",
      description: "Write complete API documentation with examples",
      status: "todo",
      priority: "medium",
      assignee: "Li Si",
      dueDate: "2024-01-20",
      estimatedHours: 12,
      completedHours: 0,
      tags: ["Documentation", "Backend"],
    },
    {
      id: "3",
      title: "Database Optimization",
      description: "Optimize query performance and add indexes",
      status: "review",
      priority: "high",
      assignee: "Wang Wu",
      dueDate: "2024-01-18",
      estimatedHours: 20,
      completedHours: 18,
      tags: ["Database", "Performance"],
    },
    {
      id: "4",
      title: "Mobile Adaptation",
      description: "Ensure good experience on mobile devices",
      status: "done",
      priority: "medium",
      assignee: "Zhao Liu",
      dueDate: "2024-01-10",
      estimatedHours: 24,
      completedHours: 24,
      tags: ["Frontend", "Mobile"],
    },
    {
      id: "5",
      title: "Security Fix",
      description: "Fix discovered security vulnerabilities",
      status: "todo",
      priority: "urgent",
      assignee: "Qian Qi",
      dueDate: "2024-01-12",
      estimatedHours: 8,
      completedHours: 0,
      tags: ["Security", "Fix"],
    },
  ];
}

function TaskCard({ task }: { task: Task }) {
  const { t } = useLanguage();

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  };

  const progress = (task.completedHours / task.estimatedHours) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <span
            className={clsx(
              "px-2 py-1 rounded-full text-xs font-medium",
              priorityColors[task.priority],
            )}
          >
            {t(`task.priority.${task.priority}`)}
          </span>
          <span
            className={clsx(
              "px-2 py-1 rounded-full text-xs font-medium",
              statusColors[task.status],
            )}
          >
            {t(`task.filters.${task.status}`)}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{task.dueDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>
            {task.completedHours}/{task.estimatedHours}h
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t("task.progress")}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { t } = useLanguage();
  const tasks = generateSampleTasks();

  const filters = [
    t("task.filters.all"),
    t("task.filters.todo"),
    t("task.filters.inProgress"),
    t("task.filters.review"),
    t("task.filters.done"),
  ];

  return (
    <div className="space-y-6">
      <SectionContainer
        title={t("task.title")}
        badge={tasks.length}
        filters={filters}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
