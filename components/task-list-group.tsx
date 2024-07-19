'use client';

import TaskCard from './task-card';
import type { Task } from '../lib/db';

type Props = Readonly<{
  onTaskDeleted: () => void;
  group: {
    id: string;
    name: string;
    noTasksLabel: string;
    getTaskIds: () => Task['id'][];
  };
}>;

export default function TaskListGroup(props: Props) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{props.group.name}</h2>
      <div className="space-y-2">
        {props.group.getTaskIds().map((taskId) => (
          <TaskCard
            key={taskId}
            taskId={taskId}
            onTaskDeleted={props.onTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
}
