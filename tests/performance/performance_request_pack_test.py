import time
import sys
sys.path.append('K:\\work\\dream-builder')
from tests.backend.distributions_methods import (
    UserMethods,
    DeploymentsMethods,
    AdminMethods
)
from tests.backend.config import (
    va_data,
    public_va_names,
    counter_distributions as counter
)
import pytest


@pytest.mark.parametrize('execution_number', range(1, 2))
def test_get_dialog_session_history_with_created_from_scratch_va(execution_number):

    bot_pack_size = 5

    print(f'execution_number = {execution_number}')
    print(f'number of bots = {execution_number*bot_pack_size}')
    name = va_data["name"]
    user_list = [0]*bot_pack_size
    va_id_list = [0]*bot_pack_size
    va_name_list = [0]*bot_pack_size
    deployment_id_list = [0]*bot_pack_size
    dialog_session_id_list = [0]*bot_pack_size

    for i in range(bot_pack_size):
        user_list[i] = UserMethods()
        va = user_list[i].create_virtual_assistant(name)
        va_id_list[i] = va["id"]
        va_name_list[i] = va["name"]
        print(f'va_id = {va_id_list[i]}, va_name = {va_name_list[i]}')
    print()
    print(f'va is created, do deploy')

    for i in range(bot_pack_size):
        deploy = DeploymentsMethods()
        deployment_id = deploy.create_deployment(va_name_list[i])["id"]
        print(f'deployment_id = {deployment_id}')

    time.sleep(80)
    print(f'deploy is created')

    for i in range(bot_pack_size):
        dialog_session_id = user_list[i].create_dialog_sessions(va_name_list[i])["id"]
        print(f'dialog_session_id = {dialog_session_id}')
        user_list[i].send_dialog_session_message(dialog_session_id)
        user_list[i].get_dialog_session_history(dialog_session_id)
    print(f'dialog is success')
