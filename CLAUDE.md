<!-- governance:start -->
## Security & Governance

<!-- Generated from governance-map.toml in security-standards. Do not hand-edit. -->
<!-- Regenerate: cd ~/Projects/security-standards && make sync -->

**Build-agent class:** consumer — governed by **security-standards** (lane: detect).
**Enforcement is automatic** via global hooks (`bws-write-guard`, `bws-read-guard`, `bws-scan-gate` in `~/.claude/hooks/`). You run nothing.
**Audit on demand:** the `security-standards` skill, or `python -m security_scan.cli . --category security`.
**BWS usage** is declared in `.bws-secrets.toml` (stable UUIDs only — never token values).
<!-- governance:end -->
