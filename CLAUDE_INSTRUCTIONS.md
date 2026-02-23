# Coding Standards

## Quick Rules (Always Active)

1. **Strict TypeScript** — `strict: true` in all tsconfigs. No `// @ts-ignore`.
2. **No `any`** — Use `unknown` + type guards when the type is truly unknown. Otherwise, define a proper type.
3. **No single-letter variables** — Except `e` in catch blocks. Use descriptive, domain-specific names.
4. **No generic names** — `data`, `result`, `item`, `info`, `list`, `value` are banned. Name what it actually is.
5. **Function size** — Max ~30 lines. If a function is longer, extract well-named helpers.
6. **Explicit return types** — All exported functions and public methods must have explicit return types.

## Guidelines Index

| Guideline | What It Covers |
|-----------|---------------|
| `docs/coding-guidelines/naming-conventions.md` | Variables, functions, files, types, constants |
| `docs/coding-guidelines/code-quality.md` | Method size, error handling, imports, magic numbers, early returns |
| `docs/coding-guidelines/checklists.md` | Anti-patterns checklist, "where does this code go?" decision tree |

## Principles (Ordered by Priority)

1. **Clarity** — Code reads like documentation. A reviewer should understand intent without comments.
2. **YAGNI** — Don't build what isn't needed yet. No speculative abstractions.
3. **SRP** — Each function/class/module has one reason to change.
4. **DRY (rule of three)** — Duplicate twice is fine. On the third occurrence, extract.
5. **Explicit over implicit** — Spell out types, name things fully, avoid cleverness.
