"use client";

import { Skeleton } from "antd";

export default function NotificationSkeleton() {
  const size = 64;

  return (
    <div className="space-y-4 p-4">
      {Array(3)
        .fill(0)
        .map((v, i) => (
          <Skeleton key={i} avatar={{ size }} title={false} />
        ))}
    </div>
  );
}
