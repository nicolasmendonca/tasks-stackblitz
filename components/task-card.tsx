'use-client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDaysIcon, FlagIcon, TrashIcon } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { db, type Task } from '../lib/db';
import { format } from 'date-fns/format';
import { produce } from 'immer';

const updateTask = async (key: string, { arg }: { arg: { task: Task } }) => {
  await db.tasks.update(arg.task.id, arg.task);
  return arg;
};

const deleteTask = async (key: string, { arg }: { arg: { task: Task } }) => {
  await db.tasks.delete(arg.task.id);
  return undefined;
};

export default function TaskCard({
  task,
  onTaskUpdated,
  onTaskDeleted,
}: Readonly<{
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: () => void;
}>) {
  return (
    <Card>
      <CardContent className="grid gap-2 pt-6">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`checkbox-task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(newCheckedState) => {
              const updatedTask = produce(task, (draft) => {
                draft.completed = newCheckedState as boolean;
              });
              onTaskUpdated(updatedTask);
            }}
          />
          <div className="flex-1">
            <h3 className="font-medium pl-2">{task.description}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-fit px-2 h-3 text-xs font-normal"
                  >
                    <CalendarDaysIcon className="size-4 stroke-muted-foreground mr-1" />
                    {task.dueDate
                      ? `Due: ${format(task.dueDate, 'EEE P')}`
                      : `No due date`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={task.dueDate ?? undefined}
                    onSelect={(newDay) => {
                      const updatedTask = produce(task, (draft) => {
                        draft.dueDate = newDay ?? null;
                      });
                      onTaskUpdated(updatedTask);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={task.projectId ?? undefined}
                onValueChange={(newProjectValue) => {
                  const updatedTask = produce(task, (draft) => {
                    draft.projectId = newProjectValue;
                  });
                  onTaskUpdated(updatedTask);
                }}
              >
                <SelectTrigger className="h-3 group w-fit px-2 text-xs border-none hover:bg-muted">
                  <FlagIcon className="stroke-muted-foreground group-hover:stroke-accent-foreground size-4 mr-1" />
                  <SelectValue placeholder="No Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project-a">Project A</SelectItem>
                  <SelectItem value="project-b">Project B</SelectItem>
                  <SelectItem value="project-c">Project C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onTaskDeleted}>
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
