defmodule NotebookBackendWeb.NoteController do
  use NotebookBackendWeb, :controller
  import Ecto.Query, only: [from: 2]

  def index(conn, _body) do
    query = from n in NotebookBackend.Note,
      order_by: n.id,
      preload: :todos
    notes = NotebookBackend.Repo.all(query)
    |> Enum.map(fn note ->
      Map.merge(
        Map.take(note, [:id, :title]),
        %{
          todos: note.todos
          |> Enum.map(&Map.take(&1, [:done, :id, :title]))
          |> Enum.map(&Map.update!(&1, :done, fn val -> !!val end))
        }
      )
    end)
    json(conn, notes)
  end

  def create(conn, _body) do
    {:ok, %{id: id}} = %NotebookBackend.Note{} |> NotebookBackend.Repo.insert()
    json(conn, %{id: id})
  end

  def update(conn, body) do
    %{"id" => note_id} = conn.path_params

    query = from n in NotebookBackend.Note,
      where: n.id == ^note_id,
      preload: :todos
    note = NotebookBackend.Repo.one(query)

    # Обновляю текст заметки
    NotebookBackend.Note.changeset(note, body)
    |> NotebookBackend.Repo.update!()

    case Map.get(body, "todos", nil) do
      items when is_list(items) -> update_todos(note, items)
      _ -> nil
    end

    conn
    |> send_resp(204, "")
  end

  def delete(conn, _body) do
    %{"id" => note_id} = conn.path_params

    # Удаляю все todo для начала
    query = from t in NotebookBackend.Todo,
      where: t.note_id == ^note_id
    NotebookBackend.Repo.delete_all(query)

    # Удаляю заметку
    query = from n in NotebookBackend.Note,
      where: n.id == ^note_id
    NotebookBackend.Repo.delete_all(query)

    conn
    |> send_resp(204, "")
  end

  @spec update_todos(NotebookBackend.Note.t, [map()]) :: nil
  defp update_todos(note, body_todos) do
    existing_todos_map = note.todos
    |> Enum.reduce(%{}, fn %{id: id} = todo, map ->
      Map.put(map, id, todo)
    end)

    # Собираю todo из тела запроса в карту %{^id => todo, create: [new_todos]}
    body_todos_map = body_todos
    |> Enum.reduce(%{}, fn todo, map ->
      case Map.get(todo, "id", nil) do
        nil -> Map.update(map, :create, [todo], fn x -> [todo | x] end)
        id ->
          if Map.has_key?(existing_todos_map, id) do
            Map.put(map, id, todo)
          else
            throw :unexisted_todo
          end
      end
    end)

    # Прохожусь по существующим todo, удаляя и обновляя
    Map.to_list(existing_todos_map)
    |> Enum.each(fn {id, item} ->
      case Map.get(body_todos_map, id, nil) do
        nil -> NotebookBackend.Repo.delete(item)
        data ->
          item
          |> NotebookBackend.Todo.changeset(data)
          |> NotebookBackend.Repo.update!()
      end
    end)

    # Создаю новые todo
    Map.get(body_todos_map, :create, [])
    |> Enum.each(fn data ->
      %NotebookBackend.Todo{note_id: note.id}
      |> NotebookBackend.Todo.changeset(data)
      |> NotebookBackend.Repo.insert!()
    end)

    nil
  end
end
