defmodule NotebookBackend.Todo do
  use Ecto.Schema

  schema "todos" do
    belongs_to :note, NotebookBackend.Note
    field :title, :string
    field :done, :boolean
  end

  def changeset(todo, params \\ %{}) do
    todo
    |> Ecto.Changeset.cast(params, [:title, :done])
    # |> Ecto.Changeset.validate_change(:done, fn val ->
    #   if is_boolean(val) do
    #     []
    #   else
    #     [done: "Must be a boolean"]
    #   end
    # end)
    # |> Ecto.Changeset.validate_change(:title, fn val ->
    #   if is_binary(val) do
    #     []
    #   else
    #     [title: "Must be a string"]
    #   end
    # end)
  end
end
