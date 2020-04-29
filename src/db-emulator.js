/**
 * @typedef {{ title: string, done: boolean }} TodoItem Пункт TODO заметки
 *
 * @typedef {{ id: number, title: string, todos: TodoItem[] }} Note Заметка, как хранится
 *
 * @typedef {{ title?: string, todos?: TodoItem[] }} NoteChangeSet Данные,
 * указываемые при создании/редактировании заметки
 */

/**
 * Чтение данных из localStorage
 * @returns {Note[]}
 */
function readStorage() {
  const data = localStorage.getItem('stored_notes');
  if (!data) {
    return [{
      id: 1,
      title: 'Первая тестовая заметка',
      todos: [
        { id: 1, title: 'Первый пункт TODO', done: false },
        { id: 2, title: 'Второй пункт', done: true },
        { id: 3, title: 'Третий, скрытый пункт', done: false },
      ],
    }];
  }

  try {
    return JSON.parse(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return [];
  }
}

/**
 * Запись данных в localStorage
 * @param {Note[]} data
 */
function writeStorage(data) {
  localStorage.setItem('stored_notes', JSON.stringify(data));
}

async function randomDelay() {
  const delay = 300 + ~~(Math.random() * 400);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export default {
  /**
   * Чтение заметок из абстрактной базы данных
   */
  async get() {
    await randomDelay();
    return readStorage();
  },
  /**
   * Удаление одной заметки по id
   */
  async remove(id) {
    await randomDelay();
    writeStorage(
      readStorage().filter((note) => note.id !== id),
    );
  },
  /**
   * Создание новой заметки
   * @param {NoteChangeSet} noteData Данные новой заметки
   * @returns {Promise<{ id: number }>} ID новой заметки
   */
  async create(noteData = { title: '', todos: [] }) {
    await randomDelay();
    const data = readStorage();
    const maxId = data.length > 0
      ? Math.max(...data.map((val) => val.id))
      : 0;
    const id = maxId + 1;
    data.push({
      ...noteData,
      id,
    });
    writeStorage(data);
    return { id };
  },
  /**
   * Обновление данных существующей заметки
   * @param {number} id ID заметки
   * @param {NoteChangeSet} changeset Новые данные заметки
   */
  async update(id, changeset) {
    await randomDelay();
    const data = readStorage();
    const index = data.findIndex((val) => val.id === id);
    if (index >= 0) {
      data[index] = { ...changeset, id };
    }
    writeStorage(data);
  },
};
