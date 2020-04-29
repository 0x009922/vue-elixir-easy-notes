defmodule NotebookBackend.Repo do
  use Ecto.Repo,
    otp_app: :notebook_backend,
    adapter: Ecto.Adapters.Postgres
end
