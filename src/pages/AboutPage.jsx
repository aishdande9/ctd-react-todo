
  import './AboutPage.css';

  function AboutPage() {
    return (
      <div className="about-page">
        <section className="about-card">
          <h1>About This Todo App</h1>

          <img
  className="about-image"
  src="https://plus.unsplash.com/premium_photo-1681487870238-4a2dfddc6bcb?fm=jpg&q=60&w=3000&auto=format&fit=crop"
  alt="Todo List"
/>
  
          <p>
            This application helps users manage their daily tasks by creating,
            updating, completing, filtering, and deleting todos.
          </p>
  
          <h2>Features</h2>
          <ul>
            <li>Add new todos</li>
            <li>Edit existing todos</li>
            <li>Check and uncheck completed todos</li>
            <li>Delete todos</li>
            <li>Filter and sort todos</li>
            <li>User authentication</li>
          </ul>
  
          <h2>Technologies Used</h2>
          <ul>
            <li>React</li>
            <li>React Router</li>
            <li>Context API</li>
            <li>useReducer</li>
            <li>Vite</li>
          </ul>
        </section>
      </div>
    );
  }
  
  export default AboutPage;
