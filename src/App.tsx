import React, { Component } from 'react';
import { Select, Input, Container, Button, Message, Icon, Grid } from 'semantic-ui-react'
import { API_ENDPOINT_OANDA, API_KEY_OANDA, SELECT_OPTIONS, CURRENCIES } from "./config.js"
import './App.css';
import axios from "axios";
import { string } from 'prop-types';

interface Props { };
interface State {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  requestState: string;
  result: string;
};

interface DropdownProps {
  key: string;
  text: string;
  value: string;
};
class App extends Component<Props, State> {
  state: State = {
    amount: 1,
    fromCurrency: "",
    toCurrency: "",
    requestState: "",
    result: "Choose the currencies"
  };

  handleChange = async (_event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    const { value, name }: { value: string | number, name: "amount" | "fromCurrency" | "toCurrency" | undefined } = data;
    await this.setState({ [name]: value });
    if (this.isValid()) this.getData();
  };

  getData = () => {
    const { amount, fromCurrency, toCurrency } = this.state;
    this.setState({ requestState: "loading" });
    axios.get(`${API_ENDPOINT_OANDA}?api_key=${API_KEY_OANDA}&base=${fromCurrency}&quote=${toCurrency}`)
      .then(({ data }) => {
        this.setState({ requestState: "succeed", result: (data.quotes[0].midpoint * amount).toFixed(4) });
      })
      .catch(() => this.setState({ requestState: "failure", result: "Oops... something went wrong :(" }));
  };

  isValid = () => {
    const { amount, fromCurrency, toCurrency } = this.state;
    if (fromCurrency && toCurrency && fromCurrency === toCurrency) {
      this.setState({ result: `Can't convert ${fromCurrency} into ${fromCurrency}`, requestState: "" });
      return false;
    };

    if (amount <= 0) {
      this.setState({ result: `Choose an amount`, requestState: "" });
      return false;
    };

    if (CURRENCIES.includes(fromCurrency) && CURRENCIES.includes(toCurrency) && amount > 0) return true;
    this.setState({ result: `Choose the currencies`, requestState: "" });
    return false;
  }

  swapCurrencies = async () => {
    await this.setState({ fromCurrency: this.state.toCurrency, toCurrency: this.state.fromCurrency });
    if (this.isValid()) this.getData();
  };

  render() {
    const { amount, fromCurrency, toCurrency, requestState, result } = this.state;

    return (
      <div className="App">
        <Container>
          <Grid divided='vertically'>
            <Grid.Row columns={3}>
              <Grid.Column width={7} >
                <Select search fluid label='Convert' options={SELECT_OPTIONS} placeholder='Currency' name="fromCurrency" value={fromCurrency} onChange={this.handleChange} />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button type="button" icon='exchange' className="swap-button" title="Swap currencies" circular onClick={this.swapCurrencies} />
              </Grid.Column>
              <Grid.Column width={7} >
                <Select search fluid label='Into' options={SELECT_OPTIONS} placeholder='Currency' name="toCurrency" value={toCurrency} onChange={this.handleChange} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column>
                <Input fluid type='number' min='1' size='massive' name="amount" className="amount-input" value={amount} onChange={this.handleChange} />
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
                {requestState === "" && <Message icon >
                  <Icon name='write' />
                  {result}
                </Message>}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
