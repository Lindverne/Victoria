#!/usr/bin/env python3
import re
from pathlib import Path


def format_js_file(content: str) -> str:
    lines = content.split('\n')
    formatted_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        is_control_start = False
        is_control_end = False
        is_function_decl = False
        is_import = False
        is_export = False
        is_class = False

        control_keywords = ['if', 'else', 'catch', 'try', 'while', 'for', 'switch', 'do']
        for kw in control_keywords:
            if re.match(rf'^\s*{kw}\s*[\(\{{]', stripped):
                is_control_start = True
                break
        if re.match(r'^\s*else\s+(if\s*\(|[\{\:])', stripped):
            is_control_start = True

        if re.match(r'^\s*\}\s*(else|catch|finally)?\s*[\{;]?\s*$', stripped):
            is_control_end = True

        if re.match(r'^\s*(async\s+)?function\s+\w+\s*\([^)]*\)\s*\{', stripped):
            is_function_decl = True

        if re.match(r'^\s*(const|let|var)\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>\s*\{', stripped):
            is_function_decl = True

        if re.match(r'^\s*(const|let|var)\s+\w+\s*=\s*function\s*\([^)]*\)\s*\{', stripped):
            is_function_decl = True

        if re.match(r'^\s*(export\s+)?class\s+\w+', stripped):
            is_class = True

        if re.match(r'^\s*import\s', stripped) or re.match(r'^\s*export\s', stripped):
            is_import = True

        needs_blank_before = False

        if is_control_start and formatted_lines and formatted_lines[-1].strip() != '':
            needs_blank_before = True

        if is_function_decl and formatted_lines and formatted_lines[-1].strip() != '':
            prev_stripped = formatted_lines[-1].strip()
            if not (re.match(r'^\s*(import|export)\s', prev_stripped) or
                    re.match(r'^\s*(async\s+)?function\s+\w+', prev_stripped) or
                    re.match(r'^\s*(const|let|var)\s+\w+\s*=', prev_stripped)):
                needs_blank_before = True

        if is_class and formatted_lines and formatted_lines[-1].strip() != '':
            needs_blank_before = True

        if (is_import or is_export) and formatted_lines and formatted_lines[-1].strip() != '':
            prev = formatted_lines[-1].strip()
            if not (re.match(r'^\s*(import|export)\s', prev)):
                needs_blank_before = True

        if not (is_import or is_export) and formatted_lines:
            prev = formatted_lines[-1].strip()
            if re.match(r'^\s*(import|export)\s', prev):
                needs_blank_before = True

        if needs_blank_before:
            formatted_lines.append('')

        formatted_lines.append(line)

        if is_control_end and i + 1 < len(lines) and lines[i + 1].strip() != '':
            next_stripped = lines[i + 1].strip()
            if not re.match(r'^\s*(else|catch|finally)\b', next_stripped):
                formatted_lines.append('')

        i += 1

    content = '\n'.join(formatted_lines)
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.rstrip() + '\n'

    return content


def process_file(filepath: Path) -> bool:
    try:
        original = filepath.read_text(encoding='utf-8')
        formatted = format_js_file(original)

        if original != formatted:
            filepath.write_text(formatted, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False


def main():
    project_root = Path('/srv/http/TCC/Victoria')

    js_files = list(project_root.glob('public/assets/js/**/*.js'))
    js_files = [f for f in js_files if 'backup-refatoracao' not in str(f)]
    sw_file = project_root / 'public' / 'sw.js'
    if sw_file.exists() and 'backup-refatoracao' not in str(sw_file):
        js_files.append(sw_file)

    print(f"Encontrados {len(js_files)} arquivos JS para formatar...")

    modified_count = 0
    for filepath in sorted(js_files):
        if process_file(filepath):
            print(f"  ✓ Formatado: {filepath.relative_to(project_root)}")
            modified_count += 1
        else:
            print(f"  - Sem mudanças: {filepath.relative_to(project_root)}")

    print(f"\nConcluído! {modified_count} arquivos JS modificados.")


if __name__ == '__main__':
    main()