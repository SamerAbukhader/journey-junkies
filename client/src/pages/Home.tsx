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

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  input: {
    borderRadius: 0,
    borderTopLeftRadius: theme.spacing.md,
    borderBottomLeftRadius: theme.spacing.md,
  },
  filter: {
    borderRadius: 0,
    borderTopRightRadius: theme.spacing.md,
    borderBottomRightRadius: theme.spacing.md,
  },
  form: {
    width: "100%",
  },
  advancedFilter: {
    display: "grid",
    marginBlock: theme.spacing.md,
    padding: theme.spacing.sm,
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing.sm,
  },
}));

const HomePage = () => {
  const { posts, formValues } = useLoaderData() as LoaderData<
    typeof postsLoader
  >;
  const [opened, setOpened] = useState<boolean>(false);
  const navigation = useNavigation();
  const { classes, theme } = useStyles();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("title");

  return (
    <div>
      <Center mt={rem(48)}>
        <Title className={classes.title}>
          To Travel is to{" "}
          <Text component="span" inherit className={classes.highlight}>
            Live
          </Text>
        </Title>
      </Center>
      <Container mt="sm">
        <Flex
          direction="column"
          gap="md"
          align="center"
          justify="center"
          mb={theme.spacing.lg}
        >
          <Form id="search" role="search" className={classes.form}>
            <Flex w="100%" align="center" justify="center">
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
              <Button className={classes.filter}>
                <IconAdjustmentsAlt
                  size={24}
                  onClick={() => setOpened(!opened)}
                />
              </Button>
            </Flex>
            {opened && (
              <Paper className={classes.advancedFilter}>
                <TextInput
                  placeholder="Search for author"
                  size="sm"
                  label="Author"
                  name="author"
                  defaultValue={formValues.author || ""}
                  mb={rem(12)}
                />
                <TextInput
                  placeholder="Search for blog tag"
                  size="sm"
                  label="Tag"
                  name="tag"
                  defaultValue={formValues.tag || ""}
                  mb={rem(12)}
                />
                <NumberInput
                  placeholder="Filter by rating"
                  size="sm"
                  label="Rating"
                  mb={rem(24)}
                  max={5}
                  precision={1}
                  name="rating"
                  defaultValue={formValues.rating || 0}
                  min={0}
                />
                <Select
                  label="location"
                  placeholder="Post location"
                  data={locations}
                  mb={rem(12)}
                  name="location"
                  defaultValue={formValues.location || ""}
                />
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
      <LoadingOverlay
        aria-label="Loading"
        visible={Boolean(searching) || Boolean(navigation.location)}
      />
      <Home posts={posts || []} />
    </div>
  );
};

export default HomePage;
