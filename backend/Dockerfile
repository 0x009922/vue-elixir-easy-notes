FROM elixir:1.10-alpine

WORKDIR /app

RUN mix do local.hex --force, local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
COPY config config
RUN mix do deps.get, deps.compile

COPY priv priv
COPY lib lib
RUN mix compile

COPY entrypoint.sh ./

CMD ["sh", "./entrypoint.sh"]
