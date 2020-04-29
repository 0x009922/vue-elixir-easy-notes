defmodule NotebookBackend.Note do
  use Ecto.Schema

  schema "notes" do
    field :title, :string
    has_many :todos, NotebookBackend.Todo
  end

  def changeset(note, params \\ %{}) do
    note
    |> Ecto.Changeset.cast(params, [:title])
  end
end
