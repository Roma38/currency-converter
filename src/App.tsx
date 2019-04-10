import React, { Component } from 'react';
import { Form, Container, Button, Message, Icon } from 'semantic-ui-react'
import { API_HOST, API_KEY, CURRENCIES } from "./config.js"
import './App.css';
import axios from "axios";

class App extends Component {
  state = {
    amount: 0,
    fromCurrency: "",
    toCurrency: "",
    requestState: "",
    result: null
  };

  handleChange = (_event: any, data: any) => {
    const { value, name } = data;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { amount, fromCurrency, toCurrency } = this.state;
    this.setState({ requestState: "loading" });
    axios.get(`${API_HOST}/1.0.3/convert?from=${fromCurrency}&to=${toCurrency}&quantity=${amount}&api_key=${API_KEY}`)
      .then(({ data }) => {
        data.error ?
          this.setState({ requestState: "failure", result: data.message }) :
          this.setState({ requestState: "succeed", result: data.text });
      })
      .catch(() => this.setState({ requestState: "failure", result: "Oops... something went wrong :(" }));
  };

  swapCurrencies = () => this.setState({ fromCurrency: this.state.toCurrency, toCurrency: this.state.fromCurrency });

  render() {
    const { amount, fromCurrency, toCurrency, requestState, result } = this.state;
    return (
      <div className="App">
        <Container>
          <Form onSubmit={this.handleSubmit} size="large">
            <Form.Group widths='equal'>
              <Form.Input fluid label='Amount' placeholder='0' type='number' min='1' required name="amount" value={amount} onChange={this.handleChange} />
              <Form.Select fluid label='Convert' options={CURRENCIES} placeholder='Currency' required name="fromCurrency" value={fromCurrency} onChange={this.handleChange} />
              <Button type="button" icon='exchange' className="swap-button" circular onClick={this.swapCurrencies} />
              <Form.Select fluid label='Into' options={CURRENCIES} placeholder='Currency' required name="toCurrency" value={toCurrency} onChange={this.handleChange} />
            </Form.Group>
            <Form.Button>Convert</Form.Button>
          </Form>

          {requestState === "loading" && <Message icon>
            <Icon name='circle notched' loading />
            Loading...
          </Message>}
          {requestState === "succeed" && <Message icon positive>
            <Icon name='thumbs up outline' />
            {result}
          </Message>}
          {requestState === "failure" && <Message icon negative>
            <Icon name='frown outline' />
            {result}
          </Message>}
        </Container>
      </div>
    );
  }
}

export default App;
