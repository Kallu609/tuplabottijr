import * as React from 'react';
import { Checkbox, Container, Segment, Header } from 'semantic-ui-react';

class App extends React.Component {
  render() {
    return (
      <div>
        <Container style={{ padding: '30px' }}>
          <Header as='h4' attached='top' block>
            Top Block Header
          </Header>
          <Segment attached>
            <Checkbox label='Fuck mee' toggle />
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;