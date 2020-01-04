import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
  /**
   * match do tipo objeto porque ela tem uma outra propriedade params dentro dela
   * por isso utiliza-se shape().
   *
   * dentro do objeto match existe outro objeto chamado params porque dentro dela
   * ela tem outra propriedade chamado repository
   *
   * dentro do params.repository -> do tipo string pq eh o tipo do valor que veio
   * dentro da URL
   */
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string, // Strn
      }),
    }).isRequired,
  };

  state = {
    repository: {}, // como eh um unico repositorio inicia como um objeto e nao mais como um array []
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository); // params -> parametros recebidos atraves da URL

    // api.github.com/repos/rocketseat/unform -> para carregar os detalhes do repositorio
    // const response = await api.get(`/repos/${repoName}`);
    // api.github.com/repos/rocketseat/unform/issues -> retorna somente as issues do repositorio
    // const issues = await api.get(`/repos/${repoName}/issues`);
    // Porem como devem ser executadas ao mesmo tempo, utilizamos 'Promise'

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
      {
        params: {
          state: 'open', // somente issues abertas
          per_page: 5,
        },
      },
    ]);

    this.setState({
      repository: repository.data, // .data porque eh onde os dados vem no axios
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    // chega aqui somente depois que os dados forem carregados
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {/** LABELS */}
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}

/**
 * Como render sai no primeiro return, utiliza-se um if para fazer com que enquanto
 * a condicao seja verdadeira ele execute algo, e quando a condicao for falsa ele
 * sai e executa o return com algum codigo html.
 *
 * Owner -> Mostrar quem eh o dono do repositorio e algumas infos sobre o repositorio
 */
