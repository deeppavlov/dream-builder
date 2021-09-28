import os, subprocess, logging
from tempfile import TemporaryDirectory
from pathlib import Path
from zipfile import ZipFile
from cotypes.adapters import StorePath, StoreDriver

class DirtyRepoError(Exception):
    pass

class GitDriver(StoreDriver):
    def store(self, path: Path) -> StorePath:
        diff_proc = subprocess.run(["git", "diff-index", "--quiet", "HEAD", "--"], cwd=path)
        if diff_proc.returncode != 0:
            raise DirtyRepoError("The repository contains uncommited changes. Commit or stash and try again!")
        revaprse_proc = subprocess.run(["git", "rev-parse", "HEAD"], cwd=path, capture_output=True, text=True)
        if revaprse_proc.returncode != 0:
            raise RuntimeError(f"{path} is not inside a git repo")
        hash = revaprse_proc.stdout.strip()
        return StorePath(driver="git", path=str(path), hash=hash)

    def dump(self, path: str, hash: str, target_dir: Path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"{path} not found")
        if not target_dir.exists():
            os.makedirs(target_dir)
        with TemporaryDirectory() as tempdir:
            zip_path = Path(tempdir) / "dump.zip"
            git_proc = subprocess.run(["git", "archive", "-o", str(zip_path.absolute()), hash], cwd=path, capture_output=True, text=True)
            if git_proc.returncode != 0 or not zip_path.exists():
                logging.error(f"Git archive failed:\n{git_proc.stderr}")
                raise RuntimeError(f"Dumping {path}@{hash} failed")
            
            with ZipFile(zip_path) as zip:
                zip.extractall(target_dir)

