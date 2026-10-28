#!/usr/bin/env python3
import re
from pathlib import Path


def format_css_file(content: str) -> str:
    lines = content.split('\n')
    formatted_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        is_rule_start = False
        is_rule_end = False
        is_at_rule = False
        is_section_comment = False

        if re.match(r'^[^{]*\{', stripped) and not stripped.startswith('@') and not stripped.startswith('/*'):
            is_rule_start = True

        if re.match(r'^\}\s*$', stripped):
            is_rule_end = True

        if re.match(r'^\s*@(media|keyframes|supports|import|font-face|namespace|page|viewport|charset|layer|property|starting-style|counter-style|font-feature-values|font-palette-values|swash|annotation|color-profile)\b', stripped):
            is_at_rule = True

        if is_at_rule and re.match(r'^\}\s*$', stripped):
            is_rule_end = True

        if re.match(r'^/\*\s*[=-]{3,}.*[=-]{3,}\s*\*/$', stripped) or \
           re.match(r'^/\*\s*(===|---|\*{3,}).*\*/$', stripped):
            is_section_comment = True

        needs_blank_before = False

        if is_rule_start and formatted_lines and formatted_lines[-1].strip() != '':
            prev = formatted_lines[-1].strip()
            if not (prev.startswith('/*') or prev.startswith('@')):
                needs_blank_before = True

        if is_at_rule and formatted_lines and formatted_lines[-1].strip() != '':
            prev = formatted_lines[-1].strip()
            if not (prev.startswith('/*') or prev.startswith('@')):
                needs_blank_before = True

        if is_section_comment and formatted_lines and formatted_lines[-1].strip() != '':
            needs_blank_before = True

        if needs_blank_before:
            formatted_lines.append('')

        formatted_lines.append(line)

        if is_rule_end and i + 1 < len(lines) and lines[i + 1].strip() != '':
            next_stripped = lines[i + 1].strip()
            if not (next_stripped.startswith('}') or next_stripped.startswith('/*')):
                formatted_lines.append('')

        if is_at_rule and re.match(r'^\s*@import\b', stripped) and i + 1 < len(lines) and lines[i + 1].strip() != '':
            formatted_lines.append('')

        i += 1

    content = '\n'.join(formatted_lines)
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.rstrip() + '\n'

    return content


def process_file(filepath: Path) -> bool:
    try:
        original = filepath.read_text(encoding='utf-8')
        formatted = format_css_file(original)

        if original != formatted:
            filepath.write_text(formatted, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False


def main():
    project_root = Path('/srv/http/TCC/Victoria')

    css_files = list(project_root.glob('public/assets/css/**/*.css'))
    css_files = [f for f in css_files if 'backup-refatoracao' not in str(f)]

    print(f"Encontrados {len(css_files)} arquivos CSS para formatar...")

    modified_count = 0
    for filepath in sorted(css_files):
        if process_file(filepath):
            print(f"  ✓ Formatado: {filepath.relative_to(project_root)}")
            modified_count += 1
        else:
            print(f"  - Sem mudanças: {filepath.relative_to(project_root)}")

    print(f"\nConcluído! {modified_count} arquivos CSS modificados.")


if __name__ == '__main__':
    main()