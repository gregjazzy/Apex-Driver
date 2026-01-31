ALTER TABLE public.apexdriver_tasks 
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS description text;

CREATE INDEX IF NOT EXISTS apexdriver_tasks_due_date_idx ON public.apexdriver_tasks(due_date);
