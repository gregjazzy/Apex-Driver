ALTER TABLE public.apexdriver_tasks 
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

UPDATE public.apexdriver_tasks 
SET progress = CASE 
  WHEN status = true THEN 100 
  ELSE 0 
END
WHERE progress IS NULL;
