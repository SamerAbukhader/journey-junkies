import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Text,
  Button,
  Divider,
} from "@mantine/core";

import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";

import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { AuthState } from "./AuthModal";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: rem(60),
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  linkActive: {
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      .color,
  },
}));

interface Link {
  to: string;
  label: string;
}

const links: Link[] = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/write", label: "Write" },
  { to: "/profile", label: "Profile" },
];

const loginModalHandler = () =>
  modals.openContextModal({
    modal: "auth",
    innerProps: {
      intitialState: AuthState.LOGIN,
    },
  });

const signUpModalHandler = () =>
  modals.openContextModal({
    modal: "auth",
    innerProps: {
      intitialState: AuthState.REGISTER,
    },
  });

const AppHeader = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx, theme } = useStyles();
  const clerk = useClerk();
  const { user } = useUser();
  const items = links.map((link) => {
    if (link.label === "Dashboard" && user?.unsafeMetadata["admin"]) {
      return (
        <NavLink
          key={link.label}
          to={link.to}
          className={({ isActive }) =>
            cx(classes.link, { [classes.linkActive]: isActive })
          }
          onClick={close}
        >
          {link.label}
        </NavLink>
      );
    }

    if (link.label === "Dashboard") {
      return null; // Skip the iteration and continue to the next link
    }

    return user ? (
      <NavLink
        key={link.label}
        to={link.to}
        className={({ isActive }) =>
          cx(classes.link, { [classes.linkActive]: isActive })
        }
        onClick={close}
      >
        {link.label}
      </NavLink>
    ) : (
      <NavLink
        key={link.label}
        to={""}
        className={classes.link}
        onClick={() => clerk.openSignIn()}
      >
        {link.label}
      </NavLink>
    );
  });

  return (
    <Header height={rem(60)} className={classes.root}>
      <Container className={classes.header}>
        <Text>Journey Junkies</Text>
        <Group spacing="xl" className={classes.links}>
          {items}
        </Group>

        <SignedOut>
          <Group className={classes.hiddenMobile}>
            <Button variant="default" onClick={() => clerk.openSignIn()}>
              Log in
            </Button>
            <Button onClick={() => clerk.openSignUp()}>Sign up</Button>
          </Group>
        </SignedOut>

        <SignedIn>
          <Group className={classes.hiddenMobile}>
            <ThemeToggle />
            <UserButton />
          </Group>
        </SignedIn>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          aria-label="Menu"
        />

        <Transition transition="pop-top-right" duration={300} mounted={opened}>
          {(styles) => (
            <>
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
                <Group className={classes.link}>
                  <SignedIn>
                    <UserButton />
                    <ThemeToggle />
                  </SignedIn>
                </Group>

                <SignedOut>
                  <Divider
                    my="xs"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />
                  <Group position="center" grow p="xs">
                    <Button
                      variant="default"
                      onClick={() => clerk.openSignIn()}
                    >
                      Log in
                    </Button>
                    <Button onClick={() => clerk.openSignUp()}>Sign up</Button>
                  </Group>
                </SignedOut>
              </Paper>
            </>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default AppHeader;
