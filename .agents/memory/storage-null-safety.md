---
name: Storage null-safety pattern
description: MemStorage create methods need ?? null for optional fields to match schema types
---

## Rule
When spreading an `Insert*` type into a `Select*` type in MemStorage `create*` methods, explicitly set each optional field with `fieldName: insertData.fieldName ?? null`.

## Why
Drizzle schema `Select` types declare optional nullable columns as `field: T | null` (not `T | null | undefined`). TypeScript spread of an `Insert*` type leaves unset optionals as `undefined`, causing a type mismatch. The `?? null` coercion resolves this.

## How to apply
Any new `createX` method in MemStorage should follow this pattern:
```ts
const record: SelectType = {
  ...insertData,
  id,
  optionalField: insertData.optionalField ?? null,
};
```
