import shutil
from pathlib import Path
from cotypes.adapters import StorePath, StoreDriver


class LocalDriver(StoreDriver):
    def store(self, path: Path) -> StorePath:
        return StorePath.from_path(path.absolute())

    def dump(self, path: str, hash: str, target_dir: Path):
        shutil.copytree(path, target_dir)
