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
