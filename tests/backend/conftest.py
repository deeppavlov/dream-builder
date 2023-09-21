import pytest
from .distributions_methods import UserMethods, AdminMethods
from .config import (
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


@pytest.fixture(scope="session")
def delete_all_users_assistant():
    user = UserMethods(test_token_github1, "github")
    names_list = user.get_list_of_private_va_wo_assert()
    print(names_list)
