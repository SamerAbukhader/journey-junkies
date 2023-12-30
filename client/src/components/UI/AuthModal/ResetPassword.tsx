import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Anchor,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ActionTypes } from ".";
import { Form } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const ForgotPassword = ({
  dispatch,
}: {
  dispatch: React.Dispatch<ActionTypes>;
}) => {
  const { classes } = useStyles();

  return (
    <>
      <Title align="center">Forgot your password?</Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>
      <Form method="POST" action="/reset-password">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            required
            label="Your Email"
            placeholder="hello@mantine.dev"
            name="email"
            type="email"
            radius="md"
            aria-required="true"
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor
              color="dimmed"
              size="sm"
              className={classes.control}
              onClick={() => dispatch(ActionTypes.SET_LOGIN)}
            >
              <Center inline>
                <IconArrowLeft size={rem(12)} stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} aria-label="Back to the login page" type="submit">
              Reset password
            </Button>
          </Group>
        </Paper>
      </Form>
    </>
  );
};

export default ForgotPassword;
