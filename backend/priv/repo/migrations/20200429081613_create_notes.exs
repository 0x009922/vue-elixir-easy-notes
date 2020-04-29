defmodule NotebookBackend.Repo.Migrations.CreateNotes do
  use Ecto.Migration

  def change do
    create table("notes") do
      add :title, :string
    end

    create table("todos") do
      add :note_id, references("notes")
      add :title, :string
      add :done, :boolean
    end
  end
end
