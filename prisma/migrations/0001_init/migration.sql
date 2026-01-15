-- Create table for audit logs.
create extension if not exists "pgcrypto";

create table if not exists public.pedidos_log (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  payload jsonb not null,
  operacao text not null,
  status text not null,
  data_operacao timestamptz not null
);
