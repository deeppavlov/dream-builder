import os, asyncio
from glob import glob
from pathlib import Path
from typing import List, Union
from fastapi import APIRouter, Depends, HTTPException

from api_server.db import DB, NotFoundError
from adapters.concurrent import import_component, export_component
from adapters.registry import get_supported_components
from cotypes.common import Project, Component, NewComponent, ImportComponent 

router = APIRouter(prefix='/projects')

@router.get("/", response_model=List[Project])
async def list_projects(db: DB = Depends()):
    return await db.list_projects()

@router.post("/", response_model=Project)
async def create_project(new_project: Project, db: DB = Depends()):
    try:
        proj = await db.get_project(new_project.name)
        if proj:
            raise HTTPException(status_code=400, detail=f"Project with name '{new_project.name}' already exists")
    except NotFoundError:
        pass
    created_proj = await db.create_project(new_project)
    proj_path = Path(new_project.export_root)
    if proj_path.exists():
        comp_types = get_supported_components()
        for comp_dir in glob(str(proj_path / '*' / '*') + os.path.sep):
            comp_path = Path(comp_dir)
            comp_type = next((t for t in comp_types if t in comp_path.name), None)
            if comp_type is not None:
                data = await import_component(comp_path, comp_type)
                new_comp = NewComponent(
                    type=comp_type,
                    label=comp_path.name,
                    group=comp_path.parent.name,
                    template_link=str(comp_path.absolute()))
                created_comp = await db.create_component(new_project.name, new_comp)
                await db.import_data(created_comp['id'], data)
    else:
        os.makedirs(proj_path)
    return created_proj

@router.get("/{project_name}", response_model=Project)
async def get_project(project_name: str, db: DB = Depends()):
    return await db.get_project(project_name)

@router.get("/{project_name}/components", response_model=List[Component])
async def list_components(project_name: str, db: DB = Depends()):
    return await db.list_components(project_name)

@router.post("/{project_name}/components", response_model=Component)
async def create_component(project_name: str, new_comp: Union[NewComponent, ImportComponent], db: DB = Depends()):
    proj = await db.get_project(project_name)
    if isinstance(new_comp, NewComponent):
        created_comp = await db.create_component(project_name, new_comp)
        data = {}
    else:
        import_path = Path(new_comp.import_path)
        data = await import_component(import_path, new_comp.type)
        if data is None:
            raise HTTPException(status_code=400, detail="Couldn't find importer for the component")
        data = data
        comp = NewComponent(
            type=new_comp.type,
            label=import_path.name,
            group=new_comp.group,
            template_link=str(import_path.absolute()))
        created_comp = await db.create_component(project_name, comp)
        await db.import_data(created_comp['id'], data)
    comp = Component(**created_comp)
    comp_path = Path(proj['export_root']) / comp.group / comp.label
    asyncio.create_task(export_component(comp, data, comp_path))
    return created_comp
