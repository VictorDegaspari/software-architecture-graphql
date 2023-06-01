import { ApolloClient, ApolloProvider, InMemoryCache, gql } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const client = new ApolloClient({
  uri: 'https://flyby-router-demo.herokuapp.com/',
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query GetLocations {
        locations {
          id
          name
          description
          photo
        }
      }
    `,
  })
  .then((result) => console.log(result));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);

