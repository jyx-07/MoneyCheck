import { Migration } from '@mikro-orm/migrations';

export class Migration20260605035406 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "account" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "balance" numeric(12,2) not null default 0);`);

    this.addSql(`create table "category" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" text not null);`);
    this.addSql(`alter table "category" add constraint "category_type_check" check ("type" in ('INCOME', 'EXPENSE'));`);

    this.addSql(`create table "budget" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "amount" numeric(12,2) not null, "year" int not null, "month" int not null, "category_id" int not null);`);
    this.addSql(`alter table "budget" add constraint "budget_year_month_category_id_unique" unique ("year", "month", "category_id");`);

    this.addSql(`create table "transaction" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "amount" numeric(12,2) not null, "type" text not null, "date" date not null, "memo" varchar(255) null, "account_id" int not null, "category_id" int not null);`);
    this.addSql(`alter table "transaction" add constraint "transaction_type_check" check ("type" in ('INCOME', 'EXPENSE'));`);

    this.addSql(`alter table "budget" add constraint "budget_category_id_foreign" foreign key ("category_id") references "category" ("id");`);

    this.addSql(`alter table "transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "account" ("id");`);
    this.addSql(`alter table "transaction" add constraint "transaction_category_id_foreign" foreign key ("category_id") references "category" ("id");`);
  }

}
