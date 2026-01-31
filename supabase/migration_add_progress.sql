-- Migration: Ajout du champ progress (avancement en %)
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne progress (pourcentage 0-100)
ALTER TABLE public.apexdriver_tasks 
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Mettre à jour les tâches existantes : si status=true alors 100%, sinon 0%
UPDATE public.apexdriver_tasks 
SET progress = CASE 
  WHEN status = true THEN 100 
  ELSE 0 
END
WHERE progress IS NULL;
