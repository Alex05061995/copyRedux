import { useReducer, createContext, useMemo, useContext } from 'react';

interface IPost {
  id: number;
  title: string;
  body: string; 
}

interface IInitialState {
  loading: boolean;
  posts: IPost[];
  error: string;
}

const initialState: IInitialState = {
  loading: false,
  posts: [],
  error: '',
}

enum ActionsTypes {
  //Получение постов
  GETPOSTSUCCESS = 'GETPOSTSUCCESS',
  GETPOSTSFETCHING = 'GETPOSTSFETCHING',
  GETPOSTERROR = 'GETPOSTERROR',

  //Удаление постов
  DELETEPOST = 'DELETEPOST',

  //Обновление постов
  UPDATEPOST = 'UPDATEPOST',
}

//Получение постов

interface IGetPostsSuccess {
  type: ActionsTypes.GETPOSTSUCCESS;
  payload: IPost[];
}

interface IGetPostsFetching {
  type: ActionsTypes.GETPOSTSFETCHING;
}

interface IGetPostsError {
  type: ActionsTypes.GETPOSTERROR;
  payload: string;
}

//Удаление постоов
interface IDeletePosts {
  type: ActionsTypes.DELETEPOST;
  payload: number;
}

//Обновление постов 
interface IUpdatePosts {
  type: ActionsTypes.UPDATEPOST;
  payload:  {
    id: number,
    text: string
  };
}


type Actions = IGetPostsSuccess | IGetPostsError | IGetPostsFetching | IDeletePosts | IUpdatePosts;

const reducer = (state: IInitialState, action: Actions) => {
  switch (action.type) {
    case ActionsTypes.GETPOSTSFETCHING: 
      return { ...state, loading: true};
    case ActionsTypes.GETPOSTSUCCESS: 
      return { ...state, loading: false, posts: [...state.posts, ...action.payload] };
    case ActionsTypes.GETPOSTERROR:
      return { ...state, loading: false, error: action.payload };
    case ActionsTypes.DELETEPOST:
      return { ...state, posts: [...state.posts.filter(post => post.id !== action.payload)]};
    case ActionsTypes.UPDATEPOST:
        return { ...state, posts: [...state.posts.map(post => {
          if(post.id === action.payload.id) {
            post.body = action.payload.text
          }
          return post
        })]};
    default: return state;
  }
}

type AllActions = {
  getPostsFetching: () => void;
  getPostsSuccess: (payload: IPost[]) => void;
  getPostsError: (payload: string) => void;
  deletePost: (payload: number) => void;
  updatePost: (payload: { id: number, text: string }) => void
}

type ContextValue = {
  state: IInitialState;
  actions: AllActions;
}

export const Context = createContext<ContextValue>({ state: initialState, actions: {  } as AllActions});

const getPostsFetching = () => ({ type: ActionsTypes.GETPOSTSFETCHING}) as IGetPostsFetching;
const getPostsSuccess = (payload: IPost[]) => ({ type: ActionsTypes.GETPOSTSUCCESS, payload: payload }) as  IGetPostsSuccess;
const getPostsError = (payload: string) => ({ type: ActionsTypes.GETPOSTERROR, payload: payload }) as  IGetPostsError;
const deletePost = (payload: number) => ({ type: ActionsTypes.DELETEPOST, payload: payload }) as IDeletePosts;
const updatePost = (payload: { id: number, text: string }) => ({ type: ActionsTypes.UPDATEPOST, payload: payload }) as IUpdatePosts;

const LocalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    getPostsFetching: () => dispatch(getPostsFetching()),
    getPostsSuccess: (payload: IPost[]) =>  dispatch(getPostsSuccess(payload)),
    getPostsError: (payload: string) =>  dispatch(getPostsError(payload)),
    deletePost: (payload:  number) => dispatch(deletePost(payload)),
    updatePost: (payload: { id: number, text: string }) => dispatch(updatePost(payload))
  }), [dispatch])

  const value = useMemo(() => ({
    state, actions
  }), [state, actions])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

const useBodyContext = () => useContext(Context);
const useBodyAction = () => useBodyContext().actions;
const useBodyState = () => useBodyContext().state;

export {
  LocalContextProvider,
  useBodyAction,
  useBodyState
}




