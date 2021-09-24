import asyncio
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from adapters import import_component as import_project_sync, export_component as export_component_sync
from cotypes.common.component import Component
from cotypes.adapters import ImportedComponent, Resources

async def import_component(comp_root: Path, comp_type: str) -> ImportedComponent:
    with ProcessPoolExecutor(1) as executor:
        fut = executor.submit(import_project_sync, comp_root, comp_type)
        return await asyncio.wrap_future(fut)

async def export_component(comp: Component, data: Resources, comp_root: Path):
    with ProcessPoolExecutor(1) as executor:
        fut = executor.submit(export_component_sync, comp, data, comp_root)
        return await asyncio.wrap_future(fut)

