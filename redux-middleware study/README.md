# Redux middleware (React)

리덕스 미들웨어는 액션이 디스패치 된 다음, 리듀서에서 해당 액션을 받아와서 업데이트를 하기 전에 추가적인 작업을 할 수 있게 해준다.  
예를 들어

- 특정 조건에 따라 액션이 무시되게 만들 수 있다.
- 액션을 콘솔에 출력하거나, 서버쪽에 로깅할 수 있다.
- 액션이 디스패치 됐을 때, 이를 수정해서 리듀서에게 전달되도록 할 수 있다.
- 특정 액션이 발생했을 때, 이에 기반하여 다른 액션이 발생되도록 할 수 있다.
- 특정 액션이 발생했을 때, 특정 자바스크립트 함수를 실행시킬 수 있다.

보통 비동기 작업을 처리할 때 많이 사용한다. 백엔드에서 API를 받아오는 경우!

## 👀 Redux module 준비

이 부분은 Redux를 공부했을 때와 동일하다. 당연하게도 Redux에 middleware가 더해진 것이라 같을 수 밖에...

### modules/counter.js

```js
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

const initialState = 0;

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;

    case DECREASE:
      return state - 1;

    default:
      return state;
  }
}
```

바로 Root Reducer를 만들도록하자.

### modules/index.js

```js
import { combineReducers } from "redux";
import counter from "./counter";

const rootReducer = combineReducers({ counter });

export default rootReducer;
```

그리고나서 스토어를 만들도록하자.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

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

스토어까지 준비를 했으니 presentational 컴포넌트를 만들어보자.

### components/Counter.js

```js
import React from "react";

function Counter({ number, onIncrease, onDecrease }) {
  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+</button>
      <button onClick={onDecrease}>-</button>
    </div>
  );
}

export default Counter;
```

container 컴포넌트도 만들자.  
계속 연습하면서 느낀 건데 container를 먼저 만드는 것이 구조를 이해하는데 더 편한 것 같다.  
물론 완전히 처음부터 프로젝트를 만든다면 컴포넌트를 왔다갔다 하면서 만들겠지만...?

### containers/CounterContainer.js

```js
import React from "react";
import Counter from "../components/Counter";
import { useSelector, useDispatch } from "react-redux";
import { increase, decrease } from "../modules/counter";

function CounterContainer() {
  const number = useSelector((state) => state.counter);

  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increase());
  };
  const onDecrease = () => {
    dispatch(decrease());
  };

  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
}

export default CounterContainer;
```

이제 App.js에 적용해서 렌더링을 해보자.

### src/App.js

```js
import React from "react";
import CounterContainer from "./containers/CounterContainer";

function App() {
  return <CounterContainer />;
}

export default App;
```

여기까지는 Redux study 때와 크게 다른 것이 전혀 없다.  
이제 middleware 파트로 들어가보자!!

## 👀 middleware 이해하기

미들웨어는 쉽게 말하면 함수를 연달아 두 번 리턴하는 함수다.  
사용법은 아래와 같다.

```js
const middleware = (store) => (next) => (action) => {
  // 하고 싶은 작업...
};

// 위 코드는 아래와 같이 동작한다.
function middleware(store) {
  return function (next) {
    return function (action) {
      // 하고 싶은 작업...
    };
  };
}
```

첫 번째, store는 리덕스 스토어 인스턴로, dispatch, getState, subscribe 내장함수들이 들어있다.  
두 번째, next는 액션을 다음 미들웨어에게 전달하는 함수이다. next(action) 이런 형태로 사용한다.  
만약, 다음 미들웨어가 없다면 리듀서에게 액션을 전달해준다. 또한, next를 호출하지 않게 된다면 액션이 무시처리되어 리듀서에게로 전달되지않는다.  
세 번째, action은 현재 처리하고 있는 액션 객체이다.

리덕스 스토어에는 여러 개의 미들웨어를 등록할 수 있다.  
새로운 액션이 디스패치 되면 첫 번째로 등록한 미들웨어가 호출된다.  
만약에 미들웨어에서 next(action)을 호출하게 되면 다음 미들웨어로 액션이 넘어간다.  
미들웨어에서 store.dispatch를 사용하면 다른 액션을 추가적으로 발생시킬 수 도 있다.

## 👀 middleware 연습해보기

### middlewares/myLogger.js

```js
const myLogger = (store) => (next) => (action) => {
  console.log(action); // 어떤 액션인지 출력해보자.
  const result = next(action); // 다음 미들웨어(또는 리듀서)에게 액션 전달

  // 업데이트 이후(액션이 리듀서까지 전달되고 난 후)의 상태를 출력해보자.
  console.log("\t", store.getState());

  return result;
  // 여기서 반환하는 값은 dispatch(action)의 결과물. 기본: undefined
};

export default myLogger;
```

간단하게 미들웨어를 만들어봤으니, 스토어에 적용해야한다.  
스토어에 미들웨어를 적용 할 때는 applyMiddleware 함수를 사용한다.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules/index";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import myLogger from "./middlewares/myLogger";

// 다음과 같은 방법으로 미들웨어를 스토어에 적용한다.
const store = createStore(rootReducer, applyMiddleware(myLogger));

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

## 👀 redux-logger 사용, middleware와 DevTools 함께 사용하기

redux-logger는 디스패치된 액션의 타입과 이전 상태, 다음 상태를 보여주는 라이브러리이다.  
DevTools는 Redux study에서 봤던 것과 동일하다. extension과 코드를 연결하는..?  
따라서 추가 설명은 하지않겠다.  
위의 두 설명을 코드에 적용하면 다음과 같다.  
myLogger.js로 구현했던 기능은 redux-logger로 구현되므로 삭제했다.

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules/index";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// 아래와 같은 방법으로 DevTools와 redux-logger를 사용하면 된다.
// 개발자 도구에서 액션 동작을 깔끔하게 확인할 수 있게된다.
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);

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

## 👀 redux-thunk

redux-thunk는 비동기 작업을 처리 할 때 가장 많이 사용하는 미들웨어이다.  
이걸 사용하면 액션 객체가 아닌 함수를 디스패치 할 수 있다!!!  
함수를 디스패치할 때는 dispatch와 getState를 파라미터로 받아와야한다.  
그리고 이를 만들어주는 함수를 thunk라고 부른다.  
간단하게 코드 예시를 보자.

```js
const getComments = () => (dispatch, getState) => {
  // 이 안에서는 액션을 dispatch 할 수도 있고
  // getState를 사용하여 현재 상태도 조회 할 수 있습니다.
  const id = getState().post.activeId;

  // 요청이 시작했음을 알리는 액션
  dispatch({ type: "GET_COMMENTS" });

  // 댓글을 조회하는 프로미스를 반환하는 getComments 가 있다고 가정해봅시다.
  api
    .getComments(id) // 요청을 하고
    .then((comments) =>
      dispatch({ type: "GET_COMMENTS_SUCCESS", id, comments })
    ) // 성공시
    .catch((e) => dispatch({ type: "GET_COMMENTS_ERROR", error: e })); // 실패시
};

// 위 코드는 async/await 를 사용해서 나타내도 무관하다.
const getComments = () => async (dispatch, getState) => {
  const id = getState().post.activeId;
  dispatch({ type: "GET_COMMENTS" });
  try {
    const comments = await api.getComments(id);
    dispatch({ type: "GET_COMMENTS_SUCCESS", id, comments });
  } catch (e) {
    dispatch({ type: "GET_COMMENTS_ERROR", error: e });
  }
};
```

대략 어떤 식으로 코드를 작성하는지 확인했으니 연습을 해보자.
redux-thunk를 다운받으면 src/index.js의 미들웨어 부분에 넣어주자.

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules/index";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";

// logger를 사용할 때는 항상 가장 마지막에 오게 작성해야한다.
// 여러 개의 미들웨어를 적용할 수 있다는 것을 확인 가능.
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, logger))
);

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

이제 기존에 작성했던 코드들에 thunk 함수를 추가해보자.

### modules/counter.js

```js
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// dispatch를 파라미터로 받는 thunk 함수
export const increaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(increase()), 1000);
};

export const decreaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(decrease()), 1000);
};

const initialState = 0;

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;

    case DECREASE:
      return state - 1;

    default:
      return state;
  }
}
```

이제 container 컴포넌트에 적용해보자.

### containers/CounterContainer.js

```js
import React from "react";
import Counter from "../components/Counter";
import { useSelector, useDispatch } from "react-redux";
import { increaseAsync, decreaseAsync } from "../modules/counter";

function CounterContainer() {
  const number = useSelector((state) => state.counter);

  const dispatch = useDispatch();

  const onIncrease = () => dispatch(increaseAsync());
  const onDecrease = () => dispatch(decreaseAsync());

  return (
    <Counter onIncrease={onIncrease} onDecrease={onDecrease} number={number} />
  );
}

export default CounterContainer;
```

1000ms의 텀을 두고 increase와 decrease 액션이 디스패치 된다.

## 👀 redux-thunk로 Promise 다루기

우선 Promise를 사용해 데이터를 반환할 가짜 API 함수를 만들자.

### api/posts.js

```js
// n ms 동안 기다리는 프로미스를 만들어주는 함수
const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

// 더미 데이터
const posts = [
  {
    id: 1,
    title: "리덕스 미들웨어를 배워봅시다",
    body: "리덕스 미들웨어를 직접 만들어보면 이해하기 쉽죠",
  },
  {
    id: 2,
    title: "redux-thunk를 사용해봅시다",
    body: "redux-thunk를 사용해서 비동기 작업을 처리해봅시다!",
  },
  {
    id: 3,
    title: "redux-saga도 사용해봅시다",
    body: "나중엔 redux-saga를 사용해서 비동기 작업을 처리하는 방법도 배워볼 거예요.",
  },
];

// 데이터 목록을 가져오는 비동기 함수
export const getPosts = async () => {
  await sleep(500);
  return posts;
};

// ID로 데이터를 조회하는 비동기 함수
export const getPostById = async (id) => {
  await sleep(500);
  return posts.find((post) => post.id === id);
};
```

이제 리덕스 모듈을 준비하자.  
프로미스를 다루는 리덕스 모듈을 생성할 때는 다음 사항들을 고려해야한다.

- 프로미스가 시작, 성공, 실패했을 때 다른 액션을 디스패치해야한다.
- 각 프로미스마다 thunk 함수를 만들어줘야한다.
- 리듀서에서 액션에 따라 로딩중, 결과, 에러 상태를 변경해줘야한다.

### modules/posts.js

```js
// api/posts 안의 함수 모두 불러오기
import * as postsAPI from "../api/posts";

// 포스트 여러개 조회하기
const GET_POSTS = "GET_POSTS"; // 요청 시작
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; // 요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

// thunk 를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없다.
// 그냥 thunk 함수에서 바로 액션 객체를 만들어도 괜찮다.
export const getPosts = () => async (dispatch) => {
  dispatch({ type: GET_POSTS }); // 요청이 시작
  try {
    const posts = await postsAPI.getPosts(); // API 호출
    dispatch({ type: GET_POSTS_SUCCESS, posts }); // 성공
  } catch (e) {
    dispatch({ type: GET_POSTS_ERROR, error: e }); // 실패
  }
};

// thunk 함수에서도 파라미터를 받아와서 사용 할 수 있다.
export const getPost = (id) => async (dispatch) => {
  dispatch({ type: GET_POST }); // 요청이 시작
  try {
    const post = await postsAPI.getPostById(id); // API 호출
    dispatch({ type: GET_POST_SUCCESS, post }); // 성공
  } catch (e) {
    dispatch({ type: GET_POST_ERROR, error: e }); // 실패
  }
};

const initialState = {
  posts: {
    loading: false,
    data: null,
    error: null,
  },
  post: {
    loading: false,
    data: null,
    error: null,
  },
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: null,
        },
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          loading: true,
          data: action.posts,
          error: null,
        },
      };
    case GET_POSTS_ERROR:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: action.error,
        },
      };
    case GET_POST:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: null,
        },
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        post: {
          loading: true,
          data: action.post,
          error: null,
        },
      };
    case GET_POST_ERROR:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
```

정말 길다...posts와 post를 따로 만들어야하니 이런 일이 발생했다.  
반복되는 코드들을 따로 함수화해서 리팩토링을 하면 훨씬 깔끔해질 것이다.  
조금씩 정리를 해보자.

### lib/asyncUtils.js

```js
// Promise에 기반한 Thunk를 만들어주는 함수
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성되었다.
  // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 된다.
  // 예: writeComment({ postId: 1, text: '댓글 내용' });
  return (param) => async (dispatch) => {
    // 요청 시작
    dispatch({ type, param });
    try {
      // 결과물의 이름을 payload 라는 이름으로 통일시켰다.
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload }); // 성공
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true }); // 실패
    }
  };
};

// 리듀서에서 사용 할 여러 유틸 함수 생성
export const reducerUtils = {
  // 초기 상태.
  // 초기 data 값은 기본적으로 null 이지만 바꿀 수 있다.
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
  }),

  // 로딩중 상태.
  // prevState의 경우엔 기본값은 null 이지만
  // 따로 값을 지정하면 null 로 바꾸지 않고 다른 값을 유지시킬 수 있다.
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null,
  }),

  // 성공 상태
  success: (payload) => ({
    loading: false,
    data: payload,
    error: null,
  }),

  // 실패 상태
  error: (error) => ({
    loading: false,
    data: null,
    error: error,
  }),
};
```

함수로 리팩토링을 했으니 리덕스 모듈에 적용해보자.

### modules/posts.js

```js
import * as postsAPI from "../api/posts";
import { createPromiseThunk, reducerUtils } from "../lib/asyncUtils";

const GET_POSTS = "GET_POSTS";
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
const GET_POSTS_ERROR = "GET_POSTS_ERROR";

const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

// thunk 함수 부분이 엄청 깔끔해졌다!
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: reducerUtils.loading(),
      };

    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: reducerUtils.success(action.payload),
        // action.posts -> action.payload 로 변경됐다.
      };

    case GET_POSTS_ERROR:
      return {
        ...state,
        posts: reducerUtils.error(action.error),
      };

    case GET_POST:
      return {
        ...state,
        post: reducerUtils.loading(),
      };

    case GET_POST_SUCCESS:
      return {
        ...state,
        post: reducerUtils.success(action.payload),
      };

    case GET_POST_ERROR:
      return {
        ...state,
        post: reducerUtils.error(action.error),
      };

    default:
      return state;
  }
}
```

이전 코드에 비해서는 매우 깔끔해졌지만,  
여전히 리듀서 부분에서는 반복되는 코드가 많이 보인다.  
이 부분도 리팩토링을 통해 개선해보자.

### lib/asyncUtils.js

```js
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return (param) => async (dispatch) => {
    dispatch({ type, param });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload });
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true });
    }
  };
};

export const reducerUtils = {
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
  }),
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null,
  }),
  success: (payload) => ({
    loading: false,
    data: payload,
    error: null,
  }),
  error: (error) => ({
    loading: false,
    data: null,
    error: error,
  }),
};

// 비동기 관련 액션들을 처리하는 리듀서 생성
// type은 액션의 타입, key는 상태의 key(ex: posts, post)
export const handleAsyncActions = (type, key) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(),
        };

      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };

      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload),
        };

      default:
        return state;
    }
  };
};
```

코드를 그대로 가져와서 파라미터 형태로 변환했다.  
이제 이 코드를 또 한번 적용해보자.

### modules/posts.js

```js
import * as postsAPI from "../api/posts";
import {
  createPromiseThunk,
  reducerUtils,
  handleAsyncActions,
} from "../lib/asyncUtils";

const GET_POSTS = "GET_POSTS";
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
const GET_POSTS_ERROR = "GET_POSTS_ERROR";

const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

// 훨씬 간단하게 변했다!
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, "posts")(state, action);

    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActions(GET_POST, "post")(state, action);

    default:
      return state;
  }
}
```

참고로 다음 코드가 이해가 잘 안될 것이다.

```js
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, "posts")(state, action);
```

이 코드는 아래와 같다.

```js
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
      return postsReducer(state, action);
```

handleAsyncActions 함수는 type과 key를 파라미터로 받고,  
return에서 state와 action을 파라미터로 또 받기 때문에 저런 코드가 된 것이다.  
이제 리덕스 모듈을 루트 리듀서에 등록해주자.

### modules/index.js

```js
import { combineReducers } from "redux";
import counter from "./counter";
import posts from "./posts";

const rootReducer = combineReducers({ counter, posts });

export default rootReducer;
```

이제 presentational 컴포넌트를 만들어보자.

### components/PostList.js

```js
import React from "react";

function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default PostList;
```

이제 container 컴포넌트를 만들어보자.

### containers/PostListContainer.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../modules/posts";
import PostList from "../components/PostList";

function PostListContainer() {
  const { data, loading, error } = useSelector((state) => state.posts.posts);

  const dispatch = useDispatch();

  // 컴포넌트 마운트 후 데이터 목록 요청
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!data) return null;

  return <PostList posts={data} />;
}

export default PostListContainer;
```

이제 이 것을 렌더링해보자.

### src/App.js

```js
import React from "react";
import PostListContainer from "./containers/PostListContainer";

function App() {
  return <PostListContainer />;
}

export default App;
```

비동기 작업이 잘 처리 되는 것을 확인 할 수 있을 것이다.

## 👀 react-router 적용하기
