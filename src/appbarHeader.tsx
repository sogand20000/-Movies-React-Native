import React from 'react';

import {Appbar} from 'react-native-paper';
const _goBack = () => console.log('Went back');

const _handleSearch = () => console.log('Searching');

const _handleMore = () => console.log('Shown more');

export default function AppbarHeader() {
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title="Movies" />
      <Appbar.Action icon="magnify" onPress={_handleSearch} />
      <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
    </Appbar.Header>
  );
}
