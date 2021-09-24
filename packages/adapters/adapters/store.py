from pathlib import Path

from cotypes.adapters import StorePath
from adapters.store_drivers import drivers

def store(local_path: Path, driver_name: str, fallback_driver: str = 'local') -> str:
    if driver_name not in drivers:
        driver = drivers[fallback_driver]
    driver = drivers[driver_name]
    try:
        store_path = driver.store(local_path)
    except RuntimeError:
        store_path = drivers[fallback_driver].store(local_path)
    return str(store_path)

def dump(store_path_str: str, target_dir: Path):
    store_path = StorePath.from_str(store_path_str)
    driver = drivers[store_path.driver]
    driver.dump(store_path.path, store_path.hash, target_dir)

