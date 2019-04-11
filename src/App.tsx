import React, { Component } from 'react';
import { Form, Container, Button, Message, Icon, Grid } from 'semantic-ui-react'
import { API_ENDPOINT_OANDA, API_KEY_OANDA, SELECT_OPTIONS } from "./config.js"
import './App.css';
import axios from "axios";

class App extends Component {
  state = {
    amount: 1,
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
    axios.get(`${API_ENDPOINT_OANDA}?api_key=${API_KEY_OANDA}&base=${fromCurrency}&quote=${toCurrency}`)
      .then(({ data }) => {
        console.log(data);
        /* data.error ?
          this.setState({ requestState: "failure", result: data.message }) :
          this.setState({ requestState: "succeed", result: data.text }); */
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
            <Grid divided='vertically'>
              <Grid.Row columns={3}>
                <Grid.Column width={7} >
                  <Form.Select search fluid label='Convert' options={SELECT_OPTIONS} placeholder='Currency' name="fromCurrency" value={fromCurrency} onChange={this.handleChange} />
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button type="button" icon='exchange' className="swap-button" circular onClick={this.swapCurrencies} />
                </Grid.Column>
                <Grid.Column width={7} >
                  <Form.Select search fluid label='Into' options={SELECT_OPTIONS} placeholder='Currency' name="toCurrency" value={toCurrency} onChange={this.handleChange} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Input fluid type='number' min='1' required name="amount" value={amount} onChange={this.handleChange} />
                </Grid.Column>
                <Grid.Column>
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
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Form.Group widths='equal'>


            </Form.Group>
            <Form.Button>Convert</Form.Button>
          </Form>


        </Container>
      </div>
    );
  }
}

export default App;
