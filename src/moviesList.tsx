import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  DataTable,
  TextInput,
  Button,
  Title,
  HelperText,
  Modal,
  Portal,
  Text,
  Card,
  Paragraph,
  Divider,
} from 'react-native-paper';
import AppbarHeader from './appbarHeader';

export function MoviesList() {
  const [movies, setMovies] = useState(null);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const [update, setupdate] = useState(false);
  const [movieId, setMovieId] = useState(0);

  const [visible, setVisible] = React.useState(false);
  const [actors, setActors] = useState('');

  const containerStyle = {backgroundColor: 'white', padding: 20};
  //Modal
  const showModal = async id => {
    try {
      const res = await fetch(`/api/movies/${id}/actors`);
      const json = await res.json();
      setActors(json.actors);
      console.log(json.actors);

      setVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  const hideModal = () => setVisible(false);
  //Modal
  //list
  const deleteMovie = async id => {
    try {
      //  await fetch(`/api/Movies/${id}`, {method: 'DELETE'});
      setMovies(movies.filter(m => m.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const setMovieForUpdate = id => {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;
    setupdate(true);
    setMovieId(movie.id);
    setName(movie.name);
    setYear(movie.year);
  };

  const updateMovie = async () => {
    console.log('update');
    const res = await fetch(`/api/movies/${movieId}`, {
      method: 'PATCH',
      body: JSON.stringify({name, year}),
    });
    const json = await res.json();
    const moviesCopy = [...movies];
    const index = movies.findIndex(m => m.id === movieId);
    moviesCopy[index] = json.movie;
    setMovies(moviesCopy);
    setupdate(false);
    setMovieId(null);
    setName('');
    setYear('');
  };
  //list
  const createMovie = async () => {
    try {
      console.log('createMovie');
      const res = await fetch('/api/movies', {
        method: 'POST',
        body: JSON.stringify({name, year}),
      });
      const json = await res.json();
      setMovies([...movies, json.movie]);
      setName('');
      setYear('');
    } catch (err) {
      console.log(err);
    }
  };
  // validation input
  const hasNameErrors = () => {
    return name === '' ? true : false;
  };
  const hasYearErrors = () => {
    return year === '' ? true : false;
  };
  // validation input

  //
  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(json => setMovies(json.movies))
      .catch(err => console.log(err));
  }, []);

  return (
    <View>
      <AppbarHeader></AppbarHeader>
      <View>
        <TextInput
          label="Name"
          value={name}
          onChangeText={name => setName(name)}
        />
        <HelperText type="error" visible={hasNameErrors()}>
          Name is invalid!
        </HelperText>
        <TextInput
          label="Year"
          value={year}
          keyboardType="numeric"
          maxLength={4}
          onChangeText={year => setYear(year)}
        />
        <HelperText type="error" visible={hasYearErrors()}>
          Year is invalid!
        </HelperText>
        {update == true ? (
          <Button
            style={{marginBottom: 30, marginTop: 10}}
            icon="plus"
            mode="contained"
            onPress={() => updateMovie()}>
            Update
          </Button>
        ) : (
          <Button
            style={{marginBottom: 30, marginTop: 10}}
            icon="plus"
            mode="contained"
            onPress={() => createMovie()}>
            Create
          </Button>
        )}
      </View>
      <View>
        <Paragraph>Movie List</Paragraph>
        {movies?.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Year</DataTable.Title>
              <DataTable.Title>Delete </DataTable.Title>
              <DataTable.Title>UpDate </DataTable.Title>
              <DataTable.Title>Actors</DataTable.Title>
            </DataTable.Header>
            {movies.map(({id, name, year}) => (
              <DataTable.Row key={id}>
                <DataTable.Cell>{name}</DataTable.Cell>
                <DataTable.Cell>{year}</DataTable.Cell>
                <DataTable.Cell Button>
                  <Button
                    key="delete"
                    icon="delete"
                    color="green"
                    onPress={() => deleteMovie(id)}></Button>
                </DataTable.Cell>
                <DataTable.Cell Button>
                  <Button
                    key={update}
                    icon="update"
                    color="green"
                    onPress={() => setMovieForUpdate(id)}></Button>
                </DataTable.Cell>
                <DataTable.Cell Button>
                  <Button
                    key="Actor"
                    icon="eye"
                    onPress={() => showModal(id)}></Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <Title>no item</Title>
        )}
      </View>

      <Portal>
        <Modal
          visible={visible}
          contentContainerStyle={containerStyle}
          onDismiss={hideModal}>
          {actors.length !== 0 ? (
            actors.map(actor => (
              <Card key={actor.id}>
                <Card.Content key={actor.id}>
                  <Title>{actor.name}</Title>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Paragraph>dont have Actors</Paragraph>
          )}
        </Modal>
      </Portal>
    </View>
  );
}
