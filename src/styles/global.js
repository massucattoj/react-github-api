import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  /* De todos os elementos da aplicacao remover margin ... */
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  /* Fazer com que a pagina possa acessar 100% da altura */
  html, body, #root {
    min-height: 100%;
  }

  body {
    background: #7159c1;
    -webkit-font-smoothing: antialiased !important;
  }

  body, input, button {
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }

`;
