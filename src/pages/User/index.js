import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api'

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name
  })

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func
    }).isRequired
  }

  state = {
    user: '',
    starts: [],
    loading: false,
    page: 1
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
      user: user
    });
  }

  loadMore = async () => {
    const { page, starts, user } = this.state
    const newPage = page + 1

    const response = await api.get(`/users/${user.login}/starred?page=${newPage}`);
    // console.tron.log(starts)
    // console.tron.log(...response.data)
    // console.tron.log([ ...starts, ...response.data ])

    this.setState({
      stars: [ ...starts, ...response.data ],
      page: newPage
    });
  }

  render() {
    const { stars, loading } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        { loading
          ? (<ActivityIndicator color="#000" />)
          : (
            <Stars
              onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
              onEndReached={this.loadMore} // Função que carrega mais itens
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title> {item.name} </Title>
                    <Author> {item.owner.login} </Author>
                  </Info>
                </Starred>
              )}
            >

            </Stars>
          )
        }
      </Container>
    );
  }
}
