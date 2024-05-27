from locust import HttpLocust, TaskSet, task


class MyTaskSet(TaskSet):
    @task
    def post_api_assistant_dists(self, **kwargs):
        return self.client.post("/api/assistant_dists", name="/api/assistant_dists", **kwargs)

    @task
    def get_api_assistant_dists_public_templates(self, **kwargs):
        return self.client.get(
            "/api/assistant_dists/public_templates",
            name="/api/assistant_dists/public_templates",
            **kwargs
        )

    @task
    def get_api_assistant_dists_user_owned(self, **kwargs):
        return self.client.get("/api/assistant_dists/user_owned", name="/api/assistant_dists/user_owned", **kwargs)

    @task
    def get_api_assistant_dists_dist_name(self, dist_name, **kwargs):
        return self.client.get(
            "/api/assistant_dists/{0}".format(dist_name),
            name="/api/assistant_dists/{dist_name}",
            **kwargs
        )

    @task
    def patch_api_assistant_dists_dist_name(self, dist_name, **kwargs):
        return self.client.patch(
            "/api/assistant_dists/{0}".format(dist_name),
            name="/api/assistant_dists/{dist_name}", **kwargs
        )

    @task
    def delete_api_assistant_dists_dist_name(self, dist_name, **kwargs):
        return self.client.delete(
            "/api/assistant_dists/{0}".format(dist_name),
            name="/api/assistant_dists/{dist_name}",
            **kwargs
        )

    @task
    def post_api_assistant_dists_dist_name_clone(self, dist_name, **kwargs):
        return self.client.post(
            "/api/assistant_dists/{0}/clone".format(dist_name),
            name="/api/assistant_dists/{dist_name}/clone",
            **kwargs
        )

    @task
    def get_api_assistant_dists_dist_name_components(self, dist_name, **kwargs):
        return self.client.get(
            "/api/assistant_dists/{0}/components".format(dist_name),
            name="/api/assistant_dists/{dist_name}/components",
            **kwargs
        )

    @task
    def post_api_assistant_dists_dist_name_components(self, dist_name, **kwargs):
        return self.client.post(
            "/api/assistant_dists/{0}/components".format(dist_name),
            name="/api/assistant_dists/{dist_name}/components",
            **kwargs
        )

    @task
    def patch_api_assistant_dists_dist_name_components_virtual_assistant_component_id(
            self, dist_name, virtual_assistant_component_id, **kwargs
    ):
        return self.client.patch(
            "/api/assistant_dists/{0}/components/{1}".format(dist_name,virtual_assistant_component_id),
            name="/api/assistant_dists/{dist_name}/components/{virtual_assistant_component_id}",
            **kwargs
        )

    @task
    def delete_api_assistant_dists_dist_name_components_virtual_assistant_component_id(
            self, dist_name, virtual_assistant_component_id, **kwargs
    ):
        return self.client.delete(
            "/api/assistant_dists/{0}/components/{1}".format(dist_name,virtual_assistant_component_id),
            name="/api/assistant_dists/{dist_name}/components/{virtual_assistant_component_id}",
            **kwargs
        )

    @task
    def post_api_assistant_dists_dist_name_publish(self, dist_name, **kwargs):
        return self.client.post(
            "/api/assistant_dists/{0}/publish".format(dist_name),
            name="/api/assistant_dists/{dist_name}/publish",
            **kwargs
        )

    @task
    def get_api_assistant_dists_templates_template_file_path(self, template_file_path, **kwargs):
        return self.client.get(
            "/api/assistant_dists/templates/{0}?owner_address={1}&dist_name={2}".format(template_file_path),
            name="/api/assistant_dists/templates/{template_file_path}",
            **kwargs
        )

    @task
    def get_api_components(self, **kwargs):
        return self.client.get("/api/components", name="/api/components", **kwargs)

    @task
    def post_api_components(self, **kwargs):
        return self.client.post("/api/components", name="/api/components", **kwargs)

    @task
    def get_api_components_component_id(self, component_id, **kwargs):
        return self.client.get(
            "/api/components/{0}".format(component_id),
            name="/api/components/{component_id}",
            **kwargs
        )

    @task
    def patch_api_components_component_id(self, component_id, **kwargs):
        return self.client.patch(
            "/api/components/{0}".format(component_id),
            name="/api/components/{component_id}",
            **kwargs
        )

    @task
    def delete_api_components_component_id(self, component_id, **kwargs):
        return self.client.delete(
            "/api/components/{0}".format(component_id),
            name="/api/components/{component_id}",
            **kwargs
        )

    @task
    def get_api_components_component_id_generative_config(self, component_id, **kwargs):
        return self.client.get(
            "/api/components/{0}/generative_config".format(component_id),
            name="/api/components/{component_id}/generative_config",
            **kwargs
        )

    @task
    def get_api_components_group_group_name(self, group_name, **kwargs):
        return self.client.get(
            "/api/components/group/{0}".format(group_name),
            name="/api/components/group/{group_name}",
            **kwargs
        )

    @task
    def get_api_users(self, **kwargs):
        return self.client.get("/api/users", name="/api/users", **kwargs)

    @task
    def get_api_users_self(self, **kwargs):
        return self.client.get("/api/users/self", name="/api/users/self", **kwargs)

    @task
    def get_api_users_user_id(self, user_id, **kwargs):
        return self.client.get("/api/users/{0}".format(user_id), name="/api/users/{user_id}", **kwargs)

    @task
    def put_api_users_user_id(self, user_id, **kwargs):
        return self.client.put("/api/users/{0}".format(user_id), name="/api/users/{user_id}", **kwargs)

    @task
    def get_api_api_keys(self, **kwargs):
        return self.client.get("/api/api_keys", name="/api/api_keys", **kwargs)

    @task
    def post_api_dialog_sessions(self, **kwargs):
        return self.client.post("/api/dialog_sessions", name="/api/dialog_sessions", **kwargs)

    @task
    def get_api_dialog_sessions_dialog_session_id(self, dialog_session_id, **kwargs):
        return self.client.get(
            "/api/dialog_sessions/{0}".format(dialog_session_id),
            name="/api/dialog_sessions/{dialog_session_id}",
            **kwargs
        )

    @task
    def post_api_dialog_sessions_dialog_session_id_chat(self, dialog_session_id, **kwargs):
        return self.client.post(
            "/api/dialog_sessions/{0}/chat".format(dialog_session_id),
            name="/api/dialog_sessions/{dialog_session_id}/chat",
            **kwargs
        )

    @task
    def get_api_dialog_sessions_dialog_session_id_history(self, dialog_session_id, **kwargs):
        return self.client.get(
            "/api/dialog_sessions/{0}/history".format(dialog_session_id),
            name="/api/dialog_sessions/{dialog_session_id}/history",
            **kwargs
        )

    @task
    def get_api_deployments(self, **kwargs):
        return self.client.get("/api/deployments", name="/api/deployments", **kwargs)

    @task
    def post_api_deployments(self, **kwargs):
        return self.client.post("/api/deployments", name="/api/deployments", **kwargs)

    @task
    def get_api_deployments_stacks(self, **kwargs):
        return self.client.get("/api/deployments/stacks", name="/api/deployments/stacks", **kwargs)

    @task
    def get_api_deployments_stack_ports(self, **kwargs):
        return self.client.get("/api/deployments/stack_ports", name="/api/deployments/stack_ports", **kwargs)

    @task
    def get_api_deployments_deployment_id(self, deployment_id, **kwargs):
        return self.client.get(
            "/api/deployments/{0}".format(deployment_id),
            name="/api/deployments/{deployment_id}",
            **kwargs
        )

    @task
    def patch_api_deployments_deployment_id(self, deployment_id, **kwargs):
        return self.client.patch(
            "/api/deployments/{0}".format(deployment_id),
            name="/api/deployments/{deployment_id}",
            **kwargs
        )

    @task
    def delete_api_deployments_deployment_id(self, deployment_id, **kwargs):
        return self.client.delete(
            "/api/deployments/{0}".format(deployment_id),
            name="/api/deployments/{deployment_id}",
            **kwargs
        )

    @task
    def delete_api_deployments_stacks_stack_id(self, stack_id, task_id, **kwargs):
        return self.client.delete(
            "/api/deployments/stacks/{0}?task_id={1}".format(stack_id, task_id),
            name="/api/deployments/stacks/{stack_id}",
            **kwargs
        )

    @task
    def get_api_deployments_task_task_id(self, task_id, **kwargs):
        return self.client.get(
            "/api/deployments/task/{0}".format(task_id),
            name="/api/deployments/task/{task_id}",
            **kwargs
        )

    @task
    def get_api_admin_publish_request(self, **kwargs):
        return self.client.get("/api/admin/publish_request", name="/api/admin/publish_request", **kwargs)

    @task
    def get_api_admin_publish_request_unreviewed(self, **kwargs):
        return self.client.get(
            "/api/admin/publish_request/unreviewed",
            name="/api/admin/publish_request/unreviewed",
            **kwargs
        )

    @task
    def post_api_admin_publish_request_publish_request_id_confirm(self, publish_request_id, **kwargs):
        return self.client.post(
            "/api/admin/publish_request/{0}/confirm".format(publish_request_id),
            name="/api/admin/publish_request/{publish_request_id}/confirm",
            **kwargs
        )

    @task
    def post_api_admin_publish_request_publish_request_id_decline(self, publish_request_id, **kwargs):
        return self.client.post(
            "/api/admin/publish_request/{0}/decline".format(publish_request_id),
            name="/api/admin/publish_request/{publish_request_id}/decline",
            **kwargs
        )

    @task
    def get_api_lm_services(self, **kwargs):
        return self.client.get("/api/lm_services", name="/api/lm_services", **kwargs)

    @task
    def post_api_tokens_validate(self, **kwargs):
        return self.client.post("/api/tokens/validate", name="/api/tokens/validate", **kwargs)


class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 3000
