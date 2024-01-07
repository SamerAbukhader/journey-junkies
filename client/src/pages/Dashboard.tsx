import {
  Avatar,
  Table,
  Group,
  Text,
  Flex,
  ScrollArea,
  useMantineTheme,
  Container,
  Menu,
  TextInput,
} from "@mantine/core";
import {
  IconTrash,
  IconCircleCheck,
  IconCircleLetterX,
  IconDiscountCheckFilled,
  IconSettings,
  IconEdit,
} from "@tabler/icons-react";
import { LoaderData } from "../types";
import { Form, useLoaderData, useSubmit } from "react-router-dom";
import { dashboardLoader } from "../loaders";
import { formatDate, timeAgo } from "../utils";
import ErrorPage from "./ErrorPage";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

const Dashboard = () => {
  // Load user data using the dashboard loader
  const users = useLoaderData() as LoaderData<typeof dashboardLoader>;
  const theme = useMantineTheme();
  const { user } = useUser();
  // State to manage the selected form value for user actions
  const [formValue, setFormValue] = useState<"verify" | "delete" | "role">();

  // Generate table rows based on user data
  const rows = users.map((user: any) => (
    <tr key={user.id}>
      <td>
        {/* Display user avatar and name */}
        <Group spacing="sm">
          <Avatar size={30} src={user.imageUrl} radius={30} />
          <Text fz="sm" fw={500}>
            <Flex align="center" gap={4}>
              {user.firstName + " " + user.lastName}{" "}
              {/* Display verification icon if user is verified */}
              {user.unsafeMetadata!["verified"] && (
                <IconDiscountCheckFilled
                  size={20}
                  fill={theme.colors.red[4]}
                  color={theme.colors.red[4]}
                />
              )}
            </Flex>
          </Text>
        </Group>
      </td>
      <td>
        {/* Display user join date */}
        <Group spacing="sm">
          <Text fz="sm" c="dimmed">
            {formatDate(user.createdAt)}
          </Text>
        </Group>
      </td>
      <td>
        {/* Display user last active date */}
        <Group spacing="sm">
          <Text fz="sm" c="dimmed">
            {timeAgo(user.lastSignInAt)}
          </Text>
        </Group>
      </td>
      <td>
        {/* Display whether the user is an admin */}
        <Group spacing="sm">
          <Text fz="sm" fw={500}>
            {user.unsafeMetadata["admin"] ? (
              <IconCircleCheck color={theme.colors.blue[4]} />
            ) : (
              <IconCircleLetterX color={theme.colors.red[5]} />
            )}
          </Text>
        </Group>
      </td>
      <td>
        {/* Form for user actions */}
        <Form method="post" style={{ padding: "20px" }}>
          {/* Dropdown menu for user actions */}
          <Menu
            trigger="hover"
            openDelay={100}
            closeDelay={400}
            shadow="md"
            width={160}
          >
            <Menu.Target>
              {/* Settings icon to trigger the menu */}
              <IconSettings size={24} cursor="pointer" />
            </Menu.Target>
            <Menu.Dropdown>
              {/* Hidden input to pass data to the form */}
              <TextInput
                readOnly
                display="none"
                name="value"
                value={
                  JSON.stringify({
                    id: user.id,
                    value: formValue,
                    metaData: user.unsafeMetadata,
                  }) ?? ""
                }
              />
              {/* Menu items for user actions */}
              <Menu.Item
                type="submit"
                icon={<IconCircleCheck size={14} />}
                onClick={() => setFormValue("verify")}
              >
                Toggle Verify
              </Menu.Item>
              <Menu.Item
                onClick={() => setFormValue("role")}
                type="submit"
                icon={<IconEdit size={14} />}
              >
                Toggle Admin
              </Menu.Item>
              <Menu.Item
                type="submit"
                color="red"
                onClick={() => setFormValue("delete")}
                icon={<IconTrash size={14} />}
              >
                Delete User
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Form>
      </td>
    </tr>
  ));

  // Render the Dashboard content based on user role
  return user?.unsafeMetadata["admin"] ? (
    <Container>
      {/* Scrollable area for the user table */}
      <ScrollArea>
        {/* User table with columns: Name, Join Date, Active Date, Is Admin, Actions */}
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Join Date</th>
              <th>Active Date</th>
              <th>Is Admin</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </Container>
  ) : (
    // Display an error page for non-admin users
    <ErrorPage />
  );
};

export default Dashboard;
