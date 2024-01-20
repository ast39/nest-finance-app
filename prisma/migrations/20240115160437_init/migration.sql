-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "EPaymentType" AS ENUM ('annuitent', 'differ');

-- CreateEnum
CREATE TYPE "ECreditSubject" AS ENUM ('period', 'percent', 'amount', 'payment');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128),
    "name" VARCHAR(128),
    "status" "EUserStatus" DEFAULT 'active',
    "refresh_token" VARCHAR(128),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "credit_calculations" (
    "record_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" VARCHAR(128),
    "payment_type" "EPaymentType" NOT NULL DEFAULT 'annuitent',
    "subject" "ECreditSubject" NOT NULL DEFAULT 'payment',
    "amount" DOUBLE PRECISION,
    "percent" DOUBLE PRECISION,
    "period" INTEGER,
    "payment" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_calculations_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "credit_checkings" (
    "record_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" VARCHAR(128),
    "amount" DOUBLE PRECISION,
    "percent" DOUBLE PRECISION,
    "period" INTEGER,
    "payment" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_checkings_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "credits" (
    "credit_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "creditor" VARCHAR(128) NOT NULL,
    "amount" DOUBLE PRECISION,
    "percent" DOUBLE PRECISION,
    "period" INTEGER,
    "payment" DOUBLE PRECISION,
    "opened_at" TIMESTAMPTZ(3) NOT NULL,
    "payment_day" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("credit_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "credit_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payed_day" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "credit_calculations" ADD CONSTRAINT "credit_calculations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_checkings" ADD CONSTRAINT "credit_checkings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "credits"("credit_id") ON DELETE RESTRICT ON UPDATE CASCADE;
