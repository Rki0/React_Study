# axios study (React)

axios란 HTTP 비동기 통신 라이브러리이다.  
fetch와 같이 API를 요청하는 방법 중 하나로, fetch 보다 깔끔하게 사용할 수 있어서 인기가 굉장히 많다고 한다.

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
      "https://jsonplaceholder.typicode.com/users",
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
