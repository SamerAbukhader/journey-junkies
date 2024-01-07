import {
  Button,
  Center,
  Container,
  Flex,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useLoaderData, Form, useNavigation } from "react-router-dom";
import { LoaderData } from "../types";
import { postsLoader } from "../loaders";
import Home from "../components/layout/Home";
import { useState } from "react";
import { IconAdjustmentsAlt, IconSearch } from "@tabler/icons-react";
import { locations } from "../types/data";

// Create styles using Mantine's createStyles utility
const useStyles = createStyles((theme) => ({
  // Styles for the title component
  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  // Highlighted text style
  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  // Styles for the TextInput component
  input: {
    borderRadius: 0,
    borderTopLeftRadius: theme.spacing.md,
    borderBottomLeftRadius: theme.spacing.md,
  },

  // Styles for the filter button
  filter: {
    borderRadius: 0,
    borderTopRightRadius: theme.spacing.md,
    borderBottomRightRadius: theme.spacing.md,
  },

  // Styles for the entire form
  form: {
    width: "100%",
  },

  // Styles for the advanced filter section
  advancedFilter: {
    display: "grid",
    marginBlock: theme.spacing.md,
    padding: theme.spacing.sm,
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing.sm,
  },
}));

const HomePage = () => {
  // Extract data and values from the loader
  const { posts, formValues } = useLoaderData() as LoaderData<typeof postsLoader>;
  // State for managing the visibility of the advanced filter
  const [opened, setOpened] = useState<boolean>(false);
  // Navigation hook from react-router-dom
  const navigation = useNavigation();
  // Extract classes and theme from Mantine styles
  const { classes, theme } = useStyles();

  // Check if searching based on the presence of 'title' in the query params
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("title");

  return (
    <div>
      {/* Title section */}
      <Center mt={rem(48)}>
        <Title className={classes.title}>
          To Travel is to{" "}
          {/* Highlighted text */}
          <Text component="span" inherit className={classes.highlight}>
            Live
          </Text>
        </Title>
      </Center>
      {/* Main container */}
      <Container mt="sm">
        <Flex
          direction="column"
          gap="md"
          align="center"
          justify="center"
          mb={theme.spacing.lg}
        >
          {/* Search form */}
          <Form id="search" role="search" className={classes.form}>
            <Flex w="100%" align="center" justify="center">
              {/* Search input */}
              <TextInput
                placeholder="Search for blogs"
                size="sm"
                icon={<IconSearch size={16} />}
                w="75%"
                type="search"
                name="title"
                id="title"
                aria-label="Search for blogs"
                defaultValue={formValues.title || ""}
                classNames={{ input: classes.input }}
              />
              {/* Filter button */}
              <Button className={classes.filter}>
                <IconAdjustmentsAlt
                  size={24}
                  onClick={() => setOpened(!opened)}
                />
              </Button>
            </Flex>
            {/* Advanced filter section */}
            {opened && (
              <Paper className={classes.advancedFilter}>
                {/* Tag input */}
                <TextInput
                  placeholder="Search for blog tag"
                  size="sm"
                  label="Tag"
                  name="tag"
                  defaultValue={formValues.tag || ""}
                  mb={rem(12)}
                />
                {/* Location dropdown */}
                <Select
                  label="location"
                  placeholder="Post location"
                  data={locations}
                  mb={rem(12)}
                  name="location"
                  defaultValue={formValues.location || ""}
                />
                {/* Cancel and Apply buttons */}
                <Button
                  type="submit"
                  bg="red"
                  onClick={() => setOpened(false)}
                  w="fit-content"
                >
                  Cancel
                </Button>
                <Button type="submit" w="fit-content">
                  Apply
                </Button>
              </Paper>
            )}
          </Form>
        </Flex>
      </Container>
      {/* Loading overlay */}
      <LoadingOverlay
        aria-label="Loading"
        visible={Boolean(searching) || Boolean(navigation.location)}
      />
      {/* Render the Home component with the retrieved posts */}
      <Home posts={posts || []} />
    </div>
  );
};

export default HomePage;
