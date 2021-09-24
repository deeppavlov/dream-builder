from typing import Dict

from .git import GitDriver
from .local import LocalDriver
from cotypes.adapters import StoreDriver

drivers: Dict[str, StoreDriver] = {
    'local': LocalDriver(),
    'git': GitDriver()
}
