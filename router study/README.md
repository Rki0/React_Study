# Router study (React)

라우팅이란 사용자가 요청한 URL에 따라 알맞는 페이지를 보여주는 것을 의미한다.  
프로젝트를 만들 때, 하나의 페이지만 만들 수도 있고, 여러 페이지를 만들 수도 있는데,  
여러 페이지를 만들었을 경우 그들을 연결해놔서 사용자가 이동할 수 있게끔 만들 때 사용된다.

싱글 페이지 어플리케이션(Single Page Application)을 쉽게 만들 수 있는데,  
한 개의 페이지로 이루어진 어플리케이션이라는 뜻으로,  
html은 한번만 받아와 웹 어플리케이션을 실행시킨 후, 그 이후에는 필요한 데이터만 받아와서 화면에 업데이트 해주는 것을 말한다.  
기술적으로는 한 페이지만 존재하는 것이 아니지만, 사용자가 경험하기에는 여러 페이지가 존재하는 것 처럼 느낄 수 있다.

리액트 라우터와 같은 라우팅 시스템은 사용자의 브라우저 주소창의 경로에 따라 알맞는 페이지를 보여주는데, 링크를 눌러서 다른 페이지로 이동하게 될 때 서버에 다른 페이지의 html을 새로 요청하는 것이 아니라, 브라우저의 History API를 사용하여 브라우저의 주소창 값만 변경하고 기존 페이지에 띄웠던 웹 어플리케이션을 그대로 유지하면서 라우팅 설정에 따라 또 다른 페이지를 보여주게 된다.

## 👀 라이브러리 설치

react-router-dom 이라는 라이브러리를 통해 라우터 기능을 활용할 수 있다.

```
$ npm add react-router-dom
```

## 👀 프로젝트에 라우터 적용하기

### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

BrowserRouter 컴포넌트로 감싸게 되면 웹 어플리케이션의 History API를 사용해 페이지를 새로 불러오지 않고도 주소를 변경하고, 현재 주소의 경로에 관련된 정보를 리액트 컴포넌트에서 사용할 수 있게 된다.

## 👀 Route 사용해보기

우선, 홈으로 사용할 페이지와 이동할 페이지를 만들어보자.

### src/pages/Home.js

```js
const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>First page</p>
    </div>
  );
};

export default Home;
```

### src/pages/About.js

```js
const About = () => {
  return (
    <div>
      <h1>Introduction</h1>
      <p>React-Router Project~</p>
    </div>
  );
};

export default About;
```

이제 사용자의 브라우저 주소 경로에 따라 우리가 원하는 컴포넌트를 보여주기 위해서는 Route 컴포넌트를 통해 라우트 설정을 해야한다.

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";

const App = () => {
  return (
    {/* Route 컴포는트는 Routes 컴포넌트 내부에 사용해야한다! */}
    <Routes>
      {/* path = 주소 규칙, element = 보여 줄 컴포넌트 JSX */}
      {/* path = "/" 는 홈페이지를 의미 */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
```

## 👀 Link 컴포넌트 사용해보기

Link 컴포넌트는 페이지를 새로 불러오는 것을 막고 History API를 통해 브라우저 주소의 경로만 바꿔서 다른 페이지로 이동하는 기능을 가지고 있다.

Home 페이지에서 About 페이지로 이동할 수 있도록 Link 컴포넌트를 사용해보자.

### src/pages/Home.js

```js
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>First page</p>
      {/* to = 경로 */}
      {/* Introduction은 임의로 정한 링크 이름이다. 화면 상에 출력될 부분. */}
      {/* 클릭하면 About 페이지로 이동한다. */}
      <Link to="/about">Introduction</Link>
    </div>
  );
};

export default Home;
```

## 👀 URL 파라미터와 쿼리스트링

페이지 주소를 정의할 때, 유동적인 값을 사용해야할 때가 있다.  
URL 파라미터와 쿼리스트링이 그 예시이다.  
URL 파라미터는 주소의 경로에 유동적인 값을 넣는 형태로, ID 또는 이름을 사용하여 특정 데이터를 조회할 때 사용한다. (ex) /profile/velopert)  
쿼리스트링은 주소의 뒷부분에 ? 문자열 이후에 key=value 로 값을 정의하며 & 로 구분하는 형태이다. 키워드 검색, 페이지네이션, 정렬 방식 등 데이터 조회에 필요한 옵션을 전달할 때 사용한다. (ex) /articles?\*\*page=1&keyword=react)

URL 파라미터부터 연습해보자.

### src/pages/Profile.js

```js
// useParams는 URL 파라미터를 객체 형태로 조회할 수 있게 만들어주는 Hook이다.
import { useParams } from "react-router-dom";

// key - value 형태로 저장해놓은 프로필 정보
const data = {
  velopert: {
    name: "김민준",
    description: "리액트를 좋아하는 개발자",
  },
  gildong: {
    name: "홍길동",
    description: "고전 소설 홍길동전의 주인공",
  },
};

const Profile = () => {
  const params = useParams();
  // username은 Route 컴포넌트에 넣을 URL 파라미터의 이름이다.
  // profile은 data 객체의 key 값을 가지게 될 것이다.
  const profile = data[params.username];

  return (
    <div>
      <h1>사용자 프로필</h1>
      {/* username이라는 URL 파라미터를 통하여 프로필을 조회한 뒤 */}
      {profile ? (
        {/* 존재하면 프로필 정보를 보여주고 */}
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.description}</p>
        </div>
      ) : (
        {/* 존재하지 않으면 다음 문장을 출력한다. */}
        <p>존재하지 않는 프로필입니다.</p>
      )}
    </div>
  );
};

export default Profile;
```

이제 App.js에 라우트 설정을 해주자.

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* :username 과 같이 경로에 : 를 사용하여 URL 파라미터를 설정 */}
      {/* 만약 URL 파라미터가 여러개인 경우엔 /profiles/:username/:field 처럼 사용하면 된다. */}
      <Route path="/profiles/:username" element={<Profile />} />
    </Routes>
  );
};

export default App;
```

이제 Profile 페이지로 이동할 수 있도록 Home 페이지에 Link 컴포넌트를 만들어주자.

### src/pages/Home.js

```js
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>First page</p>
      <ul>
        <li>
          <Link to="/about">Introduction</Link>
        </li>
        <li>
          {/* :username 부분에 data 객체의 key를 넣어놓음 */}
          <Link to="/profiles/velopert">velopert의 프로필</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong의 프로필</Link>
        </li>
        <li>
          {/* 존재하지 않는 경우는 void를 입력해놓았다! */}
          <Link to="/profiles/void">존재하지 않는 프로필</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
```

이제 Link를 클릭하면 해당 username이 적용된 Profile 컴포넌트가 보여질 것이다.

이번에는 쿼리스트링을 연습해보자.  
이 때는 URL 파라미터와는 달리 Route 컴포넌트를 사용할 때 별도로 설정해야하는 것은 없다.  
우선 쿼리스트링을 화면에 띄워보는 것부터 해보자.

### src/pages/About.js

```js
// useLocation은 객체를 반환하며, 현재 사용자가 보고있는 페이지의 정보를 지니고 있는 Hook이다.
// pathname, search, hash, state, key 값들이 객체에 들어있다.
import { useLocation } from "react-router-dom";

const About = () => {
  const location = useLocation();

  return (
    <div>
      <h1>Introduction</h1>
      <p>React-Router Project~</p>
      {/* search를 통해 맨 앞의 ? 문자를 포함한 쿼리스트링 값을 볼 수 있다. */}
      {/* http://localhost:3000/about?detail=true&mode=1 이라고 주소창에 작성하면 */}
      {/* location.search에는 ?detail=true&mode=1 이라고 출력된다. */}
      <p>쿼리스트링: {location.search}</p>
    </div>
  );
};

export default About;
```

http://localhost:3000/about?detail=true&mode=1 이라고 주소창에 입력하면  
쿼리스트링 값이 ?detail=true&mode=1 로 나오는데,  
앞에 있는 ? 를 지우고, & 문자열로 분리한 뒤 key와 value를 파싱하는 작업을 해야한다.  
이 때, useSearchParams 라고 불리는 Hook을 사용한다.

### src/pages/About.js

```js
// useSearchParams는 배열을 반환한다.
import { useSearchParams } from "react-router-dom";

const About = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // 첫번째 원소는 쿼리파라미터를 조회하거나 수정하는 메서드들이 담긴 객체이다.
  // get 메서드를 통해 특정 쿼리 파라미터를 조회할 수 있고, set 메서드를 통해서 특정 쿼리 파라미터를 업데이트 할 수 있다.
  // 만약 조회 시 쿼리파라미터가 존재하지 않는다면 null로 조회된다.
  const detail = searchParams.get("detail");
  const mode = searchParams.get("mode");

  // 두번째 원소는 쿼리파라미터를 객체 형태로 업데이트 할 수 있는 함수를 반환한다.
  const onToggleDetail = () => {
    // 쿼리파라미터를 조회할 때 값은 무조건 문자열 타입이다.
    // 따라서 비교할 때는 반드시 ""로 감싸서 비교를 해야한다.
    setSearchParams({ mode, detail: detail === "true" ? false : true });
  };

  const onIncreaseMode = () => {
    // 같은 이유로 숫자 형태라면 parseInt를 통해 숫자 타입으로 바꿔야한다.
    const nextMode = mode === null ? 1 : parseInt(mode) + 1;
    setSearchParams({ mode: nextMode, detail });
  };

  return (
    <div>
      <h1>Introduction</h1>
      <p>React-Router Project~</p>
      <p>detail : {detail}</p>
      <p>mode : {mode}</p>
      <button onClick={onToggleDetail}>Toggle detail</button>
      <button onClick={onIncreaseMode}>mode + 1</button>
    </div>
  );
};

export default About;
```

## 👀 중첩된 라우트

이번에는 중첩된 라우트를 어떻게 다뤄야하는지 살펴볼 것이다.  
중첩된 라우트를 이해해보기 위해 다음과 같은 컴포넌트를 구성해보자.

### src/pages/Articles.js

```js
import { Link } from "react-router-dom";

const Articles = () => {
  return (
    <ul>
      <li>
        <Link to="/articles/1">게시글 1</Link>
      </li>
      <li>
        <Link to="/articles/2">게시글 2</Link>
      </li>
      <li>
        <Link to="/articles/3">게시글 3</Link>
      </li>
    </ul>
  );
};

export default Articles;
```

### src/pages/Article.js

```js
import { useParams } from "react-router-dom";

const Article = () => {
  // id는 URL 파라미터가 될 것이다.
  const { id } = useParams();

  return (
    <div>
      <h2>게시글 {id}</h2>
    </div>
  );
};

export default Article;
```

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profiles/:username" element={<Profile />} />
      <Route path="/articles" element={<Articles />} />
      {/* URL 파라미터로 id가 사용된 것을 확인할 수 있다. */}
      <Route path="/articles/:id" element={<Article />} />
    </Routes>
  );
};

export default App;
```

라우트를 설정해줬으니 Home 페이지에서 이동할 수 있는 Link를 만들자.

### src/pages/Home.js

```js
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>First page</p>
      <ul>
        <li>
          <Link to="/about">Introduction</Link>
        </li>
        <li>
          <Link to="/profiles/velopert">velopert의 프로필</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong의 프로필</Link>
        </li>
        <li>
          <Link to="/profiles/void">존재하지 않는 프로필</Link>
        </li>
        <li>
          <Link to="/articles">게시글 목록</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
```

Home 페이지에서 '게시글 목록'을 누르면 Articles 페이지를 보게되고, 거기서 '게시글 1'을 누르면 id가 1인 Article 페이지를 보게된다.

이 상황에서 Article 페이지에 게시글 목록까지 보여주고자 한다면 어떻게 해야할까??  
기존 방식으로 생각하면 게시글 목록 컴포넌트를 하나 따로 만들어서 각 페이지 컴포넌트에 넣어줬을 것이다. 다음과 같이 말이다.

```js
<div>
  <h2>게시글 {id}</h2>
  <ArticleList />
</div>
```

그런데, 중첩된 라우트를 사용하면 훨씬 쉽게 구현 할 수 있다!!  
중첩된 라우트를 만들어보자!

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profiles/:username" element={<Profile />} />

      {/* 중첩된 라우트 */}
      {/* /articles와 /articles/:id 였던 것을 */}
      {/* 중복된 부분을 묶어서 위쪽으로 분리했다!! */}
      <Route path="/articles" element={<Articles />}>
        <Route path=":id" element={<Article />} />
      </Route>
    </Routes>
  );
};

export default App;
```

그 다음으로는 중첩된 라우트 부분(Articles 컴포넌트)에 Outlet 컴포넌트를 사용해야한다.

### src/pages/Articles.js

```js
// Outlet 컴포넌트는 Route의 children으로 들어가는 JSX 엘리먼트를 보여준다.
// Articles 컴포넌트에서 사용했으니
// <Route path=":id" element={<Article />} /> 가 Outlet으로 보여질 것!!
import { Link, Outlet } from "react-router-dom";

const Articles = () => {
  return (
    <div>
      {/* Outlet 컴포넌트가 사용된 자리에 <Article />이 보여지게된다. */}
      <Outlet />
      <ul>
        <li>
          <Link to="/articles/1">게시글 1</Link>
        </li>
        <li>
          <Link to="/articles/2">게시글 2</Link>
        </li>
        <li>
          <Link to="/articles/3">게시글 3</Link>
        </li>
      </ul>
    </div>
  );
};

export default Articles;
```

이제 Article 페이지에 들어갔을 때 하단에 게시글 목록이 보인다!!  
게시글 목록을 구현했던 Articles 가 Articles 페이지에서도 보여야하고, 각 id의 Article 페이지에서도 보여야하므로 중첩되는 것을 표현하는 개선된 방법이 중첩된 라우트인 것이다.

## 👀 공통 레이아웃 컴포넌트

중첩된 라우트와 Outlet은 페이지끼리 공통적으로 보여줘야 하는 레이아웃이 있을 때에도 유용하게 쓰인다.  
예를 들어, 지금까지 만든 페이지 상단에 header를 보여주고싶다고 해보자.  
아마 Header 컴포넌트를 따로 만들어두고 각 페이지 컴포넌트에서 재사용하는 방법을 가장 먼저 떠올릴 것이다. 물론 맞는 방법이다.

하지만, 이번에 배운 중첩된 라우트와 Outlet을 이용할 수도 있다.  
이 방법을 사용하면 컴포넌트를 한번만 사용해도 된다는 장점이 있다.

중첩된 라우트를 통해 공통 레이아웃 컴포넌트를 사용해보자.

### src/Layout.js

```js
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header style={{ background: "lightgray", padding: 16, fontSize: 24 }}>
        Header
      </header>
      <main>
        {/* 아래 App.js에 라우트한 코드를 보면 */}
        {/* Outlet은 <Home />, <About />, <Profile /> 이 될 것이다.*/}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
```

이제 App.js에 라우트를 해주자.

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      {/* 중첩된 라우트 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profiles/:username" element={<Profile />} />
      </Route>

      <Route path="/articles" element={<Articles />}>
        <Route path=":id" element={<Article />} />
      </Route>
    </Routes>
  );
};

export default App;
```

이제 Home, About, Profile 페이지에서 Header 부분이 보여지게 될 것이다.  
두 번째 예시까지 보니까 이해가 되는 것 같다.  
Outlet은 중첩되는 부분을 말하는게 아니라, 중첩되는 부분 외에 보여질, 즉, 계속 바뀌는 부분들을 말하는 것이다.  
Outlet은 변하는 부분이고, Outlet 외에 작성된 부분들이 중첩되는 부분인 것이다!!

## 👀 index props

Route 컴포넌트에는 index라는 props가 있다.  
이는 path="/" 와 동일한 의미를 가진다.  
지금까지 만든 코드들 중에서는 Home 컴포넌트에 이 것이 적용될 수 있겠다.

## src/App.js

```js
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profiles/:username" element={<Profile />} />
      </Route>

      <Route path="/articles" element={<Articles />}>
        <Route path=":id" element={<Article />} />
      </Route>
    </Routes>
  );
};

export default App;
```

index prop은 상위 라우트의 경로와 일치하지만, 그 이후에 경로가 주어지지 않았을 때 보여지는 라우트를 설정할 때 사용한다.  
Layout에 path="/"로 설정되었는데, 이는 Home의 상위 라우트이므로 index는 path="/"가 된다.

## 👀 react-router 부가 기능

1. useNavigate

useNavigate는 Link 컴포넌트를 사용하지 않고 다른 페이지로 이동을 해야하는 상황에 사용하는 Hook이다.

### src/Layout.js

```js
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const goBack = () => {
    // 이전 페이지로 이동(뒤로 한 페이지)
    navigate(-1);
  };

  const goArticles = () => {
    // articles 경로로 이동(Articles 페이지로 이동)
    navigate("/articles");
  };

  return (
    <div>
      <header style={{ background: "lightgray", padding: 16, fontsize: 24 }}>
        {/* 버튼을 누르면 각각 이전 페이지, Articles 페이지로 이동 */}
        <button onClick={goBack}>Go Back</button>
        <button onClick={goArticles}>Go Airticle List</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
```

navigate를 사용할 때 파라미터가 숫자라면 앞으로 가거나 뒤로 간다.  
예를 들어, navigate(-1)을 하면 뒤로 한 페이지 가고, navigate(-2)를 하면 뒤로 두 페이지를 간다.  
반대로 navigate(1)을 하면 앞으로 한 페이지를 간다. 물론, 이 경우에는 뒤로가기를 한 번 한 상태여야 한다.

추가로, 다른 페이지로 이동할 때 replace라는 옵션이 있다.  
이 옵션을 사용하면 페이지를 이동할 때 현재 페이지를 페이지 기록에 남기지 않는다.  
...? 이게 무슨 소리일까???  
위 코드에서 작성한 goArticles 함수를 다음과 같이 수정해보자.

```js
const goArticles = () => {
  navigate("/articles", { replace: true });
};
```

이제 Home 페이지에 들어가서 About 페이지로 이동한 뒤, header에 보이는 Articles 페이지로의 이동 버튼을 통해 Articles 페이지로 이동해보자.  
그리고 브라우저의 뒤로가기 버튼을 누르면...!  
Home 페이지로 이동이 되었다!  
분명히 Home -> About -> Articles 순서로 이동했는데 어떻게 된걸까??

만약, {replace: true}라는 옵션이 없었다면 직전에 봤던 페이지인 About 페이지가 나왔겠지만, 이 옵션을 활성화했기 때문에 About의 이전 페이지인 Home 페이지가 나타난 것이다.  
이 옵션을 활성화시키면 Home -> Articles 순서로 이동한 것처럼 된다고 생각하면 이해가 쉽다.

2. NavLink

NavLink 컴포넌트는 링크에서 사용하는 경로가 현재 라우트의 경로와 일치하는 경우 특정 스타일 또는 CSS 클래스를 적용하는 컴포넌트이다.  
이 컴포넌트를 사용할 때 style이나 className을 설정하면 {isActive: boolean}을 파라미터로 전달받는 함수 타입의 값을 전달한다.  
역시 이해가 어렵다. 예시를 살펴보자.

```js
<NavLink
  style={({isActive}) => isActive ? activeStyle : undefined}
/>

<NavLink
  className={({isActive}) => isActive ? 'active' : undefined}
/>
```

실제 우리가 작성했던 코드에 적용해보자.

### src/pages/Articles.js

```js
import { NavLink, Outlet } from "react-router-dom";

const Articles = () => {
  // isActive가 true일 경우의 스타일을 미리 만들어놓았다.
  // true라는 것은 해당 링크에서 사용되는 경로가 현재 페이지 경로와 일치한다는 뜻!
  const activeStyle = {
    color: "green",
    fontSize: 21,
  };

  return (
    <div>
      <Outlet />
      <ul>
        <li>
          <NavLink
            to="/articles/1"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            게시글 1
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/articles/2"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            게시글 2
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/articles/3"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            게시글 3
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Articles;
```

지금까지 작성한 코드대로라면 게시글 1에 들어가 있는 상태에서 게시글 목록이 보일 것이다.  
그런데, 게시글 목록에 현재 페이지인 게시글 1 또한 들어가있다.  
이 경우가 바로 isActive가 true인 경우이다.  
어떤 목록에서 현재 페이지가 어떤 요소인지를 보여줄 때 유용하겠다!

지금 Articles 컴포넌트를 보면 NavLink 컴포넌트로 표시되는 것들이 id 부분을 제외하면 동일한 것을 볼 수 있다.  
리팩토링을 통해 코드를 좀 더 깔끔하게 만들어주자.

### src/pages/Articles.js

```js
import { NavLink, Outlet } from "react-router-dom";

const Articles = () => {
  // id를 파라미터로 받아 NavLink에 전달
  const ArticleItem = ({ id }) => {
    const activeStyle = {
      color: "green",
      fontSize: 21,
    };

    return (
      <li>
        <NavLink
          to={`/articles/${id}`}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          게시글 {id}
        </NavLink>
      </li>
    );
  };

  return (
    <div>
      <Outlet />
      <ul>
        <ArticleItem id={1} />
        <ArticleItem id={2} />
        <ArticleItem id={3} />
      </ul>
    </div>
  );
};

export default Articles;
```

3. NotFound 페이지 만들기

사전에 정의되지 않은 경로에 사용자가 진입했을 때는 NotFound 페이지를 보여줘야한다.  
즉, 페이지를 찾을 수 없을 때 나타나는 페이지이다.

### src/pages/NotFound.js

```js
const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 64,
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      404
    </div>
  );
};

export default NotFound;
```

App.js에 라우트 해주자.

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profiles/:username" element={<Profile />} />
      </Route>

      <Route path="/articles" element={<Articles />}>
        <Route path=":id" element={<Article />} />
      </Route>

      {/* *는 wildcard 문자로, 아무 텍스트나 매칭한다는 뜻 */}
      {/* 라우트 엘리먼트의 상단에 위치하는 라우트들의 규칙(path)을 모두 확인하고 */}
      {/* 일치하는 라우트가 없다면 이 라우트가 화면에 나타나게 된다 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
```

4. Navigate 컴포넌트

Navigate 컴포넌트는 컴포넌트를 화면에 보여주는 순간 다른 페이지로 이동을 하고 싶을 때 사용한다. 설명만 보면 도대체 어디에 써먹는지 상상이 안된다.  
보통 사용자의 로그인이 필요한 페이지인데 로그인을 안했다면 로그인 페이지를 보여줘야하는 상황에 이용한다.  
코드를 통해 살펴보자.

### src/pages/Login.js

```js
// 로그인 페이지
const Login = () => {
  return <div>Login Page</div>;
};

export default Login;
```

### src/pages/Mypage.js

```js
import { Navigate } from "react-router-dom";

const Mypage = () => {
  // 로그인 상태에 따라 true나 false로 변할 변수
  const isLoggedIn = false;

  // isLoggedIn이 false일 경우 Navigate 컴포넌트가 보여진다.
  // 보여지는 순간 /login 경로(<Login />)로 이동된다.
  // replace 옵션이 활성화 상태이므로 Login 페이지에서 뒤로가기를 누르면 페이지가 두 번 뒤로 이동한다.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return <div>My page</div>;
};

export default Mypage;
```

이제 App.js에 라우팅 해주자.

### src/App.js

```js
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import About from "./pages/About";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profiles/:username" element={<Profile />} />
      </Route>

      <Route path="/articles" element={<Articles />}>
        <Route path=":id" element={<Article />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
```

이제 Mypage 페이지로 이동하는 순간, Login 페이지로 이동하게 될 것이다.

이렇게 react-router 라이브러리에 관한 기초 공부를 마치도록 하겠습니다.  
🥳 수고하셨습니다~
