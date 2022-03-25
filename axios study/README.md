# axios study (React)

axios란 HTTP 비동기 통신 라이브러리이다.  
fetch와 같이 API를 요청하는 방법 중 하나로, fetch 보다 깔끔하게 사용할 수 있어서 인기가 굉장히 많다고 한다.

axios를 살펴본 뒤에는 다른 개념도 살펴볼 예정이다.  
axios와 같이 사용하는 다양한 개념들이 있는데 아래의 순서로 살펴볼 것이다.

1. useReducer
2. useAsync 커스텀 Hook
3. react-async

## 👀 axios

## GET

입력한 url에 존재하는 자원에 요청을 하는 코드이다.  
서버에서 어떤 데이터를 가져와서 보여준다거나 하는 용도로 쓰인다.  
따라서 get 메서드는 값이나 상태 등을 바꿀 수 없다.  
사용 방법은 아래와 같다.

```js
axios.get(url, [config]);
```

사용 방법을 봐도 크게 와닿지 않는다...  
실제 적용 예시를 살펴보자.  
벨로퍼트 아저씨의 개발 블로그가 큰 도움이 되었다.  
우선, 요청에 대한 상태를 관리 할 때에는 요청의 결과, 로딩 상태, 에러...이 3가지 상태를 관리해줘야한다는 것을 기억하고 시작하자.

### Users.js

```js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  // 요청의 결과, 로딩 상태, 에러...3가지 상태를 관리하기 위한 useState()
  const [users, setUsers] = useState(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    // 요청이 시작될 때는 요청의 결과와 에러를 초기화함.
    setUsers(null);
    setError(null);
    // 데이터 로딩이 진행 중인 것이므로 true로 설정.
    setLoad(true);

    // try와 catch는 같이 사용되므로 이 구조를 외워놓자!
    try {
      // 변수에 axios.get으로 받아온 데이터를 할당.
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      // .data를 사용해서 데이터를 받아올 수 있다.
      // response만 쓴다면 오류가 발생하니 주의!!
      setUsers(response.data);
    } catch (e) {
      // 에러를 감지하면 error에 값을 넣음.
      setError(e);
    }

    // 데이터 로딩이 끝났으니 load를 다시 false로 전환.
    setLoad(false);
  };

  // Users가 렌더링 될 때 한번 실행되도록 useEffect()
  // useEffect() 내부에서는 async를 사용할 수 없어서, fetchUsers()를 분리해서 만든 것임.
  useEffect(() => {
    fetchUsers();
  }, []);

  // load가 진행 중일 때 표시 될 내용.
  if (load) return <div>Loading...</div>;

  // error에 값이 있을 때(에러가 발생했을 때) 표시 될 내용.
  if (error) return <div>Error!!</div>;

  // users에 값이 없다면 !users === true 이므로 null을 변환.
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      {/* 클릭하면 데이터를 다시 불러올 수 있게 fetchUsers를 onClick에 넣어줌 */}
      <button onClick={fetchUsers}>ReLoad</button>
    </>
  );
}

export default Users;
```

위 예시 코드는 지정된 단순 데이터 요청을 수행하는 경우이다.  
따라서 get method에 url만 입력한 것을 확인 할 수 있다.

만약, 사용자 번호에 따라 다른 데이터를 불러와야할 경우에는 어떻게 해야할까?  
한 가지 방법은, "url/(사용자 번호)"를 get하는 것이다.  
또 다른 방법은 url을 입력하고, 사용자 번호값을 parameter 객체에 넣어 같이 넘겨 주면 된다.  
아래 예시 코드를 보자.

### Users.js

```js
// id가 1인 user의 데이터를 get

// 방법 1
const response = await axios.get(
  "https://jsonplaceholder.typicode.com/users/1"
);

// 방법 2
const response = await axios.get("https://jsonplaceholder.typicode.com/users", {
  params: {
    // url 뒤에 붙는 사용자 번호(id) 값
    id: 1,
  },
});
```

## POST

새로운 데이터를 전송(생성) 할 때 사용한다.  
post method의 두 번째 인자는 본문으로 보낼 데이터(객체)를 전달한다.  
보통 로그인, 회원가입 등 사용자가 생성한 파일을 서버에 업로드할 때 사용되며,  
주소창에 쿼리스트링이 남지 않아서 GET보다 안전하다.  
사용법은 아래와 같다.

```js
axios.post(
  "url주소",
  {
    data객체,
  },
  [, config]
);
```

마찬가지로 어떤 방식으로 사용하는지 와닿지 않는다...
실제 적용 예시를 살펴보자.

```js
import React, { useEffect } from "react";
import axios from "axios";

function Post() {
  const postUsers = async () => {
    const postResponse = await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      {
        // 보내고자 하는 데이터
        id: 11,
        username: "Rki0",
        name: "Pak-Kiyoung",
      }
    );

    console.log("post", postResponse.data);
  };

  useEffect(() => {
    postUsers();
  }, []);

  return <></>;
}

export default Post;
```

## PUT

데이터 내용을 수정할 때 사용한다.  
POST와 헷갈릴 수도 있는데, POST는 신규 데이터 입력이라고 생각하고,  
PUT은 기존 데이터의 수정이라고 생각하면 편하다.  
사용법은 아래와 같다.

```js
axios.put(url,data[,config])
```

이번에도 어떤 방식으로 사용하는지 와닿지 않는다...
실제 적용 예시를 살펴보자.

```js
import React, { useEffect } from "react";
import axios from "axios";

function Put() {
  const putUsers = async () => {
    const putResponse = await axios.post(
      "https://jsonplaceholder.typicode.com/users/사용자 id",
      {
        // 수정하고자 하는 데이터
        id: 1,
        username: "Revise username",
        name: "Revise name",
      }
    );

    console.log("put", putResponse.data);
  };

  useEffect(() => {
    putUsers();
  }, []);

  return <></>;
}

export default Put;
```

위 코드는 해당 url에서 id가 1인 데이터를 찾아서 username, name을 수정하는 코드이다.

## DELETE

데이터를 삭제할 때 사용한다.  
사용법은 아래와 같다.

```js
axios.delete(url[,config])
```

역시 어떤 방식으로 사용하는지 와닿지 않는다...
실제 적용 예시를 살펴보자.

```js
import React, { useEffect } from "react";
import axios from "axios";

function Delete() {
  const DeleteUsers = async () => {
    const DeleteResponse = await axios.delete(
      "https://jsonplaceholder.typicode.com/users",
      {
        // 제거하고자 하는 데이터
        id: 1,
        username: "Bret",
      }
    );
  };

  useEffect(() => {
    DeleteUsers();
  }, []);

  return <></>;
}

export default Delete;
```

위 코드는 해당 url에서 id가 1인 데이터를 삭제한다.  
이 방법은 데이터 베이스에 데이터가 많아서 헤더에 많은 정보를 담기 어려울 때 사용한다.  
특정 데이터를 선택해서 삭제할 때 사용하는 방법이라 생각하면 편하다.  
일반적인 Delete는 url까지만 적어서 사용한다.  
이 경우에는 전부 삭제 될 것으로 생각된다.

## 👀 useReducer

앞서 axios를 사용해 API로 데이터를 CRUD하는 방법에 대해서 알아보았다.  
예시 코드를 보면 useState와 setState(setLoad etc..)를 정말 많이 사용한다.  
이 점을 개선하기 위해 useReducer를 사용해보자.

useReducer는 반복되는 useState, setState 함수를 여러번 사용하지 않아도 되도록 해주고, 로직을 분리함으로써 다른 곳에서도 쉽게 재사용 할 수 있게 해준다.  
즉, 상태 업데이트 로직을 컴포넌트에서 분리시킬 수 있다는 것이다.
물론, useState를 사용하는 방법도 무방하므로 원하는 방법을 선택해서 사용하자.

아래는 useReducer를 사용하여 axios.get을 수행하는 코드이다.

### Users.js

```js
import { useEffect, useReducer } from "react";
import axios from "axios";

// reducer 함수 생성
// state 값과 action 함수를 파라미터로 받음.
// 현재 상태와 액션 객체를 파라미터로 받아와서 새로운 상태를 반환해주는 함수.
function reducer(state, action) {
  // 각 action 함수의 type에 따라 state를 설정해줌.
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };

    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };

    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };

    // 항상 default까지 써줘야하는 것을 잊지 말자.
    default:
      return new Error(`Unhandled actioin type : ${action.type}`);
  }
}

function Users() {
  // useReducer()는 reducer 함수와 초기 state를 파라미터로 가진다.
  // state는 앞으로 컴포넌트에서 사용할 수 있는 상태를 가르키고, dispatch는 액션을 발생시키는 함수이다.
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  const fetchUsers = async () => {
    // 액션 함수를 실행하는 dispatch(). 바로 아래는 type이 "LOADING"인 녀석을 실행하는 것.
    // setUsers, setError, setLoad를 하나의 코드로 처리 가능하다!
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      // 받아온 데이터(response.data)를 data에 넣어줌. reducer()에서 action.data로 받게 되는 것이 여기서 설정한 data.
      dispatch({ type: "SUCCESS", data: response.data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // state에 있는 loading, data, error를 사용. data는 users라는 키워드로 사용될 것.
  const { loading, data: users, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!users) return null;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>ReLoad</button>
    </div>
  );
}

export default Users;
```

이렇게 useReducer를 사용하면 관리해야하는 값이 여러개일 때 useState보다 간결명확한 코드를 작성할 수 있다.  
위에서도 말했지만 무조건 useReducer를 사용해야하는 것은 아니므로, 자료의 구조나 본인 취향에 맞게 선택해서 사용하자.

## 👀 useAsync 커스텀 Hook

데이터를 요청할 때마다 reducer를 작성하면 매우 번거로울 것이다.  
그래서 커스텀 Hook을 만들어서 요청 상태 관리 로직을 보다 쉽게 만들어보자.

위에서 작성한 코드(Users.js)에서 useReducer 기능들을 떼어낸 것이다.

### useAsync.js

```js
import { useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };

    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };

    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// useAsync의 첫번째 파라미터는 API 요청을 시작하는 함수이고, 두번째 파라미터는 deps인데 얘는 해당 함수 안에서 사용하는 useEffect의 deps로 설정됨.
// 그렇다면 deps는 나중에 특정 파라미터가 바뀔 때, 새로운 데이터를 불러오고싶은 경우 활용 할 수 있겠다!
function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false,
  });

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  // 요청 관련 상태와 fetchData 함수를 리턴한다.
  // fetchData()를 리턴해서 나중에 데이터를 쉽게 리로딩 할 수 있다.
  return [state, fetchData];
}

export default useAsync;
```

이렇게 되면, 기존 Users.js에 있던 코드를 삭제할 수 있다.  
결과는 아래와 같다.

### Users.js

```js
import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function Users() {
  const [state, refetch] = useAsync(getUsers, []);

  const { loading, data: users, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!users) return null;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>ReLoad</button>
    </div>
  );
}

export default Users;
```

매우 간결해졌다!  
Users 컴포넌트는 처음 렌더링 되는 시점부터 API를 요청한다.  
그런데 POST, PUT, DELETE 등 HTTP method를 사용하게 된다면 필요한 시점에서만 API를 호출해야하므로, 필요할 때만 API를 요청하는 기능이 있어야된다.  
이렇게 특정 버튼(특정 기능)을 눌렀을 때만 데이터를 받아오고 싶다면 어떻게 해야할까?

useAsync()에 세번 째 파라미터로 skip을 넣으면 된다!

### useAsync.js

```js
import { useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };

    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };

    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// 세번 째 파라미터로 skip이 추가됐다!
// 초기값을 false로 설정해서 skip을 하지않겠다는 것으로 표시해둠.
function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false,
  });

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  // 만약, skip이 true라면 useEffect에서는 아무런 작업도 하지않게된다.
  useEffect(() => {
    if (skip) return;
    fetchData();
  }, deps);

  return [state, fetchData];
}

export default useAsync;
```

useAsync.js에 기능을 추가했으니, Users.js에도 변화를 주자.  
변하는 부분은 크게 없지만, useAsync 부분에 skip 파라미터에 들어갈 값을 입력해줬고,  
클릭했을 때 API 호출이 진행되도록 해줄 버튼을 만들어주었다.

### Users.js

```js
import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function Users() {
  // 세번 째 파라미터로 추가된 true(skip에 들어갈 값). skip이 true이므로 useAsync.js에서 useEffect가 실행되지 않고 넘어감.
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  // users에 값이 없다면 버튼이 생기고, 이 버튼을 클릭 시 refetch 함수가 실행됨.
  // 여기서 refetch는 skip이 기본값인 false이므로, API 호출이 실행됨.
  if (!users) return <button onClick={refetch}>Load Data</button>;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      {/* 여기서도 마찬가지로 refetch는 skip이 기본값인 false이므로, API 호출이 실행됨 */}
      <button onClick={refetch}>ReLoad</button>
    </div>
  );
}

export default Users;
```

이렇게 특정 액션 시에만 API가 호출되도록 만들었다.  
만약, 특정한 사용자의 데이터를 얻고자 한다면 어떻게 해야할까?  
이런 경우는 API를 요청할 때 파라미터를 필요로 한다.  
아래의 코드를 살펴보자.

### User.js

```js
import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

// id를 파라미터로 받아서 API에 추가해줬다.
// 만약 id가 1인 사용자의 정보가 들어오면 https://...users/1 이 될 것이다.
async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  // useAsync()를 사용할 때, 파라미터를 포함시켜서 함수를 호출하는 새로운 함수를 만들어서 등록해주었다.
  // id가 변경 될 때마다 재호출되도록 deps에 id를 넣어줬다.
  const [state] = useAsync(() => getUser(id), [id]);
  const { loading, data: user, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email : </b> {user.email}
      </p>
    </div>
  );
}

export default User;
```

이제 파라미터로 사용되는 id를 관리하기 위해서 Users.js를 수정해보자.

### Users.js

```js
import React, { useState } from "react";
import axios from "axios";
import useAsync from "./useAsync";
import User from "./User";

async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function Users() {
  // id를 관리하기 위해 useState() 사용.
  const [userId, setUserId] = useState(null);
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!users) return <button onClick={refetch}>Load Data</button>;

  return (
    <div>
      <ul>
        {users.map((user) => (
          // 특정 유저 정보를 클릭하면 해당 유저의 id를 userId로 설정
          <li key={user.id} onClick={() => setUserId(user.id)}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>ReLoad</button>
      {/* userId가 true일 경우 User 컴포넌트를 출력. userId를 User 컴포넌트의 props로 사용.*/}
      {userId && <User id={userId} />}
    </div>
  );
}

export default Users;
```

이렇게 커스텀 Hook을 사용하여 API 호출과 reducer를 활용해봤다.  
reducer를 분리해내고 재사용하게 만들 수 있었다는 점에서 유용했던 것 같다.

## 👀 react-async

바로 위에서 커스텀 Hook을 이용해서 useAsync를 구현했었다.  
그런데, react-async라는 라이브러리에도 그와 비슷한 기능의 함수가 들어있다. 심지어 이름도 같다.  
직접 상태 관리를 위한 커스텀 Hook을 만들기 귀찮다면 이 라이브러리를 사용해보자.  
커스텀 Hook에서는 결과물이 배열로 반환되었는데,  
이 라이브러리를 사용하게 되면 결과물을 객체 형태로 반환된다.  
사용법을 알아보자.  
User.js를 react-async의 useAsync로 변환해보겠다.

### User.js

```js
import React from "react";
import axios from "axios";
import { useAsync } from "react-async";

// react-async에서 useAsync를 사용할 때, promise를 반환하는 함수의 파라미터를 객체 형태로 지정해야한다.
// 이렇게 해야 id 값을 따로 받아와서 사용할 수 있다.
async function getUser({ id }) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const {
    data: user,
    error,
    isLoading,
  } = useAsync({
    // promiseFn은 호출 할 함수를 의미
    promiseFn: getUser,
    id,
    // watch에 설정한 값이 바뀔 때마다 promiseFn에 넣은 함수가 다시 호출된다.
    watch: id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email : </b> {user.email}
      </p>
    </div>
  );
}

export default User;
```

이번에는 Users.js의 코드를 수정해보자.

### Users.js

```js
import React, { useState } from "react";
import axios from "axios";
import { useAsync } from "react-async";
import User from "./User";

async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);

  const {
    data: users,
    error,
    isLoading,
    reload,
  } = useAsync({
    promiseFn: getUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  // reload 함수를 통해 데이터를 다시 불러올 수 있다.
  if (!users) return <button onClick={reload}>Load Data</button>;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => setUserId(user.id)}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={reload}>ReLoad</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

이전에 Users 컴포넌트에 있던 코드는 Load Data 버튼을 눌러야지만 데이터를 불러오도록 만들어져 있었다.  
그런데 바로 위 코드처럼 하면 컴포넌트를 렌더링하는 시점부터 데이터를 불러오게 된다.  
이전에 skip을 통해 사용자의 특정 인터랙션에 따라 API를 호출하는 법을 배웠다.  
react-async 라이브러리를 사용할 때도 이런 기능을 사용할 수 있다.  
promiseFn 대신 deferFn을 사용하고, reload 대신 run을 사용하면 된다.  
코드를 통해 살펴보자.

### Users.js

```js
import React, { useState } from "react";
import axios from "axios";
import { useAsync } from "react-async";
import User from "./User";

async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);

  const {
    data: users,
    error,
    isLoading,
    run,
  } = useAsync({
    deferFn: getUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!users) return <button onClick={run}>Load Data</button>;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => setUserId(user.id)}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={run}>ReLoad</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

이제 렌더링 시에는 데이터를 요청하지 않고, Load Data 버튼을 눌렀을 때 데이터를 요청하게 된다.

위에서 useReducer를 사용하는 것과 useState를 사용하는 것은 우위가 없다고 했었다.  
커스텀 Hook과 react-async 또한 마찬가지다. 둘 사이에 우위는 없다.  
둘 사이의 차이를 살펴보고 본인에게 더 맞는 방법을 사용하자.  
작동방식만 완벽하게 알면 커스텀을 사용하는 것이 유지보수할 때는 본인에게 더 편하긴 하다.
