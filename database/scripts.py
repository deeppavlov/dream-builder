import logging
from pathlib import Path
from typing import Union, Dict, Type, Callable

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.event import listens_for
from sqlalchemy.types import DateTime

from database import models, utils


# def _pre_populate_from_tsv(
#     path: Union[Path, str],
#     target,
#     connection,
#     map_value_types: Dict[str, Type[bool | int | Callable[[str], bool | int]]] = None,
# ):
#     logging.error(f"Pre-populating {target.name} from {path}")
#
#     for row in utils.iter_tsv_rows(path, map_value_types):
#         connection.execute(target.insert(), row)


def register_initial_data_population():
    """

    Returns:

    """
    # @listens_for(models.Role.__table__, "after_create")
    # def pre_populate_role(target, connection, **kw):
    #     _pre_populate_from_tsv(
    #         "database/initial_data/role.tsv",
    #         target,
    #         connection,
    #         map_value_types={"can_confirm_publish": lambda x: bool(int(x)), "can_set_roles": lambda x: bool(int(x))},
    #     )
    #
    # @listens_for(models.GoogleUser.__table__, "after_create")
    # def pre_populate_google_user(target, connection, **kw):
    #     _pre_populate_from_tsv("database/initial_data/google_user.tsv", target, connection)
    #
    # @listens_for(models.ApiToken.__table__, "after_create")
    # def pre_populate_api_token(target, connection, **kw):
    #     _pre_populate_from_tsv("database/initial_data/api_token.tsv", target, connection)
    #
    # @listens_for(models.VirtualAssistant.__table__, "after_create")
    # def pre_populate_virtual_assistant(target, connection, **kw):
    #     invisible_dist_names = [
    #         "deepy_faq",
    #         "dream_sfc",
    #         "deepy_gobot_base",
    #         "dream_alice",
    #         "dream",
    #         "dream_multimodal",
    #         "deepy_base",
    #         "roomful",
    #         "deepy_adv",
    #         "dream_russian",
    #         "dream_persona_prompted",
    #         "dream_minecraft",
    #         "dream_weather",
    #         "dream_multilingual",
    #         "dream_mini_persona_based",
    #         "dream_mini",
    #         "dream_alexa",
    #     ]
    #
    #     try:
    #         from deeppavlov_dreamtools import list_dists
    #
    #         dream_root = "/dream"
    #         logging.warning(f"Pre-populating {target.name} from {dream_root}")
    #
    #         for dist in list_dists(dream_root):
    #             if dist.name not in invisible_dist_names:
    #                 inserted_row = connection.execute(
    #                     insert(target)
    #                     .values(
    #                         author_id=1,
    #                         source=str(dist.dist_path),
    #                         name=dist.name,
    #                         display_name=dist.pipeline.metadata.display_name,
    #                         description=dist.pipeline.metadata.description,
    #                         date_created=dist.pipeline.metadata.date_created,
    #                     )
    #                     .returning(target)
    #                 )
    #                 logging.warning(f"Inserted {inserted_row}")
    #     except ImportError:
    #         pass

