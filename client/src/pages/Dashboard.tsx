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
  const users = useLoaderData() as LoaderData<typeof dashboardLoader>;
  const theme = useMantineTheme();
  const { user } = useUser();
  const [formValue, setFormValue] = useState<"verify" | "delete" | "role">();
  const rows = users.map((user: any) => (
    <tr key={user.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={user.imageUrl} radius={30} />
          <Text fz="sm" fw={500}>
            <Flex align="center" gap={4}>
              {user.firstName + " " + user.lastName}{" "}
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
        <Group spacing="sm">
          <Text fz="sm" c="dimmed">
            {formatDate(user.createdAt)}
          </Text>
        </Group>
      </td>
      <td>
        <Group spacing="sm">
          <Text fz="sm" c="dimmed">
            {timeAgo(user.lastSignInAt)}
          </Text>
        </Group>
      </td>
      <td>
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
        <Form method="post" style={{ padding: "20px" }}>
          <Menu
            trigger="hover"
            openDelay={100}
            closeDelay={400}
            shadow="md"
            width={160}
          >
            <Menu.Target>
              <IconSettings size={24} cursor="pointer" />
            </Menu.Target>
            <Menu.Dropdown>
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
                // user id
                // user unsafe meta data
              />
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

  return user?.unsafeMetadata["admin"] ? (
    <Container>
      <ScrollArea>
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
    <ErrorPage />
  );
};

export default Dashboard;