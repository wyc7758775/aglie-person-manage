"use client";

import {
  HomeIcon,
  HeartIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/lib/i18n";

const links = [
  { nameKey: "dashboard.nav.overview", href: "/dashboard/overview", icon: HomeIcon },
  { nameKey: "dashboard.nav.habits", href: "/dashboard/habits", icon: HeartIcon },
  { nameKey: "dashboard.nav.dailies", href: "/dashboard/dailies", icon: CalendarDaysIcon },
  { nameKey: "dashboard.nav.todos", href: "/dashboard/todos", icon: CheckCircleIcon },
  { nameKey: "dashboard.nav.rewards", href: "/dashboard/rewards", icon: GiftIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.nameKey}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{t(link.nameKey)}</p>
          </Link>
        );
      })}
    </>
  );
}
