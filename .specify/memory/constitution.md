<!--
Sync Impact Report
- Version change: unratified scaffold (no version) -> 1.0.0
- Modified principles: template placeholders -> SIMPLICITY FIRST (YAGNI);
  SIMPLE, CLEAR DESIGN; STRUCTURED ARCHITECTURE;
  TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE); SPEC IS THE SOURCE OF TRUTH
- Added sections: none
- Removed sections: unconfigured template sections 2 and 3
- Follow-up TODOs: none
-->
# Curso-PSWE-07 Constitution

## Core Principles

### I. SIMPLICITY FIRST (YAGNI)
Implementers MUST implement only what the approved specification requires and MUST choose the
simplest solution that works. Plans MUST justify any added complexity in writing. Implementers
MUST NOT add unrequested features, abstractions, configuration options, or dependencies.
Rationale: Limiting work to demonstrated needs keeps the application simple and maintainable.

### II. SIMPLE, CLEAR DESIGN
Modules and functions MUST have a single responsibility and use clear, intention-revealing names.
Abstractions MUST NOT be introduced for a single use, and optimization MUST NOT precede a
demonstrated need. Duplication MUST be removed only when it represents genuinely repeated
behavior.
Rationale: Clear, focused code is easier to understand and change without speculative structure.

### III. STRUCTURED ARCHITECTURE
Code MUST separate UI, application logic, and persistence into clear layers. Dependencies MUST
flow from UI to application logic to persistence. UI code MUST NOT access storage directly.
Persistence MUST be hidden behind a small interface that can be replaced or faked in tests.
Rationale: Clear dependency boundaries keep screens independent of storage and enable reliable tests.

### IV. TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE)
Production code MUST be preceded by a failing test and developed using Red-Green-Refactor: make
the test pass with the minimum code, then refactor. Business logic MUST have unit tests. Each user
story MUST have at least one acceptance test that mirrors its acceptance scenarios. Tests MUST be
fast and independent.
Rationale: Test-first development verifies expected behavior while keeping changes safe to evolve.

### V. SPEC IS THE SOURCE OF TRUTH
Every implementation task MUST trace to a requirement in the approved specification. Work not
specified MUST NOT be implemented. Ambiguous requirements MUST be clarified before implementation.
Rationale: Traceability keeps delivery aligned with agreed user needs and scope.

## Governance

The constitution MUST be reviewed for compliance during planning, implementation, and code review.
Amendments MUST be proposed as a documented change and reviewed before adoption. Each amendment
MUST update this document's version and last-amended date: increment MAJOR for incompatible
principle changes, MINOR for added principles or materially expanded requirements, and PATCH for
clarifications that do not change meaning. The ratification date MUST remain the original adoption
date.

**Version**: 1.0.0 | **Ratified**: 2026-10-22 | **Last Amended**: 2026-10-22
