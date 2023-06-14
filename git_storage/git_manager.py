from git import Repo, GitError, GitCommandError
from pathlib import Path


class GitManager:
    def __init__(
        self,
        local_path: Path,
        username: str,
        remote_access_token: str,
        remote_source_url: str,
        remote_source_branch: str,
        remote_copy_url: str,
        remote_copy_branch: str,
    ):
        self.local_path = local_path
        self.username = username
        self.remote_access_token = remote_access_token
        self.remote_source_url = remote_source_url
        self.remote_source_branch = remote_source_branch
        self.remote_copy_url = remote_copy_url
        self.remote_copy_branch = remote_copy_branch
        self.remote_copy_name = "deploy"

        # self.auth_credentials = {
        #     'GIT_ASKPASS': 'echo',  # Suppress password prompt
        #     'GIT_USERNAME': self.username,
        #     'GIT_PASSWORD': self.remote_access_token,
        # }

        try:
            self.repo = self.load_local_path()
            print(f"Loaded repo from local path {self.local_path}")
        except GitError:
            self.repo = self.load_from_source()
            print(f"Loaded repo from remote {self.remote_source_url}")
        except Exception as e:
            raise e

        try:
            self.remote_copy = self.repo.remote(self.remote_copy_name)
            print(f"Loaded remote copy from repo {self.local_path}")
        except ValueError:
            self.remote_copy = self.set_copy_remote_origin()
            print(f"Set remote copy from url {self.remote_copy_url}")
        except Exception as e:
            raise e

        self.copy_branch = self.set_branch()

        self.commit_dirs = [
            "annotators",
            "assistant_dists",
            "common",
            "components",
            "response_selectors",
            "services",
            "skill_selectors",
            "skills",
        ]

    def load_local_path(self):
        return Repo(self.local_path)

    def load_from_source(self):
        repo = Repo.clone_from(
            self.remote_source_url,
            self.local_path,
            # env=self.auth_credentials,
        )
        return repo

    def set_branch(self):
        branch = self.repo.create_head(self.remote_copy_branch)
        branch.checkout()
        # self.remote_copy.push()
        return branch

    def set_copy_remote_origin(self):
        remote_copy = self.repo.create_remote(self.remote_copy_name, self.remote_copy_url)
        remote_copy.fetch()
        return remote_copy

    def pull_copy_remote_origin(self):
        try:
            self.remote_copy.pull(refspec=self.remote_copy_branch)
        except GitCommandError:
            # avoid fatal errors if remote_copy_branch does not exist
            pass

    def commit(self, user_id: int, change_id: int, *files):
        index = self.repo.index
        index.add(files)
        commit_message = f"dream-api/{user_id}/{change_id}"
        index.commit(commit_message)

    def push_to_copy_remote_origin(self):
        self.pull_copy_remote_origin()
        self.remote_copy.push(refspec=self.remote_copy_branch)

    def commit_and_push(self, user_id: int, change_id: int):
        paths = [str(self.local_path / dir_name) for dir_name in self.commit_dirs]
        self.commit(user_id, change_id, *paths)
        self.push_to_copy_remote_origin()


# dream_git = GitManager(
#     settings.git.local_path,
#     settings.git.username,
#     settings.git.remote_access_token,
#     settings.git.remote_source_url,
#     settings.git.remote_source_branch,
#     settings.git.remote_copy_url,
#     settings.git.remote_copy_branch,
# )
# # dream_git.remote_copy.fetch()
# # dream_git.set_copy_remote_origin()
# dream_git.remote_copy.push(refspec="dev-deploy")
# # dream_git.push_to_copy_remote_origin()
