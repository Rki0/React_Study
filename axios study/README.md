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
```

예시 코드가 꽤 길다. 그래도 정말 이해가 쉬운 예시이므로 천천히 살펴보자.  
주석을 꼭 잘 보면서 넘어가자. 동작 방식을 설명해놨다.
