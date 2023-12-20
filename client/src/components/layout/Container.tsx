import React, { useState, useMemo } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import {
  AppShell,
  LoadingOverlay,
  MantineProvider,
  useMantineTheme,
  ColorSchemeProvider,
  MantineTheme,
  ColorScheme,
  ModalsProvider,
} from '@mantine/core';
import { AuthModal, Header } from '../UI';

// Styles for the container
const getContainerStyles = (theme: MantineTheme) => ({
  main: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    paddingTop: theme.spacing.md,
  },
});

const Container = () => {
  const navigation = useNavigation();
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  // Ensure the value parameter has the correct type
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('color-scheme', nextColorScheme);
    }
    setColorScheme(nextColorScheme);
  };

  // Memoized modal properties
  const modalProps = useMemo(() => ({
    centered: true,
    overlayProps: {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
      opacity: 0.55,
      blur: 3,
    },
  }), [theme]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
        <ModalsProvider modals={{ auth: AuthModal }} modalProps={modalProps}>
          <AppShell padding="md" styles={getContainerStyles} header={<Header />}>
            <Outlet />
          </AppShell>
          <LoadingOverlay visible={!!navigation.location} sx={{ position: 'fixed' }} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Container;
