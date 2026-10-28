#!/usr/bin/env python3
import re
from pathlib import Path


def format_php_file(content: str) -> str:
    content = re.sub(r'(?<=\?>)\n(?=\s*<\?php)', '\n\n', content)

    def expand_php_tags(match):
        full_match = match.group(0)
        opening = match.group(1)
        closing = match.group(3)
        inner_content = match.group(2)

        if opening == '<?=':
            return full_match

        inner_content = inner_content.strip()

        if not inner_content:
            return f'{opening} {closing}'

        return f'{opening}\n\n{inner_content}\n\n{closing}'

    php_block_pattern = re.compile(r'(<\?php)(.*?)(\?>)', re.DOTALL)
    content = php_block_pattern.sub(expand_php_tags, content)

    control_keywords = [
        'if', 'else', 'elseif', 'catch', 'try',
        'while', 'for', 'foreach', 'switch', 'do'
    ]

    lines = content.split('\n')
    formatted_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        is_control_start = False
        is_control_end = False

        for kw in control_keywords:
            if re.match(rf'^\s*{kw}\s*[\(\{{]', stripped) or \
               (kw == 'else' and re.match(r'^\s*else\s*[\{\:]', stripped)) or \
               (kw == 'do' and re.match(r'^\s*do\s*[\{]', stripped)):
                is_control_start = True
                break

        if re.match(r'^\s*\}\s*$', stripped):
            is_control_end = True

        if is_control_start and formatted_lines and formatted_lines[-1].strip() != '':
            formatted_lines.append('')

        formatted_lines.append(line)

        if is_control_end and i + 1 < len(lines) and lines[i + 1].strip() != '':
            formatted_lines.append('')

        i += 1

    content = '\n'.join(formatted_lines)
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.rstrip() + '\n'

    return content


def process_file(filepath: Path) -> bool:
    try:
        original = filepath.read_text(encoding='utf-8')
        formatted = format_php_file(original)

        if original != formatted:
            filepath.write_text(formatted, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False


def main():
    project_root = Path('/srv/http/TCC/Victoria')

    php_files = []
    for pattern in ['api/**/*.php', 'public/**/*.php', 'tests/**/*.php']:
        php_files.extend(project_root.glob(pattern))

    php_files = [f for f in php_files if 'backup-refatoracao' not in str(f)]

    print(f"Encontrados {len(php_files)} arquivos PHP para formatar...")

    modified_count = 0
    for filepath in sorted(php_files):
        if process_file(filepath):
            print(f"  ✓ Formatado: {filepath.relative_to(project_root)}")
            modified_count += 1
        else:
            print(f"  - Sem mudanças: {filepath.relative_to(project_root)}")

    print(f"\nConcluído! {modified_count} arquivos modificados.")


if __name__ == '__main__':
    main()