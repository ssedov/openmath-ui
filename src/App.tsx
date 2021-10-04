import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function processResponse(response: any) {
  console.log(response);
}

type QuoteProps = {
  quotes: string[]
}
type QuoteState = {
  currentIndex: number,
}
class TestApp extends React.Component<QuoteProps, QuoteState> {

  state: QuoteState = {
    currentIndex: 0,
  };

  getIndex = (): number => {
    const min: number = 0;
    const max: number = this.props.quotes.length - 1;
    return Math.floor(Math.random() * (max - min) + min);
  };

  getNextQuote = (): void => this.setState(({currentIndex: this.getIndex()}));

  render() {
    const quoteToDisplay = this.props.quotes[this.state.currentIndex];
    return <div className="App">
      <header className="App-header">
        <h3>Render Component with State and Props using TypeScript</h3>
      </header>
      <div style={{height: "5vh", padding: "1em", margin: "7em"}}>
        <h4>{quoteToDisplay}</h4>
      </div>
      <button onClick={this.getNextQuote}>NEXT QUOTE</button>
    </div>
  }
}
const randomQuotes: string[] = [
    '123', '456', '789'
]
function App() {
  axios.get('http://localhost:5000/test/123qwe').then(processResponse);

  return (
    <div className="App">
      <header className="App-header">
        <TestApp quotes={randomQuotes}/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
