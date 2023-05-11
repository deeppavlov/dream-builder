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


@pytest.mark.parametrize('execution_number', range(50))
def test_get_dialog_session_history_with_created_from_scratch_va(execution_number):
    print(f'execution_number = {execution_number}')
    name = va_data["name"]
    user = UserMethods()
    va = user.create_virtual_assistant(name)
    va_id = va["id"]
    va_name = va["name"]
    print(f'va is created, do deploy')
    deploy = DeploymentsMethods()
    deployment_id = deploy.create_deployment(va_name)["id"]
    time.sleep(70)
    print(f'deploy is created')
    dialog_session_id = user.create_dialog_sessions(va_name)["id"]
    user.send_dialog_session_message(dialog_session_id)
    user.get_dialog_session_history(dialog_session_id)
    print(f'dialog is success')
