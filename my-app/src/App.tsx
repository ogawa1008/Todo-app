import { useState } from "react";
import "./App.css";

type Todo = {
  id: number;//Todo を識別する
  title: string;//タイトル
  category: string;//種類
  deadline: string;//期限
  completed: boolean;//完了したかどうか
};

function App() {
  //データ型がテキストなので("")になる
  const [title, setTitle] = useState("");
  // 初期値は「仕事」に設定
  const [category, setCategory] = useState("仕事");

  const [deadline, setDeadline] = useState("");

  //「Todo型の配列」一覧みたいなもん
  const [todos, setTodos] = useState<Todo[]>([]);

  // 下に詳細表示するTodo
  const [selectedTodo, setSelectedTodo]
    = useState<Todo | null>(null);

  const addTodo = () => {

    // trim() は空白を除去
    // タイトルが空ならなら戻る
    if (!title.trim()) return;

    // 新しいTodoを作るとこ
    const newTodo: Todo = {

      // Date.now()で現在時刻
      id: Date.now(),

      title,

      category,

      deadline,
      
      completed: false,
    };

    //todos は「配列を展開する」という意味で今あるTodoに新しいTodoを追加する
    setTodos([...todos, newTodo]);

    // 入力欄をリセット
    setTitle("");
    setDeadline("");
  };

  //完了した後
  const toggleComplete = (id: number) => {

    // map() を使って配列を更新する(forみたいなもの)
    setTodos(

      todos.map((todo) =>

        // 指定されたidと一致したTodoだけ変更
        todo.id === id

          // completed を反転する
          ? {
              ...todo,
              completed: !todo.completed
            }

          // 一致しないものはそのまま
          : todo
      )
    );

    // 詳細パネルを開いている場合も更新
    if (selectedTodo?.id === id) {

      // ?. 存在する場合だけ実行
      setSelectedTodo({
        ...selectedTodo,

        // true ↔ false を反転
        completed: !selectedTodo.completed,
      });
    }
  };

  /* =====================================================
     filter()
     条件に一致するデータだけ取得する。
     !t.completed
     → completed が false のもの
  ===================================================== */

  // 未完了Todo
  const incompleteTodos =
    todos.filter((t) => !t.completed);

  // 完了Todo
  const completedTodos =
    todos.filter((t) => t.completed);

  return (

    //これからは見た目の部分

    <div className="container">

      <aside className="sidebar">

        {/* タイトル */}
        <h1 className="logo">ToDoリスト</h1>

        {/* =====================================================
            未完了リスト
        ===================================================== */}
        <div className="side-section">

          {/* 件数表示 */}
          <h2>
            未完了 ({incompleteTodos.length})
          </h2>

          {/* map() で一覧表示 */}
          {incompleteTodos.map((todo) => (

            <div
              key={todo.id}

              // CSSクラス
              className="side-item"

              // クリックしたTodoを詳細表示
              onClick={() => setSelectedTodo(todo)}
            >

              <div>

                {/* タイトル表示 */}
                <p>{todo.title}</p>

                {/* 期限表示 */}
                <span className="deadline">
                  期限: {todo.deadline || "未設定"}
                </span>
              </div>

              {/* 完了ボタン */}
              <button

                onClick={(e) => {

                  /* =====================================================
                     stopPropagation()は
                     親要素へのクリックイベントを止めて、詳細パネルが開かないようにする。
                  ===================================================== */
                  e.stopPropagation();

                  // 完了状態切替
                  toggleComplete(todo.id);
                }}
              >
                完了
              </button>
            </div>
          ))}
        </div>

        {/* =====================================================
            完了リスト
        ===================================================== */}
        <div className="side-section">

          <h2>
            完了 ({completedTodos.length})
          </h2>

          {completedTodos.map((todo) => (

            <div
              key={todo.id}

              // doneクラス追加
              className="side-item done"

              onClick={() => setSelectedTodo(todo)}
            >

              <div>
                <p>{todo.title}</p>

                <span className="deadline">
                  期限: {todo.deadline || "未設定"}
                </span>
              </div>

              {/* 未完了へ戻す */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(todo.id);
                }}
              >
                戻す
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="main">

        <div className="form-area">

          {/* タイトル入力 */}
          <input
            className="title-input"

            placeholder="タイトル"

            value={title}

            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {/* カテゴリ選択 */}
          <div className="form-row">

            <label>種類</label>

            <select
              value={category}

              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option>仕事</option>
              <option>勉強</option>
              <option>買い物</option>
              <option>その他</option>
            </select>
          </div>

          {/* 日付入力 */}
          <div className="form-row">

            <label>期限</label>

            <input
              type="date"

              value={deadline}

              onChange={(e) =>
                setDeadline(e.target.value)
              }
            />
          </div>

          {/* 追加ボタン */}
          <button
            className="add-button"
            onClick={addTodo}
          >
            追加
          </button>
        </div>

        {/* selectedTodo が存在する場合だけ表示 */}
        {selectedTodo && (

          <div className="detail">

            <h2>詳細</h2>

            <p>
              タイトル:
              {selectedTodo.title}
            </p>

            <p>
              種類:
              {selectedTodo.category}
            </p>

            <p>
              期限:
              {selectedTodo.deadline || "未設定"}
            </p>

            <p>
              状態:

              {selectedTodo.completed
                ? "完了"
                : "未完了"}
            </p>

            {/* 状態切替 */}
            <button
              onClick={() =>
                toggleComplete(selectedTodo.id)
              }
            >
              状態切替
            </button>

            {/* 詳細を閉じる */}
            <button
              onClick={() =>
                setSelectedTodo(null)
              }
            >
              閉じる
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// 関数名などが被ってもエラーにならないようにする
export default App;