import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const BaseEntity = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.integer().primary().autoincrement(),
    createdAt: p.datetime(),
    updatedAt: p.datetime().onUpdate(() => new Date()),
  },
});

export type BaseEntity = InferEntity<typeof BaseEntity>;
