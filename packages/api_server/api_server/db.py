import json, hashlib
import databases
import sqlalchemy as sa
from typing import List, Dict, Optional, Mapping, Union
from collections import defaultdict
from sqlalchemy import select, Column, Integer, String, Enum, ForeignKey, JSON, DateTime

from cotypes.common.training import Status as TrainStatus
from cotypes.common import Project, NewComponent

class NotFoundError(Exception):
    pass

metadata = sa.MetaData()

projects = sa.Table(
    'projects',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String, unique=True),
    Column('export_root', String)
)

components = sa.Table(
    'components',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('project_id', ForeignKey('projects.id')),
    Column('type', String),
    Column('label', String),
    Column('group', String),
    Column('template_link', String),
    Column('data_hash', String)
)

trainings = sa.Table(
    'trainings',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('data_hash', String),
    Column('timestamp', DateTime, server_default=sa.func.now()),
    Column('component_id', ForeignKey('components.id')),
    Column('status', Enum(TrainStatus)),
    Column('template_link', String),
    Column('trained_model_link', String),
)

messages = sa.Table(
    'messages',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('training_id', ForeignKey('trainings.id')),
    Column('timestamp', DateTime, server_default=sa.func.now()),
    Column('request', JSON),
    Column('response', JSON)
)

data = sa.Table(
    'data',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('type', String),
    Column('component_id', ForeignKey('components.id')),
    Column('content', JSON),
    Column('hash', String)
)

data_archive = sa.Table(
    'data_archive',
    metadata,
    Column('rev_id', Integer, primary_key=True),
    Column('training_id', ForeignKey('trainings.id')),
    Column('id', Integer),
    Column('type', String),
    Column('content', JSON)
)

class DB:
    def __init__(self, database_url: str):
        self.db = databases.Database(database_url)

        engine = sa.create_engine(
            database_url, connect_args={"check_same_thread": False}
        )
        metadata.create_all(engine)

    async def connect(self):
        await self.db.connect()

    async def disconnect(self):
        await self.db.disconnect()


    ## PROJECTS
    async def list_projects(self):
        query = select(projects)
        return await self.db.fetch_all(query)

    async def get_project(self, proj_name: str):
        return await self._get_one(projects, projects.c.name == proj_name)

    async def get_project_by_id(self, proj_id: int):
        return await self._get_one(projects, projects.c.id == proj_id)

    async def create_project(self, new_project: Project):
        query = projects.insert().values(**new_project.dict())
        await self.db.execute(query)
        return new_project


    ## COMPONENTS
    async def list_components(self, proj_name: str):
        query = components.select().select_from(
            components.join(projects)
        ).where(projects.c.name == proj_name)
        return await self.db.fetch_all(query)

    async def get_component(self, comp_id: int):
        return await self._get_one(components, components.c.id == comp_id)

    async def create_component(self, proj_name: str, new_comp: NewComponent):
        proj = await self.get_project(proj_name)
        ins_query = components.insert().values(project_id=proj['id'], **new_comp.dict())
        new_comp_id = await self.db.execute(ins_query)
        return {'id': new_comp_id, **new_comp.dict()}


    ## TRAININGS
    async def list_trainings(self, comp_id: int):
        query = trainings.select().where(trainings.c.component_id == comp_id)
        return await self.db.fetch_all(query)
        
    async def get_training(self, train_id: int):
        return await self._get_one(trainings, trainings.c.id == train_id)

    async def get_training_by_hash(self, comp_id: int, hash: str):
        conds = [
            trainings.c.data_hash == hash,
            trainings.c.component_id == comp_id
        ]
        return await self._get_one(trainings, *conds)

    async def create_training(self, comp_id: int, template_link: str):
        async with self.db.transaction():
            comp = await self.get_component(comp_id)
            query = trainings.insert().values(
                data_hash=comp['data_hash'],
                component_id=comp_id,
                status=TrainStatus.RUNNING,
                template_link=template_link
            )
            train_id = await self.db.execute(query)
            comp_data = await self.list_data(comp_id)
            data_ins_query = data_archive.insert()
            new_data_values = [
                dict(
                    training_id=train_id,
                    id=item['id'],
                    type=item['type'],
                    content=item['content']
                ) for item in comp_data
            ]
            await self.db.execute_many(data_ins_query, new_data_values)
            return train_id

    async def update_training_status(self, train_id: int, new_status: TrainStatus):
        query = trainings.update().where(trainings.c.id == train_id).values(status=new_status)
        await self.db.execute(query)

    ## MESSAGES
    async def list_messages(self, train_id: int):
        query = messages.select().where(messages.c.training_id == train_id)
        return await self.db.fetch_all(query)

    async def create_message(self, train_id: int, request: Dict, response: Dict):
        query = messages.insert().values(
            training_id=train_id,
            request=request,
            response=response
        )
        return await self.db.execute(query)


    ## DATA
    async def list_data(self, comp_id: int, data_type: Optional[str] = None):
        conds = [data.c.component_id == comp_id]
        if data_type is not None:
            conds.append(data.c.type == data_type)
        query = data.select().where(*conds)
        return await self.db.fetch_all(query)

    async def list_all_component_data(self, comp_id: int):
        all_data = await self.list_data(comp_id)
        return self._sort_data_into_dict(all_data)

    async def get_data(self, data_id: int):
        return await self._get_one(data, data.c.id == data_id)

    async def create_data(self, comp_id: int, data_type: str, data_cont: Dict):
        async with self.db.transaction():
            hash = self._hash_data(data_cont)
            query = data.insert().values(
                type=data_type,
                component_id=comp_id,
                content=data_cont,
                hash=hash)
            data_id = await self.db.execute(query)
            await self._update_component_hash(comp_id)
            return data_id

    async def import_data(self, comp_id: int, import_data: Dict[str, List[Dict]], keep_old_data: bool = True):
        async with self.db.transaction():
            if not keep_old_data:
                del_query = data.delete().where(
                    data.c.component_id == comp_id
                )
                await self.db.execute(del_query)
            insert_values = []
            for data_type, items_list in import_data.items():
                for item in items_list:
                    hash = self._hash_data(item)
                    insert_values.append(dict(
                        type=data_type,
                        component_id=comp_id,
                        content=item,
                        hash=hash))
            ins_query = data.insert()
            await self.db.execute_many(ins_query, insert_values)
            await self._update_component_hash(comp_id)

    async def update_data(self, data_id: int, new_cont: Dict):
        async with self.db.transaction():
            hash = self._hash_data(new_cont)
            query = data.update().where(data.c.id == data_id).values(content=new_cont, hash=hash)
            await self.db.execute(query)
            data_item = await self.get_data(data_id)
            await self._update_component_hash(data_item['component_id'])
            return data_item

    async def delete_data(self, data_id: int):
        async with self.db.transaction():
            deleted_item = await self.get_data(data_id)
            query = data.delete().where(data.c.id == data_id)
            await self.db.execute(query)
            await self._update_component_hash(deleted_item['component_id'])


    ## DATA ARCHIVE
    async def list_training_data(self, train_id: int, data_type: Optional[str] = None):
        conds = [data_archive.c.training_id == train_id]
        if data_type is not None:
            conds.append(data_archive.c.type == data_type)
        query = data_archive.select().where(*conds)
        return await self.db.fetch_all(query)

    async def list_all_training_data(self, train_id: int):
        all_data = await self.list_training_data(train_id)
        return self._sort_data_into_dict(all_data)


    ## UTILS
    def _sort_data_into_dict(self, data_list: List[Union[Dict, Mapping]]):
        data_dict = defaultdict(list)
        for item in data_list:
            data_dict[item['type']].append(item)
        return data_dict

    async def _get_one(self, table: sa.Table, *conds):
        query = table.select().where(*conds)
        res = await self.db.fetch_one(query)
        if res is None:
            raise NotFoundError()
        return res

    def _hash_data(self, data: Dict):
        hasher = hashlib.sha1()
        data_str = json.dumps(data, sort_keys=True, ensure_ascii=True).encode()
        hasher.update(data_str)
        return hasher.hexdigest()

    async def _update_component_hash(self, comp_id: int):
        hashes_query = select(data.c.hash)
        hashes = await self.db.fetch_all(hashes_query)
        hasher = hashlib.sha1()
        for data_hash in hashes:
            hasher.update(data_hash[0].encode())
        template_link = await self.db.fetch_val(select(components.c.template_link))
        hasher.update(template_link.encode())
        update_query = components.update().where(
            components.c.id == comp_id
        ).values(data_hash=hasher.hexdigest())
        await self.db.execute(update_query)



