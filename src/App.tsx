import Body from "./components/Body";
import { useEffect } from 'react'
import { useBodyAction, useBodyState } from "./context/BodyContext";


function App() {

  const actions = useBodyAction();
  const state = useBodyState();

  const fetchData = async () => {
    try {
      actions.getPostsFetching();
      const posts: any = await fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json());

      setTimeout(() => {
        actions.getPostsSuccess(posts)
      }, 3000)
    } catch (error: any) {
      actions.getPostsError(error)
    }
  }

  useEffect( () => {
    fetchData();
  }, [])

  return (
      <div className="App">
        <Body />
        {state.loading && <div> ЗАГРУЗКА </div>}
        {state.posts.slice(0, 10).map(post => {
          return (
            <div style={{ padding: '20px', border: '2px', fontSize: '20px', fontWeight: '900'}} key={post.id}>
              <div>
                {post.body}
              </div>
              <button onClick={() => {
                actions.deletePost(post.id)
                console.log('DELETED');
                console.log(state.posts);
                
              }}>
                Удалить
              </button>
              <button onClick={() => {
                actions.updatePost({ text: 'ОБНОВЛЕНО', id: post.id });
                console.log('UPdated');
              }}>
                Обновить
              </button>
            </div>
          )
        })}
          {state.error && <div> ОШИБКА </div>}
      </div>
  );
}

export default App;
