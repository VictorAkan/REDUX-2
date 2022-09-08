import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm"

function App() {
  return (
    <div className="App pt-20 pb-32">
      <AddPostForm />
      <PostsList />
    </div>
  );
}

export default App;
