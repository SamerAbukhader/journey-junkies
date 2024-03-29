import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { Link } from "react-router-dom";

// Create Mantine styles
const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const ErrorPage = () => {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      {/* Grid layout with responsive columns */}
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        {/* Mobile image section */}
        <Image
          src="./images/404.svg"
          className={classes.mobileImage}
          alt="404 error illustration"
        />
        {/* Content section */}
        <div>
          {/* Error title */}
          <Title className={classes.title}>Something is not right...</Title>
          {/* Error description */}
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error, contact support.
          </Text>
          {/* Link to home page */}
          <Link to="/">
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.control}
            >
              Get back to the home page
            </Button>
          </Link>
        </div>
        {/* Desktop image section */}
        <Image
          src="./images/404.svg"
          className={classes.desktopImage}
          alt="404 error image"
        />
      </SimpleGrid>
    </Container>
  );
};

export default ErrorPage;
