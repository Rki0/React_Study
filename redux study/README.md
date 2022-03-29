# Redux study (React)

## Redux의 3가지 규칙

1. 하나의 애플리케이션 안에는 하나의 스토어만 있다.  
   여러 개의 스토어를 사용하는 것이 불가능한 것은 아니지만, 그럴 경우 개발 도구를 활용하지 못한다.

2. state는 읽기 전용이다.  
   기존의 상태는 건들지 않고 새로운 상태를 생성하여 업데이트 해주는 방식으로 해줘야, 나중에 개발자 도구를 통해 뒤로 돌릴 수도, 앞으로 돌릴 수도 있다.  
   즉, 불변성을 유지한다는 것.

3. reducer는 순수한 함수여야 한다.  
   reducer는 이전 상태와 액션 객체를 파라미터로 받는다.  
   불변성을 유지해야하며, 똑같은 파라미터로 호출된 reducer 함수는 반드시! 똑같은 결과값을 반환해야한다.  
   따라서, 실행 할 때마다 다른 결과값이 나오는 로직의 경우 reducer 함수 바깥에서 처리해야한다.

## 👀 Redux 예시

간단한 예시를 통해 Redux가 어떤 기능을 하는지 대략 살펴보자.  
주석으로 달아놓은 설명을 잘 살펴보자.

### exercise.js

```js
import { createStore } from "redux";
// createStore는 스토어를 만들어주는 함수
// 리액트 프로젝트에서는 단 하나의 스토어만 존재한다.

// redux에서 관리 할 상태 정의
const initialState = {
  counter: 0,
  text: "",
  list: [],
};

// 액션 타입 정의
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";
const CHANGE_TEXT = "CHANGE_TEXT";
const ADD_TO_LIST = "ADD_TO_LIST";

// 액션 생성 함수 정의
function increase() {
  return {
    // 액션 객체에는 type 값을 필수적으로 넣어야한다.
    type: INCREASE,
  };
}

const decrease = () => {
  return {
    type: DECREASE,
  };
};

const changeText = (text) => {
  return {
    type: CHANGE_TEXT,
    // type 외에 추가적인 필드를 마음대로 작성할 수 있다.
    text,
  };
};

const addToList = (item) => {
  return {
    type: ADD_TO_LIST,
    item,
  };
};

// reducer 만들기
// 액션 생성 함수들을 통해 만들어진 객체를 참조하여 새로운 상태를 만드는 함수
// 불변성을 반드시 지킬 것!
function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        counter: state.counter + 1,
      };

    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };

    case CHANGE_TEXT:
      return {
        ...state,
        text: action.text,
      };

    case ADD_TO_LIST:
      return {
        ...state,
        list: state.list.concat(action.item),
      };

    default:
      return state;
  }
}

// 스토어 만들기
const store = createStore(reducer);

// 현재 스토어 안에 있는 상태를 조회한다.
console.log(store.getState());

// 스토어 안에 있는 상태가 바뀔 때마다 호출되는 listener 함수
const listener = () => {
  const state = store.getState();
  console.log(state);
};

// 구독을 해제하고 싶을 때는 unsubscribe()를 호출하면 된다.
const unsubscribe = store.subscribe(listener);

// 액션 디스패치 해보기
store.dispatch(increase());
store.dispatch(decrease());
store.dispatch(changeText("안녕하세요"));
store.dispatch(addToList({ id: 1, text: "와우" }));
```

redux 스토어 안의 상태는 action이 dispatch 됨에 따라 업데이트된다.  
위 코드에서는 listener라는 함수를 만들어서 redux 상태에 변화가 생겼을 때마다 콘솔에 상태를 출력하도록 해줬다.  
코드 최하단에서는 여러가지 action을 dispatch 해봤다. 그 때마다 상태가 변하고, 이에ㄷ 따라 listener 함수가 호출된다.

간단하게 어떤 기능들이 있는지 알아보았으니 본격적으로 공부해보자.

## 👀 Redux 모듈 만들기

Redux 모듈은 다음 항목들이 모두 들어있는 파일을 의미한다.

- 액션 타입
- 액션 생성 함수
- 리듀서

이 파일들이 서로 다른 폴더에 분리가 되어 있으면 꽤 불편하므로 하나의 폴더에 몰아서 작성하는 것으로 하고 공부를 해보자.  
이렇게 하나의 폴더에 모두 넣어놓는 것을 Ducks 패턴이라고 한다.  
물론, 다른 폴더에 넣어도 전혀 상관없으므로 취향에 맞게 하자.

우선, 모듈을 만드는 것을 연습해보자.  
counter 모듈을 만들어보자.  
주석을 잘 읽으면서 나아갑시다.

### modules/counter.js

```js
// 액션 타입 만들기
// Ducks pattern을 따를 때는 액션의 이름에 접두사를 붙여서 이름이 중복되는 것을 방지
const SET_DIFF = "counter/SET_DIFF";
const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

// 액션 생성함수 만들기
// 액션 생성함수를 만들고 export를 써서 내보내기
export const setDiff = (diff) => ({ type: SET_DIFF, diff });
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// 초기 상태 선언
const initialState = {
  number: 0,
  diff: 1,
};

// 리듀서 선언
// 리듀서는 export default로 내보내기
export default function counter(state = initialState, action) {
  switch (action.type) {
    case SET_DIFF:
      return {
        ...state,
        diff: action.diff,
      };

    case INCREASE:
      return {
        ...state,
        number: state.number + state.diff,
      };

    case DECREASE:
      return {
        ...state,
        number: state.number - state.diff,
      };

    default:
      return state;
  }
}
```

이번에는 todos 모듈을 만들어보자.

### modules/todos.js

```js
// 액션 타입 만들기
const ADD_TODO = "todos/ADD_TODO";
const TOGGLE_TODO = "todos/TOGGLE_TODO";

// 액션 생성함수 선언
let nextId = 1;
export const addTodo = (text) => ({
  type: ADD_TODO,
  todo: {
    // 새 항목을 추가하고 nextId에 1을 더함.
    id: nextId++,
    text,
  },
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  id,
});

// 초기 상태 선언
// 리듀서의 초기 상태는 꼭 객체 타입일 필요가 없다. 배열, 숫자, 문자열...다 가능!
const initialState = [
  // 아래와 같이 구성된 객체를 이 배열에 넣을 것이다.
  // {
  //   id: 1,
  //   text: "example",
  //   done: false,
  // },
];

// 리듀서 선언
export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat(action.todo);

    case TOGGLE_TODO:
      // id가 일치하면 done 값을 반전시키고, 아니라면 그대로 둔다.
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );

    default:
      return state;
  }
}
```

자, 지금까지 두 개의 Redux 모듈을 만들었다.  
보통, 한 프로젝트에 여러 개의 리듀서가 있을 때는 하나의 리듀서로 합쳐서 사용한다.  
이렇게 합쳐진 리듀서를 루트 리듀서라고 부른다.  
루트 리듀서 안에 있는 것은 서브 리듀서라고 부른다.

리듀서를 합치는 작업은 redux에 내장되어 있는 combineReducers() 함수를 사용한다.  
모듈을 합치는 작업을 해보자.

### modules/index.js

```js
// combineReducers 함수를 통해 여러 개의 리듀서를 합침.
import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";

const rootReducer = combineReducers({
  counter,
  todos,
});

export default rootReducer;
```

이제 리듀서들을 합쳤으니 스토어를 만들어보자.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import rootReducer from "./modules";

// 스토어 생성
const store = createStore(rootReducer);

// 스토어의 상태 확인용. counter, todos 서브 리듀서가 합쳐진 것을 확인 가능하다.
console.log(store.getState());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
```

위 코드에서는 모든 컴포넌트가 스토어에 접근할 수는 없다.  
이를 해결하기 위해 'react-redux' 라이브러리를 사용한다.  
위 코드를 아래와 같이 수정해보자.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import rootReducer from "./modules";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    {/* Provider에 store를 넣어서 컴포넌트를 감싸면 어떤 컴포넌트던 리덕스 스토어에 접근 가능 */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
```

이제 Provider로 감싼 곳에서는 렌더링하는 그 어떤 컴포넌트던지 스토어에 접근할 수 있게 되었다.

## 👀 presentational 컴포넌트, container 컴포넌트 만들기

presentational 컴포넌트란, 리덕스 스토어에 직접적으로 접근하지 않고 필요한 값 또는 함수를 props로만 받아와서 사용하는 컴포넌트이다.  
주로 UI 선언에 집중한다.  
예시를 살펴보자.

### components/Counter.js

```js
import React from "react";

// 필요한 값 또는 함수를 props로만 받아와서 사용한다.
function Counter({ number, diff, onIncrease, onDecrease, onSetDiff }) {
  const onChange = (e) => {
    // e.target.value의 타입은 문자열이기 때문에 숫자로 변환해야한다.
    // 여기서는 10진수로 변환하겠다는 뜻.
    onSetDiff(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <h1>{number}</h1>
      <div>
        <input type="number" value={diff} min="1" onChange={onChange} />
        <button onClick={onIncrease}>+</button>
        <button onClick={onDecrease}>-</button>
      </div>
    </div>
  );
}

export default Counter;
```

container 컴포넌트는 리덕스 스토어의 상태를 조회하거나, 액션을 디스패치 할 수 있는 컴포넌트를 의미한다.  
HTML 태그들을 사용하지 않고 다른 presentational 컴포넌트들을 불러와서 사용한다.  
예시를 살펴보자.

### containers/CounterContainer.js

```js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease, setDiff } from "../modules/counter";

function CounterContainer() {
  // useSelector는 리더스 스토어의 상태를 조회하는 Hook
  // state는 store.getState()를 호출했을 때와 동일한 결과값
  const { number, diff } = useSelector((state) => ({
    number: state.counter.number,
    diff: state.counter.diff,
  }));

  // useDispatch는 리덕스 스토어의 dispatch를 함수에서 사용 가능하게 해주는 Hook
  const dispatch = useDispatch();

  // 각 액션을 디스패치하는 함수를 만든다.
  const onIncrease = () => dispatch(increase());
  const onDecrease = () => dispatch(decrease());
  const onSetDiff = (diff) => dispatch(setDiff(diff));

  return (
    <Counter
      // 상태와
      number={number}
      diff={diff}
      // 액션을 디스패치하는 함수들을 props로 넣어줌
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onSetDiff={onSetDiff}
    />
  );
}

export default CounterContainer;
```

이렇게 presentational 컴포넌트와 container 컴포넌트를 분리해서 작업하는 것은 Redux의 창시자가 이 방법을 소개했기 때문이다.  
하지만, 꼭 이렇게 폴더를 나눠서 할 필요는 없다.  
취향에 맞춰 선택하자.

## 👀 Redux 개발자 도구 적용하기

이 부분은 크롬 앱에서 extension을 설치하는 것이므로, 하고 싶다면 하고 아니면 말자.  
redux-devtools-extension을 설치하면 현재 스토어의 상태를 개발자 도구에서 조회할 수 있고, 지금까지 어떤 액션들이 디스패치 되었는지, 액션에 따라 상태가 어떻게 변화했는지 확인 할 수 있다. 또한, 액션을 직접 디스패치 할 수도 있다.  
사용법은 아래와 같다.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import rootReducer from "./modules";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

// composeWithDevTools를 사용하여 Redux 개발자 도구 활성화
const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
```

## 👀 할 일 목록 구현하기

이번에는 할 일 목록을 통해 연습해보자.  
presentational 컴포넌트를 먼저 구현해보자.

### components/Todos.js

```js
// presentational 컴포넌트 구현

import React, { useState } from "react";

// 컴포넌트 최적화를 위하여 React.memo를 사용한다.
const TodoItem = React.memo(function TodoItem({ todo, onToggle }) {
  return (
    <li
      // 이 부분에서 todo.done이 정의가 없었음에도 어떻게 동작이 가능한지 궁금할 것이다.
      // 현재 todo.done은 undefined 상태로 굳이 따지면 false로 인식된다.
      // 따라서 todo.done을 초기화하지 않아도 동작하게 되며
      // onToggle()로 인해 undefined -> true -> false -> true -> false...
      // 이런 식으로 동작하게 된다.
      style={{ textDecoration: todo.done ? "line-through" : "none" }}
      onClick={() => onToggle(todo.id)}
    >
      {todo.text}
    </li>
  );
});

// 컴포넌트 최적화를 위하여 React.memo를 사용한다.
const TodoList = React.memo(function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
});

function Todos({ todos, onCreate, onToggle }) {
  // Redux를 사용한다고 해서 모든 상태를 Redux에서 관리해야만 하는 것은 아니다!
  const [text, setText] = useState("");

  const onChange = (e) => setText(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    onCreate(text);
    setText("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={text}
          placeholder="Write Your To-Do"
          onChange={onChange}
        />
        <button type="submit">Add</button>
      </form>
      <TodoList todos={todos} onToggle={onToggle} />
    </div>
  );
}

export default Todos;
```

이번에는 container 컴포넌트를 만들어보자.

### containers/TodosContainer.js

```js
// container 컴포넌트
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Todos from "../components/Todos";
import { addTodo, toggleTodo } from "../modules/todos";

function TodosContainer() {
  // useSelector에서 꼭 객체를 반환 할 필요는 없다.
  // 한 종류의 값만 조회하고 싶으면 그냥 원하는 값만 바로 반환하면 된다.
  const todos = useSelector((state) => state.todos);

  const dispatch = useDispatch();

  const onCreate = (text) => dispatch(addTodo(text));

  // 최적화를 위해 useCallback 사용.
  const onToggle = useCallback((id) => dispatch(toggleTodo(id), [dispatch]));

  return <Todos todos={todos} onCreate={onCreate} onToggle={onToggle} />;
}

export default TodosContainer;
```

이제 App.js에 넣어줘서 렌더링을 해보자.

### src/App.js

```js
import React from "react";
import CounterContainer from "./containers/CounterContainer";
import TodosContainer from "./containers/TodosContainer";

function App() {
  return (
    <div>
      <CounterContainer />
      <hr />
      <TodosContainer />
    </div>
  );
}

export default App;
```

counter와 todo-list가 잘 동작하는 것을 확인 할 수 있다.

## 👀 useSelector 최적화

렌더링이 되는 것을 확인하는 리액트 익스텐션으로 확인해본 결과,  
counter가 동작할 때는 todo-list에 리렌더링이 발생하지 않지만,  
todos가 동작할 때는 counter가 리렌더링이 되는 것을 확인 할 수 있었다.  
이를 개선하기 위해 useSelector()를 살펴볼 것이다.

지금까지 작성한 container 컴포넌트가 두 개 있는데,  
TodosContainer, CounterContainer가 그 것이다.  
여기서 useSelector를 사용해서 리덕스 스토어에 접근했었다.

기본적으로 useSelector를 사용해서 리덕스 스토어의 상태를 조회 할 때는, 상태가 바뀌지않았다면 리렌더링을 하지 않는다.  
이 점을 기억하고 코드를 살펴보자.

### containers/TodosContainer.js

```js
const todos = useSelector((state) => state.todos);
```

TodoContainer에서는 counter의 값이 변하더라도 todos 값엔 변화가 없으므로 리렌더링이 되지않는다.

### containers/CounterContainer.js

```js
const { number, diff } = useSelector((state) => ({
  number: state.counter.number,
  diff: state.counter.diff,
}));
```

CounterContainer에서는 useSelector를 통해 렌더링 될 때마다 새로운 객체 {number, diff} 를 만들기 때문에, 상태가 바뀐건지 아닌지를 확인 할 수가 없으므로 낭비 렌더링이 발생한다.

이러한 낭비 렌더링을 최적화 하는데는 두 가지 방법이 있다.

1. useSelector 여러번 사용하기  
   코드를 다음과 같이 수정해보도록 하겠다.

```js
const number = useSelector((state) => state.counter.number);
const diff = useSelector((state) => state.counter.diff);
```

이렇게 하면 해당 값들 중 하나라도 바뀌었을 때에만 컴포넌트가 리렌더링 된다.

2. shallowEqual 함수를 useSelector의 두 번째 인자로 전달해주기  
   코드를 다음과 같이 수정해보도록 하겠다.  
   변경되는 부분만 작성한 것이다.

```js
import { useSelector, useDispatch, shallowEqual } from "react-redux";

const { number, diff } = useSelector(
  (state) => ({
    number: state.counter.number,
    diff: state.counter.diff,
  }),
  shallowEqual
);
```

useSelector의 두 번째 파라미터는 equalityFn인데,  
이전 값과 다음 값을 비교하여 true가 나오면 리렌더링을 하지않고, false가 나오면 리렌더링을 하는 것이다.  
shallowEqual(직역하자면 얕은 일치..?)은 react-redux 내장 함수로서, 객체 안의 가장 겉에 있는 값들을 모두 비교해준다.  
이게 무슨 말인가 하니, 만약 다음과 같은 객체가 있다고 하면

```js
const object = {
  a: {
    x: 3,
    y: 2,
    z: 1,
  },
  b: 1,
  c: [{ id: 1 }],
};
```

가장 겉에 있는 값은 object.a, object.b, object.c 이다.  
shallowEqual은 해당 값들만 비교하고, object.a.x나 object.c[0]은 비교하지 않는다는 것이다.

이렇게 둘 중 하나의 방식으로 최적화를 해주면, container 컴포넌트가 필요한 상황에만 리렌더링 될 것이다.
