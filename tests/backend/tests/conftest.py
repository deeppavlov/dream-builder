import pytest
from tests.backend.distributions_methods import UserMethods, AdminMethods
from tests.backend.config import (
    admin_token,
    test_token_github1,
    test_token_github2,
)


@pytest.fixture(scope="function")
def user():
    user = UserMethods(test_token_github1, "github")
    return user


@pytest.fixture(scope="function")
def user2():
    user2 = UserMethods(test_token_github2, "github")
    return user2


@pytest.fixture(scope="function")
def admin():
    admin = AdminMethods(admin_token, "github")
    return admin


def pytest_sessionfinish(session, exitstatus):
    """
    user = UserMethods()
    names_list = user.get_list_of_private_va_wo_assert()
    if names_list:
        for name in names_list:
            user.delete_va_by_name(name)
    """
    if not hasattr(session.config, "workerinput"):
        pass



