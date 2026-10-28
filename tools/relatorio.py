import os
from typing import List

def get_file_metadata():
    return {
        'html': '🌐', 'css': '🎨', 'js': '📜', 
        'php': '🐘', 'py': '🐍', 'sql': '🗄️', 'json': '📦'
    }

def get_project_files(root_dir: str, ignore_list: set, supported_exts: set) -> List[str]:
    valid_files = []

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ignore_list]

        for file in files:
            ext = file.split('.')[-1].lower()

            if ext in supported_exts and file not in ignore_list:
                full_path = os.path.join(root, file)
                valid_files.append(os.path.relpath(full_path, root_dir))
    return valid_files

def sort_files_by_extension_and_name(files: List[str]) -> List[str]:
    return sorted(files, key=lambda x: (x.split('.')[-1].lower(), x.lower()))

def generate_tree_structure(root_dir: str, ignore_list: set) -> str:
    tree_lines = []

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ignore_list]
        level = root.replace(root_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        tree_lines.append(f"{indent}{os.path.basename(root) or 'RAIZ'}/")
        sub_indent = ' ' * 4 * (level + 1)

        for file in files:

            if file not in ignore_list:
                tree_lines.append(f"{sub_indent}{file}")
    return "\n".join(tree_lines)

def build_readme():
    project_root = os.path.abspath(os.path.join(os.getcwd(), ".."))
    output_file = os.path.join(project_root, "relatorio.md")
    
    metadata = get_file_metadata()
    supported_exts = set(metadata.keys())
    
    ignore_list = {'.git', '__pycache__', 'node_modules', 'venv', 'README.md', 'tools', 'B.py'}

    all_files = get_project_files(project_root, ignore_list, supported_exts)
    sorted_files = sort_files_by_extension_and_name(all_files)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# 📂 Relatório Estruturado do Projeto\n\n")
        
        f.write("## 🏗️ Estrutura de Diretórios\n")
        f.write("```text\n")
        f.write(generate_tree_structure(project_root, ignore_list))
        f.write("\n```\n\n---\n\n")

        f.write("## 📑 Sumário de Arquivos (Ordenado por Extensão)\n")

        for file_path in sorted_files:
            ext = file_path.split('.')[-1].lower()
            icon = metadata.get(ext, '📄')
            anchor = file_path.replace('\\', '').replace('/', '').replace('.', '').replace(' ', '-').lower()
            f.write(f"* {icon} [`{file_path}`](#{anchor})\n")
        f.write("\n---\n\n")

        f.write("## 💻 Análise do Código Fonte\n\n")

        for file_path in sorted_files:
            ext = file_path.split('.')[-1].lower()
            icon = metadata.get(ext, '📄')
            abs_path = os.path.join(project_root, file_path)
            
            try:
                size = os.path.getsize(abs_path)
                f.write(f"### {icon} {file_path}\n")
                f.write(f"- **Tamanho:** {size} bytes\n\n")
                f.write(f"```{ext}\n")

                with open(abs_path, 'r', encoding='utf-8') as code_file:
                    f.write(code_file.read())
                f.write("\n```\n\n---\n")
            except Exception as e:
                f.write(f"\n> ⚠️ Erro ao ler `{file_path}`: {e}\n\n---\n")

    print(f"[SUCESSO] relatorio.md gerado na raiz: {output_file}")

if __name__ == "__main__":
    build_readme()
