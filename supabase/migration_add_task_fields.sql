-- Migration: Ajout de due_date et description aux tâches
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes due_date et description
ALTER TABLE public.apexdriver_tasks 
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS description text;

-- Créer un index pour optimiser les requêtes par date
CREATE INDEX IF NOT EXISTS apexdriver_tasks_due_date_idx ON public.apexdriver_tasks(due_date);
