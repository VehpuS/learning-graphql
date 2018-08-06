import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils';

import App from './';
import '../../tests/utils'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render((
    <MockedProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </MockedProvider>
  ), div);
  ReactDOM.unmountComponentAtNode(div);
});
