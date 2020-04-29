# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :notebook_backend,
  ecto_repos: [NotebookBackend.Repo]

# Configures the endpoint
config :notebook_backend, NotebookBackendWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "wzDUWvTYbhZYWxdFX12EQw/B0JTfRRPSbupBxIgmw5H64ocy8ZnxHnXKWR+ypZQR",
  render_errors: [view: NotebookBackendWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: NotebookBackend.PubSub,
  live_view: [signing_salt: "0In4c6zP"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
