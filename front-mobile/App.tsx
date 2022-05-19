import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

const App = () => {

  async function checkUpdates() {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }

  useEffect(() => {
    checkUpdates();
  }, [])

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

export default App;
