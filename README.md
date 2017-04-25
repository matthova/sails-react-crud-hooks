A basic way to add react "create", "update", and "destroy" hooks to a sailsjs resource

```
npm install --save sails-react-crud-hooks
```

Add socket events for handling creation, updating, or removal of any sails model object
```javascript
  import * as addCrud from 'sails-react-crud-hooks';
  ...
  constructor() {
    super();
    addCrud('todo', this);
  }
```

I plan on using this module for any sails model that I will interact with in React.
Here's an example of a 'todo' app where the 'todo' asset is inserted at the App root


```javascript
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import addCrud from 'sails-react-crud-hooks';
import autoBind from 'react-autobind';

import Todos from './components/Todos';

import './styles/App.css';

class App extends Component {
  constructor() {
    super();

    const io = sailsIOClient(socketIOClient);
    io.sails.url = 'http://localhost:1337';

    this.state = {
      io,
    };

    addCrud('todo', this);
    autoBind(this);
  }

  render() {
    return (
      <div className="App">
        <Todos
          io={this.state.io}
          todos={this.state.todos}
          createTodo={this.createTodo}
          updateTodo={this.updateTodo}
          destroyTodo={this.destroyTodo}
        />
      </div>
    );
  }
}

export default App;
```

