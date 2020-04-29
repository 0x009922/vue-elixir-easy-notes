defmodule NotebookBackendWeb.Router do
  use NotebookBackendWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", NotebookBackendWeb do
    pipe_through :api

    resources "/notes", NoteController, only: [:index, :create, :update, :delete]
  end
end
