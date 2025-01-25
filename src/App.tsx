import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import MainInput from './MainInput';

export default function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme='dark'>
      <MainInput />
    </MantineProvider>
  );
}
