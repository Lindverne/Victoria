import pathlib

class FileExtensionConverter:

    def __init__(self, root_dir: pathlib.Path):
        self.root_dir = root_dir

    def convert_files(self, old_ext: str, new_ext: str):

        for file_path in self.root_dir.rglob(f"*{old_ext}"):

            if file_path.is_file():
                self._rename_file(file_path, new_ext)

    def _rename_file(self, file_path: pathlib.Path, new_ext: str):
        file_path.rename(file_path.with_suffix(new_ext))

if __name__ == "__main__":
    target_root = pathlib.Path(__file__).resolve().parent.parent
    converter = FileExtensionConverter(target_root)
    converter.convert_files(".html", ".php")
