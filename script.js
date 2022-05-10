Vue.createApp({
  data() {
    return {
      searchValue: "",
      currentListType: "All",
      currentTodo: "",
      todos: [],
    };
  },
  computed: {
    todoList() {
      let result = [];

      if (this.currentListType === "All") {
        result = this.todos;
      } else if (this.currentListType === "Done") {
        result = this.todos.filter((todo) => todo.done);
      } else if (this.currentListType === "Open") {
        result = this.todos.filter((todo) => !todo.done);
      }

      result = result.filter((todo) => todo.title.includes(this.searchValue));

      return result;
    },
  },
  methods: {
    toggleEdit(index) {
      this.todoList[index].edit = !this.todoList[index].edit;

      if (this.todoList[index].edit) {
        console.log("Test");
      } else {
        fetch("http://localhost:3000/todos/" + this.todoList[index].id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: this.todoList[index].title,
            done: this.todoList[index].done,
          }),
        }).then((response) => response.json());
      }
    },
    fetchTodos() {
      fetch("http://localhost:3000/todos")
        .then((response) => response.json())
        .then(
          (jsonResult) =>
            (this.todos = jsonResult.map((todo) => {
              return {
                ...todo,
                edit: false,
              };
            }))
        );
    },
    addNewTodo(event) {
      const newItem = {
        title: this.currentTodo,
        done: false,
      };

      this.todos.push(newItem);

      fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then(() => {
          this.currentTodo = "";
        });
    },
    updateDoneStatus(index) {
      this.todos[index].done = !this.todos[index].done;

      console.log(JSON.stringify(this.todos[index]));

      fetch("http://localhost:3000/todos/" + this.todos[index].id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.todos[index]),
      }).then((response) => response.json());
    },
    removeAllDoneItems() {
      this.todos = this.todos.filter((todo) => !todo.done);
    },
  },
  created() {
    this.fetchTodos();
  },
}).mount("#app");
