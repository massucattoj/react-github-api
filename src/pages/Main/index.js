import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  // 'react/state-in-constructor': ['error', 'never'],
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    // Verificar se existe algum dado salvo no local Storage
    const repositories = localStorage.getItem('repositories');

    // Se existir transformar de JSON para valor em objeto novamente
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    // Se o estado de repisotorio mudou em comparacao com o objeto repositorio atual
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: false });
  };

  handleSubmit = async e => {
    e.preventDefault(); // evitar que o form faca refresh na pagina

    // antes de fazer a requisicao para api mudar o estado do botao
    this.setState({ loading: true, error: false });

    /**
     * Adicionar try/catch
     *  try {
     *   -> faz alguma coisa que pode dar erro. no caso procurar um repositorio
     *      e este repositorio nao existe
     *
     *  } cath (error) {
     *    this.setState(error)
     *  }
     *
     */
    try {
      // desestruturacao para pegar os valores do estado
      const { newRepo, repositories } = this.state;

      const existRepo = repositories.find(r => r.name === newRepo);
      // eslint-disable-next-line
      if (existRepo) throw 'Repository already exist';

      // procurar um repositorio utilizando a api do github (Chamada na API)
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data], // copiar tudo que ja tem nela ...repositories e adicionar data
        newRepo: '',
      });
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Details
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
