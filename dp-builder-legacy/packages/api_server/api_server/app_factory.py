from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

from cotypes.manager import ComponentRunner
from .db import DB, NotFoundError
from .routes import components, projects, data, trainings

def create_app(
    database_url: str,
    comp_runner: ComponentRunner
) -> FastAPI:
    app = FastAPI()
    db = DB(database_url)

    def get_db():
        return db
    def get_runner():
        return comp_runner

    def handle_notfound_error(*_):
        return PlainTextResponse(
            status_code=404,
            content="Resource not found"
        )

    app.dependency_overrides[DB] = get_db
    app.dependency_overrides[ComponentRunner] = get_runner
    app.add_exception_handler(NotFoundError, handle_notfound_error)
    app.add_event_handler("startup", db.connect)
    app.add_event_handler("shutdown", db.disconnect)
    app.include_router(projects.router)
    app.include_router(components.router)
    app.include_router(trainings.router)
    app.include_router(data.router)
    
    return app
