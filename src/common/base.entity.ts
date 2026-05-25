import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const BaseEntity = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.integer().primary().autoincrement(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type BaseEntity = InferEntity<typeof BaseEntity>;
