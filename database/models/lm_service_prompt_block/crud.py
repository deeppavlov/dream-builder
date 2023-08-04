# from database.models.component.model import Component
#
# from sqlalchemy import select, and_, delete
# from sqlalchemy.dialects.postgresql import insert
# from sqlalchemy.orm import Session
#
# from database.models.virtual_assistant_component.model import VirtualAssistantComponent
# from database.models.virtual_assistant import crud as virtual_assistant_crud
#
#
# def get_by_id(
#     db: Session, virtual_assistant_component_id: int
# ) -> [VirtualAssistantComponent]:
#     return db.get(VirtualAssistantComponent, virtual_assistant_component_id)
#
#
# def get_by_component_name(
#     db: Session, virtual_assistant_id: int, component_name: str
# ) -> VirtualAssistantComponent:
#     va_component = db.scalar(
#         select(VirtualAssistantComponent).filter(
#             and_(
#                 VirtualAssistantComponent.virtual_assistant_id == virtual_assistant_id,
#                 VirtualAssistantComponent.component.has(name=component_name),
#             )
#         )
#     )
#     if not va_component:
#         raise ValueError(f"Component with name={component_name} does not exist")
#
#     return va_component
#
#
# def get_by_component_name_like(
#     db: Session, virtual_assistant_id: int, component_name_pattern: str
# ) -> [VirtualAssistantComponent]:
#     return db.scalars(
#         select(VirtualAssistantComponent).filter(
#             and_(
#                 VirtualAssistantComponent.virtual_assistant_id == virtual_assistant_id,
#                 VirtualAssistantComponent.component.has(
#                     Component.name.like(f"%{component_name_pattern}")
#                 ),
#             )
#         )
#     ).all()
#
#
# def get_all_by_virtual_assistant_id(db: Session, virtual_assistant_id: int) -> [VirtualAssistantComponent]:
#     return db.scalars(
#         select(VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant_id)
#     ).all()
#
#
# def get_all_by_virtual_assistant_name(
#     db: Session, virtual_assistant_name: str
# ) -> [VirtualAssistantComponent]:
#     virtual_assistant = virtual_assistant_crud.get_by_name(db, virtual_assistant_name)
#
#     return db.scalars(
#         select(VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant.id)
#     ).all()
#
#
# def create(
#     db: Session, virtual_assistant_id: int, component_id: int, is_enabled: bool = True
# ):
#     return db.scalar(
#         insert(VirtualAssistantComponent)
#         .values(
#             virtual_assistant_id=virtual_assistant_id,
#             component_id=component_id,
#             is_enabled=is_enabled,
#         )
#         .returning(VirtualAssistantComponent)
#     )
#
#
# def create_many(db: Session, virtual_assistant_id: int, components: [Component]):
#     new_virtual_assistant_components = []
#
#     for component in components:
#         new_component = create(db, virtual_assistant_id, component.id, True)
#         new_virtual_assistant_components.append(new_component)
#
#     return new_virtual_assistant_components
#
#
# def delete_by_id(db: Session, id: int):
#     db.execute(delete(VirtualAssistantComponent).filter(VirtualAssistantComponent.id == id))
