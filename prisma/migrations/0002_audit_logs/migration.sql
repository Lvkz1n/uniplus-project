-- Create generic API log table.
CREATE TABLE "api_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "recurso" text NOT NULL,
  "rota" text,
  "metodo" text,
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- Create per-resource log tables.
CREATE TABLE "entidades_log" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "entidades_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "produtos_log" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "produtos_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ordens_servico_log" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "ordens_servico_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_log" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "health_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "empresas_log" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "codigo" text,
  "payload" jsonb NOT NULL,
  "operacao" text NOT NULL,
  "status" text NOT NULL,
  "data_operacao" timestamptz(6) NOT NULL,
  CONSTRAINT "empresas_log_pkey" PRIMARY KEY ("id")
);
