import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ActionTypes } from ".";
import { Form } from "react-router-dom";

const Login = ({ dispatch }: { dispatch: React.Dispatch<ActionTypes> }) => {
  return (
    <>
      <Title align="center">Welcome back!</Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor
          size="sm"
          component="button"
          aria-label="Create account"
          onClick={() => dispatch(ActionTypes.SET_REGISTER)}
        >
          Create account
        </Anchor>
      </Text>
      <Form method="post" action="/login">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            name="email"
            type="email"
            radius="md"
            aria-required="true"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            name="password"
            aria-required="true"
          />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor
              component="button"
              size="sm"
              color="dimmed"
              onClick={() => dispatch(ActionTypes.SET_RESET_PASSWORD)}
              aria-label="Forgot password?"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" size="sm" type="submit">
            Sign in
          </Button>
        </Paper>
      </Form>
    </>
  );
};

export default Login;
