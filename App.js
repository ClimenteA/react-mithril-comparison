
// A Simple Component

/*

class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById('hello-example')
);

*/


class HelloMessage {
    
    //or v.attrs or {attrs: props} in mithril attrs == props (see destructuring)
    view({attrs}) { 
        return m("div", attrs.name)
    }
}

m.render(
    document.getElementById('hello-example'),
    m(HelloMessage, {name: "Taylor"})
)


// A Stateful Component

/*
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}

ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);

*/

// https://github.com/MithrilJS/mithril.js/issues/2388
// https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4A9GIAE9KAE9JAJxgATBRgDuk4oRiS4xDMQCucSQCMMCgDpoh+yQGUDxuACFLkgLySAFAEovAD5JYBtJSVhiSTojBi9JAAYwyWSlYwU0EOTw+molQxhEXwDPYNDM8Mq4GGIASWEFADcMKB9-IKyKysqYhgBqPuzuySx8JTRlGAUfRn0KSQADABJgXuJWLQgcU0NJFZ80GE0AEQL-P3xiWgAZWmoWmAAVLZgnBQg0AHN-VgW-IfC7EkAEYEmD-l1JECho0IEciu1SiMfAByZQQRoAYlmxBREMBNlYNhsdiiGAADuT4oiyslIloYAAPKLeFEACRgUCgtEk6loCigyhRyVSNSMGU63Vh8OKQQByLRGJRFHl4SwqI+5KMuPmwBSkOGkmaUCMhQZzJVBuG9E12qKuiRjGZ8Rgl0snxq+GNptVUL8lsNap8TkMJncCnxw0jRLQMZsoywtFixB8yjuRhwDHwZloylk8wp5IhlBA1Vg1GIEHoCB4wIATIgAMxsDggTA4PD4ahwAQ0eiMZg8NgAXSoUA+AGsa6g21w8FgINp3uQqOLyDwSMRyXBEBJYuSJ58u7QsGIF0voAABYH4G8ANjPi8Iy-w-BLxFk5O4pbyEHJolYYdWCAA


class Timer {

    constructor() {
        this.state = { seconds: 0 }
        // redraw on change only this component
        this.initial_dom = undefined 
    }
    
    tick() {
        this.state = { seconds: this.state.seconds + 1 } 
    }
    
    oncreate(v) {
        // we forcing the diff only on this component
        this.initial_dom = v.dom 
        this.interval = setInterval( _ => {
            this.tick()
            m.render(this.initial_dom, this.view())
        }, 1000)
    }

    onremove() {
        clearInterval(this.interval)
    }

    view() {
        return m("div", this.state.seconds)
    }

}


m.mount(
    document.getElementById('timer-example'),
    Timer
)



// An Application TODO

/*

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            What needs to be done?
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Add #{this.state.items.length + 1}
          </button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }));
  }
}


class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('todos-example')
);

*/


class TodoApp {

    constructor() {
        this.state = { items: [], text: '' }
    }

    view() {
        return [
            m("h3", "TODO"),
            m(TodoList, {items:this.state.items}),
            m("form", {onsubmit: e => this.handleSubmit(e)},
                m("label", {for:"new-todo"}, "What needs to be done?"),
                m("input", {
                    id:"new-todo", 
                    onchange: e => this.handleChange(e),
                    value:this.state.text
                }),
                m("button", "Add #" + Number(this.state.items.length + 1))
            )
        ]
    }
    
    handleChange(e) {
        this.state.text = e.target.value
        console.log("Change handled ", this.state.text)
    }

    handleSubmit(e) {
        
        e.preventDefault()
        
        if (this.state.text.length === 0) {
            return
        }

        const newItem = {
            text: this.state.text,
            id: Date.now()
        }

        this.state.items = this.state.items.concat(newItem)
        this.state.text = ""

        console.log("Submit handled ", this.state)

    }

}

class TodoList {
    
    view(v) {
        return m("ul", 
            v.attrs.items.map(item => {
                return m("li", {key:item.id}, item.text)
            })
        )
    }
}


m.mount(
    document.getElementById('todos-example'),
    TodoApp
)



// Overview 

/*

class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />

*/


class ShoppingList {

    view({attrs: props}){ // aka get attrs as props
        return [
            m(".shopping-list", [
                m("h1", `Shopping List for ${props.name}`),
                m("ul", [
                    m("li", "Instagram"),
                    m("li", "WhatsApp"),
                    m("li", "Oculus"),
                ])
            ])
        ]
    }
}


m.render(
    document.getElementById('Overview'),
    m(ShoppingList, {name:"Mark"})
)



// Tic tac toe final react tutorial result
// https://codepen.io/gaearon/pen/gWWZgR?editors=0010
// https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIDmBDAthAdAFZggA0IAZgJYwmoDaoAdrhGiPgBbw5RkiwA9k0Qj2IAL6lmrdmHhZEREuSEiIY9GvkACAMoLEOgLw6AFAEoTAPnPAAOkx07OVeYIBOAT1Q76j52dgMABHAFcsDwgwX3p8eIBBDw8sLzMATgt8aigoMyYw3IsAXQkAnWLSctgw5I14X2DwyOjY+PwklLTM7Jo8gqLSqqcdeQgABwA5MJwAIwgPXwAGYecADwBJMEmINYadeA8wiEcJC0dHXfHPeB0kCAosQtuDRTZySBgEKmE6EAAOVBLSTSEAsPDsLDfX7KfhqUTwdjaW4JaFMMAmcx6Ug6BKYhwjWBYKA1KBvADqVCYTAWvlCESiGOMtgJgR0yJ0UCp0Ux-hGbPoKx0AEYcQAmSrlAUAZhxABYcQBWSX8wL0ABsOIA7Dj-iq2c5BTjZTp1fqDfRRToFToteaBWKlbr7WqhTa9asLY7rTizVKKv6KJ5zDBblRMUsANw6cMAHk53LA+BgTAw8E40aoAGos1ZWQaOfQsDjZjjYMVMVyaWB6FRiv7nFQKOZ6S0a1gKwAyTujZqMosV4xD3sM6L0WZdnut-sdkzD6dj8t5huBKLwWpOBft+uq5xlVX7tlrjc6AZQcpScrlQgzcYAFUEdMQ4xsOnzzj0+DGUxm8w8mO-f1PxqOoRDZUxP1cdxvHob8dzZT9Nm2XZbkCUwzG-HQAFIdDFKwh1MJYL09cpOCwJgkBgABhLlYAAa18cNmTff0OSg+BPC8TFILcDjvC-WiIDMIVP2-aY5gWHQsxFc5VQ5LduPwECohEL8+2iASqFgITZLZf0m3MBIlOJUkKSpGkPAw9SwCsAAfWyRzbWtiisY8PCYf0t2cxSkJ2PYdAAfh0AByAANYKdF8YKAHlgqArheM48D9AS6CvCU4QiXgMxGC3CQXPi5T6mSni0vodjOOTDQ004eDAlE59xL-TEKv4lMavi3yUOSgBCRCtj8+AL1OfDbASC4aTWa4PFue5HmeXE0RUcBoDgeAfnRdh1VQYV1RBGQIXQBdYVUYQESRX4XnU-FygANyoCAAHdfDMYBFEOGI32xBIcVu4ljgkM4bH9HAzGC2YwngDimDU0dgpxd9Aky2iGPMUbcS4cjKIgGitLosw-qgY5dMCKQUqK1SvKzQnjgKph90uKabjuB4nigK7R34T41o2v5tuBKQDrYdBZkESIkBOgQzvqdgqBwaaOZaHQKA8QQcBC-AAHoFzijymA5AAhMWPCQG6Rnup6XreqGPE+4BvsB0aQbBpAqFu+GVyNWUzXwHAsHGMw1mB3dAlB4LXdu-BRfFgBaVXHo9kOBRWUUJV9-2zC45kVwNHRQb0dSEe+37-ogXw1izLwzhzwISdzuva-9WSGcmhWWfm9mdCN8WudWpb2GFYVUC1fawVkdBsDwSX4Rl9A5bb7uTeV1X1eCrXo5N3XHA5ABxVgzecC3nrsd7bcaB2gez1Uw4j-BJ4gRPc5vt279YGON6QR-c7zsxF6QIvSAJGriHCwno2TP0jvfGOVIgxfyfi7N2cDv5GSJCSQoZlqQLDMMBWoKl4CwzbA3XOQVgqUkwYsEKUkMaoNMogMhFlsFKVwfUAhjIiEGiioNHQ4wyReFpJQ6SjCur+RIeFSKIVYrsOcKAmuYdBBQCQbnUqfF0p+wDhhZ8OIcCCFuhAJ2ScDRhy5Io7+zgw4QyhsIeGLEDGmORnjF66MjI3nlg+Mw2jdFSO-mTDxEBAohR3oIA4QTfE6AAMQRWkqEqKgTgk6HvqMBQM1gpeLZKknQXj2EN2bhNK4zM5ps1uHvCEHw+7rV+APIEo9wTCw4MQOE0tNAgHnszV4RhnAqzVhrbWhgH6OBaTNRa5T0TLy6WvTWUJhlgF1gMop+9AidNXlre+W99aXR0P7F86F0b5g5HobivTLDVHWXiUwqIpnYNkuUNyThEZH0ca+UGxSIAAKASTfcLccC+0EGEEQZgkCCBqHgVSoskBeBxJsiwDT5Y0AWOwWYWB5h8FKV8KZA9pSoDFHtQWY9DocFgGAZaM8mmgq4vmIMIhfDCjlOMIO9gQBUXqLULigT0xaXpTiAAYpDWoxZRjkTADHSAHgmyRnKH7DwGAqS+DFEsWlYr6YTXkTiQoNjnDjCwEgV2qYY4wAoPsaUcq1gKpblHY2SA46CGelgfVkldkwEiL4UW6YFXOGJfsel9LXV3DcDw1IvgFCzBgCaiaX5DBhAxPmCVUqmDv0EJYnAVKjUhr1qwvx+YEX0QwKrX5SBfBhIoIW71osTb8OFLS0Y8iqCmzCekOt3qKBQDFvsPV8AG1nSFVQAAXmXXCNLjXlApfAGOj0IBUAwNwJ18ikDeqrBAGOnAx0ToNf271i7x2Tp0NKVd4rIgxrjhu-YMdy0DpGNGqkMcOLjF8Me+V5QNVaqpBgZY3rEB7BjsScdTBfDaXUB4b1j1q3pl8Nuu9irU0LlQEGGokbyg-PgHO3wTBhAQBTY4fAdFZgWpYPdbAwydBpqg4CiNaqdCZrotmn5FF81apnacUNCT8yuzAH6nwysYCno6RxmOrsohol8PHNDMMoEwKCVGvdF7W0yuTfRpgvdUW83YIqJYVT8rkCrHROgjBcW1JwFQdMIrkUgFqHwdA3B4DjBiJrTWvzxgUYyjgTWemDM0AAAJinwEsfAconP6c4IZ32VJJbwC8OMWpYBYAivGIiNTOn2B3i0joO8UIkuCDYBIIAA

// STATE ACTIONS VIEW example
// https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAysQyNJAXkkAKAJRKAfKuAAdNJMl0Arg0SSADPtZr9+8VICC1YhHpwlMrTv2GIaanN1b2l8EwYAagiKX0kAExhA1Q1FbVDw4gBaTOtbNHt3KQA1CBgAd08VaQpHFM1YrBUAcjiIADcmmINDSUamwgBGTskAAwBhWlNicwASYHTJhlYRtS6e3uaAI2NiYnph4HpqKAhqAGtzR3x-anZJXRAIh9XYwz7t3f2KSUOAk-PLvgErdvg8ciA8oY8vosPgsItiCo4rRqMYcAx8JtaHEAJ7fYKpH6xBxeZSyeQwdTEwqSRyeZyudxVSH3boAJxgxGMbIMem6hjapTKQTqkhK5SqNRZrFy+koIDgMFgLjcaAQPAAHIgLGwOCBMDg8GE4AIaPRGMweGwALpUE5oM7q1D6rh4LAQYiENnQeXc8g8EjEAAOcEQAHow6Yg2cAOZhWhYMPuz3eqAAAQG+EzADYkx6vdB8Px5cQcUHuArqN6g6JWNbWEA


/*

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  

*/



const Square = {
    view: ({attrs: props}) => [
      m("button", { class: "square", onclick: props.onClick }, props.value)
    ]
}


class Board {

  oninit(v){
    this.props = v.attrs
  }

  onupdate(v){
    this.props = v.attrs
    m.redraw()
  }

  renderSquare(i) {
    return m(Square, { 
      value: this.props.squares[i], 
      onClick: () => this.props.onClick(i)
    })   

  }

  view(v) {
    
    return [
      m(".board-row", [
        this.renderSquare(0),
        this.renderSquare(1),
        this.renderSquare(2),
      ]),

      m(".board-row", [
        this.renderSquare(3),
        this.renderSquare(4),
        this.renderSquare(5),
      ]),

      m(".board-row", [
        this.renderSquare(6),
        this.renderSquare(7),
        this.renderSquare(8),
      ]),
      
    ]
  }

}


class Game extends Board{

  constructor() {
    
    super()

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }   
  }

  handleClick(i) {

      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1]
      const squares = current.squares.slice()
      
      if (calculateWinner(squares) || squares[i]) {
        return
      }

      squares[i] = this.state.xIsNext ? "X" : "O"
      this.state = {
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      }

  }

  jumpTo(step) {
    this.state.stepNumber = step
    this.state.xIsNext = (step % 2) === 0
  }

  view(v) {

    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner  = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start'
      
        return [
          m("li", {key:move}, 
          m("button", {onclick: () => this.jumpTo(move)}, desc))
        ]  
    })


    let status
    if (winner) {
      status = "Winner: " + winner
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }

    return m(".game", [
        m(".game-board", 
          m(Board, { 
            squares: current.squares, 
            onClick: i => this.handleClick(i)
          })
        ),

        m(".game-info", [
            m("div", status),
            m("ol", moves),
        ])
    ])
    
  }

}


m.mount(
  document.getElementById("tictactoe"),
  Game                                                                                
)


function calculateWinner(squares) {
  const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
      }
  }
  return null
}


