import React, { useRef, useState } from "react";

function App() {
  const [todo, setTodo] = useState("");

  const [todos, setTodos] = useState([]);

  const [reTodo, setReTodo] = useState("");

  const onChange = (e) => {
    setTodo(e.target.value);
  };

  const nextId = useRef(0); // useRef로 key 값으로 사용할 변수를 선언 및 초기화함.

  const todoWithId = {
    // todo 리스트를 렌더링할 때나 항목을 제거할 때 사용할 key 값을 객체로 정의. todoWithId 자체가 todos에 들어갈 하나의 배열 원소(객체 형식)임.
    what: todo, // what이라는 변수에 todo 값을 집어넣음.
    id: nextId.current, // .current를 통해 useRef로 정의한 변수를 조회하거나 수정 가능. 여기서는 id라는 변수에다가 바로 위에서 useRef로 정의한 nextId 값을 조회해서 넣어준 것.
    update: false,
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (todo === "") {
      return;
    }

    //원래 todoWithId 있던 곳

    // 아래 두 코드는 todos를 업데이트하는 방법.
    // 전자는 concat을 사용해 todoWithId를 todos에 집어넣은 것.
    // 후자는 ...라는 spread 연산자를 사용해서 todos를 복사해오고, 거기에 todoWithId를 원소로 넣은 것.
    // setTodos(todos.concat(todoWithId));
    setTodos([...todos, todoWithId]);

    setTodo("");

    nextId.current += 1; // 다음에 추가될 항목에 들어갈 key값인 nextId를 .current를 사용해서 증분함.
  };

  const onDelete = (id) => {
    // filter를 통해 조건을 만족하면 남기고, 만족하지 못하면 없애서 삭제 기능 구현
    // todos의 id와 파라미터로 받아온(클릭된 요소) id가 같은 경우 0이므로 삭제
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onRechange = (e) => {
    setReTodo(e.target.value);
  };

  const onUpdate = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, update: !todo.update } : todo
      )
    );

    setReTodo("");
  };

  const onRevise = (e) => {
    e.preventDefault();

    if (reTodo === "") {
      return;
    }

    const reId = e.target.key;

    setTodos(
      todos.map((todo) => (todo.id === reId ? { ...todo, what: reTodo } : todo))
    );
  };

  return (
    <div>
      <h1>To-Do-List : {todos.length}</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Write your To-Do"
          value={todo}
          onChange={onChange}
        />
        <button type="submit">Add</button>
      </form>
      <hr />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {/* 배열을 렌더링하기 위해 key값(변수 id)을 li마다 붙이도록 해줌. */}
            {todo.what}
            <button type="button" onClick={() => onDelete(todo.id)}>
              {/* map()에서 사용하는 파라미터를 그대로 받아서 사용. onDelete 함수에 todo.id를 파라미터로 입력 */}
              Delete
            </button>
            <button type="button" onClick={() => onUpdate(todo.id)}>
              {todo.update ? "Cancel" : "Update"}
            </button>

            {todo.update ? (
              <form key={todo.id} onSubmit={onRevise}>
                <input
                  type="text"
                  placeholder="Revise your To-Do"
                  onChange={onRechange}
                  value={reTodo}
                />
                <button type="submit">Revise</button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
