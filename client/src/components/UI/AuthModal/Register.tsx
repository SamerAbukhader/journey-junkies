import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Title,
  Paper,
} from "@mantine/core";
import { ActionTypes } from ".";
import { Form } from "react-router-dom";

const Register = ({ dispatch }: { dispatch: React.Dispatch<ActionTypes> }) => {
  return (
    <>
      <Title align="center" id="form-title">Join Journey Junkies</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" aria-labelledby="form-title">
        <Form method="POST" action="/register">
          <Stack>
            <TextInput
                required
                label="Name"
                placeholder="Your name"
                name="name"
                radius="md"
                aria-label="Enter your name"
            />
            <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                name="email"
                type="email"
                radius="md"
                aria-label="Enter your email"
            />
            <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                name="password"
                radius="md"
                aria-label="Enter your password"
            />
            <Checkbox
                label="I accept terms and conditions"
                required
                name="terms"
                aria-label="Agree to terms and conditions"
            />
            <Button type="submit" radius="md" fullWidth mt="xl">
              Register
            </Button>

            <Anchor
                component="button"
                type="button"
                color="dimmed"
                size="xs"
                ta="center"
                mt="md"
                onClick={() => dispatch(ActionTypes.SET_LOGIN)}
                aria-label="Switch to login"
            >
              Already have an account? Login
            </Anchor>
          </Stack>
        </Form>
      </Paper>
    </>
  );
};

export default Register;
