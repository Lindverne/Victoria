#!/usr/bin/env python3
import re
from pathlib import Path


def format_py_file(content: str) -> str:
    lines = content.split('\n')
    formatted_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        indent = len(line) - len(line.lstrip())

        is_control_start = False
        is_control_else = False
        is_control_end = False
        is_func_class = False
        is_import = False
        is_decorator = False

        control_keywords = ['if', 'while', 'for', 'try', 'with', 'match']
        for kw in control_keywords:
            if re.match(rf'^\s*{kw}\s', stripped) and stripped.endswith(':'):
                is_control_start = True
                break

        if re.match(r'^\s*(elif|else|except|finally)\s*:', stripped):
            is_control_else = True

        if re.match(r'^\s*(def|class)\s', stripped):
            is_func_class = True

        if re.match(r'^\s*@\w+', stripped):
            is_decorator = True

        if re.match(r'^\s*(import|from)\s', stripped):
            is_import = True

        if i > 0 and formatted_lines:
            prev_line = formatted_lines[-1]
            prev_indent = len(prev_line) - len(prev_line.lstrip())
            prev_stripped = prev_line.strip()

            if prev_stripped.endswith(':') and indent <= prev_indent and stripped:
                is_control_end = True

        needs_blank_before = False

        if is_control_start and formatted_lines and formatted_lines[-1].strip() != '':
            prev = formatted_lines[-1].strip()
            if not prev.startswith('@'):
                needs_blank_before = True

        if is_control_else and formatted_lines and formatted_lines[-1].strip() != '':
            needs_blank_before = True

        if is_func_class and formatted_lines:
            blank_count = 0
            for l in reversed(formatted_lines):
                if l.strip() == '':
                    blank_count += 1
                else:
                    break

            if blank_count < 2:
                needs_blank_before = True

        if is_import and formatted_lines and formatted_lines[-1].strip() != '':
            prev = formatted_lines[-1].strip()
            if not (re.match(r'^\s*(import|from)\s', prev) or prev.startswith('#')):
                needs_blank_before = True

        if not is_import and formatted_lines:
            prev = formatted_lines[-1].strip()
            if re.match(r'^\s*(import|from)\s', prev):
                needs_blank_before = True

        if needs_blank_before:
            formatted_lines.append('')

        formatted_lines.append(line)

        i += 1

    content = '\n'.join(formatted_lines)

    lines = content.split('\n')
    result_lines = []

    for i, line in enumerate(lines):
        result_lines.append(line)

        stripped = line.strip()
        if re.match(r'^\s*(def|class)\s', stripped):
            next_non_empty = None
            for j in range(i + 1, len(lines)):
                if lines[j].strip() != '':
                    next_non_empty = lines[j].strip()
                    break

            if next_non_empty and not next_non_empty.startswith('@') and not re.match(r'^\s*(def|class)\s', next_non_empty):
                blank_count = 0
                for j in range(i + 1, len(lines)):
                    if lines[j].strip() == '':
                        blank_count += 1
                    else:
                        break

                if blank_count < 2:
                    pass

    content = '\n'.join(result_lines)
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.rstrip() + '\n'

    return content


def process_file(filepath: Path) -> bool:
    try:
        original = filepath.read_text(encoding='utf-8')
        formatted = format_py_file(original)

        if original != formatted:
            filepath.write_text(formatted, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False


def main():
    project_root = Path('/srv/http/TCC/Victoria')

    py_files = list(project_root.glob('tools/*.py'))
    py_files = [f for f in py_files if 'backup-refatoracao' not in str(f)]
    py_files = [f for f in py_files if f.name not in ['formatar_php.py', 'formatar_js.py', 'formatar_css.py', 'formatar_py.py']]

    print(f"Encontrados {len(py_files)} arquivos Python para formatar...")

    modified_count = 0
    for filepath in sorted(py_files):
        if process_file(filepath):
            print(f"  ✓ Formatado: {filepath.relative_to(project_root)}")
            modified_count += 1
        else:
            print(f"  - Sem mudanças: {filepath.relative_to(project_root)}")

    print(f"\nConcluído! {modified_count} arquivos Python modificados.")


if __name__ == '__main__':
    main()